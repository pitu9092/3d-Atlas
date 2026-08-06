/**
 * @file engine/renderer/RenderLoop.ts
 * @description Central RequestAnimationFrame loop for the engine.
 *
 * Purpose: Drives the entire engine tick (Scenes, Scroll, Performance, UI).
 * Responsibilities: RAF management, delta time calculation, emitting tick events.
 */

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'

export class RenderLoop {
  private rafId = 0
  private lastTime = 0
  private frameCount = 0
  private isRunning = false

  /**
   * Starts the global render loop.
   */
  public start(): void {
    if (this.isRunning) return
    this.isRunning = true
    this.lastTime = performance.now()
    this.tick(this.lastTime)
  }

  /**
   * Stops the global render loop.
   */
  public stop(): void {
    this.isRunning = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  private tick = (time: number): void => {
    if (!this.isRunning) return

    let delta = time - this.lastTime

    // Clamp delta to prevent huge jumps (e.g., user switches tabs)
    if (delta > EngineConstants.MAX_DELTA_TIME) {
      delta = EngineConstants.MAX_DELTA_TIME
    }

    this.lastTime = time
    this.frameCount++

    // Emit tick event to all subscribed managers (GSAP, Lenis, SceneManager, etc.)
    globalEventBus.emit('frame:tick', {
      time,
      delta,
      frame: this.frameCount,
    })

    this.rafId = requestAnimationFrame(this.tick)
  }

  public dispose(): void {
    this.stop()
  }
}
