/**
 * @file lib/design-system/tailwindTheme.ts
 * @description Tailwind CSS v4 theme configuration for 3D Atlas.
 *
 * In Tailwind v4, the theme is configured via the @theme CSS directive (not JS config).
 * This file provides the TypeScript representation of those theme values,
 * useful for:
 *   - Type-safe CSS variable references in JavaScript/TypeScript
 *   - Storybook or testing tooling that needs theme values
 *   - Documentation / design system reference
 *   - Dynamic class composition with type safety
 *
 * The actual Tailwind theme is declared in app/globals.css via @theme {}.
 * This file mirrors those declarations as TypeScript constants.
 *
 * @note All color values reference CSS custom properties (var(--*)) so that
 * runtime theme switching works without class regeneration.
 */

// ─── Color CSS Variable References ────────────────────────────────────────────
// Format: var(--color-{name}-{shade})
// These become Tailwind utilities: bg-primary-500, text-accent-300, etc.

const makeColorScale = (name: string) => ({
  '50': `var(--color-${name}-50)`,
  '100': `var(--color-${name}-100)`,
  '200': `var(--color-${name}-200)`,
  '300': `var(--color-${name}-300)`,
  '400': `var(--color-${name}-400)`,
  '500': `var(--color-${name}-500)`,
  '600': `var(--color-${name}-600)`,
  '700': `var(--color-${name}-700)`,
  '800': `var(--color-${name}-800)`,
  '900': `var(--color-${name}-900)`,
})

export const tailwindColors = {
  primary: makeColorScale('primary'),
  secondary: makeColorScale('secondary'),
  accent: makeColorScale('accent'),
  neutral: makeColorScale('neutral'),
  surface: makeColorScale('surface'),
  background: makeColorScale('background'),
  text: makeColorScale('text'),
  success: makeColorScale('success'),
  warning: makeColorScale('warning'),
  danger: makeColorScale('danger'),
  border: makeColorScale('border'),
  overlay: makeColorScale('overlay'),
  glass: makeColorScale('glass'),
  glow: makeColorScale('glow'),
} as const

// ─── Typography CSS Variable References ───────────────────────────────────────

