/**
 * @file styles/tokens/typography.ts
 * @description Typography token system for 3D Atlas.
 *
 * Derived from: docs/reference/05_TypographyAnalysis.md
 *
 * Key measurements from docs:
 *   H1 hero:    96–128px, weight 900, tracking -0.02em to -0.04em, line-height 0.9–1.0
 *   H2 section: 64–96px,  weight 900, tracking -0.02em to -0.03em, line-height 0.95–1.05
 *   Eyebrow:    12–14px,  weight 400/500, tracking +0.1em to +0.15em
 *   Body:       16–18px,  weight 400, line-height 1.6–1.7
 *   Button:     14–16px,  weight 500, tracking +0.05em
 *   Caption:    12–14px,  weight 400, standard tracking
 *
 * Candidate fonts (from visual analysis, DevTools unconfirmed):
 *   Display: Neue Haas Grotesk / Aktiv Grotesk Extended / Monument Extended
 *   Fallback: Outfit (loaded via Next.js), then system-ui
 *   Body/UI:  Inter (loaded via Next.js), then system-ui
 */

// ─── Font Families ────────────────────────────────────────────────────────────
// CSS variables injected by Next.js font optimization in lib/fonts.ts
// layout.tsx applies --font-inter and --font-outfit to <html>
export const fontFamily = {
  /** Display — ultra-bold condensed headings (Outfit weight 900 as proxy) */
  display: 'var(--font-outfit), "Outfit", "Neue Haas Grotesk Display", system-ui, sans-serif',
  /** Heading — bold section headings */
  heading: 'var(--font-outfit), "Outfit", system-ui, sans-serif',
  /** Sans — body copy, UI text, nav links */
  sans: 'var(--font-inter), "Inter", system-ui, -apple-system, sans-serif',
  /** Mono — code snippets */
  mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
} as const

// ─── Font Size ────────────────────────────────────────────────────────────────
// Fluid type scale using clamp(). All sizes relative to 1440px design viewport.
// Stat counters: 80–120px → display-2xl
// H1:            96–128px → display-xl
// H2:            64–96px  → display-lg / display-md
// Feature titles: 14–18px → label / body-sm
export const fontSize = {
  // ── Display scale (Hero & Section Headlines) ─────────────────────
  /** 96–128px: H1 hero headline "EVERY LEG OF THE JOURNEY" */
  'display-2xl': 'clamp(5rem, 9vw + 2rem, 8rem)',
  /** 80–110px: Section H1 variants / stat counters "2 500+" */
  'display-xl': 'clamp(4.5rem, 7vw + 1.5rem, 6.875rem)',
  /** 64–96px: H2 section headlines (editorial, testimonials) */
  'display-lg': 'clamp(3.5rem, 5.5vw + 1.25rem, 6rem)',
  /** 48–72px: Sub-section headings */
  'display-md': 'clamp(2.5rem, 4vw + 1rem, 4.5rem)',
  /** 36–56px: Minor display headings */
  'display-sm': 'clamp(2rem, 3vw + 0.75rem, 3.5rem)',
  // ── Heading scale ────────────────────────────────────────────────
  '4xl': 'clamp(1.875rem, 3vw + 0.75rem, 2.25rem)',
  '3xl': 'clamp(1.5rem, 2.5vw + 0.625rem, 1.875rem)',
  '2xl': 'clamp(1.25rem, 2vw + 0.5rem, 1.5rem)',
  xl: 'clamp(1.125rem, 1.5vw + 0.5rem, 1.25rem)',
  lg: 'clamp(1rem, 1.2vw + 0.4rem, 1.125rem)',
  // ── Body / UI scale ──────────────────────────────────────────────
  /** 16–18px: Body copy on all sections */
  base: 'clamp(1rem, 1vw + 0.75rem, 1.125rem)',
  /** 14–16px: Feature titles, button labels */
  sm: 'clamp(0.875rem, 0.8vw + 0.625rem, 1rem)',
  /** 12–14px: Eyebrow labels, captions, nav links */
  xs: 'clamp(0.75rem, 0.6vw + 0.55rem, 0.875rem)',
  /** 10–12px: Fine print */
  '2xs': 'clamp(0.625rem, 0.5vw + 0.45rem, 0.75rem)',
} as const

// ─── Font Weights ─────────────────────────────────────────────────────────────
// From docs: H1/H2 = Black/900, eyebrow = 400/500, body = 400, button = 500
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
} as const

// ─── Line Heights ─────────────────────────────────────────────────────────────
// H1: 0.9–1.0 (very tight)
// H2: 0.95–1.05 (very tight)
// Body: 1.6–1.7 (relaxed)
export const lineHeight = {
  none: '1',
  /** 1.0 — H1 hero headline (very tight) */
  tight: '1.05',
  /** 1.1 — H2 section headlines */
  snug: '1.15',
  /** 1.25 — Sub-headings */
  normal: '1.25',
  /** 1.5 — UI text */
  relaxed: '1.5',
  /** 1.65 — Body copy (from docs: 1.6–1.7) */
  loose: '1.65',
  /** 1.75 — Long-form content */
  spacious: '1.75',
} as const

// ─── Letter Spacing ───────────────────────────────────────────────────────────
// H1: -0.02em to -0.04em (tight)
// H2: -0.02em to -0.03em
// Eyebrow: +0.1em to +0.15em (distinctive wide)
// Feature titles: +0.05em to +0.1em
// Button: +0.05em
export const letterSpacing = {
  /** -0.04em — H1 tightest (hero headline) */
  tightest: '-0.04em',
  /** -0.03em — H2 tight (section headlines) */
  tighter: '-0.03em',
  /** -0.02em — General headline tight tracking */
  tight: '-0.02em',
  /** 0em — Default body copy */
  normal: '0em',
  /** +0.05em — Button labels, feature titles */
  wide: '0.05em',
  /** +0.1em — Feature titles upper range */
  wider: '0.10em',
  /** +0.15em — Eyebrow labels (distinctive wide tracking) */
  widest: '0.15em',
} as const

// ─── Composite Export ─────────────────────────────────────────────────────────

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const

export type Typography = typeof typography
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
export type LineHeight = keyof typeof lineHeight
export type LetterSpacing = keyof typeof letterSpacing
