/**
 * @file lib/design-system/theme.ts
 * @description Theme configuration objects for 3D Atlas.
 *
 * Provides resolved theme objects for dark and light modes.
 * These are the semantic layer on top of the raw token system.
 * Components should use these semantic values, not raw tokens directly.
 *
 * Usage:
 *   import { darkTheme, lightTheme, getTheme } from '@/lib/design-system/theme'
 *   const bg = darkTheme.colors.background  // 'hsl(220 25% 4%)'
 */

import { blur } from '@/styles/tokens/blur'
import {
  background,
  border,
  glass,
  glow,
  overlay,
  primary,
  surface,
  text,
} from '@/styles/tokens/colors'
import { shadows } from '@/styles/tokens/shadows'
import type { ThemeMode } from '@/types/theme'

// ─── Dark Theme ───────────────────────────────────────────────────────────────
// Primary mode: cinematic dark for hero, features, and 3D sections

export const darkTheme = {
  mode: 'dark' as ThemeMode,

  colors: {
    /** Page / section background */
    background: background['900'], // #080808–#0a0b10
    backgroundSecondary: background['800'], // #151515 dark card bg
    backgroundTertiary: background['700'], // features section

    /** Surface / elevated panels */
    surface: surface['800'],
    surfaceSecondary: surface['700'],
    surfaceBorder: border['800'],

    /** Foreground text */
    foreground: text['50'], // #ffffff primary
    foregroundSecondary: text['200'], // ~rgba(255,255,255,0.65) secondary
    foregroundTertiary: text['400'], // ~rgba(255,255,255,0.40) captions

    /** Accent */
    accent: glow['500'], // electric blue atmosphere
    accentWarm: glow['700'], // thermal orange
    accentDanger: 'hsl(0 80% 50%)', // accent-red

    /** Overlay */
    overlay: overlay['800'], // nav background ~0.88 opacity
    overlayHeavy: overlay['900'],

    /** Glass */
    glass: glass['800'], // dark glass surface
    glassBorder: 'hsl(220 15% 100% / 0.08)',

    /** Muted */
    muted: surface['700'],
    mutedForeground: text['400'],
  },

  nav: {
    background: primary['900'], // near-black
    backgroundBlur: blur['lg'], // 12px blur (from docs)
    opacity: '0.88', // nav glass opacity
    border: border['800'],
  },

  shadow: {
    card: shadows['medium'],
    modal: shadows['large'],
    glow: shadows['glow'],
    floating: shadows['floating'],
  },
} as const

// ─── Light Theme ──────────────────────────────────────────────────────────────
// Secondary mode: editorial light for brand statement, testimonials

export const lightTheme = {
  mode: 'light' as ThemeMode,

  colors: {
    /** Page background */
    background: background['100'], // #F8F7F4 off-white
    backgroundSecondary: background['200'], // #F4F3EF editorial
    backgroundTertiary: background['50'], // #FFFFFF white

    /** Surface / elevated panels */
    surface: text['50'], // white cards on light
    surfaceSecondary: background['100'],
    surfaceBorder: border['200'],

    /** Foreground text */
    foreground: text['900'], // #111111 primary light
    foregroundSecondary: text['600'], // #444444 body copy
    foregroundTertiary: text['500'], // #888888 captions

    /** Accent */
    accent: 'hsl(0 80% 50%)', // accent-red (from docs: light sections)
    accentWarm: 'hsl(25 90% 55%)', // thermal orange
    accentDanger: 'hsl(0 80% 40%)', // deeper red danger

    /** Overlay */
    overlay: overlay['200'], // light overlay
    overlayHeavy: overlay['500'],

    /** Glass */
    glass: glass['200'], // light glass surface
    glassBorder: 'hsl(0 0% 0% / 0.08)',

    /** Muted */
    muted: background['200'],
    mutedForeground: text['500'],
  },

  nav: {
    background: background['50'], // white on light
    backgroundBlur: blur['md'],
    opacity: '0.92',
    border: border['200'],
  },

  shadow: {
    card: shadows['soft'],
    modal: shadows['medium'],
    glow: shadows['glowDanger'], // red glow on light theme
    floating: shadows['floating'],
  },
} as const

// ─── Theme Map ────────────────────────────────────────────────────────────────

export const themeMap = {
  dark: darkTheme,
  light: lightTheme,
} as const

/**
 * Returns the theme object for the given mode.
 */
export function getTheme(mode: ThemeMode): typeof darkTheme | typeof lightTheme {
  return themeMap[mode]
}

/**
 * Default theme mode for the project.
 * 3D Atlas is dark-first (hero is always dark).
 */
export const DEFAULT_THEME: ThemeMode = 'dark'

export type DarkTheme = typeof darkTheme
export type LightTheme = typeof lightTheme
export type AppTheme = DarkTheme | LightTheme
