/**
 * @file styles/tokens/gradients.ts
 * @description Gradient token system for 3D Atlas.
 *
 * Derived from: docs/reference/06_ColorPalette.md → Gradient Definitions
 *               docs/reference/09_BackgroundEvolution.md (frame analysis)
 *
 * Key gradients from docs:
 *   heroToAtmosphere: #080808 → #0a1220 → #1a3a7a → #2a5ac8 → #f8f7f4
 *   Globe atmosphere shader: edge hsl(210,100%,65%) → Fresnel → thermal hsl(20,90%,55%)
 */

export const gradients = {
  // ── Hero / Scroll Transitions ────────────────────────────────────

  /**
   * Page master scroll gradient.
   * Drives the full-page background color transition as user scrolls.
   * From near-black hero → deep blue atmosphere → off-white editorial.
   * From: docs/reference/06_ColorPalette.md → Hero to Atmosphere gradient
   */
  heroToAtmosphere: `linear-gradient(
    to bottom,
    #080808 0%,
    #0a1220 40%,
    #1a3a7a 70%,
    #2a5ac8 90%,
    #f8f7f4 100%
  )`,

  /**
   * Hero dark background (static, no color shift).
   * Used as base for the globe hero section.
   */
  heroDark: `linear-gradient(
    180deg,
    hsl(220 25% 3%) 0%,
    hsl(220 22% 5%) 100%
  )`,

  /**
   * Atmosphere rim gradient overlay.
   * Sweeps across viewport as hero exits and atmosphere section enters.
   */
  atmosphereBlue: `linear-gradient(
    180deg,
    hsl(215 100% 60% / 0) 0%,
    hsl(215 100% 50% / 0.4) 50%,
    hsl(213 68% 28% / 0.8) 100%
  )`,

  /**
   * Ocean blue section background.
   * Container ship scene — deep ocean to mid-water.
   */
  oceanDepth: `linear-gradient(
    180deg,
    hsl(213 68% 28%) 0%,
    hsl(210 70% 40%) 60%,
    hsl(205 80% 55%) 100%
  )`,

  /**
   * Editorial light section.
   * Off-white background for brand statement / testimonials.
   */
  editorialLight: `linear-gradient(
    180deg,
    hsl(40 10% 98%) 0%,
    hsl(40 8% 95%) 100%
  )`,

  // ── Glass & Surface ──────────────────────────────────────────────

  /**
   * Glass surface — dark glassmorphism.
   * Nav background, card overlays on dark sections.
   */
  glassDark: `linear-gradient(
    135deg,
    hsl(220 15% 100% / 0.06) 0%,
    hsl(220 15% 100% / 0.02) 100%
  )`,

  /**
   * Glass surface — light glassmorphism.
   * Potential use on light editorial sections.
   */
  glassLight: `linear-gradient(
    135deg,
    hsl(0 0% 100% / 0.7) 0%,
    hsl(0 0% 100% / 0.4) 100%
  )`,

  // ── Glow ─────────────────────────────────────────────────────────

  /**
   * Electric blue radial glow.
   * Globe atmosphere rim, route network nodes.
   */
  glowBlue: `radial-gradient(
    circle at center,
    hsl(215 100% 60% / 0.35) 0%,
    hsl(215 100% 60% / 0) 70%
  )`,

  /**
   * Thermal orange-red radial glow.
   * Globe northern hemisphere thermal effect.
   */
  glowThermal: `radial-gradient(
    circle at top,
    hsl(25 90% 55% / 0.3) 0%,
    hsl(10 85% 50% / 0.15) 40%,
    hsl(215 100% 60% / 0) 70%
  )`,

  /**
   * Accent red glow.
   * Dividers, aircraft livery highlights.
   */
  glowDanger: `radial-gradient(
    ellipse at center,
    hsl(0 80% 50% / 0.25) 0%,
    hsl(0 80% 50% / 0) 70%
  )`,

  // ── Text Gradients ───────────────────────────────────────────────

  /**
   * Text gradient — white to blue shimmer.
   * Special headline treatment.
   */
  textShimmer: `linear-gradient(
    90deg,
    hsl(0 0% 100%) 0%,
    hsl(215 100% 80%) 50%,
    hsl(0 0% 100%) 100%
  )`,

  /**
   * Overlay fade — content fades to black at edges.
   * Used for scroll-continuation hints.
   */
  fadeToBlack: `linear-gradient(
    to bottom,
    hsl(220 25% 4% / 0) 0%,
    hsl(220 25% 4% / 1) 100%
  )`,

  fadeToBlackTop: `linear-gradient(
    to top,
    hsl(220 25% 4% / 0) 0%,
    hsl(220 25% 4% / 1) 100%
  )`,
} as const

export type Gradients = typeof gradients
export type GradientKey = keyof Gradients
