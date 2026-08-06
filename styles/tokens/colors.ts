/**
 * @file styles/tokens/colors.ts
 * @description Complete color token system for 3D Atlas.
 *
 * Derived from: docs/reference/06_ColorPalette.md
 *
 * Design system color map:
 *   Primary    — Deep space navy (hero background, dark UI)
 *   Secondary  — Ocean blue (container ship sections, logistics blue)
 *   Accent     — Electric blue (atmospheric glow, highlights)
 *   Neutral    — Pure grays (UI chrome, borders)
 *   Surface    — Elevated UI panels (dark surfaces, glassmorphism)
 *   Background — Section backgrounds (dark hero + light editorial)
 *   Text       — Typography hierarchy colors
 *   Success    — Status: success
 *   Warning    — Status: warning
 *   Danger     — Status: danger / accent red
 *   Border     — Dividers and borders
 *   Overlay    — Screen-level overlays
 *   Glass      — Glassmorphic surface fills
 *   Glow       — Luminous atmospheric glow (electric blue)
 *
 * Every color supports shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
 * All values use modern CSS HSL syntax (space-separated, no commas).
 */

// ─── Primary — Deep Space Navy ───────────────────────────────────────────────
// Hero background: #080808 → #0a0b10 (hsl 220 25% 4%)
// From: docs/reference/06_ColorPalette.md → Background → bg-hero
export const primary = {
  '50': 'hsl(220 20% 97%)',
  '100': 'hsl(220 20% 93%)',
  '200': 'hsl(220 20% 85%)',
  '300': 'hsl(220 20% 72%)',
  '400': 'hsl(220 20% 52%)',
  '500': 'hsl(220 20% 32%)',
  '600': 'hsl(220 20% 18%)',
  '700': 'hsl(220 20% 11%)', // bg-dark-1: #0f0f0f–#111111
  '800': 'hsl(220 22% 7%)', // bg-dark-2: #151515
  '900': 'hsl(220 25% 4%)', // bg-hero: #080808–#0a0b10
} as const

// ─── Secondary — Ocean Blue ───────────────────────────────────────────────────
// Deep ocean: hsl(215,75%,28%) ≈ #133D77
// From: docs/reference/06_ColorPalette.md → Blue / Ocean Theme
export const secondary = {
  '50': 'hsl(213 68% 96%)',
  '100': 'hsl(213 68% 90%)',
  '200': 'hsl(213 68% 78%)',
  '300': 'hsl(213 68% 64%)',
  '400': 'hsl(213 68% 50%)',
  '500': 'hsl(213 68% 40%)', // ocean-mid: hsl(210,70%,40%) ≈ #1E5FA3
  '600': 'hsl(215 75% 28%)', // ocean-deep: hsl(215,75%,28%) ≈ #133D77
  '700': 'hsl(215 75% 20%)',
  '800': 'hsl(215 75% 13%)',
  '900': 'hsl(215 75% 8%)',
} as const

// ─── Accent — Electric Blue (Atmospheric) ────────────────────────────────────
// Atmosphere rim: hsl(215,100%,60%) ≈ #1a7fff
// Outer atmosphere: hsl(210,100%,45%) ≈ #006de6
// From: docs/reference/06_ColorPalette.md → Globe / 3D Atmosphere Colors
export const accent = {
  '50': 'hsl(215 100% 97%)',
  '100': 'hsl(215 100% 92%)',
  '200': 'hsl(215 100% 82%)',
  '300': 'hsl(215 100% 72%)',
  '400': 'hsl(215 100% 65%)',
  '500': 'hsl(215 100% 60%)', // atmosphere-blue ≈ #1a7fff
  '600': 'hsl(210 100% 45%)', // atmosphere-blue-outer ≈ #006de6
  '700': 'hsl(210 100% 36%)',
  '800': 'hsl(210 100% 26%)',
  '900': 'hsl(210 100% 15%)',
} as const

// ─── Neutral — Pure Grays ─────────────────────────────────────────────────────
// UI chrome, borders, subtle backgrounds
export const neutral = {
  '50': 'hsl(0 0% 98%)',
  '100': 'hsl(0 0% 93%)',
  '200': 'hsl(0 0% 85%)',
  '300': 'hsl(0 0% 70%)',
  '400': 'hsl(0 0% 55%)',
  '500': 'hsl(0 0% 40%)',
  '600': 'hsl(0 0% 27%)',
  '700': 'hsl(0 0% 18%)',
  '800': 'hsl(0 0% 11%)',
  '900': 'hsl(0 0% 5%)',
} as const

