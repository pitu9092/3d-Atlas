/**
 * @file engine/hero/HeroState.ts
 * @description State machine definitions for the Hero scene (Scene 01).
 */

/** Ordered lifecycle phases of the Hero scene. */
export type HeroPhase =
  | 'idle' // Waiting for loader to complete
  | 'entering' // Loader complete, running entry animations
  | 'active' // Fully visible and interactive, reacting to scroll
  | 'exiting' // Scrolling past the hero section
  | 'hidden' // Scrolled entirely out of view

export interface HeroStateValue {
  /** Current lifecycle phase. */
  phase: HeroPhase

  /** True if the loader has finished and emitted loader:complete */
  isReady: boolean

  /** Current scroll progress mapped specifically to the Hero section (0.0 to 1.0) */
  scrollProgress: number
}

const VALID_TRANSITIONS: Record<HeroPhase, HeroPhase[]> = {
  idle: ['entering'],
  entering: ['active'],
  active: ['exiting'],
  exiting: ['active', 'hidden'],
  hidden: ['exiting'],
}

export function isValidHeroTransition(from: HeroPhase, to: HeroPhase): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

export function createInitialHeroState(): HeroStateValue {
  return {
    phase: 'idle',
    isReady: false,
    scrollProgress: 0,
  }
}
