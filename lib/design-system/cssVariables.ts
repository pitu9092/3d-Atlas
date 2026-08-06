/**
 * @file lib/design-system/cssVariables.ts
 * @description CSS custom property name constants for 3D Atlas design system.
 *
 * Provides type-safe CSS variable name constants for use in JavaScript/TypeScript
 * contexts where you need to reference CSS custom properties programmatically.
 *
 * Usage:
 *   import { cssVars, token } from '@/lib/design-system/cssVariables'
 *
 *   // Get the CSS variable name
 *   const varName = cssVars.color.primary['500']  // '--color-primary-500'
 *
 *   // Get the CSS var() reference
 *   const value = token(cssVars.color.primary['500'])  // 'var(--color-primary-500)'
 *
 *   // Inline style usage:
 *   style={{ color: token(cssVars.color.glow['500']) }}
 *
 *   // GSAP animation to CSS variable:
 *   gsap.to(el, { [cssVars.color.accent['500']]: 'hsl(215 100% 70%)' })
 */

// ─── Helper Functions ─────────────────────────────────────────────────────────

/** Wraps a CSS custom property name in var() for use as a value */
export const token = (varName: string): string => `var(${varName})`

/** Constructs a CSS custom property name (adds leading --) */
export const cssVar = (name: string): string => `--${name}`

// ─── Color CSS Variable Names ─────────────────────────────────────────────────

type ColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
type ColorVarScale = Record<ColorShade, string>

const makeColorVars = (name: string): ColorVarScale => ({
  '50': `--color-${name}-50`,
  '100': `--color-${name}-100`,
  '200': `--color-${name}-200`,
  '300': `--color-${name}-300`,
  '400': `--color-${name}-400`,
  '500': `--color-${name}-500`,
  '600': `--color-${name}-600`,
  '700': `--color-${name}-700`,
  '800': `--color-${name}-800`,
  '900': `--color-${name}-900`,
})

