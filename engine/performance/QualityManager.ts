/**
 * @file engine/performance/QualityManager.ts
 * @description Manages performance scaling presets.
 *
 * Purpose: Dynamically adjusts quality based on DeviceCapabilities and FPS drops.
 * Responsibilities: Quality tier state, downgrade logic.
 */

import { type QualityPreset } from '@/config/performance'

import { globalEventBus } from '../events'

export class QualityManager {
  private currentTier: QualityPreset
  private initialTier: QualityPreset

  private readonly tiers: QualityPreset[] = ['low', 'medium', 'high', 'ultra']

  constructor(initialTier: QualityPreset = 'medium') {
    this.initialTier = initialTier
    this.currentTier = initialTier
  }

  /**
   * Returns the current active quality preset.
   */
  public getQuality(): QualityPreset {
    return this.currentTier
  }

  /**
   * Force a specific quality tier.
   */
  public setQuality(tier: QualityPreset): void {
    if (this.currentTier !== tier) {
      const prev = this.currentTier
      this.currentTier = tier
      globalEventBus.emit('perf:quality_adjust', { previousQuality: prev, newQuality: tier })
    }
  }

  /**
   * Downgrades quality by one tier if possible.
   */
  public downgrade(): void {
    const currentIndex = this.tiers.indexOf(this.currentTier)
    if (currentIndex > 0) {
      const newTier = this.tiers[currentIndex - 1]
      this.setQuality(newTier)
    }
  }

  /**
   * Resets quality to the initial detected tier.
   */
  public reset(): void {
    this.setQuality(this.initialTier)
  }
}
