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
} as const
