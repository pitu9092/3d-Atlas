/**
 * @file styles/tokens/opacity.ts
 * @description Opacity token system for 3D Atlas.
 *
 * Derived from: docs/reference/06_ColorPalette.md → Opacity Usage
 *
 * Key values from docs:
 *   0.3–0.4  — Route lines on globe (material opacity)
 *   0.6–0.8  — Route nodes (material opacity)
 *   0.65     — Body copy on dark ("text-secondary-dark")
 *   0.4      — Nav links, captions ("text-tertiary-dark")
 *   0.85–0.95 — Nav background glass blur
 *   0.5–0.8  — Ocean foam particles
 */

export const opacity = {
  /** 0 — Fully transparent (hidden, animation start state) */
  0: '0',
  /** 0.04 — Barely visible (glass surface 50) */
  4: '0.04',
  /** 0.08 — Very subtle (glass hover) */
  8: '0.08',
  /** 0.12 — Subtle (glass border) */
  12: '0.12',
  /** 0.16 — Light transparency */
  16: '0.16',
  /** 0.20 — Overlay hint */
  20: '0.20',
  /** 0.25 — Quarter opacity */
  25: '0.25',
  /** 0.30 — Route lines on globe, danger glow base */
  30: '0.30',
  /** 0.35 — Glow effects, atmosphere color */
  35: '0.35',
  /** 0.40 — text-tertiary-dark (nav links, captions on dark) */
  40: '0.40',
  /** 0.50 — Half opacity (particles, foam) */
  50: '0.50',
  /** 0.60 — Route nodes lower bound */
  60: '0.60',
  /** 0.65 — text-secondary-dark (body copy on dark sections) */
  65: '0.65',
  /** 0.70 — Visible transparency */
  70: '0.70',
  /** 0.75 — Three-quarter opacity */
  75: '0.75',
  /** 0.80 — Route nodes upper bound, foam upper */
  80: '0.80',
  /** 0.85 — Nav background lower bound */
  85: '0.85',
  /** 0.90 — Nav background mid */
  90: '0.90',
  /** 0.95 — Nav background upper bound */
  95: '0.95',
  /** 1 — Fully opaque */
  100: '1',
} as const

export type Opacity = typeof opacity
export type OpacityKey = keyof Opacity
