/**
 * @file styles/tokens/easings.ts
 * @description Easing function token system for 3D Atlas.
 *
 * Derived from: docs/motion-blueprint/03_GSAPBlueprint.md → Easing Reference
 *               docs/reference/10_AnimationInventory.md
 *
 * GSAP easing → CSS cubic-bezier approximation mapping:
 *   power4.out → headline reveals, H1/H2 clip-path animations
 *   power3.out → ship labels, feature cards, testimonials
 *   power2.out → body copy fade, stat count-up, buttons
 *   expo.out   → fast cinematic entrance (alternative to power4)
 *   linear     → all scroll-scrubbed animations (none)
 *
 * Additional CSS easings for UI:
 *   spring     — bouncy micro-interactions
 *   elastic    — overshoot + settle
 *   bounce     — soft landing
 *   cinematic  — smooth cinematic feel (Lenis-like)
 */

export const easings = {
  // ── Standard CSS Easings ─────────────────────────────────────────
  /** No easing — scroll-scrubbed animations, continuous loops */
  linear: 'linear',
  /** Standard ease-in */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Standard ease-out */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Standard ease-in-out */
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // ── GSAP Approximations (CSS equivalents) ────────────────────────
  /**
   * power2.out — body copy fade, stat count-up, button entrance
   * GSAP: ease: "power2.out"
   */
  power2Out: 'cubic-bezier(0.33, 1, 0.68, 1)',
  /**
   * power3.out — feature card stagger, ship labels, testimonial cards
   * GSAP: ease: "power3.out"
   */
  power3Out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /**
   * power4.out — H1/H2 clip-path line reveals (primary headline ease)
   * GSAP: ease: "power4.out"
   */
  power4Out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /**
   * expo.out — fast cinematic entrance (alternative to power4)
   * GSAP: ease: "expo.out"
   */
  expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  /**
   * expo.inOut — smooth in-and-out transitions
   */
  expoInOut: 'cubic-bezier(0.87, 0, 0.13, 1)',

  // ── Spring / Bounce / Elastic ────────────────────────────────────
  /**
   * Spring — bouncy, overshoots slightly then settles
   * Good for: UI micro-interactions, cursor
   */
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  /**
   * Elastic — strong overshoot (use sparingly)
   */
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  /**
   * Bounce — soft landing bounce
   */
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // ── Project-specific ─────────────────────────────────────────────
  /**
   * Cinematic — smooth, weighted feel (mirrors Lenis easing character)
   * Used for: atmosphere transitions, camera-like movements
   */
  cinematic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  /**
   * Smooth — deceleration for overlapping layers
   */
  smooth: 'cubic-bezier(0.43, 0.195, 0.02, 1)',
  /**
   * Snappy — fast start, immediate settle (navbar interactions)
   */
  snappy: 'cubic-bezier(0.2, 0, 0, 1)',
} as const

export type Easings = typeof easings
export type EasingKey = keyof Easings
