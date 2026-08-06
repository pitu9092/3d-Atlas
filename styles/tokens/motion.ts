/**
 * @file styles/tokens/motion.ts
 * @description Combined motion token system for 3D Atlas.
 *
 * Derived from: docs/motion-blueprint/03_GSAPBlueprint.md
 *               docs/reference/10_AnimationInventory.md
 *
 * This file provides semantic motion presets that combine duration + easing
 * into named animation configurations for common patterns.
 * Use durations.ts and easings.ts for raw values.
 *
 * Motion categories:
 *   fast      — micro-interactions, hover states
 *   normal    — standard UI transitions
 *   slow      — text reveals, entrance animations
 *   verySlow  — stat counters, ambient pulses
 *   spring    — bouncy micro-interactions
 *   ease      — standard eased transitions
 *   bezier    — custom bezier for project-specific feel
 *   elastic   — overshoot animations
 *   bounce    — landing animations
 */

import { durations } from './durations'
import { easings } from './easings'

// ─── Semantic Motion Presets ─────────────────────────────────────────────────
// Each preset bundles duration + easing + any transform defaults.
// Used by AnimationProvider and GSAP animation helpers.

export const motion = {
  // ── Speed tiers ──────────────────────────────────────────────────
  fast: {
    duration: durations.fast,
    ease: easings.power2Out,
    /** CSS transition shorthand */
    transition: `${durations.fast} ${easings.power2Out}`,
  },
  normal: {
    duration: durations.normal,
    ease: easings.easeInOut,
    transition: `${durations.normal} ${easings.easeInOut}`,
  },
  slow: {
    duration: durations.slower,
    ease: easings.power3Out,
    transition: `${durations.slower} ${easings.power3Out}`,
  },
  verySlow: {
    duration: durations.cinematic,
    ease: easings.cinematic,
    transition: `${durations.cinematic} ${easings.cinematic}`,
  },

  // ── Easing character presets ─────────────────────────────────────
  spring: {
    duration: durations.moderate,
    ease: easings.spring,
    transition: `${durations.moderate} ${easings.spring}`,
  },
  ease: {
    duration: durations.slow,
    ease: easings.easeOut,
    transition: `${durations.slow} ${easings.easeOut}`,
  },
  bezier: {
    duration: durations.slower,
    ease: easings.power4Out,
    transition: `${durations.slower} ${easings.power4Out}`,
  },
  elastic: {
    duration: durations.slow,
    ease: easings.elastic,
    transition: `${durations.slow} ${easings.elastic}`,
  },
  bounce: {
    duration: durations.moderate,
    ease: easings.bounce,
    transition: `${durations.moderate} ${easings.bounce}`,
  },

  // ── Project-specific animation definitions ───────────────────────

  /** H1/H2 line-by-line reveal (clip-path + translateY) */
  headlineReveal: {
    duration: durations.slower,
    ease: easings.power4Out,
    stagger: durations.faster, // 80ms stagger between lines
    transition: `${durations.slower} ${easings.power4Out}`,
  },

  /** Body copy, eyebrow fade-in */
  bodyFade: {
    duration: durations.slow,
    ease: easings.power2Out,
    transition: `${durations.slow} ${easings.power2Out}`,
  },

  /** Feature card stagger entrance */
  cardStagger: {
    duration: durations.moderate,
    ease: easings.power3Out,
    stagger: '100ms',
    transition: `${durations.moderate} ${easings.power3Out}`,
  },

  /** Stat counter count-up */
  counter: {
    duration: durations.epic,
    ease: easings.power2Out,
    transition: `${durations.epic} ${easings.power2Out}`,
  },

  /** Scroll-scrubbed animations (no easing — driven by scroll progress) */
  scrub: {
    duration: '0ms',
    ease: easings.linear,
    transition: `0ms ${easings.linear}`,
  },

  /** Ambient / continuous loop animations */
  ambient: {
    duration: durations.ambient,
    ease: easings.linear,
    transition: `${durations.ambient} ${easings.linear}`,
  },
} as const

// ─── Transform Defaults ───────────────────────────────────────────────────────
// Standard initial/final transform values used across animations

export const transformDefaults = {
  /** translateY for text reveals (from bottom) */
  textRevealFrom: 'translateY(100%)',
  textRevealTo: 'translateY(0%)',

  /** translateY for fade-up entrances */
  fadeUpFrom: 'translateY(1.25rem)', // 20px — body copy
  fadeUpTo: 'translateY(0px)',

  /** translateY for button entrance */
  buttonFrom: 'translateY(0.75rem)', // 12px — buttons
  buttonTo: 'translateY(0px)',

  /** Scale for card pulse/expand */
  scaleFrom: 'scale(0.95)',
  scaleTo: 'scale(1)',

  /** Opacity for fades */
  opacityFrom: '0',
  opacityTo: '1',
} as const

export type Motion = typeof motion
export type MotionKey = keyof Motion
export type TransformDefaults = typeof transformDefaults
