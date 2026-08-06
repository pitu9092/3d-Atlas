/**
 * @file lib/fonts.ts
 * @description Next.js font optimization configuration.
 * Import these font variables into layout.tsx and apply to <html>.
 */

import { Inter, Outfit } from 'next/font/google'

/**
 * Inter — primary sans-serif for body text and UI.
 * Loaded as a CSS variable for use in design tokens.
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

/**
 * Outfit — display font for headings and hero text.
 * Loaded as a CSS variable for use in design tokens.
 */
export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700', '900'],
})
