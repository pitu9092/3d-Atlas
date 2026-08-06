/**
 * @file engine/performance/FPSMonitor.ts
 * @description Tracks frames per second and frame times.
 *
 * Purpose: Provides real-time FPS metrics and detects severe frame drops.
 * Responsibilities: Frame counting, moving average, drop detection.
 */

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'

export class FPSMonitor {
  private frames = 0
  private lastTime = 0
  private currentFps = 0
  private fpsHistory: number[] = []
  private readonly historySize = 60
  private targetFps: number = EngineConstants.DEFAULT_FPS_TARGET

  /**
   * Called every frame to track FPS.
   */
  public tick(time: number): void {
    this.frames++

    if (time >= this.lastTime + 1000) {
      this.currentFps = Math.round((this.frames * 1000) / (time - this.lastTime))
      this.frames = 0
      this.lastTime = time

      this.trackHistory(this.currentFps)
      this.checkDrops()
    }
  }

  private trackHistory(fps: number): void {
    this.fpsHistory.push(fps)
    if (this.fpsHistory.length > this.historySize) {
      this.fpsHistory.shift()
    }
  }

  private checkDrops(): void {
    // If FPS drops below 50% of target for 3 consecutive seconds, emit event
    const recent = this.fpsHistory.slice(-3)
    if (recent.length === 3 && recent.every((fps) => fps < this.targetFps * 0.5)) {
      globalEventBus.emit('perf:fps_drop', {
        currentFps: this.currentFps,
        targetFps: this.targetFps,
      })
    }
  }

  public getFPS(): number {
    return this.currentFps
  }

  public getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0)
    return Math.round(sum / this.fpsHistory.length)
  }

  public setTargetFPS(fps: number): void {
    this.targetFps = fps
  }
}
