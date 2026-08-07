/**
 * @file engine/assets/AssetMetrics.ts
 * @description Load time, cache hit/miss, and memory tracking for all assets.
 *
 * Purpose: Production observability for the asset pipeline.
 * Responsibilities:
 *   - Per-asset load time tracking
 *   - Cache hit / miss counters
 *   - Error tracking
 *   - Aggregate reports: slowest, largest, hit rate
 */

import { logger } from '@/lib/core'

// ─── Per-Asset Metric ─────────────────────────────────────────────────────────

export interface AssetMetricEntry {
  id: string
  loadCount: number
  totalLoadMs: number
  avgLoadMs: number
  lastLoadMs: number
  cacheHits: number
  errors: number
  sizeBytes: number
  firstLoadAt: number
  lastLoadAt: number
}

// ─── Aggregate Report ─────────────────────────────────────────────────────────

export interface AssetMetricsReport {
  totalAssets: number
  totalLoads: number
  totalCacheHits: number
  totalErrors: number
  cacheHitRate: number
  avgLoadMs: number
  slowest: AssetMetricEntry[]
  largest: AssetMetricEntry[]
}

// ─── Asset Metrics ────────────────────────────────────────────────────────────

export class AssetMetrics {
  private metrics: Map<string, AssetMetricEntry> = new Map()

  // ─── Recording ────────────────────────────────────────────────────────────

  /**
   * Records a successful asset load.
   */
  public recordLoad(id: string, durationMs: number, sizeBytes: number): void {
    const now = Date.now()
    const existing = this.metrics.get(id)

    if (existing) {
      existing.loadCount++
      existing.totalLoadMs += durationMs
      existing.avgLoadMs = existing.totalLoadMs / existing.loadCount
      existing.lastLoadMs = durationMs
      existing.sizeBytes = Math.max(existing.sizeBytes, sizeBytes)
      existing.lastLoadAt = now
    } else {
      this.metrics.set(id, {
        id,
        loadCount: 1,
        totalLoadMs: durationMs,
        avgLoadMs: durationMs,
        lastLoadMs: durationMs,
        cacheHits: 0,
        errors: 0,
        sizeBytes,
        firstLoadAt: now,
        lastLoadAt: now,
      })
    }

    logger.debug(
      `[AssetMetrics] Load recorded: '${id}' (${durationMs.toFixed(1)}ms, ${sizeBytes}B)`,
    )
  }

  /**
   * Records a cache hit for an asset.
   */
  public recordCacheHit(id: string): void {
    const existing = this.metrics.get(id)
    if (existing) {
      existing.cacheHits++
    } else {
      this.metrics.set(id, {
        id,
        loadCount: 0,
        totalLoadMs: 0,
        avgLoadMs: 0,
        lastLoadMs: 0,
        cacheHits: 1,
        errors: 0,
        sizeBytes: 0,
        firstLoadAt: Date.now(),
        lastLoadAt: Date.now(),
      })
    }
  }

  /**
   * Records a load error for an asset.
   */
  public recordError(id: string): void {
    const existing = this.metrics.get(id)
    if (existing) {
      existing.errors++
    } else {
      this.metrics.set(id, {
        id,
        loadCount: 0,
        totalLoadMs: 0,
        avgLoadMs: 0,
        lastLoadMs: 0,
        cacheHits: 0,
        errors: 1,
        sizeBytes: 0,
        firstLoadAt: Date.now(),
        lastLoadAt: Date.now(),
      })
    }
  }

  // ─── Reports ──────────────────────────────────────────────────────────────

  /**
   * Returns a full metrics report across all tracked assets.
   */
  public getReport(topN = 10): AssetMetricsReport {
    const all = Array.from(this.metrics.values())

    const totalLoads = all.reduce((s, m) => s + m.loadCount, 0)
    const totalCacheHits = all.reduce((s, m) => s + m.cacheHits, 0)
    const totalErrors = all.reduce((s, m) => s + m.errors, 0)
    const totalRequests = totalLoads + totalCacheHits

    const allLoadMs = all.flatMap((m) => (m.loadCount > 0 ? [m.avgLoadMs] : []))
    const avgLoadMs =
      allLoadMs.length > 0 ? allLoadMs.reduce((a, b) => a + b, 0) / allLoadMs.length : 0

    return {
      totalAssets: all.length,
      totalLoads,
      totalCacheHits,
      totalErrors,
      cacheHitRate: totalRequests > 0 ? totalCacheHits / totalRequests : 0,
      avgLoadMs: Math.round(avgLoadMs * 10) / 10,
      slowest: this.getSlowest(topN),
      largest: this.getLargest(topN),
    }
  }

  /**
   * Returns the N slowest-loading assets (by average load time).
   */
  public getSlowest(n = 5): AssetMetricEntry[] {
    return Array.from(this.metrics.values())
      .filter((m) => m.loadCount > 0)
      .sort((a, b) => b.avgLoadMs - a.avgLoadMs)
      .slice(0, n)
  }

  /**
   * Returns the N largest assets (by byte size).
   */
  public getLargest(n = 5): AssetMetricEntry[] {
    return Array.from(this.metrics.values())
      .filter((m) => m.sizeBytes > 0)
      .sort((a, b) => b.sizeBytes - a.sizeBytes)
      .slice(0, n)
  }

  /**
   * Returns the overall cache hit rate (0–1).
   */
  public getCacheHitRate(): number {
    const totalLoads = Array.from(this.metrics.values()).reduce((s, m) => s + m.loadCount, 0)
    const totalHits = Array.from(this.metrics.values()).reduce((s, m) => s + m.cacheHits, 0)
    const total = totalLoads + totalHits
    return total > 0 ? totalHits / total : 0
  }

  public getMetric(id: string): AssetMetricEntry | undefined {
    return this.metrics.get(id)
  }

  /**
   * Resets all metrics. Called on engine dispose.
   */
  public dispose(): void {
    this.metrics.clear()
    logger.info('[AssetMetrics] Metrics reset.')
  }
}

// Singleton instance
export const assetMetrics = new AssetMetrics()
