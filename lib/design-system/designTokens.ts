/**
 * @file lib/design-system/designTokens.ts
 * @description Aggregated design token system for 3D Atlas.
 *
 * This is the single-import point for the complete design token system.
 * Aggregates all token modules into one unified, tree-shakable object.
 *
 * Usage:
 *   import { designTokens } from '@/lib/design-system/designTokens'
 *   designTokens.colors.primary['500']
 *
 * Or use individual token imports for maximum tree-shaking:
 *   import { colors } from '@/styles/tokens/colors'
 */

import { blur } from '@/styles/tokens/blur'
import { breakpoints, breakpointValues, mediaQueries } from '@/styles/tokens/breakpoints'
import { colors } from '@/styles/tokens/colors'
import { containers } from '@/styles/tokens/containers'
import { durations } from '@/styles/tokens/durations'
import { easings } from '@/styles/tokens/easings'
import { gradients } from '@/styles/tokens/gradients'
import { motion, transformDefaults } from '@/styles/tokens/motion'
import { opacity } from '@/styles/tokens/opacity'
import { radius } from '@/styles/tokens/radius'
import { shadows } from '@/styles/tokens/shadows'
import { spacing } from '@/styles/tokens/spacing'
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
} from '@/styles/tokens/typography'
import { zIndex } from '@/styles/tokens/zIndex'

// ─── Aggregated Design Token System ──────────────────────────────────────────

export const designTokens = {
  /** Color palette — primary, secondary, accent, semantic, surface, etc. */
  colors,

  /** Typography — fontFamily, fontSize, fontWeight, lineHeight, letterSpacing */
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  },

  /** Spacing scale (8px base unit, 2px–256px) */
  spacing,

  /** Border radius (xs–full) */
  radius,

  /** Shadow tokens (soft, medium, large, glass, floating, glow variants) */
  shadows,

  /** Z-index hierarchy (background=-1 through debug=9999) */
  zIndex,

  /** Breakpoints (mobile/tablet/laptop/desktop/wide/ultrawide) */
  breakpoints: {
    values: breakpoints,
    px: breakpointValues,
    media: mediaQueries,
  },

  /** Animation durations */
  durations,

  /** CSS cubic-bezier easing functions (with GSAP equivalents) */
  easings,

  /** Semantic motion presets (fast/normal/slow/verySlow + project-specific) */
  motion: {
    presets: motion,
    transforms: transformDefaults,
  },

  /** Opacity scale (0–100) */
  opacity,

  /** Blur values for glassmorphism (none–4xl) */
  blur,

  /** Gradient definitions (hero, atmosphere, ocean, glass, glow) */
  gradients,

  /** Container & layout system (maxWidth, padding, gutter, grid) */
  containers,
} as const

export type DesignTokens = typeof designTokens

// ─── Individual re-exports for selective import ────────────────────────────────
export {
  blur,
  breakpoints,
  breakpointValues,
  mediaQueries,
  colors,
  containers,
  durations,
  easings,
  fontFamily,
  fontSize,
  fontWeight,
  gradients,
  letterSpacing,
  lineHeight,
  motion,
  opacity,
  radius,
  shadows,
  spacing,
  transformDefaults,
  zIndex,
}
