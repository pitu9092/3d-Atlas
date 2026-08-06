/**
 * @file lib/core/featureFlags.ts
 * @description Centralized feature flag system for 3D Atlas.
 *
 * Requirements met:
 * - Enable Debug
 * - Enable Stats
 * - Enable Helpers
 * - Enable Wireframe
 * - Enable FPS Meter
 * - Enable Reduced Motion (override)
 * - Enable Experimental Features
 */

import { env } from './env'

export const featureFlags = {
  /** Enables extensive debug logging */
  enableDebug: env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',

  /** Enables performance statistics (e.g., stats.js panel) */
  enableStats: env.NEXT_PUBLIC_ENABLE_STATS === 'true',

  /** Enables visual helpers in Three.js (Grid, Axes, Camera helpers) */
  enableHelpers: env.NEXT_PUBLIC_ENABLE_HELPERS === 'true',

  /** Renders Three.js materials in wireframe mode for debugging */
  enableWireframe: env.NEXT_PUBLIC_ENABLE_WIREFRAME === 'true',

  /** Displays a custom FPS meter */
  enableFpsMeter: env.NEXT_PUBLIC_ENABLE_FPS_METER === 'true',

  /**
   * Force enables reduced motion mode for testing accessibility,
   * regardless of OS preferences.
   */
  forceReducedMotion: env.NEXT_PUBLIC_FORCE_REDUCED_MOTION === 'true',

  /** Enables experimental or unreleased features */
  enableExperimental: env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL === 'true',
} as const
