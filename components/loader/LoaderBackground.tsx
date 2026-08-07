import { forwardRef } from 'react'

export interface LoaderBackgroundRefs {
  bg: HTMLDivElement | null
  glow: HTMLDivElement | null
  grid: HTMLDivElement | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoaderBackgroundProps {}

/**
 * Atmospheric background for the loader.
 * Features a deep black background, a soft atmospheric center glow,
 * and a subtle animated CSS grid.
 */
export const LoaderBackground = forwardRef<LoaderBackgroundRefs, LoaderBackgroundProps>(
  (_props, ref) => {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-0"
        ref={(el) => {
          if (ref && typeof ref !== 'function') {
            ref.current = ref.current || { bg: null, glow: null, grid: null }
            ref.current.bg = el
          }
        }}
      >
        {/* Soft atmospheric glow */}
        <div
          className="will-transform absolute inset-0 flex items-center justify-center opacity-0"
          ref={(el) => {
            if (ref && typeof ref !== 'function' && ref.current) {
              ref.current.glow = el
            }
          }}
        >
          <div className="h-[60vw] max-h-[800px] w-[60vw] max-w-[800px] rounded-full bg-[var(--color-glow-600)] opacity-10 blur-[var(--blur-4xl)]" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-0"
          ref={(el) => {
            if (ref && typeof ref !== 'function' && ref.current) {
              ref.current.grid = el
            }
          }}
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          }}
        />
      </div>
    )
  },
)

LoaderBackground.displayName = 'LoaderBackground'
