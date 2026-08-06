/**
 * @file hooks/useReducedMotion.ts
 * @description Hook to detect user's reduced motion preference.
 *
 * Derived from: docs/engineering/22_AccessibilityStrategy.md
 *
 * When reduced motion is preferred:
 *   - All GSAP animations run at 0 duration
 *   - CSS transitions are disabled
 *   - WebGL continuous animations (globe rotation, aircraft banking) stop
 *   - Counter animations skip to final value immediately
 *
 * Usage:
 *   const isReducedMotion = useReducedMotion()
 *   if (isReducedMotion) {
 *     // Skip to final state immediately
 *   }
 */

'use client'

import { useMediaQuery } from './useMediaQuery'

/**
 * Returns true if the user has requested reduced motion
 * via OS accessibility settings (prefers-reduced-motion: reduce).
 *
 * SSR-safe: defaults to false (full motion) on server.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}
