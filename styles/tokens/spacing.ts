/**
 * @file styles/tokens/spacing.ts
 * @description Spacing token system for 3D Atlas.
 *
 * Derived from: docs/reference/07_SpacingSystem.md
 *
 * Base unit: 8px (8pt grid — all values are multiples of 8px).
 * Converted to rem for accessibility (16px base = 1rem).
 *
 * Key values from docs:
 *   Section padding top/bottom: 80–120px → space-80 / space-96 / space-128
 *   Container side padding: 80–100px → space-80 / space-96
 *   Heading-to-body gap: 24–40px → space-24 / space-32 / space-40
 *   Button gap: 16–24px → space-16 / space-24
 *   Grid column gap: 40–60px → space-40 / space-48 / space-64
 *   Navbar height: 48–64px → space-48 / space-64
 */

// All values in rem (1rem = 16px at browser default)
export const spacing = {
  /** 2px — micro gap (icon to label) */
  2: '0.125rem',
  /** 4px — xs gap (tight UI elements) */
  4: '0.25rem',
  /** 8px — sm gap (base unit, caption to main) */
  8: '0.5rem',
  /** 12px — sm-md gap (icon → title gap: ~12–16px) */
  12: '0.75rem',
  /** 16px — md gap (between CTA buttons, eyebrow → H1) */
  16: '1rem',
  /** 20px — md-lg gap */
  20: '1.25rem',
  /** 24px — lg gap (H1 → body copy gap, card gap lower bound) */
  24: '1.5rem',
  /** 32px — xl gap (body copy → buttons, card gap upper bound) */
  32: '2rem',
  /** 40px — 2xl gap (grid column gap lower bound) */
  40: '2.5rem',
  /** 48px — 3xl gap (navbar height lower, section padding mobile) */
  48: '3rem',
  /** 64px — 4xl gap (grid column gap upper, navbar height upper) */
  64: '4rem',
  /** 80px — section gap (section padding lower bound) */
  80: '5rem',
  /** 96px — section padding mid */
  96: '6rem',
  /** 128px — section padding upper */
  128: '8rem',
  /** 160px — large section separation */
  160: '10rem',
  /** 192px — hero-level spacing */
  192: '12rem',
  /** 256px — maximum spacing token */
  256: '16rem',
} as const

export type Spacing = typeof spacing
export type SpacingKey = keyof Spacing
