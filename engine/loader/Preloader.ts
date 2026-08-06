/**
 * @file engine/loader/Preloader.ts
 * @description Application-level preloading orchestration.
 *
 * Purpose: Bootstraps the critical assets required before the app can be shown.
 * Responsibilities: Loading critical fonts, initial scene models, parsing manifest.
 */

import { assetsConfig } from '@/config/assets'
import { logger } from '@/lib/core'

import { type LoadingManager } from './LoadingManager'

export class Preloader {
  private manager: LoadingManager

  constructor(manager: LoadingManager) {
    this.manager = manager
  }

  /**
   * Triggers the critical path loading sequence.
   */
  public async loadCriticalAssets(): Promise<void> {
    logger.info('Starting critical asset preload')

    // Define the initial assets required for the hero scene
    const criticalBatch = [
      { url: assetsConfig.models.globe, type: 'model' as const },
      { url: assetsConfig.textures.earth.diffuse, type: 'texture' as const },
    ]

    try {
      await this.manager.loadBatch(criticalBatch, 'app_init')
      logger.info('Critical assets loaded successfully')
    } catch (error) {
      logger.error('Failed to preload critical assets', error)
      throw error
    }
  }
}
