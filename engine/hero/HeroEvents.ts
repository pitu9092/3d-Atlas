/**
 * @file engine/hero/HeroEvents.ts
 * @description Event name constants for the Hero scene.
 */

export const HeroEvents = {
  /** Emitted when hero is ready to begin entry animations */
  HERO_READY: 'hero:ready',

  /** Emitted when hero scroll progress updates */
  HERO_SCROLL: 'hero:scroll',
} as const

export type HeroEventName = (typeof HeroEvents)[keyof typeof HeroEvents]
