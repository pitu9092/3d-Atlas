/**
 * @file engine/assets/AssetCache.ts
 * @description Reference-counted memory and GPU asset cache.
 *
 * Purpose: Prevents duplicate loads, enables resource reuse, and provides
 * automatic LRU eviction when memory budget is exceeded.
 *
 * Responsibilities:
 *   - Store loaded assets keyed by asset ID
 *   - Reference counting: acquire() increments, release() decrements
 *   - Auto-evict least-recently-used assets when over memory budget
 *   - GPU texture memory estimation
 *   - Cache statistics (hit rate, total memory)
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { EngineConstants } from '../shared/EngineConstants'

// ─── Cache Entry ──────────────────────────────────────────────────────────────

interface CacheEntry {
  id: string
  data: unknown
  /** Estimated memory usage in MB (0 = unknown). */
  sizeMB: number
  /** Reference count — how many consumers hold this asset. */
  refs: number
  /** Whether this entry is pinned (never auto-evicted). */
  pinned: boolean
  /** Last access timestamp (for LRU ordering). */
  lastAccessAt: number
  /** When the asset was first cached. */
  cachedAt: number
}

// ─── Cache Stats ──────────────────────────────────────────────────────────────

export interface CacheStats {
  totalEntries: number
  pinnedEntries: number
  totalMemoryMB: number
  budgetMB: number
  hitCount: number
  missCount: number
  hitRate: number
  evictionCount: number
}

// ─── Asset Cache ──────────────────────────────────────────────────────────────

export class AssetCache {
  private store: Map<string, CacheEntry> = new Map()
  private budgetMB: number
  private hitCount = 0
  private missCount = 0
  private evictionCount = 0

  constructor(budgetMB: number = EngineConstants.ASSET_CACHE_MAX_MEMORY_MB) {
    this.budgetMB = budgetMB
  }

  // ─── Core API ─────────────────────────────────────────────────────────────

  /**
   * Stores an asset in the cache.
   * If `pinned` is true, the entry is never auto-evicted.
   */
  public set(id: string, data: unknown, sizeMB = 0, pinned = false): void {
    const entry: CacheEntry = {
      id,
      data,
      sizeMB,
      refs: 0,
      pinned,
      lastAccessAt: Date.now(),
      cachedAt: Date.now(),
    }
    this.store.set(id, entry)

    // Check budget after every insert
    this.autoEvict()
  }

  /**
   * Retrieves an asset from the cache (raw, without ref count).
   * Returns null if not found.
   */
  public get<T>(id: string): T | null {
    const entry = this.store.get(id)
    if (!entry) {
      this.missCount++
      return null
    }

    entry.lastAccessAt = Date.now()
    this.hitCount++

    globalEventBus.emit('asset:cache_hit', { id })
    return entry.data as T
  }

  /**
   * Checks whether an asset is cached.
   */
  public has(id: string): boolean {
    return this.store.has(id)
  }

  /**
   * Acquires a reference to a cached asset.
   * Increments the ref count.
   * Returns null if the asset is not in cache.
   */
  public acquire<T>(id: string): T | null {
    const entry = this.store.get(id)
    if (!entry) return null

    entry.refs++
    entry.lastAccessAt = Date.now()
    this.hitCount++

    globalEventBus.emit('asset:cache_hit', { id })
    return entry.data as T
  }

  /**
   * Releases a reference to a cached asset.
   * Decrements the ref count. If it reaches 0 and the entry is not pinned,
   * the entry becomes eligible for eviction.
   */
  public release(id: string): void {
    const entry = this.store.get(id)
    if (!entry) return

    entry.refs = Math.max(0, entry.refs - 1)
  }

  /**
   * Immediately evicts an asset from the cache (regardless of refs).
   */
  public evict(id: string, reason: 'lru' | 'manual' | 'memory_pressure' = 'manual'): boolean {
    if (!this.store.has(id)) return false

    this.store.delete(id)
    this.evictionCount++

    globalEventBus.emit('asset:cache_evict', { id, reason })
    logger.debug(`[AssetCache] Evicted: '${id}' (${reason})`)

    return true
  }

  /**
   * Clears all non-pinned entries from the cache.
   */
  public flush(): void {
    const toEvict: string[] = []
    this.store.forEach((entry, id) => {
      if (!entry.pinned) toEvict.push(id)
    })
    toEvict.forEach((id) => this.evict(id, 'manual'))
    logger.info(`[AssetCache] Flushed ${toEvict.length} entries.`)
  }

  /**
   * Clears all entries including pinned ones.
   */
  public clear(): void {
    const ids = Array.from(this.store.keys())
    ids.forEach((id) => this.evict(id, 'manual'))
    logger.info('[AssetCache] Cleared all entries.')
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  public getStats(): CacheStats {
    let totalMemoryMB = 0
    let pinnedEntries = 0

    this.store.forEach((entry) => {
      totalMemoryMB += entry.sizeMB
      if (entry.pinned) pinnedEntries++
    })

    const totalRequests = this.hitCount + this.missCount

    return {
      totalEntries: this.store.size,
      pinnedEntries,
      totalMemoryMB: Math.round(totalMemoryMB * 100) / 100,
      budgetMB: this.budgetMB,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: totalRequests > 0 ? this.hitCount / totalRequests : 0,
      evictionCount: this.evictionCount,
    }
  }

  public getTotalMemoryMB(): number {
    let total = 0
    this.store.forEach((e) => (total += e.sizeMB))
    return total
  }

  // ─── Automatic Eviction ───────────────────────────────────────────────────

  /**
   * Evicts LRU non-referenced, non-pinned entries until under budget.
   * Called automatically after every `set()`.
   */
  private autoEvict(): void {
    if (this.getTotalMemoryMB() <= this.budgetMB) return

    // Gather eviction candidates: not pinned, no refs, sorted by LRU
    const candidates = Array.from(this.store.values())
      .filter((e) => !e.pinned && e.refs === 0)
      .sort((a, b) => a.lastAccessAt - b.lastAccessAt)

    for (const candidate of candidates) {
      if (this.getTotalMemoryMB() <= this.budgetMB) break
      this.evict(candidate.id, 'memory_pressure')
    }

    if (this.getTotalMemoryMB() > this.budgetMB) {
      logger.warn(
        `[AssetCache] Memory budget exceeded: ${this.getTotalMemoryMB().toFixed(1)}MB / ${this.budgetMB}MB. All eviction candidates exhausted.`,
      )
    }
  }
}

// Singleton instance
export const assetCache = new AssetCache()
