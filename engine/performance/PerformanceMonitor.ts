/**
 * @file engine/performance/PerformanceMonitor.ts
 * @description Facade manager for all performance-related subsystems.
 *
 * Purpose: Centralizes FPS tracking, memory monitoring, device capability detection,
 * and quality management. Exposes the full EngineManager contract.
 *
 * Responsibilities:
 *   - Evaluate device hardware tier on init
 *   - Set initial quality preset based on tier
 *   - Tick FPS monitor every frame
 *   - Listen for FPS drop events → auto-downgrade quality
 *   - Expose pause / resume (stop FPS tracking)
 *   - Resize: no-op (quality managed by FPS, not viewport)
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { type EngineManager, type LifecycleState, type Tickable } from '../shared/EngineTypes'

import { DeviceCapabilities, type DeviceInfo } from './DeviceCapabilities'
import { FPSMonitor } from './FPSMonitor'
import { MemoryMonitor } from './MemoryMonitor'
import { QualityManager } from './QualityManager'

export class PerformanceMonitor implements EngineManager, Tickable {
  public state: LifecycleState = 'uninitialized'

  public fps: FPSMonitor
  public memory: MemoryMonitor
  public quality: QualityManager
  public device: DeviceInfo | null = null

  constructor() {
    this.fps = new FPSMonitor()
    this.memory = new MemoryMonitor()
    this.quality = new QualityManager('medium')
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // ── Device capability detection ──────────────────────────────────────
    this.device = DeviceCapabilities.evaluate()

    // ── Set quality preset from hardware tier ────────────────────────────
    this.quality = new QualityManager(this.device.tier)

    // ── Subscribe to FPS drop events ─────────────────────────────────────
    globalEventBus.on('perf:fps_drop', this.handleFpsDrop)

    this.state = 'running'
    logger.info(
      `[PerformanceMonitor] Initialized. Tier: ${this.device.tier} | GPU: ${this.device.gpuName}`,
    )
  }

  /**
   * Ticks the FPS monitor. Called every frame by EngineRuntime.
   */
  public tick(time: number, _delta: number, _frame: number): void {
    if (this.state !== 'running') return
    this.fps.tick(time)
  }

  /**
   * Called by EngineRuntime each frame with delta time.
   */
  public update(delta: number): void {
    this.tick(performance.now(), delta, 0)
  }

  /**
   * Pause: stop FPS sampling (counters freeze at last value).
   */
  public pause(): void {
    if (this.state !== 'running') return
    this.state = 'paused'
    logger.info('[PerformanceMonitor] Paused')
  }

  /**
   * Resume: restart FPS sampling.
   */
  public resume(): void {
    if (this.state !== 'paused') return
    this.state = 'running'
    logger.info('[PerformanceMonitor] Resumed')
  }

  /**
   * Resize: no-op — quality is governed by FPS, not viewport dimensions.
   */
  public resize(_width: number, _height: number, _pixelRatio: number): void {
    // No-op
  }

  public dispose(): void {
    globalEventBus.off('perf:fps_drop', this.handleFpsDrop)
    this.state = 'destroyed'
    logger.info('[PerformanceMonitor] Disposed')
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Returns a snapshot of current performance metrics.
   */
  public getSnapshot(): {
    fps: number
    avgFps: number
    memoryMB: number | null
    quality: string
    tier: string
  } {
    const mem = this.memory.getMemoryStats()
    return {
      fps: this.fps.getFPS(),
      avgFps: this.fps.getAverageFPS(),
      memoryMB: mem?.usedMB ?? null,
      quality: this.quality.getQuality(),
      tier: this.device?.tier ?? 'unknown',
    }
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private handleFpsDrop = (payload: { currentFps: number; targetFps: number }): void => {
    logger.warn(
      `[PerformanceMonitor] Severe FPS drop: ${payload.currentFps}fps / target ${payload.targetFps}fps. Downgrading quality.`,
    )
    this.quality.downgrade()
  }
}
