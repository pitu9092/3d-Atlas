import { forwardRef } from 'react'

export interface HeroBackgroundRefs {
  container: HTMLDivElement | null
}

type HeroBackgroundProps = Record<string, never>

/**
 * Pure black background for the Hero scene as specified by the design.
 */
export const HeroBackground = forwardRef<HeroBackgroundRefs, HeroBackgroundProps>((_props, ref) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 bg-[#0a0a0a]"
      ref={(el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { container: null }
          ref.current.container = el
        }
      }}
    />
  )
})

HeroBackground.displayName = 'HeroBackground'
