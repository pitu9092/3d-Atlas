'use client'

/**
 * @file components/scenes/scene01/Scene01Effects.tsx
 * @description Visual atmosphere effects layer for Scene 01.
 *
 * Renders the cinematic atmosphere gradient overlay:
 *   - The glowing electric-blue band that simulates Earth's atmosphere
 *   - A radial gradient glow (representing the lit limb of the atmosphere)
 *   - Composited above the page via absolute positioning + additive blending
 *
 * This component is purely visual. All animation is driven by Scene01Manager
 * (GSAP ScrollTrigger) via a forwarded ref on the atmosphere element.
 */

import { forwardRef } from 'react'

import { SCENE01_COLORS } from './Scene01Timeline'

export interface Scene01EffectsRefs {
  atmosphereBand: HTMLDivElement | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Scene01EffectsProps {}

export const Scene01Effects = forwardRef<Scene01EffectsRefs, Scene01EffectsProps>((_props, ref) => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/*
          Atmosphere Band:
          A full-viewport overlay that GSAP will fade in/out (opacity: 0 → 1 → 0)
          as the user scrolls through this section.
          The gradient simulates the glowing blue band of Earth's atmosphere
          as seen from low orbit.
        */}
      <div
        className="absolute inset-0 will-change-transform"
        ref={(_el) => {
          if (ref && typeof ref !== 'function') {
            ref.current = ref.current || { atmosphereBand: null }
            ref.current.atmosphereBand = _el
          }
        }}
        style={{
          background: `
              radial-gradient(ellipse 120% 60% at 50% 100%,
                ${SCENE01_COLORS.atmosphereBlue}cc 0%,
                ${SCENE01_COLORS.atmosphereBlue}66 30%,
                ${SCENE01_COLORS.atmosphereBlue}00 70%
              )
            `,
          opacity: 0, // GSAP will animate this
        }}
      />

      {/*
          Horizon glow line: a thin bright line at the vertical midpoint
          suggesting Earth's curved horizon. Fades with the atmosphere band.
        */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 left-0"
        style={{
          // Positioned at the "horizon" — bottom 40% of the viewport
          bottom: '35%',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${SCENE01_COLORS.atmosphereBlue}ff 30%, #6ec6ffff 50%, ${SCENE01_COLORS.atmosphereBlue}ff 70%, transparent 100%)`,
          filter: 'blur(3px)',
          opacity: 'inherit', // inherits from parent GSAP-controlled element when nested, but here it's separate
        }}
      />
    </div>
  )
})

Scene01Effects.displayName = 'Scene01Effects'
