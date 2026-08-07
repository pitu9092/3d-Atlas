/**
 * @file engine/assets/AssetEvents.ts
 * @description Asset pipeline event name constants.
 *
 * Purpose: Typed event names for the asset pipeline's pub/sub communication.
 * Mirrors the 'asset:*' keys in EventPayloadMap (engine/events/EventTypes.ts).
 */

export const AssetEvents = {
  /** Emitted when a single asset begins loading. */
  LOAD_START: 'asset:load_start',

  /** Emitted periodically with download progress (0–1). */
  LOAD_PROGRESS: 'asset:load_progress',

  /** Emitted when a single asset finishes loading successfully. */
  LOAD_COMPLETE: 'asset:load_complete',

  /** Emitted when a single asset fails to load after all retries. */
  LOAD_ERROR: 'asset:load_error',

  /** Emitted when an asset is served from cache (no network request). */
  CACHE_HIT: 'asset:cache_hit',

  /** Emitted when an asset is evicted from cache. */
  CACHE_EVICT: 'asset:cache_evict',

  /** Emitted when the load queue empties (all enqueued tasks complete). */
  QUEUE_DRAIN: 'asset:queue_drain',
} as const

export type AssetEventName = (typeof AssetEvents)[keyof typeof AssetEvents]