export const tailwindFontFamily = {
  display: 'var(--font-display)',
  heading: 'var(--font-heading)',
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

export const tailwindFontSize = {
  'display-2xl': 'var(--text-display-2xl)',
  'display-xl': 'var(--text-display-xl)',
  'display-lg': 'var(--text-display-lg)',
  'display-md': 'var(--text-display-md)',
  'display-sm': 'var(--text-display-sm)',
  '4xl': 'var(--text-4xl)',
  '3xl': 'var(--text-3xl)',
  '2xl': 'var(--text-2xl)',
  xl: 'var(--text-xl)',
  lg: 'var(--text-lg)',
  base: 'var(--text-base)',
  sm: 'var(--text-sm)',
  xs: 'var(--text-xs)',
  '2xs': 'var(--text-2xs)',
} as const

export const tailwindFontWeight = {
  light: 'var(--font-weight-light)',
  regular: 'var(--font-weight-regular)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
  black: 'var(--font-weight-black)',
} as const

// ─── Spacing CSS Variable References ──────────────────────────────────────────
// Format: var(--spacing-{size})
// These extend Tailwind's spacing scale: p-2, m-8, gap-32, etc.

export const tailwindSpacing = {
  '2': 'var(--spacing-2)',
  '4': 'var(--spacing-4)',
  '8': 'var(--spacing-8)',
  '12': 'var(--spacing-12)',
  '16': 'var(--spacing-16)',
  '20': 'var(--spacing-20)',
  '24': 'var(--spacing-24)',
  '32': 'var(--spacing-32)',
  '40': 'var(--spacing-40)',
  '48': 'var(--spacing-48)',
  '64': 'var(--spacing-64)',
  '80': 'var(--spacing-80)',
  '96': 'var(--spacing-96)',
  '128': 'var(--spacing-128)',
  '160': 'var(--spacing-160)',
  '192': 'var(--spacing-192)',
  '256': 'var(--spacing-256)',
} as const

// ─── Border Radius CSS Variable References ────────────────────────────────────

export const tailwindRadius = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const

// ─── Shadow CSS Variable References ───────────────────────────────────────────

export const tailwindShadows = {
  soft: 'var(--shadow-soft)',
  medium: 'var(--shadow-medium)',
  large: 'var(--shadow-large)',
  glass: 'var(--shadow-glass)',
  floating: 'var(--shadow-floating)',
  glow: 'var(--shadow-glow)',
  'glow-warm': 'var(--shadow-glow-warm)',
  'glow-danger': 'var(--shadow-glow-danger)',
  none: 'none',
} as const

// ─── Z-index CSS Variable References ─────────────────────────────────────────

export const tailwindZIndex = {
  background: 'var(--z-background)',
  base: 'var(--z-base)',
  content: 'var(--z-content)',
  overlay: 'var(--z-overlay)',
  atmosphere: 'var(--z-atmosphere)',
  header: 'var(--z-header)',
  cursor: 'var(--z-cursor)',
  modal: 'var(--z-modal)',
  tooltip: 'var(--z-tooltip)',
  loader: 'var(--z-loader)',
  debug: 'var(--z-debug)',
} as const

// ─── Breakpoint CSS Variable References ───────────────────────────────────────
// In Tailwind v4, breakpoints in @theme use --breakpoint-* namespace

export const tailwindScreens = {
  tablet: 'var(--breakpoint-tablet)',
  laptop: 'var(--breakpoint-laptop)',
  desktop: 'var(--breakpoint-desktop)',
  wide: 'var(--breakpoint-wide)',
  ultrawide: 'var(--breakpoint-ultrawide)',
} as const

// ─── Animation CSS Variable References ────────────────────────────────────────

export const tailwindDurations = {
  instant: 'var(--duration-instant)',
  faster: 'var(--duration-faster)',
  fast: 'var(--duration-fast)',
  normal: 'var(--duration-normal)',
  moderate: 'var(--duration-moderate)',
  slow: 'var(--duration-slow)',
  slower: 'var(--duration-slower)',
  slowest: 'var(--duration-slowest)',
  cinematic: 'var(--duration-cinematic)',
  epic: 'var(--duration-epic)',
  ambient: 'var(--duration-ambient)',
} as const

export const tailwindEasings = {
  linear: 'var(--ease-linear)',
  'ease-in': 'var(--ease-in)',
  'ease-out': 'var(--ease-out)',
  'ease-in-out': 'var(--ease-in-out)',
  'power2-out': 'var(--ease-power2-out)',
  'power3-out': 'var(--ease-power3-out)',
  'power4-out': 'var(--ease-power4-out)',
  'expo-out': 'var(--ease-expo-out)',
  'expo-in-out': 'var(--ease-expo-in-out)',
  spring: 'var(--ease-spring)',
  elastic: 'var(--ease-elastic)',
  bounce: 'var(--ease-bounce)',
  cinematic: 'var(--ease-cinematic)',
  smooth: 'var(--ease-smooth)',
  snappy: 'var(--ease-snappy)',
} as const

// ─── Blur CSS Variable References ─────────────────────────────────────────────

export const tailwindBlur = {
  none: 'var(--blur-none)',
  xs: 'var(--blur-xs)',
  sm: 'var(--blur-sm)',
  md: 'var(--blur-md)',
  lg: 'var(--blur-lg)',
  xl: 'var(--blur-xl)',
  '2xl': 'var(--blur-2xl)',
  '3xl': 'var(--blur-3xl)',
  '4xl': 'var(--blur-4xl)',
} as const

// ─── Complete Tailwind Theme Object ───────────────────────────────────────────

/**
 * Complete Tailwind v4 theme configuration as TypeScript.
 * The @theme directive in globals.css generates Tailwind utilities from these values.
 * This object provides the TypeScript-side mirror for type-safe usage.
 */
export const tailwindTheme = {
  colors: tailwindColors,
  fontFamily: tailwindFontFamily,
  fontSize: tailwindFontSize,
  fontWeight: tailwindFontWeight,
  spacing: tailwindSpacing,
  borderRadius: tailwindRadius,
  boxShadow: tailwindShadows,
  zIndex: tailwindZIndex,
  screens: tailwindScreens,
  transitionDuration: tailwindDurations,
  transitionTimingFunction: tailwindEasings,
  blur: tailwindBlur,
} as const

export type TailwindTheme = typeof tailwindTheme
