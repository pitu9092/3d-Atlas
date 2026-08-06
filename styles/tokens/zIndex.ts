/**
 * @file styles/tokens/zIndex.ts
 * @description Z-index token system for 3D Atlas.
 *
 * Derived from: docs/reference/08_LayerHierarchy.md
 *
 * Exact values from reference:
 *   -1  → WebGL Canvas / R3F background scenes
 *    0  → Page sections (standard document flow)
 *    1  → Section content (text, images within sections)
 *   10  → Transition overlay panels (wipe panels)
 *   20  → Section overlays (atmospheric gradients)
 *   50  → Fixed navbar
 *  100  → Fixed custom cursor
 *
 * Extended with additional practical levels for future UI needs.
 */

export const zIndex = {
  /** -1 — WebGL canvas (behind all DOM content) */
  background: -1,
  /** 0 — Standard document flow (page sections) */
  base: 0,
  /** 1 — Section content (text, images above canvas) */
  content: 1,
  /** 10 — Wipe panels, clip-path transition overlays */
  overlay: 10,
  /** 20 — Atmospheric gradient overlays, section transitions */
  atmosphere: 20,
  /** 50 — Fixed navigation bar */
  header: 50,
  /** 100 — Custom cursor ring (must be above everything interactive) */
  cursor: 100,
  /** 200 — Modal dialogs */
  modal: 200,
  /** 300 — Tooltip, popover */
  tooltip: 300,
  /** 400 — Full-screen loading overlay */
  loader: 400,
  /** 9999 — Debug overlays (development only) */
  debug: 9999,
} as const

export type ZIndex = typeof zIndex
export type ZIndexKey = keyof ZIndex
