/**
 * @file styles/tokens/durations.ts
 * @description Animation duration token system for 3D Atlas.
 *
 * Derived from: docs/reference/10_AnimationInventory.md
 *                docs/motion-blueprint/03_GSAPBlueprint.md
 *
 * Key timings from docs:
 *   Stat count-up: 1.5–2.0s
 *   Text reveals (H1/H2): 0.8–1.2s per line
 *   Body copy fade: 0.6s
 *   Button entrance: 0.5s
 *   Card stagger: 0.5s each
 *   Word shuffle: 100–200ms per word
 *   Route node pulse: 1–2s cycle
 *   Globe atmosphere pulse: 2–4s cycle
 *   Aircraft banking: 3–4s cycle
 *   Cloud drift: very slow (continuous)
 */

export const durations = {
  /** 0ms — immediate (for reduced motion) */
  instant: '0ms',
  /** 80ms — between staggered elements (button stagger, line stagger) */
  faster: '80ms',
  /** 150ms — micro interactions (hover effects) */
  fast: '150ms',
  /** 300ms — standard UI transitions */
  normal: '300ms',
  /** 500ms — card entrances, button fades */
  moderate: '500ms',
  /** 600ms — body copy fade, testimonial entrances */
  slow: '600ms',
  /** 800ms — H1/H2 line reveals, primary animations */
  slower: '800ms',
  /** 1000ms — complex staggered sequences */
  slowest: '1000ms',
  /** 1200ms — page-level transitions */
  cinematic: '1200ms',
  /** 2000ms — stat count-up, stat animations */
  epic: '2000ms',
  /** 4000ms — atmosphere pulse cycle */
  ambient: '4000ms',
} as const

export type Durations = typeof durations
export type DurationKey = keyof Durations
