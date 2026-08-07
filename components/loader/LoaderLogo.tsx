import { forwardRef } from 'react'

export interface LoaderLogoRefs {
  container: HTMLDivElement | null
  text: HTMLDivElement | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoaderLogoProps {}

/**
 * Animated logo for the cinematic loader.
 * Exposes refs for GSAP to animate the scale, fade, and text clip reveal.
 */
export const LoaderLogo = forwardRef<LoaderLogoRefs, LoaderLogoProps>((_props, ref) => {
  return (
    <div
      className="will-transform relative z-10 mb-16 flex flex-col items-center justify-center opacity-0"
      ref={(el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { container: null, text: null }
          ref.current.container = el
        }
      }}
    >
      {/* 
        Phase 0 logo placeholder.
        Real SVG sprite or SVG logo should be used when available.
        Using a premium typography layout for the reveal.
      */}
      <div className="flex items-center gap-4">
        {/* Globe icon placeholder */}
        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--color-accent-500)]">
          <div className="absolute inset-0 bg-[var(--color-accent-500)] opacity-20" />
          <div className="absolute top-1/2 left-0 h-[1px] w-full bg-[var(--color-accent-500)] opacity-40" />
          <div className="absolute top-0 left-1/2 h-full w-[1px] bg-[var(--color-accent-500)] opacity-40" />
        </div>

        {/* Text mask container for clip-path reveal */}
        <div
          className="inline-mask"
          ref={(el) => {
            if (ref && typeof ref !== 'function' && ref.current) {
              ref.current.text = el
            }
          }}
        >
          <h1 className="font-display font-light tracking-[var(--tracking-widest)] text-[var(--color-text-50)] text-[var(--text-4xl)] uppercase">
            3D <span className="font-medium text-[var(--color-accent-400)]">Atlas</span>
          </h1>
        </div>
      </div>
    </div>
  )
})

LoaderLogo.displayName = 'LoaderLogo'
