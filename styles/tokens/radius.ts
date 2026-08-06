/**
 * @file styles/tokens/radius.ts
 * @description Border radius token system for 3D Atlas.
 *
 * Derived from: docs/reference/07_SpacingSystem.md
 *
 * Key doc reference:
 *   Navbar CTA button: ~9999px (full pill) → radius.full
 *   Card backgrounds: estimated 4–8px → radius.sm / radius.md
 */

export const radius = {
  /** 2px — very subtle rounding (nearly square) */
  xs: '0.125rem',
  /** 4px — subtle (small UI elements) */
  sm: '0.25rem',
  /** 6px — default (most interactive elements) */
  md: '0.375rem',
  /** 8px — card rounding */
  lg: '0.5rem',
  /** 12px — larger cards, modals */
  xl: '0.75rem',
  /** 16px — section containers */
  '2xl': '1rem',
  /** 24px — large panels */
  '3xl': '1.5rem',
  /** 9999px — full pill (CTA buttons, tags) */
  full: '9999px',
} as const

export type Radius = typeof radius
export type RadiusKey = keyof Radius
