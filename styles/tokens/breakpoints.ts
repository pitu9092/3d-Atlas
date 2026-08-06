/**
 * @file styles/tokens/breakpoints.ts
 * @description Breakpoint token system for 3D Atlas.
 *
 * Derived from: docs/reference/19_ResponsiveObservations.md
 *               docs/reference/07_SpacingSystem.md
 *
 * Responsive strategy from docs:
 *   Desktop (1280px+):   Full experience — all 3D, all animations, 4-col grids
 *   Tablet  (768–1280px): Reduced 3D quality, layout adaptations, 2-col grids
 *   Mobile  (<768px):     Simplified 3D or video fallback, 1-col layouts
 *
 * All breakpoints use min-width (mobile-first).
 * Values match the CSS @media usage in the reference responsive guide.
 */

export const breakpoints = {
  /** 0px — Mobile base styles (no @media needed) */
  mobile: '0px',
  /** 768px — Tablet: layout stacks, 2-col grids, reduced 3D */
  tablet: '768px',
  /** 1024px — Laptop: intermediate layout, side-padding reduces */
  laptop: '1024px',
  /** 1280px — Desktop: full experience, 4-col grids, generous padding */
  desktop: '1280px',
  /** 1440px — Wide: max-width container kicks in, globe more visible */
  wide: '1440px',
  /** 1920px — Ultra-wide: extra large monitors */
  ultrawide: '1920px',
} as const

// ─── Numeric breakpoints (for JavaScript comparisons) ────────────────────────
export const breakpointValues = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
  ultrawide: 1920,
} as const

// ─── Media query strings (for use in CSS-in-JS or hooks) ─────────────────────
export const mediaQueries = {
  /** @media (min-width: 768px) */
  tablet: `(min-width: ${breakpoints.tablet})`,
  /** @media (min-width: 1024px) */
  laptop: `(min-width: ${breakpoints.laptop})`,
  /** @media (min-width: 1280px) */
  desktop: `(min-width: ${breakpoints.desktop})`,
  /** @media (min-width: 1440px) */
  wide: `(min-width: ${breakpoints.wide})`,
  /** @media (min-width: 1920px) */
  ultrawide: `(min-width: ${breakpoints.ultrawide})`,
  /** @media (prefers-reduced-motion: reduce) */
  reducedMotion: '(prefers-reduced-motion: reduce)',
  /** @media (prefers-color-scheme: dark) */
  darkScheme: '(prefers-color-scheme: dark)',
  /** @media (hover: none) — touch-only devices */
  touch: '(hover: none)',
  /** @media (hover: hover) — pointer devices */
  pointer: '(hover: hover)',
} as const

export type Breakpoints = typeof breakpoints
export type BreakpointKey = keyof Breakpoints
export type MediaQueries = typeof mediaQueries
