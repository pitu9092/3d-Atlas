/**
 * @file engine/shared/EngineConstants.ts
 * @description Core constants for the 3D Atlas Engine.
 *
 * Purpose: Centralizes magic numbers and internal config.
 * Responsibilities: Magic numbers, defaults, internal constraints.
 */

export const EngineConstants = {
  // Time & Framerate
  DEFAULT_FPS_TARGET: 60,
  MAX_DELTA_TIME: 100, // Maximum delta time in ms to prevent huge jumps on tab switch

  // WebGL & Rendering
  MIN_PIXEL_RATIO: 1,
  MAX_PIXEL_RATIO: 2,

  // Scene
  DEFAULT_SCENE_ID: 'hero',

  // Loaders
  MAX_CONCURRENT_LOADS: 4,

  // Asset Pipeline (Phase 6)
  ASSET_CACHE_MAX_MEMORY_MB: 512,
  ASSET_LOAD_TIMEOUT_MS: 30_000,
  ASSET_MAX_PRIORITY_LEVELS: 5,
  ASSET_MAX_RETRY_ATTEMPTS: 3,
  ASSET_RETRY_BASE_DELAY_MS: 500,
} as const
