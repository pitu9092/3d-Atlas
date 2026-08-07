import { forwardRef } from 'react'

export interface LoaderProgressRefs {
  container: HTMLDivElement | null
  bar: HTMLDivElement | null
}

interface LoaderProgressProps {
  progress: number // 0 to 1
  percent: number // 0 to 100 (smoothed)
}

/**
 * Progress bar and percentage counter for the cinematic loader.
 * Uses GSAP scaleX on the bar element for smooth hardware-accelerated filling.
 */
export const LoaderProgress = forwardRef<LoaderProgressRefs, LoaderProgressProps>(
  ({ percent }, ref) => {
    return (
      <div
        className="will-transform relative z-10 flex w-full max-w-[400px] flex-col items-center px-8 opacity-0"
        ref={(el) => {
          if (ref && typeof ref !== 'function') {
            ref.current = ref.current || { container: null, bar: null }
            ref.current.container = el
          }
        }}
      >
        {/* Progress Bar Track */}
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[var(--color-surface-700)]">
          {/* Progress Bar Fill */}
          <div
            className="will-transform absolute top-0 left-0 h-full w-full origin-left bg-[var(--color-accent-400)] shadow-[0_0_10px_var(--color-accent-400)]"
            ref={(el) => {
              if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.bar = el
              }
            }}
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Numeric Percentage */}
        <div className="mt-4 font-mono font-medium tracking-widest text-[var(--color-text-400)] text-[var(--text-sm)] tabular-nums">
          {percent.toString().padStart(3, '0')}%
        </div>
      </div>
    )
  },
)

LoaderProgress.displayName = 'LoaderProgress'
