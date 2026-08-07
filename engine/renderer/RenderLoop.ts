/**
 * @file engine/renderer/RenderLoop.ts
 * @description Central RequestAnimationFrame loop for the engine.
 *
 * Purpose: Drives the entire engine tick — scroll, camera, scene, performance.
 * Responsibilities:
 *   - RAF management with delta-time clamping
 *   - Frame subscriber registry (subscribe/unsubscribe)
 *   - Fixed-update queue at a configurable interval
 *   - Pause / resume without full disposal
 *   - Emitting frame:tick on the global EventBus
 */

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'
import { type FrameSubscriber } from '../shared/EngineTypes'

// ─── Fixed Update ────────────────────────────────────────────────────────────

type FixedUpdateFn = (fixedDelta: number) => void

// ─── Render Loop ─────────────────────────────────────────────────────────────

export class RenderLoop {
  private rafId = 0
  private lastTime = 0
  private frameCount = 0
  private isRunning = false
  private isPaused = false

  /** Elapsed time accumulator for fixed-update logic (ms). */
  private fixedAccumulator = 0

  /**
   * Fixed update interval in milliseconds.
   * Default: ~20ms → 50 Hz physics tick.
   */
  private fixedDelta = 1000 / 50

  /** High-frequency per-frame subscribers. */
  private subscribers: Set<FrameSubscriber> = new Set()

  /** Fixed-timestep subscribers (physics, deterministic logic). */
  private fixedSubscribers: Set<FixedUpdateFn> = new Set()

  // ─── Control ─────────────────────────────────────────────────────────────

  /**
   * Starts the global render loop.
   * Safe to call multiple times — no-op if already running.
   */
  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.isPaused = false
    this.lastTime = performance.now()
    this.fixedAccumulator = 0
    this.rafId = requestAnimationFrame(this.tick)
  }

  /**
   * Pauses the loop (RAF stops but state is preserved).
   * Resume with `resume()`.
   */
  public pause(): void {
    if (!this.isRunning || this.isPaused) return
    this.isPaused = true
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  /**
   * Resumes a paused loop.
   */
  public resume(): void {
    if (!this.isRunning || !this.isPaused) return
    this.isPaused = false
    // Reset lastTime to avoid giant delta on resume
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  /**
   * Stops the render loop permanently.
   * Use `pause()` for temporary stops.
   */
  public stop(): void {
    this.isRunning = false
    this.isPaused = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  // ─── Subscribers ─────────────────────────────────────────────────────────

  /**
   * Subscribes a callback to the per-frame tick.
   * Returns an unsubscribe function for easy cleanup.
   */
  public subscribe(fn: FrameSubscriber): () => void {
    this.subscribers.add(fn)
    return () => this.unsubscribe(fn)
  }

  /**
   * Removes a per-frame subscriber.
   */
  public unsubscribe(fn: FrameSubscriber): void {
    this.subscribers.delete(fn)
  }

  /**
   * Subscribes a callback to the fixed-timestep update.
   * Receives a constant `fixedDelta` in milliseconds.
   */
  public subscribeFixed(fn: FixedUpdateFn): () => void {
    this.fixedSubscribers.add(fn)
    return () => this.unsubscribeFixed(fn)
  }

  /**
   * Removes a fixed-timestep subscriber.
   */
  public unsubscribeFixed(fn: FixedUpdateFn): void {
    this.fixedSubscribers.delete(fn)
  }

  /**
   * Sets the fixed-update interval.
   * @param hz - Desired updates per second (e.g. 50 → 20ms interval).
   */
  public setFixedHz(hz: number): void {
    this.fixedDelta = 1000 / Math.max(1, hz)
  }

  // ─── Getters ─────────────────────────────────────────────────────────────

  public get frame(): number {
    return this.frameCount
  }

  public get running(): boolean {
    return this.isRunning && !this.isPaused
  }

  // ─── Internal Tick ───────────────────────────────────────────────────────

  private tick = (time: number): void => {
    if (!this.isRunning || this.isPaused) return

    // ── Delta time ───────────────────────────────────────────────────────
    let delta = time - this.lastTime

    // Clamp to prevent massive jumps (e.g. tab switch, focus loss)
    if (delta > EngineConstants.MAX_DELTA_TIME) {
      delta = EngineConstants.MAX_DELTA_TIME
    }

    this.lastTime = time
    this.frameCount++

    // ── Fixed update ─────────────────────────────────────────────────────
    if (this.fixedSubscribers.size > 0) {
      this.fixedAccumulator += delta

      // Drain accumulator in fixed steps; cap at 5 steps to prevent spiral
      let steps = 0
      while (this.fixedAccumulator >= this.fixedDelta && steps < 5) {
        this.fixedSubscribers.forEach((fn) => fn(this.fixedDelta))
        this.fixedAccumulator -= this.fixedDelta
        steps++
      }
    }

    // ── Variable update ──────────────────────────────────────────────────
    this.subscribers.forEach((fn) => {
      try {
        fn(time, delta, this.frameCount)
      } catch {
        // Swallow per-subscriber errors to keep loop alive
      }
    })

    // ── Global event ─────────────────────────────────────────────────────
    globalEventBus.emit('frame:tick', {
      time,
      delta,
      frame: this.frameCount,
    })

    // ── Schedule next frame ──────────────────────────────────────────────
    this.rafId = requestAnimationFrame(this.tick)
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  public dispose(): void {
    this.stop()
    this.subscribers.clear()
    this.fixedSubscribers.clear()
  }
}
