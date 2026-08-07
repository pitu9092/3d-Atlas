/**
 * @file engine/assets/AssetQueue.ts
 * @description Priority-ordered asset load queue with cancellation and timeout.
 *
 * Purpose: Manages concurrent loading tasks in priority order.
 * Responsibilities:
 *   - Min-heap priority ordering (lower number = higher priority)
 *   - Concurrency cap (MAX_CONCURRENT_LOADS)
 *   - Per-task cancellation via AbortController signals
 *   - Load timeout with configurable duration
 *   - pause() / resume() for lifecycle integration
 *   - globalEventBus emission on queue drain
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'

// ─── Queue Task ───────────────────────────────────────────────────────────────

export interface QueueTask {
  id: string
  priority: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadFn: (signal: AbortSignal) => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void
  reject: (reason: unknown) => void
  controller: AbortController
  enqueueTime: number
}

// ─── Cancellation Token ───────────────────────────────────────────────────────

export interface CancellationToken {
  /** Cancels the queued or in-flight load. */
  cancel(): void
  /** Returns true if the task has been cancelled. */
  readonly isCancelled: boolean
}

// ─── Asset Queue ──────────────────────────────────────────────────────────────

export class AssetQueue {
  private pending: QueueTask[] = []
  private active: Map<string, QueueTask> = new Map()

  private isPaused = false
  private maxConcurrent: number
  private timeoutMs: number

  private totalLoaded = 0
  private totalErrors = 0

  constructor(
    maxConcurrent: number = EngineConstants.MAX_CONCURRENT_LOADS,
    timeoutMs: number = EngineConstants.ASSET_LOAD_TIMEOUT_MS,
  ) {
    this.maxConcurrent = maxConcurrent
    this.timeoutMs = timeoutMs
  }

  // ─── Enqueue ──────────────────────────────────────────────────────────────

  /**
   * Adds a load task to the priority queue.
   * Returns a Promise that resolves when the asset finishes loading,
   * and a CancellationToken to abort the task.
   */
  public enqueue<T>(
    id: string,
    priority: number,
    loadFn: (signal: AbortSignal) => Promise<T>,
  ): { promise: Promise<T>; cancel: CancellationToken } {
    const controller = new AbortController()
    let cancelled = false

    let resolveTask!: (value: T) => void
    let rejectTask!: (reason: unknown) => void

    const promise = new Promise<T>((resolve, reject) => {
      resolveTask = resolve
      rejectTask = reject
    })

    const task: QueueTask = {
      id,
      priority,
      loadFn,
      resolve: resolveTask,
      reject: rejectTask,
      controller,
      enqueueTime: Date.now(),
    }

    this.insertSorted(task)

    const cancel: CancellationToken = {
      cancel: () => {
        cancelled = true
        controller.abort()
        this.removeFromPending(id)

        if (this.active.has(id)) {
          this.active.delete(id)
          rejectTask(new Error(`[AssetQueue] Task '${id}' cancelled.`))
        }
      },
      get isCancelled() {
        return cancelled
      },
    }

    this.drain()

    return { promise, cancel }
  }

  // ─── Control ──────────────────────────────────────────────────────────────

  /**
   * Cancels a specific queued task by ID.
   * If in-flight, aborts the load via AbortController.
   */
  public cancel(id: string): void {
    // Try pending first
    const pendingIndex = this.pending.findIndex((t) => t.id === id)
    if (pendingIndex !== -1) {
      const task = this.pending.splice(pendingIndex, 1)[0]
      task.controller.abort()
      task.reject(new Error(`[AssetQueue] Task '${id}' cancelled.`))
      return
    }

    // Cancel in-flight
    const activeTask = this.active.get(id)
    if (activeTask) {
      activeTask.controller.abort()
    }
  }

  /**
   * Cancels all pending and in-flight tasks.
   */
  public cancelAll(): void {
    const pendingTasks = [...this.pending]
    this.pending = []

    pendingTasks.forEach((task) => {
      task.controller.abort()
      task.reject(new Error('[AssetQueue] All tasks cancelled.'))
    })

    this.active.forEach((task) => {
      task.controller.abort()
    })

    logger.info('[AssetQueue] All tasks cancelled.')
  }

  /** Pauses dispatching of new tasks from the queue. In-flight tasks continue. */
  public pause(): void {
    this.isPaused = true
    logger.info('[AssetQueue] Paused.')
  }

  /** Resumes dispatching tasks from the queue. */
  public resume(): void {
    this.isPaused = false
    logger.info('[AssetQueue] Resumed.')
    this.drain()
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  public get pendingCount(): number {
    return this.pending.length
  }

  public get activeCount(): number {
    return this.active.size
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  /**
   * Inserts a task into the pending list in sorted priority order.
   * Lower priority number = higher priority (min-heap behavior).
   */
  private insertSorted(task: QueueTask): void {
    let lo = 0
    let hi = this.pending.length

    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (this.pending[mid].priority <= task.priority) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }

    this.pending.splice(lo, 0, task)
  }

  private removeFromPending(id: string): void {
    const idx = this.pending.findIndex((t) => t.id === id)
    if (idx !== -1) this.pending.splice(idx, 1)
  }

  /**
   * Dispatches tasks from the pending queue up to the concurrency limit.
   */
  private drain(): void {
    if (this.isPaused) return

    while (this.active.size < this.maxConcurrent && this.pending.length > 0) {
      const task = this.pending.shift()!
      this.executeTask(task)
    }
  }

  private executeTask(task: QueueTask): void {
    this.active.set(task.id, task)

    // Timeout wrapper
    const timeoutId = setTimeout(() => {
      task.controller.abort()
    }, this.timeoutMs)

    const startTime = Date.now()

    Promise.race([
      task.loadFn(task.controller.signal),
      new Promise<never>((_, reject) => {
        task.controller.signal.addEventListener('abort', () => {
          reject(new Error(`[AssetQueue] Task '${task.id}' aborted (timeout or cancellation).`))
        })
      }),
    ])
      .then((result) => {
        clearTimeout(timeoutId)
        this.totalLoaded++

        logger.debug(`[AssetQueue] Loaded: '${task.id}' in ${Date.now() - startTime}ms`)
        task.resolve(result)
      })
      .catch((error: unknown) => {
        clearTimeout(timeoutId)
        this.totalErrors++

        logger.error(`[AssetQueue] Failed: '${task.id}'`, error)
        task.reject(error)
      })
      .finally(() => {
        this.active.delete(task.id)
        this.drain()

        // Emit drain event if both queues are empty
        if (this.pending.length === 0 && this.active.size === 0) {
          globalEventBus.emit('asset:queue_drain', {
            totalLoaded: this.totalLoaded,
            totalErrors: this.totalErrors,
          })
        }
      })
  }
}

// Singleton instance
export const assetQueue = new AssetQueue()