// ─── Surface — Elevated UI Panels ────────────────────────────────────────────
// Dark section surfaces, card backgrounds
// bg-dark-2 (#151515) maps to ~surface-800
export const surface = {
  '50': 'hsl(220 15% 97%)',
  '100': 'hsl(220 15% 93%)',
  '200': 'hsl(220 15% 84%)',
  '300': 'hsl(220 15% 68%)',
  '400': 'hsl(220 15% 48%)',
  '500': 'hsl(220 15% 30%)',
  '600': 'hsl(220 15% 18%)',
  '700': 'hsl(220 15% 12%)',
  '800': 'hsl(220 15% 8%)', // ≈ #151515 card bg on dark
  '900': 'hsl(220 15% 4%)',
} as const

// ─── Background — Section Backgrounds ────────────────────────────────────────
// bg-light-1: #F4F3EF–#F8F7F4 (editorial/testimonial)
// bg-hero: #080808–#0a0b10
// bg-dark-1: #0f0f0f–#111111 (features/services)
export const background = {
  '50': 'hsl(40 15% 98%)', // bg-white: #FFFFFF
  '100': 'hsl(40 10% 96%)', // bg-light-1: #F8F7F4
  '200': 'hsl(40 8% 93%)', // bg-light-2: #F4F3EF
  '300': 'hsl(40 6% 84%)',
  '400': 'hsl(220 10% 60%)',
  '500': 'hsl(220 15% 30%)',
  '600': 'hsl(220 18% 16%)', // bg-dark-1: #0f0f0f–#111111
  '700': 'hsl(220 18% 10%)',
  '800': 'hsl(220 20% 7%)', // bg-dark-2: #151515
  '900': 'hsl(220 25% 4%)', // bg-hero: #080808–#0a0b10
} as const

// ─── Text — Typography Colors ─────────────────────────────────────────────────
// text-primary-dark: #ffffff
// text-secondary-dark: rgba(255,255,255,0.65)
// text-tertiary-dark: rgba(255,255,255,0.4)
// text-primary-light: #111111
// text-secondary-light: #444444–#555555
// text-tertiary-light: #888888
// From: docs/reference/06_ColorPalette.md → Text
export const text = {
  '50': 'hsl(0 0% 100%)', // white — text-primary-dark
  '100': 'hsl(220 15% 96%)', // near-white
  '200': 'hsl(220 12% 84%)', // ~65% white on dark (text-secondary-dark)
  '300': 'hsl(220 10% 68%)',
  '400': 'hsl(220 10% 52%)', // ~40% white on dark (text-tertiary-dark)
  '500': 'hsl(220 8% 38%)', // text-tertiary-light: #888888
  '600': 'hsl(220 7% 27%)', // text-secondary-light: #444444
  '700': 'hsl(220 8% 20%)', // text-secondary-light: #555555
  '800': 'hsl(220 8% 13%)',
  '900': 'hsl(220 10% 7%)', // text-primary-light: #111111
} as const

// ─── Success ─────────────────────────────────────────────────────────────────
export const success = {
  '50': 'hsl(145 70% 96%)',
  '100': 'hsl(145 68% 88%)',
  '200': 'hsl(145 65% 74%)',
  '300': 'hsl(145 62% 60%)',
  '400': 'hsl(145 65% 50%)',
  '500': 'hsl(145 70% 45%)',
  '600': 'hsl(145 72% 35%)',
  '700': 'hsl(145 72% 26%)',
  '800': 'hsl(145 70% 16%)',
  '900': 'hsl(145 70% 9%)',
} as const

// ─── Warning ─────────────────────────────────────────────────────────────────
export const warning = {
  '50': 'hsl(38 95% 96%)',
  '100': 'hsl(38 92% 88%)',
  '200': 'hsl(38 90% 76%)',
  '300': 'hsl(38 88% 64%)',
  '400': 'hsl(38 90% 57%)',
  '500': 'hsl(38 92% 55%)',
  '600': 'hsl(35 90% 45%)',
  '700': 'hsl(32 88% 35%)',
  '800': 'hsl(30 85% 22%)',
  '900': 'hsl(28 80% 12%)',
} as const

