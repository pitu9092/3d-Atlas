/**
 * @file types/theme.ts
 * @description Theme type definitions for 3D Atlas design system.
 *
 * Covers theme mode, theme context, and CSS variable name maps.
 */

// ─── Theme Mode ───────────────────────────────────────────────────────────────

/** Supported theme modes */
export type ThemeMode = 'dark' | 'light'

/** Color scheme section types (from docs: dual-mode color system) */
export type ColorScheme =
  | 'hero-dark' // Near-black hero sections
  | 'editorial-light' // Off-white editorial sections
  | 'ocean-blue' // Container ship deep ocean
  | 'sky-blue' // Aircraft sky sections
  | 'features-dark' // Dark charcoal feature sections

// ─── Theme Object ─────────────────────────────────────────────────────────────

export interface ThemeColors {
  background: string
  foreground: string
  accent: string
  surface: string
  border: string
  overlay: string
  muted: string
  mutedForeground: string
}

export interface Theme {
  mode: ThemeMode
  colors: ThemeColors
}

// ─── Theme Context ────────────────────────────────────────────────────────────

export interface ThemeContextValue {
  /** Current theme mode */
  theme: ThemeMode
  /** Toggle between dark and light */
  toggleTheme: () => void
  /** Explicitly set theme mode */
  setTheme: (mode: ThemeMode) => void
  /** Whether the current system preference is dark */
  systemPrefersDark: boolean
  /** Whether the theme has been resolved (avoids SSR flash) */
  resolved: boolean
}

// ─── CSS Variable Map ─────────────────────────────────────────────────────────

/** All CSS custom property names exposed by the design system */
export interface CSSVariableMap {
  // Colors
  'color-primary-50': string
  'color-primary-100': string
  'color-primary-200': string
  'color-primary-300': string
  'color-primary-400': string
  'color-primary-500': string
  'color-primary-600': string
  'color-primary-700': string
  'color-primary-800': string
  'color-primary-900': string
  // ... extends for each color scale

  // Typography
  'font-sans': string
  'font-display': string
  'font-mono': string

  // Spacing — representative subset
  'space-4': string
  'space-8': string
  'space-16': string
  'space-24': string
  'space-32': string
  'space-48': string
  'space-64': string
  'space-80': string

  // Z-index
  'z-background': string
  'z-content': string
  'z-overlay': string
  'z-header': string
  'z-cursor': string
  'z-modal': string
  'z-loader': string
  'z-debug': string

  // Motion
  'duration-fast': string
  'duration-normal': string
  'duration-slow': string
  'ease-power4-out': string
  'ease-spring': string
}

// ─── Tailwind Theme Config ────────────────────────────────────────────────────

export interface TailwindColorScale {
  '50': string
  '100': string
  '200': string
  '300': string
  '400': string
  '500': string
  '600': string
  '700': string
  '800': string
  '900': string
}

export interface TailwindThemeConfig {
  colors: Record<string, TailwindColorScale | string>
  fontFamily: Record<string, string>
  fontSize: Record<string, string>
  fontWeight: Record<string, string>
  lineHeight: Record<string, string>
  letterSpacing: Record<string, string>
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
  zIndex: Record<string, string | number>
  screens: Record<string, string>
  transitionDuration: Record<string, string>
  transitionTimingFunction: Record<string, string>
  blur: Record<string, string>
}
