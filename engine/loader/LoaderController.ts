/**
 * @file engine/loader/LoaderController.ts
 * @description Orchestrates loading progress and drives the loader state machine.
 *
 * Purpose: Bridges the EventBus asset pipeline events to the React UI layer.
 * Responsibilities:
 *   - Subscribes to scene:load_progress + asset:load_complete events
 *   - Aggregates progress across multiple scenes
 *   - Enforces minimum display duration (2500ms)
 *   - Advances state machine phases
 *   - Calls registered React state update callbacks
 *
 * This is pure TypeScript — no React imports.
 * The React layer subscribes via callbacks passed at construction.
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'

import { LoaderEvents } from './LoaderEvents'
import {
  createInitialLoaderState,
  isValidTransition,
  type LoaderPhase,
  type LoaderStateValue,
} from './LoaderState'

// ─── Configuration ────────────────────────────────────────────────────────────

/** Minimum time the loader is visible, even if loading completes instantly. */
const MIN_DISPLAY_MS = 3000

/** How long to hold at 100% before starting the exit animation. */
const COMPLETE_HOLD_MS = 400

/** Hard-cap: if loader has not resolved after this many ms, force complete. */
const MAX_DISPLAY_MS = 5000

// ─── Callbacks ────────────────────────────────────────────────────────────────

export interface LoaderControllerCallbacks {
  onStateChange: (state: LoaderStateValue) => void
  onPhaseChange: (phase: LoaderPhase) => void
  onComplete: () => void
}

// ─── Loader Controller ────────────────────────────────────────────────────────

export class LoaderController {
  private state: LoaderStateValue = createInitialLoaderState()
  private callbacks: LoaderControllerCallbacks
  private mountTime = 0
  private cleanupFns: Array<() => void> = []
  private completeTimer: ReturnType<typeof setTimeout> | null = null
  private forceCompleteTimer: ReturnType<typeof setTimeout> | null = null

  constructor(callbacks: LoaderControllerCallbacks) {
    this.callbacks = callbacks
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Call when the Loader component mounts.
   * Begins listening to EventBus events.
   */
  public mount(): void {
    this.mountTime = Date.now()
    this.transition('loading')

    // Subscribe to asset pipeline progress
    const onProgress = (payload: { sceneId: string; progress: number }) => {
      this.updateProgress(payload.progress, payload.sceneId)
    }

    const onComplete = (_payload: { sceneId: string }) => {
      this.handleLoadComplete()
    }

    const onAssetProgress = (payload: { id: string; progress: number }) => {
      this.updateCurrentItem(payload.id)
    }

    globalEventBus.on('scene:load_progress', onProgress)
    globalEventBus.on('scene:load_complete', onComplete)
    globalEventBus.on('asset:load_progress', onAssetProgress)

    this.cleanupFns.push(
      () => globalEventBus.off('scene:load_progress', onProgress),
      () => globalEventBus.off('scene:load_complete', onComplete),
      () => globalEventBus.off('asset:load_progress', onAssetProgress),
    )

    // Hard-cap safety net: if nothing resolves in MAX_DISPLAY_MS, force complete.
    // This prevents an infinite loading hang if engine boot fails silently.
    this.forceCompleteTimer = setTimeout(() => {
      logger.warn('[LoaderController] Hard-cap timer fired — forcing load complete.')
      this.handleLoadComplete()
    }, MAX_DISPLAY_MS)

    globalEventBus.emit(LoaderEvents.LOADER_MOUNT as string, undefined)
    logger.info('[LoaderController] Mounted.')
  }

  /**
   * Forces loading to complete. Used when no real assets are registered.
   * Simulates a progress fill over the minimum duration.
   */
  public simulateProgress(): void {
    // Delay start by 400ms to ensure the loader intro animation has rendered
    // before we start updating progress (prevents progress reaching 100% before
    // the loader UI is even visible, which caused the exit to fire too early).
    const INTRO_SETTLE_DELAY = 400
    const startTime = Date.now() + INTRO_SETTLE_DELAY
    const totalDuration = MIN_DISPLAY_MS

    const tick = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(tick)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      this.updateProgress(progress, 'simulated')

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        this.handleLoadComplete()
      }
    }

    requestAnimationFrame(tick)
  }

  /**
   * Called when the exit animation is complete.
   * Advances to 'hidden' phase.
   */
  public onExitComplete(): void {
    this.transition('hidden')
    globalEventBus.emit(LoaderEvents.LOADER_HIDDEN as string, undefined)
    logger.info('[LoaderController] Hidden.')
  }

  /**
   * Tear down: remove EventBus subscriptions, clear timers.
   */
  public dispose(): void {
    this.cleanupFns.forEach((fn) => fn())
    this.cleanupFns = []

    if (this.completeTimer !== null) {
      clearTimeout(this.completeTimer)
      this.completeTimer = null
    }

    if (this.forceCompleteTimer !== null) {
      clearTimeout(this.forceCompleteTimer)
      this.forceCompleteTimer = null
    }

    logger.info('[LoaderController] Disposed.')
  }

  // ─── State Accessors ──────────────────────────────────────────────────────

  public getState(): LoaderStateValue {
    return { ...this.state }
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private updateProgress(progress: number, currentItem: string | null): void {
    this.state = {
      ...this.state,
      progress: Math.max(this.state.progress, Math.min(progress, 1)),
      currentItem,
      elapsedMs: Date.now() - this.mountTime,
    }

    globalEventBus.emit(LoaderEvents.LOADER_PROGRESS as string, undefined)
    this.callbacks.onStateChange({ ...this.state })
  }

  private updateCurrentItem(id: string): void {
    this.state = { ...this.state, currentItem: id }
    this.callbacks.onStateChange({ ...this.state })
  }

  private handleLoadComplete(): void {
    if (this.state.phase !== 'loading') return

    // Clear the hard-cap timer since we completed naturally
    if (this.forceCompleteTimer !== null) {
      clearTimeout(this.forceCompleteTimer)
      this.forceCompleteTimer = null
    }

    // Snap progress to 100%
    this.state = { ...this.state, progress: 1 }
    this.callbacks.onStateChange({ ...this.state })

    // Respect minimum display time
    const elapsed = Date.now() - this.mountTime
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)

    this.completeTimer = setTimeout(() => {
      this.transition('completing')

      // Hold at 100% briefly, then trigger exit
      this.completeTimer = setTimeout(() => {
        this.transition('complete')
        globalEventBus.emit(LoaderEvents.LOADER_COMPLETE as string, undefined)
        this.callbacks.onComplete()
      }, COMPLETE_HOLD_MS)
    }, remaining)
  }

  private transition(to: LoaderPhase): void {
    const from = this.state.phase

    if (!isValidTransition(from, to)) {
      logger.warn(`[LoaderController] Invalid transition: ${from} → ${to}`)
      return
    }

    this.state = { ...this.state, phase: to }
    this.callbacks.onPhaseChange(to)
    this.callbacks.onStateChange({ ...this.state })

    logger.debug(`[LoaderController] Phase: ${from} → ${to}`)
  }
}
