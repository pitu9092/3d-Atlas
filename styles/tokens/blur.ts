/**
 * @file styles/tokens/blur.ts
 * @description Blur token system for 3D Atlas.
 *
 * Derived from: docs/reference/06_ColorPalette.md → Glass / Frosted Effects
 *               docs/reference/06_ColorPalette.md → Opacity Usage
 *
 * Key values from docs:
 *   Nav background: backdrop-filter: blur(12px) — blur.lg
 *   Glass surfaces: estimated 8–16px blur
 */

export const blur = {
  /** 0px — No blur */
  none: '0px',
  /** 2px — Micro blur (subtle texture softening) */
  xs: '2px',
  /** 4px — Small blur (card hover states) */
  sm: '4px',
  /** 8px — Medium blur (elevated glass panels) */
  md: '8px',
  /** 12px — Nav background blur (from docs: backdrop-filter blur(12px)) */
  lg: '12px',
  /** 16px — Strong glassmorphism */
  xl: '16px',
  /** 24px — Heavy glass (modal backdrop) */
  '2xl': '24px',
  /** 40px — Very heavy blur (full-screen overlay) */
  '3xl': '40px',
  /** 64px — Maximum blur (background obscure) */
  '4xl': '64px',
} as const

export type Blur = typeof blur
export type BlurKey = keyof Blur
