/**
 * @file engine/assets/AssetLoader.ts
 * @description Production asset pipeline facade — the primary public API for loading assets.
 *
 * Purpose: Bridges the asset registry/manifest/cache/queue to the underlying
 * engine/loader/AssetLoader transport layer.
 *
 * Responsibilities:
 *   - load<T>(id): cache check → registry lookup → queue → transport loader
 *   - preload(ids[]): bulk enqueue at given priority
 *   - unload(id): release ref → disposer
 *   - get<T>(id): synchronous cache lookup (null if not loaded)
 *   - has(id): cache hit check
 *   - clear(): drain cache + dispose all
 *
 * This is NOT a rewrite of engine/loader/AssetLoader.ts.
 * It is a higher-level orchestrator that delegates raw I/O to it.
 *
 * Integration:
 *   - Emits asset:load_start / asset:load_complete / asset:load_error
 *   - Records metrics via AssetMetrics
 *   - Uses AssetQueue for priority + concurrency control
 *   - Uses AssetCache for reference-counted storage
 *   - Uses AssetRegistry to resolve paths from IDs
 *   - Uses AssetDisposer for typed cleanup
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { AssetLoader as TransportLoader, type AssetType } from '../loader/AssetLoader'

import { assetCache } from './AssetCache'
import { assetDisposer } from './AssetDisposer'
import { type AssetManifestEntry } from './AssetManifest'
import { assetMetrics } from './AssetMetrics'
import { AssetPriority } from './AssetPriority'
import { assetQueue } from './AssetQueue'
import { assetRegistry } from './AssetRegistry'

// ─── Category → AssetType mapping ────────────────────────────────────────────

function categoryToAssetType(category: AssetManifestEntry['category']): AssetType {
  switch (category) {
    case 'model':
      return 'model'
    case 'texture':
    case 'hdri':
    case 'image':
      return category === 'hdri' ? 'hdri' : 'texture'
    case 'video':
      return 'video'
    case 'font':
      return 'font'
    case 'audio':
      // Audio falls back to video loader (HTMLAudioElement)
      return 'video'
    case 'icon':
      // Icons are SVG/JSON strings, use texture loader
      return 'texture'
    default: {
      const _exhaustive: never = category
      return 'texture' as AssetType
      void _exhaustive
    }
  }
}

// ─── Asset Pipeline Loader ────────────────────────────────────────────────────

export class AssetPipelineLoader {
  private transport: TransportLoader

  constructor() {
    this.transport = new TransportLoader()
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Loads an asset by its registry ID.
   *
   * 1. Checks the AssetCache — returns immediately if cached.
   * 2. Looks up the manifest entry from AssetRegistry.
   * 3. Enqueues in AssetQueue at the declared priority.
   * 4. Delegates raw loading to the transport AssetLoader.
   * 5. Stores result in cache and records metrics.
   */
  public async load<T>(id: string): Promise<T> {
    // Cache hit
    if (assetCache.has(id)) {
      const cached = assetCache.acquire<T>(id)
      if (cached !== null) {
        assetMetrics.recordCacheHit(id)
        return cached
      }
    }

    // Registry lookup
    const entry = assetRegistry.get(id)
    if (!entry) {
      throw new Error(`[AssetPipelineLoader] Asset not registered: '${id}'`)
    }

    // Emit load start
    globalEventBus.emit('asset:load_start', {
      id,
      url: entry.path,
      type: entry.category,
    })

    const startTime = Date.now()

    const { promise } = assetQueue.enqueue<T>(id, entry.priority, (_signal: AbortSignal) =>
      this.transport.loadByType<T>(entry.path, categoryToAssetType(entry.category)),
    )

    try {
      const result = await promise
      const durationMs = Date.now() - startTime

      // Store in cache
      assetCache.set(id, result, entry.size / 1_000_000, entry.cache)
      assetMetrics.recordLoad(id, durationMs, entry.size)

      globalEventBus.emit('asset:load_complete', {
        id,
        url: entry.path,
        durationMs,
        sizeBytes: entry.size,
      })

      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      assetMetrics.recordError(id)

      globalEventBus.emit('asset:load_error', {
        id,
        url: entry.path,
        error: message,
        attempts: 1,
      })

      throw error
    }
  }

  /**
   * Bulk-preloads a list of asset IDs.
   * All assets are enqueued at the given priority (defaults to NORMAL).
   * Returns a settled promise — individual errors are logged, not thrown.
   */
  public async preload(ids: string[], priority = AssetPriority.NORMAL): Promise<void> {
    // Override priority for preload calls
    const tasks = ids.map(async (id) => {
      const entry = assetRegistry.get(id)
      if (!entry) {
        logger.warn(`[AssetPipelineLoader] preload: unknown asset '${id}'`)
        return
      }

      const overriddenEntry = { ...entry, priority }

      try {
        await this.loadWithEntry(overriddenEntry)
      } catch (error) {
        logger.error(`[AssetPipelineLoader] preload failed for '${id}'`, error)
      }
    })

    await Promise.allSettled(tasks)
  }

  /**
   * Releases a reference to a cached asset.
   * If the ref count drops to 0 and it is not pinned, the entry becomes evictable.
   */
  public unload(id: string): void {
    assetCache.release(id)
    logger.debug(`[AssetPipelineLoader] Released reference to '${id}'.`)
  }

  /**
   * Synchronous cache lookup. Returns null if the asset is not loaded.
   */
  public get<T>(id: string): T | null {
    return assetCache.get<T>(id)
  }

  /**
   * Returns true if the asset is currently in the cache.
   */
  public has(id: string): boolean {
    return assetCache.has(id)
  }

  /**
   * Registers an asset and immediately loads it.
   * Useful for dynamic assets not declared in the static manifest.
   */
  public async register(entry: AssetManifestEntry): Promise<void> {
    assetRegistry.register(entry)
    await this.load(entry.id)
  }

  /**
   * Clears the entire cache and disposes all assets.
   */
  public clear(): void {
    // Dispose all cached assets
    assetCache.getStats() // trigger a stats snapshot for logging
    assetRegistry.getAll().forEach((entry) => {
      const asset = assetCache.get(entry.id)
      if (asset !== null) {
        assetDisposer.disposeByType(entry.category, asset)
      }
    })

    assetCache.clear()
    logger.info('[AssetPipelineLoader] Cache cleared and all assets disposed.')
  }

  /**
   * Disposes the pipeline and resets metrics.
   */
  public dispose(): void {
    assetQueue.cancelAll()
    this.clear()
    assetMetrics.dispose()
    logger.info('[AssetPipelineLoader] Disposed.')
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private async loadWithEntry<T>(entry: AssetManifestEntry): Promise<T> {
    if (assetCache.has(entry.id)) {
      const cached = assetCache.acquire<T>(entry.id)
      if (cached !== null) {
        assetMetrics.recordCacheHit(entry.id)
        return cached
      }
    }

    const startTime = Date.now()

    const { promise } = assetQueue.enqueue<T>(entry.id, entry.priority, (_signal: AbortSignal) =>
      this.transport.loadByType<T>(entry.path, categoryToAssetType(entry.category)),
    )

    const result = await promise
    const durationMs = Date.now() - startTime

    assetCache.set(entry.id, result, entry.size / 1_000_000, entry.cache)
    assetMetrics.recordLoad(entry.id, durationMs, entry.size)

    return result
  }
}

// Singleton instance
export const assetPipelineLoader = new AssetPipelineLoader()
