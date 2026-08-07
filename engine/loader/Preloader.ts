/**
 * @file engine/loader/Preloader.ts
 * @description Application-level critical path preloading.
 *
 * Purpose: Bootstraps the critical assets required before the app can be shown.
 * Responsibilities: Loading critical fonts, initial scene models, parsing manifest.
 */

import { assetsConfig } from '@/config/assets'
import { logger } from '@/lib/core'

import { type LoadingManager, type BatchItem } from './LoadingManager'

export class Preloader {
  private manager: LoadingManager

  constructor(manager: LoadingManager) {
    this.manager = manager
  }

  /**
   * Triggers the critical path loading sequence.
   * These assets must be ready before the hero scene can appear.
   */
  public async loadCriticalAssets(): Promise<void> {
    logger.info('[Preloader] Starting critical asset preload...')

    const criticalBatch: BatchItem[] = [
      { url: assetsConfig.models.globe, type: 'model' },
      { url: assetsConfig.textures.earth.diffuse, type: 'texture' },
    ]

    try {
      await this.manager.loadBatch(criticalBatch, 'app_init')
      logger.info('[Preloader] Critical assets loaded successfully.')
    } catch (error) {
      // Non-fatal: app continues with degraded visuals
      logger.error('[Preloader] Failed to preload critical assets', error)
    }
  }
}
