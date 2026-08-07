import { forwardRef } from 'react'

export interface HeroBackgroundRefs {
  container: HTMLDivElement | null
}

type HeroBackgroundProps = Record<string, never>

/**
 * Cinematic background for the Hero scene.
 * Includes a pure black base, a soft radial bloom to highlight the globe area,
 * and a subtle animated noise layer for cinematic texture.
 */
export const HeroBackground = forwardRef<HeroBackgroundRefs, HeroBackgroundProps>((_props, ref) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-[var(--color-background-900)]"
      ref={(el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { container: null }
          ref.current.container = el
        }
      }}
    >
      {/* Soft radial bloom behind the globe area (right side) */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle at 75% 50%, var(--color-primary-900) 0%, transparent 60%)',
        }}
      />

      {/* SVG Noise Texture for cinematic grain */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay">
        <svg className="h-full w-full">
          <filter id="hero-noise">
            <feTurbulence
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              type="fractalNoise"
            />
          </filter>
          <rect fill="transparent" filter="url(#hero-noise)" height="100%" width="100%" />
        </svg>
      </div>
    </div>
  )
})

HeroBackground.displayName = 'HeroBackground'