export const cssVars = {
  // ── Colors ──────────────────────────────────────────────────────
  color: {
    primary: makeColorVars('primary'),
    secondary: makeColorVars('secondary'),
    accent: makeColorVars('accent'),
    neutral: makeColorVars('neutral'),
    surface: makeColorVars('surface'),
    background: makeColorVars('background'),
    text: makeColorVars('text'),
    success: makeColorVars('success'),
    warning: makeColorVars('warning'),
    danger: makeColorVars('danger'),
    border: makeColorVars('border'),
    overlay: makeColorVars('overlay'),
    glass: makeColorVars('glass'),
    glow: makeColorVars('glow'),
  },

  // ── Typography ───────────────────────────────────────────────────
  font: {
    display: '--font-display',
    heading: '--font-heading',
    sans: '--font-sans',
    mono: '--font-mono',
  },
  text: {
    'display-2xl': '--text-display-2xl',
    'display-xl': '--text-display-xl',
    'display-lg': '--text-display-lg',
    'display-md': '--text-display-md',
    'display-sm': '--text-display-sm',
    '4xl': '--text-4xl',
    '3xl': '--text-3xl',
    '2xl': '--text-2xl',
    xl: '--text-xl',
    lg: '--text-lg',
    base: '--text-base',
    sm: '--text-sm',
    xs: '--text-xs',
    '2xs': '--text-2xs',
  },
  fontWeight: {
    light: '--font-weight-light',
    regular: '--font-weight-regular',
    medium: '--font-weight-medium',
    semibold: '--font-weight-semibold',
    bold: '--font-weight-bold',
    black: '--font-weight-black',
  },
  lineHeight: {
    none: '--leading-none',
    tight: '--leading-tight',
    snug: '--leading-snug',
    normal: '--leading-normal',
    relaxed: '--leading-relaxed',
    loose: '--leading-loose',
    spacious: '--leading-spacious',
  },
  letterSpacing: {
    tightest: '--tracking-tightest',
    tighter: '--tracking-tighter',
    tight: '--tracking-tight',
    normal: '--tracking-normal',
    wide: '--tracking-wide',
    wider: '--tracking-wider',
    widest: '--tracking-widest',
  },

  // ── Spacing ──────────────────────────────────────────────────────
  space: {
    2: '--spacing-2',
    4: '--spacing-4',
    8: '--spacing-8',
    12: '--spacing-12',
    16: '--spacing-16',
    20: '--spacing-20',
    24: '--spacing-24',
    32: '--spacing-32',
    40: '--spacing-40',
    48: '--spacing-48',
    64: '--spacing-64',
    80: '--spacing-80',
    96: '--spacing-96',
    128: '--spacing-128',
    160: '--spacing-160',
    192: '--spacing-192',
    256: '--spacing-256',
  },

  // ── Border Radius ────────────────────────────────────────────────
  radius: {
    xs: '--radius-xs',
    sm: '--radius-sm',
    md: '--radius-md',
    lg: '--radius-lg',
    xl: '--radius-xl',
    '2xl': '--radius-2xl',
    '3xl': '--radius-3xl',
    full: '--radius-full',
  },

  // ── Shadows ──────────────────────────────────────────────────────
  shadow: {
    soft: '--shadow-soft',
    medium: '--shadow-medium',
    large: '--shadow-large',
    glass: '--shadow-glass',
    floating: '--shadow-floating',
    glow: '--shadow-glow',
    glowWarm: '--shadow-glow-warm',
    glowDanger: '--shadow-glow-danger',
  },

  // ── Z-Index ──────────────────────────────────────────────────────
  z: {
    background: '--z-background',
    base: '--z-base',
    content: '--z-content',
    overlay: '--z-overlay',
    atmosphere: '--z-atmosphere',
    header: '--z-header',
    cursor: '--z-cursor',
    modal: '--z-modal',
    tooltip: '--z-tooltip',
    loader: '--z-loader',
    debug: '--z-debug',
  },

  // ── Animation ────────────────────────────────────────────────────
  duration: {
    instant: '--duration-instant',
    faster: '--duration-faster',
    fast: '--duration-fast',
    normal: '--duration-normal',
    moderate: '--duration-moderate',
    slow: '--duration-slow',
    slower: '--duration-slower',
    slowest: '--duration-slowest',
    cinematic: '--duration-cinematic',
    epic: '--duration-epic',
    ambient: '--duration-ambient',
  },
  ease: {
    linear: '--ease-linear',
    easeIn: '--ease-in',
    easeOut: '--ease-out',
    easeInOut: '--ease-in-out',
    power2Out: '--ease-power2-out',
    power3Out: '--ease-power3-out',
    power4Out: '--ease-power4-out',
    expoOut: '--ease-expo-out',
    expoInOut: '--ease-expo-in-out',
    spring: '--ease-spring',
    elastic: '--ease-elastic',
    bounce: '--ease-bounce',
    cinematic: '--ease-cinematic',
    smooth: '--ease-smooth',
    snappy: '--ease-snappy',
  },

  // ── Blur ─────────────────────────────────────────────────────────
  blur: {
    none: '--blur-none',
    xs: '--blur-xs',
    sm: '--blur-sm',
    md: '--blur-md',
    lg: '--blur-lg',
    xl: '--blur-xl',
    '2xl': '--blur-2xl',
    '3xl': '--blur-3xl',
    '4xl': '--blur-4xl',
  },

  // ── Layout ───────────────────────────────────────────────────────
  container: {
    maxWidth: '--container-max-width',
    paddingX: '--container-padding-x',
    paddingXFluid: '--container-padding-x-fluid',
  },

  // ── Safe Area (for mobile notches/home bars) ──────────────────────
  safeArea: {
    top: '--safe-area-top',
    bottom: '--safe-area-bottom',
    left: '--safe-area-left',
    right: '--safe-area-right',
  },
} as const

export type CSSVars = typeof cssVars
