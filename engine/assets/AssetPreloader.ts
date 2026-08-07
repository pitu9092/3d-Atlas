/**
 * @file engine/assets/AssetPreloader.ts
 * @description Critical-path and scene-scoped preloading orchestrator.
 *
 * Purpose: Coordinates the preloading of assets required before a scene renders.
 * Responsibilities:
 *   - preloadCritical(tier): loads all `preload: true` assets matching the quality tier
 *   - preloadScene(sceneId): loads all assets tagged for a specific scene ID
 *   - Emits scene:load_start, scene:load_progress, scene:load_complete events
 *   - Compatible with Phase 5 LoadingManager progress events
 */

import { type QualityPreset } from '@/config/performance'
import { logger } from '@/lib/core'

import { globalEventBus } from '../events'

import { assetPipelineLoader } from './AssetLoader'
import { type AssetManifestEntry } from './AssetManifest'
import { AssetPriority } from './AssetPriority'
import { assetRegistry } from './AssetRegistry'

export class AssetPreloader {
  /**
   * Loads all `preload: true` assets that are compatible with the given quality tier.
   * Assets with `qualityLevel: 'all'` are always included.
   * Emits scene:load_* events so LoadingManager and UI overlays can react.
   */
  public async preloadCritical(tier: QualityPreset): Promise<void> {
    const all = assetRegistry.getCriticalAssets()

    const eligible = all.filter((e) => e.qualityLevel === 'all' || this.isTierEligible(e, tier))

    const prioritized = eligible.sort((a, b) => a.priority - b.priority)

    logger.info(
      `[AssetPreloader] Starting critical preload: ${prioritized.length} assets (tier: ${tier})`,
    )

    await this.runBatch('critical', prioritized)
  }

  /**
   * Loads all assets tagged with a specific scene ID.
   * Used by SceneManager when transitioning into a new scene.
   */
  public async preloadScene(sceneId: string): Promise<void> {
    const assets = assetRegistry.getByTag(sceneId)

    if (assets.length === 0) {
      logger.info(`[AssetPreloader] No assets tagged for scene: '${sceneId}'`)
      return
    }

    const prioritized = assets.sort((a, b) => a.priority - b.priority)

    logger.info(`[AssetPreloader] Preloading ${prioritized.length} assets for scene: '${sceneId}'`)

    await this.runBatch(sceneId, prioritized)
  }

  /**
   * Loads all assets in a named group.
   */
  public async preloadGroup(groupId: string): Promise<void> {
    const assets = assetRegistry.getByGroup(groupId)

    if (assets.length === 0) {
      logger.info(`[AssetPreloader] No assets in group: '${groupId}'`)
      return
    }

    const prioritized = assets.sort((a, b) => a.priority - b.priority)
    await this.runBatch(groupId, prioritized)
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  /**
   * Runs a loading batch with progress tracking and EventBus emissions.
   * Compatible with Phase 5 LoadingManager progress event format.
   */
  private async runBatch(batchId: string, entries: AssetManifestEntry[]): Promise<void> {
    const total = entries.length
    let loaded = 0
    let hasErrors = false

    globalEventBus.emit('scene:load_start', { sceneId: batchId })

    const loadOne = async (entry: AssetManifestEntry): Promise<void> => {
      try {
        await assetPipelineLoader.load(entry.id)
      } catch (error) {
        hasErrors = true
        logger.error(`[AssetPreloader] Failed to load '${entry.id}'`, error)
      }

      loaded++
      const progress = total > 0 ? loaded / total : 1

      globalEventBus.emit('scene:load_progress', { sceneId: batchId, progress })
      globalEventBus.emit('asset:load_progress', { id: entry.id, progress })
    }

    // Respect priority ordering while loading concurrently
    // Group into priority buckets: CRITICAL first, then others
    const critical = entries.filter((e) => e.priority === AssetPriority.CRITICAL)
    const rest = entries.filter((e) => e.priority !== AssetPriority.CRITICAL)

    // Load critical assets first (must be sequential or concurrent — here concurrent)
    await Promise.allSettled(critical.map(loadOne))

    // Then load the rest
    await Promise.allSettled(rest.map(loadOne))

    globalEventBus.emit('scene:load_complete', { sceneId: batchId })

    if (hasErrors) {
      logger.warn(`[AssetPreloader] Batch '${batchId}' completed with errors.`)
    } else {
      logger.info(`[AssetPreloader] Batch '${batchId}' complete (${total} assets).`)
    }
  }

  /**
   * Returns true if an asset should be loaded for the given quality tier.
   * An asset is eligible if its qualityLevel matches OR is a lower tier
   * (e.g., a 'low' quality asset is loaded on 'high' devices too).
   */
  private isTierEligible(entry: AssetManifestEntry, tier: QualityPreset): boolean {
    if (entry.qualityLevel === 'all') return true

    const tiers: QualityPreset[] = ['low', 'medium', 'high', 'ultra']
    const entryIndex = tiers.indexOf(entry.qualityLevel as QualityPreset)
    const tierIndex = tiers.indexOf(tier)

    return entryIndex <= tierIndex
  }
}

// Singleton instance
export const assetPreloader = new AssetPreloader()
