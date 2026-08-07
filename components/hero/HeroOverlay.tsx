import type { ReactNode } from 'react'

interface HeroOverlayProps {
  children: ReactNode
}

/**
 * Fixed UI wrapper for the Hero scene.
 * Sits above the Canvas with z-index 1.
 */
export function HeroOverlay({ children }: HeroOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24">
      {/* 
        pointer-events-none on wrapper to allow clicks to pass through to Canvas, 
        then re-enable pointer-events on the content 
      */}
      <div className="pointer-events-auto mx-auto w-full max-w-7xl">{children}</div>
    </div>
  )
}
