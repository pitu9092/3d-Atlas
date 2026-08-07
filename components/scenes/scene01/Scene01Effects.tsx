'use client'

/**
 * @file components/scenes/scene01/Scene01Effects.tsx
 * @description Visual atmosphere effects layer for Scene 01 (TR-01).
 *
 * Two GSAP-animated layers (per 09_BackgroundEvolution.md BG-02):
 *   gradientElement — full 8-stop atmosphere gradient (bg layer)
 *   atmosphereBand  — electric-blue radial limb glow (peak layer)
 *   horizon line    — pure CSS decorative strip (no GSAP)
 */

import { forwardRef } from 'react'

import { ATMOSPHERE_GRADIENT } from '@/engine/scenes/Scene01Manager'

import { SCENE01_COLORS } from './Scene01Timeline'

export interface Scene01EffectsRefs {
  atmosphereBand: HTMLDivElement | null
  gradientElement: HTMLDivElement | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Scene01EffectsProps {}

export const Scene01Effects = forwardRef<Scene01EffectsRefs, Scene01EffectsProps>((_props, ref) => {
  const setRef = (key: keyof Scene01EffectsRefs) => (el: HTMLDivElement | null) => {
    if (ref && typeof ref !== 'function') {
      if (!ref.current) {
        ref.current = { atmosphereBand: null, gradientElement: null }
      }
      ref.current[key] = el
    }
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Layer 1: Full-frame 8-stop atmosphere gradient (GSAP controls opacity) */}
      <div
        className="absolute inset-0"
        ref={setRef('gradientElement')}
        style={{
          background: `linear-gradient(to bottom, ${ATMOSPHERE_GRADIENT})`,
          opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* Layer 2: Electric-blue radial atmosphere limb glow (GSAP controls opacity) */}
      <div
        className="absolute inset-0"
        ref={setRef('atmosphereBand')}
        style={{
          background: `
            radial-gradient(ellipse 140% 80% at 50% 110%,
              ${SCENE01_COLORS.atmosphereBlue}dd 0%,
              ${SCENE01_COLORS.atmosphereBlue}88 25%,
              ${SCENE01_COLORS.atmosphereBlue}44 50%,
              ${SCENE01_COLORS.atmosphereBlue}00 75%
            )
          `,
          opacity: 0,
          willChange: 'opacity',
        }}
      />

      {/* Layer 3: Horizon glow line — decorative, pure CSS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 left-0"
        style={{
          bottom: '38%',
          height: '1px',
          background: `linear-gradient(90deg,
            transparent 0%,
            ${SCENE01_COLORS.atmosphereBlue}cc 20%,
            #7ecfff 50%,
            ${SCENE01_COLORS.atmosphereBlue}cc 80%,
            transparent 100%
          )`,
          filter: 'blur(2px)',
          boxShadow: `0 0 12px 4px ${SCENE01_COLORS.atmosphereBlue}66`,
        }}
      />
    </div>
  )
})

Scene01Effects.displayName = 'Scene01Effects'
