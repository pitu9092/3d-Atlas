/**
 * @file engine/assets/AssetPriority.ts
 * @description Priority constants for the asset loading queue.
 *
 * Purpose: Provides named, stable priority values for asset declarations.
 * Lower number = higher priority (min-heap ordering).
 *
 * Usage:
 *   priority: AssetPriority.CRITICAL  // Must be ready before first frame
 *   priority: AssetPriority.HIGH      // Should be ready before user interaction
 *   priority: AssetPriority.NORMAL    // Standard content loading
 *   priority: AssetPriority.LOW       // Background, deferred content
 *   priority: AssetPriority.LAZY      // Load only when requested or visible
 */

export const AssetPriority = {
  /** Must be loaded before the application renders. Hero assets, critical fonts. */
  CRITICAL: 0,

  /** Should be ready before user scrolls. First-visible scene assets. */
  HIGH: 1,

  /** Standard content. Loaded after critical path. */
  NORMAL: 2,

  /** Background content. Loaded when the queue is clear. */
  LOW: 3,

  /** Load on-demand or intersection observer trigger. */
  LAZY: 4,
} as const

export type AssetPriorityLevel = (typeof AssetPriority)[keyof typeof AssetPriority]
