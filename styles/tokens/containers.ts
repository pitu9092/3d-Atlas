/**
 * @file styles/tokens/containers.ts
 * @description Container and layout token system for 3D Atlas.
 *
 * Derived from: docs/reference/04_LayoutAnalysis.md
 *               docs/reference/07_SpacingSystem.md
 *
 * Key measurements from docs:
 *   Max-width: ~1440px (Awwwards-quality standard)
 *   Content side padding: 80–120px (very generous on desktop)
 *   Grid: 12-column, gutter ~24–32px
 *   Mobile padding: estimated ~16–24px
 *   Section top/bottom padding: 80–120px
 *
 * Container hierarchy:
 *   content  — Standard content (~1440px max, large side padding)
 *   prose    — Long-form text (~720px max, comfortable reading)
 *   narrow   — Centered short content (~640px max)
 *   wide     — Nearly full-bleed (~1920px max, minimal padding)
 *   full     — Full bleed (100% width, no padding constraint)
 */

export const containers = {
  // ── Max widths ────────────────────────────────────────────────────
  maxWidth: {
    /** Narrow text content / centered forms */
    narrow: '40rem', // 640px
    /** Prose / long-form reading (~720px) */
    prose: '45rem', // 720px
    /** Standard content container */
    content: '80rem', // 1280px
    /** Primary project container (from docs: 1440px) */
    wide: '90rem', // 1440px
    /** Ultra-wide / near full-bleed */
    ultrawide: '120rem', // 1920px
    /** No max-width constraint */
    full: '100%',
  },

  // ── Horizontal padding (responsive) ──────────────────────────────
  // Mobile: ~16–24px, tablet ~40–60px, desktop: ~80–120px
  paddingX: {
    /** Mobile: 16px */
    mobile: '1rem',
    /** Tablet: 40px */
    tablet: '2.5rem',
    /** Laptop: 60px */
    laptop: '3.75rem',
    /** Desktop: 80px (lower bound from docs) */
    desktop: '5rem',
    /** Wide: 100px (mid range from docs) */
    wide: '6.25rem',
    /** Ultra-wide: 120px (upper bound from docs) */
    ultrawide: '7.5rem',
  },

  // ── Fluid padding (clamp for automatic responsive behavior) ───────
  paddingXFluid: 'clamp(1rem, 5vw, 7.5rem)',

  // ── Gutter (column gap) ──────────────────────────────────────────
  // From docs: gutter ~24–32px, feature grid gap ~40–60px
  gutter: {
    /** Tight layout (feature labels, small grids) */
    tight: '1.5rem', // 24px
    /** Default grid gutter */
    default: '2rem', // 32px
    /** Feature/services grid gap (from docs: 40–60px) */
    relaxed: '2.5rem', // 40px
    /** Generous gap (editorial two-column) */
    wide: '4rem', // 64px
    /** Very wide (heading ↔ quote column from docs: ~80px) */
    hero: '5rem', // 80px
  },

  // ── Section vertical spacing ─────────────────────────────────────
  // From docs: editorial sections 80–120px top/bottom padding
  sectionSpacing: {
    /** None — full-bleed sections (hero, crane, ship) */
    none: '0',
    /** Compact — minimal sections */
    compact: '3rem', // 48px
    /** Default — standard sections (80px lower bound) */
    default: '5rem', // 80px
    /** Comfortable — editorial standard (100px) */
    comfortable: '6rem', // 96px
    /** Generous — testimonials, brand statement (120px) */
    generous: '7.5rem', // 120px
    /** Hero — oversized section padding */
    hero: '10rem', // 160px
  },

  // ── Grid configuration ────────────────────────────────────────────
  grid: {
    /** Column count (12-column standard) */
    columns: 12,
    /** Feature grid: 4 columns on desktop, 2 on tablet, 1 on mobile */
    featureColumns: {
      mobile: 1,
      tablet: 2,
      desktop: 4,
    },
    /** Editorial split: ~55% left / ~40% right with gap */
    editorialLeft: '55%',
    editorialRight: '40%',
    /** Hero split: ~45% text / ~60% globe */
    heroText: '45%',
    heroCanvas: '60%',
    /** Testimonial split: ~40% left / ~55% right */
    testimonialLeft: '40%',
    testimonialRight: '55%',
  },
} as const

export type Containers = typeof containers
