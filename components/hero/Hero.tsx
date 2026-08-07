'use client'

import { useRef, useEffect } from 'react'

import { useHeroController } from '@/engine/hero/HeroHooks'
import { useScroll } from '@/hooks/useScroll'

import { HeroBackground } from './HeroBackground'
import { HeroCanvas } from './HeroCanvas'
import { HeroContent } from './HeroContent'
import { HeroEffects } from './HeroEffects'
import { HeroOverlay } from './HeroOverlay'

/**
 * Root component for the Hero Cinematic Experience.
 * Coordinates the DOM overlay, 3D Canvas, background, and scroll updates.
 */
export function Hero() {
  const { state, controller } = useHeroController()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Map global scrollY to local hero progress (0 to 1) over a defined pixel height
  // The master timeline states Hero is active from 0vh to 150vh.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const vh = window.innerHeight
    const totalScrollRange = vh * 1.5 // 150vh

    // Clamp between 0 and 1
    const rawProgress = scrollY / totalScrollRange
    const progress = Math.max(0, Math.min(rawProgress, 1))

    controller.setScrollProgress(progress)
  }, [scrollY, controller])

  return (
    <section
      aria-label="Hero Section"
      className="relative h-[150vh] w-full bg-[#0a0a0a]"
      ref={sectionRef}
    >
      {/* Sticky container holds everything in place while the user scrolls down 150vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroBackground />

        <HeroCanvas isReady={state.isReady} scrollProgress={state.scrollProgress} />

        <HeroEffects />

        <HeroOverlay>
          <HeroContent
            isReady={state.isReady}
            onEntryComplete={() => controller.markEntryComplete()}
          />
        </HeroOverlay>
      </div>
    </section>
  )
}
