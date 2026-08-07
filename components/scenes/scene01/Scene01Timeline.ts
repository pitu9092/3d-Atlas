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

/** Scroll range of Scene 01 — Atmosphere Transition. Per 01_MasterAnimationTimeline.md:
 *  starts at 150vh (end of Hero pin) and ends at ~210vh.
 *  60vh of scroll = the user sees the full atmosphere transition.
 */
export const SCENE01_SCROLL_VH = 60 as const

/**
 * GSAP scrub value for the atmosphere ScrollTrigger.
 * Per 04_ScrollTriggerBlueprint.md (ST-02): scrub: 1
 */
export const SCENE01_SCRUB = 1 as const

/** Colors used in Scene 01 atmosphere transition — sourced from 06_ColorPalette.md */
export const SCENE01_COLORS = {
  spaceBlack: '#080808',
  atmosphereBlue: '#1a7fff',
  offWhite: '#F5F4F0',
} as const

/** Timeline label constants (match 01_MasterAnimationTimeline.md labels) */
export const SCENE01_LABELS = {
  atmoStart: 'atmo-start',
  atmoPeak: 'atmo-peak',
  atmoEnd: 'atmo-end',
} as const
