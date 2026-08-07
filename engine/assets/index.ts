/**
 * @file engine/assets/index.ts
 * @description Public API barrel for the engine/assets pipeline.
 *
 * Exports all classes, instances, and types from the asset pipeline.
 * Scene code, hooks, and providers should import from here only — never from deep paths.
 *
 * Singletons:
 *   assetRegistry       — Global asset manifest registry
 *   assetCache          — Reference-counted memory/GPU cache
 *   assetQueue          — Priority load queue with cancellation
 *   assetPipelineLoader — Main public loading API
 *   assetPreloader      — Critical-path preloading orchestrator
 *   assetDisposer       — Typed disposal for all asset types
 *   assetOptimizer      — Texture and model optimization helpers
 *   assetMetrics        — Load time, cache hit, and memory tracking
 *   assetValidator      — Schema validation for manifest entries
 *
 * Constants:
 *   AssetPriority       — Priority level constants (CRITICAL, HIGH, etc.)
 *   AssetEvents         — Asset event name constants
 */

// ── Manifest Types ─────────────────────────────────────────────────────────
export type {
  AssetManifestEntry,
  AssetManifest,
  AssetCategory,
  AssetFormat,
  AssetCompression,
  AssetQualityLevel,
} from './AssetManifest'

// ── Priority ───────────────────────────────────────────────────────────────
export { AssetPriority } from './AssetPriority'
export type { AssetPriorityLevel } from './AssetPriority'

// ── Event Constants ────────────────────────────────────────────────────────
export { AssetEvents } from './AssetEvents'
export type { AssetEventName } from './AssetEvents'

// ── Registry ───────────────────────────────────────────────────────────────
export { AssetRegistry, assetRegistry } from './AssetRegistry'

// ── Cache ──────────────────────────────────────────────────────────────────
export { AssetCache, assetCache } from './AssetCache'
export type { CacheStats } from './AssetCache'

// ── Queue ──────────────────────────────────────────────────────────────────
export { AssetQueue, assetQueue } from './AssetQueue'
export type { QueueTask, CancellationToken } from './AssetQueue'

// ── Loader (pipeline facade) ───────────────────────────────────────────────
export { AssetPipelineLoader, assetPipelineLoader } from './AssetLoader'

// ── Preloader ──────────────────────────────────────────────────────────────
export { AssetPreloader, assetPreloader } from './AssetPreloader'

// ── Disposer ───────────────────────────────────────────────────────────────
export { AssetDisposer, assetDisposer } from './AssetDisposer'

// ── Optimizer ─────────────────────────────────────────────────────────────
export { AssetOptimizer, assetOptimizer } from './AssetOptimizer'

// ── Metrics ────────────────────────────────────────────────────────────────
export { AssetMetrics, assetMetrics } from './AssetMetrics'
export type { AssetMetricEntry, AssetMetricsReport } from './AssetMetrics'

// ── Validator ─────────────────────────────────────────────────────────────
export { AssetValidator, assetValidator } from './AssetValidator'
export type { ValidationError, ValidationReport } from './AssetValidator'