// ─── Danger — Accent Red ──────────────────────────────────────────────────────
// accent-red: #cc0000–#e63030
// Used for: horizontal rule/divider, aircraft tail livery
// From: docs/reference/06_ColorPalette.md → Light Theme → Accent
export const danger = {
  '50': 'hsl(0 85% 97%)',
  '100': 'hsl(0 82% 92%)',
  '200': 'hsl(0 80% 82%)',
  '300': 'hsl(0 80% 68%)',
  '400': 'hsl(0 80% 57%)',
  '500': 'hsl(0 80% 50%)', // ≈ #cc0000
  '600': 'hsl(4 82% 44%)', // ≈ #e63030
  '700': 'hsl(6 84% 35%)',
  '800': 'hsl(6 84% 23%)',
  '900': 'hsl(6 84% 13%)',
} as const

// ─── Border ───────────────────────────────────────────────────────────────────
// surface-border: hsl(220, 20%, 25%, 0.3) from existing globals.css
export const border = {
  '50': 'hsl(220 15% 95%)',
  '100': 'hsl(220 15% 88%)',
  '200': 'hsl(220 15% 78%)',
  '300': 'hsl(220 15% 64%)',
  '400': 'hsl(220 15% 48%)',
  '500': 'hsl(220 20% 32%)',
  '600': 'hsl(220 20% 22%)',
  '700': 'hsl(220 20% 16%)',
  '800': 'hsl(220 20% 10%)',
  '900': 'hsl(220 20% 5%)',
} as const

// ─── Overlay ─────────────────────────────────────────────────────────────────
// Nav background (dark): ~0.85–0.95 opacity
// Screen overlays for wipe transitions
// Values use hsl with alpha channel
export const overlay = {
  '50': 'hsl(220 25% 4% / 0.04)',
  '100': 'hsl(220 25% 4% / 0.08)',
  '200': 'hsl(220 25% 4% / 0.16)',
  '300': 'hsl(220 25% 4% / 0.28)',
  '400': 'hsl(220 25% 4% / 0.42)',
  '500': 'hsl(220 25% 4% / 0.56)',
  '600': 'hsl(220 25% 4% / 0.68)',
  '700': 'hsl(220 25% 4% / 0.78)',
  '800': 'hsl(220 25% 4% / 0.88)', // nav background dark
  '900': 'hsl(220 25% 4% / 0.96)',
} as const

// ─── Glass — Glassmorphism Fills ──────────────────────────────────────────────
// Nav glass: backdrop-filter blur(12px) with ~0.85–0.95 opacity dark
// From: docs/reference/06_ColorPalette.md → Glass / Frosted Effects
export const glass = {
  '50': 'hsl(220 15% 100% / 0.04)',
  '100': 'hsl(220 15% 98% / 0.06)',
  '200': 'hsl(220 15% 95% / 0.10)',
  '300': 'hsl(220 15% 90% / 0.16)',
  '400': 'hsl(220 15% 80% / 0.22)',
  '500': 'hsl(220 15% 70% / 0.32)',
  '600': 'hsl(220 15% 50% / 0.40)',
  '700': 'hsl(220 15% 30% / 0.52)',
  '800': 'hsl(220 15% 15% / 0.70)',
  '900': 'hsl(220 15% 8% / 0.88)',
} as const

// ─── Glow — Atmospheric Electric Blue ────────────────────────────────────────
// Primary: atmosphere-blue hsl(215,100%,60%) ≈ #1a7fff
// Used for: globe Fresnel rim, route network, particle glow
// From: docs/reference/06_ColorPalette.md → Globe / 3D Atmosphere Colors
export const glow = {
  '50': 'hsl(215 100% 95%)',
  '100': 'hsl(215 100% 88%)',
  '200': 'hsl(215 100% 78%)',
  '300': 'hsl(215 100% 70%)',
  '400': 'hsl(215 100% 65%)',
  '500': 'hsl(215 100% 60%)', // atmosphere-blue primary
  '600': 'hsl(210 100% 48%)', // atmosphere-blue-outer
  '700': 'hsl(25 90% 55%)', // fire-glow-orange thermal
  '800': 'hsl(15 87% 52%)', // fire-glow orange-red
  '900': 'hsl(10 85% 50%)', // fire-glow-red deep thermal
} as const

// ─── Composite Export ─────────────────────────────────────────────────────────

export const colors = {
  primary,
  secondary,
  accent,
  neutral,
  surface,
  background,
  text,
  success,
  warning,
  danger,
  border,
  overlay,
  glass,
  glow,
} as const

export type ColorScale = typeof colors
export type ColorName = keyof ColorScale
export type ColorShade =
  '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
