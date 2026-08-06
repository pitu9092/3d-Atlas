/**
 * @file engine/shared/EngineUtils.ts
 * @description Core utility functions for the 3D Atlas Engine.
 *
 * Purpose: Shared helpers for mathematics, clamping, and common calculations.
 * Responsibilities: Reusable pure functions.
 */

export const EngineUtils = {
  /**
   * Clamps a value between a minimum and maximum bound.
   */
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  },

  /**
   * Linear interpolation between two values.
   */
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t
  },

  /**
   * Maps a value from one range to another.
   */
  mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  },

  /**
   * Generates a unique ID (simple implementation for internal engine use).
   */
  generateId(): string {
    return Math.random().toString(36).substring(2, 9)
  },
}
