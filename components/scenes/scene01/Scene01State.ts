/**
 * @file components/scenes/scene01/Scene01State.ts
 * @description State machine definitions for Scene 01 — Atmosphere Transition.
 */

export type Scene01Phase =
  | 'idle' // Not yet in viewport
  | 'entering' // Scrolling into view
  | 'active' // Fully visible
  | 'exiting' // Scrolling out of view

export interface Scene01StateValue {
  phase: Scene01Phase
  /** Scroll progress through the scene (0.0 to 1.0) */
  progress: number
  /** Whether the ScrollTrigger has been initialized */
  isInitialized: boolean
}

export function createInitialScene01State(): Scene01StateValue {
  return {
    phase: 'idle',
    progress: 0,
    isInitialized: false,
  }
}
