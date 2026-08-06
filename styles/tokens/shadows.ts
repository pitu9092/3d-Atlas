/**
 * @file styles/tokens/shadows.ts
 * @description Shadow token system for 3D Atlas.
 *
 * Designed for the dark cinematic aesthetic of the project.
 * Shadows reference the deep space primary color (hsl 220 25% 4%).
 * Glow shadows reference the electric blue accent and thermal orange.
 */

export const shadows = {
  /** Subtle elevation — low-profile cards */
  soft: '0 1px 4px hsl(220 25% 2% / 0.4), 0 2px 8px hsl(220 25% 2% / 0.2)',
  /** Standard elevation — interactive components */
  medium: '0 4px 16px hsl(220 25% 2% / 0.5), 0 2px 6px hsl(220 25% 2% / 0.3)',
  /** Strong elevation — raised panels, modals */
  large: '0 8px 32px hsl(220 25% 2% / 0.6), 0 4px 12px hsl(220 25% 2% / 0.35)',
  /** Glass morphism shadow — frosted surfaces */
  glass: '0 8px 32px hsl(220 25% 2% / 0.4), inset 0 1px 0 hsl(220 15% 100% / 0.08)',
  /** Floating element — cursor, tooltips, dropdowns */
  floating: '0 16px 64px hsl(220 25% 2% / 0.7), 0 4px 16px hsl(220 25% 2% / 0.4)',
  /** Electric blue glow — atmospheric accent elements */
  glow: '0 0 24px hsl(215 100% 60% / 0.35), 0 0 64px hsl(215 100% 60% / 0.15)',
  /** Thermal orange glow — globe thermal atmosphere */
  glowWarm: '0 0 24px hsl(25 90% 55% / 0.35), 0 0 64px hsl(25 90% 55% / 0.15)',
  /** Danger/red glow — accent red highlights */
  glowDanger: '0 0 24px hsl(0 80% 50% / 0.30), 0 0 48px hsl(0 80% 50% / 0.12)',
  /** No shadow */
  none: 'none',
} as const

export type Shadows = typeof shadows
export type ShadowKey = keyof Shadows
