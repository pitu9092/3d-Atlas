/**
 * @file components/scenes/scene01/Scene01Timeline.ts
 * @description GSAP ScrollTrigger timeline factory for Scene 01.
 *
 * Scene 01 — Atmosphere Transition (scroll range: 150vh → 200vh / ~50vh).
 *
 * Visual behaviour per 02_SceneMap.md and 03_GSAPBlueprint.md:
 *   - Background transitions: deep black → electric blue atmosphere band → off-white
 *   - The electric blue band is an overlay div whose opacity is scrubbed
 *   - The page background simultaneously lightens via a CSS var or body class
 *
 * The timeline is owned by Scene01Manager (engine layer). This module exposes
 * configuration constants consumed by both the manager and the component.
 */

/** Scroll range of Scene 01, expressed as a vh multiple (50vh = 0.5 × 100vh). */
export const SCENE01_SCROLL_VH = 50 as const

/**
 * GSAP scrub value for the atmosphere ScrollTrigger.
 * `1` = 1 second lag behind scroll for organic feel.
 * Per 03_GSAPBlueprint.md recommendation: use scrub: 1 for atmosphere.
 */
export const SCENE01_SCRUB = 1 as const

/** Colors used in Scene 01 atmosphere transition — sourced from 06_ColorPalette.md */
export const SCENE01_COLORS = {
  spaceBlack: '#0a0a0a',
  atmosphereBlue: '#1a7fff',
  offWhite: '#F5F5F2',
} as const

/** Timeline label constants (match 01_MasterAnimationTimeline.md labels) */
export const SCENE01_LABELS = {
  atmoStart: 'atmo-start',
  atmoPeak: 'atmo-peak',
  atmoEnd: 'atmo-end',
} as const
