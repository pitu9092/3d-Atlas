/**
 * @file engine/performance/PerformanceMonitor.ts
 * @description Facade manager for all performance-related modules.
 *
 * Purpose: Centralizes FPS tracking, memory monitoring, and quality adjustments.
 * Responsibilities: Lifecycle management for performance tools, subscribing to drop events.
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
    this.quality = new QualityManager('medium') // Default until init
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // Evaluate hardware
    this.device = DeviceCapabilities.evaluate()

    // Set initial quality based on hardware tier
    this.quality = new QualityManager(this.device.tier)
    logger.info(`Performance initialized. Hardware tier: ${this.device.tier}`)

    // Subscribe to FPS drops to trigger auto-downgrade
    globalEventBus.on('perf:fps_drop', this.handleFpsDrop)

    this.state = 'running'
  }

  public tick(time: number): void {
    if (this.state !== 'running') return
    this.fps.tick(time)
  }

  private handleFpsDrop = (payload: { currentFps: number; targetFps: number }): void => {
    logger.warn(
      `Severe FPS drop detected (${payload.currentFps}/${payload.targetFps}). Downgrading quality...`,
    )
    this.quality.downgrade()
  }

  public dispose(): void {
    globalEventBus.off('perf:fps_drop', this.handleFpsDrop)
    this.state = 'destroyed'
  }
}
