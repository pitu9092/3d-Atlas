import type { ReactNode } from 'react'

interface HeroOverlayProps {
  children: ReactNode
}

/**
 * Fixed UI wrapper for the Hero scene.
 * Sits above the Canvas with z-index 1.
 * Uses design system container tokens and safe areas for perfect responsive layout.
 */
export function HeroOverlay({ children }: HeroOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-[var(--container-padding-x)] pt-[var(--safe-area-top)] pb-[var(--safe-area-bottom)]">
      {/* 
        pointer-events-none on wrapper to allow clicks to pass through to Canvas, 
        then re-enable pointer-events on the content 
      */}
      <div className="pointer-events-auto mx-auto w-full max-w-[var(--container-max-width)]">
        {children}
      </div>
    </div>
  )
}
