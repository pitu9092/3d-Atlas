/**
 * @file engine/scroll/ScrollState.ts
 * @description State interface for the global scroll engine.
 *
 * Purpose: Provides a snapshot of the current scroll metrics.
 */

export interface ScrollState {
  scrollY: number
  scrollX: number
  direction: 1 | -1 | 0
  progress: number // 0 to 1 based on document height
  velocity: number
  isScrolling: boolean
}
