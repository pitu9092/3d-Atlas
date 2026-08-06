/**
 * @file engine/animation/AnimationState.ts
 * @description State interface for global animation and GSAP configuration.
 *
 * Purpose: Tracks whether the animation engine is ready and active.
 */

export interface AnimationState {
  isGSAPReady: boolean
  isReducedMotion: boolean
  globalTimeScale: number
  activeTimelines: number
}
