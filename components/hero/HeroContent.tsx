'use client'

import { useEffect, useRef } from 'react'

import { buildHeroEntryTimeline } from '@/engine/hero/HeroAnimation'
import { useAnimation } from '@/providers/AnimationProvider'

import { HeroCTA, type HeroCTARefs } from './HeroCTA'
import { HeroHeadline, type HeroHeadlineRefs } from './HeroHeadline'
import { HeroSubheadline, type HeroSubheadlineRefs } from './HeroSubheadline'

interface HeroContentProps {
  isReady: boolean
  onEntryComplete: () => void
}

/**
 * Orchestrates the Hero UI overlay content and its GSAP entry animation.
 */
export function HeroContent({ isReady, onEntryComplete }: HeroContentProps) {
  const { motionPreferences, isGSAPReady } = useAnimation()
  const { reducedMotion } = motionPreferences

  const headlineRefs = useRef<HeroHeadlineRefs>({ words: [] })
  const subheadlineRefs = useRef<HeroSubheadlineRefs>({ eyebrow: null, bodyWords: [] })
  const ctaRefs = useRef<HeroCTARefs>({ buttons: [] })

  const playedRef = useRef(false)

  useEffect(() => {
    if (!isReady || !isGSAPReady || playedRef.current) return
    playedRef.current = true

    buildHeroEntryTimeline(
      {
        globeContainer: null, // Globe is animated independently in HeroCanvas or CSS
        eyebrow: subheadlineRefs.current.eyebrow,
        headlineWords: headlineRefs.current.words,
        bodyWords: subheadlineRefs.current.bodyWords,
        buttons: ctaRefs.current.buttons,
      },
      reducedMotion,
      onEntryComplete,
    )
  }, [isReady, isGSAPReady, reducedMotion, onEntryComplete])

  return (
    <div className="relative z-10 flex w-full max-w-[800px] flex-col gap-2 pt-20">
      <HeroSubheadline ref={subheadlineRefs} />
      <HeroHeadline ref={headlineRefs} />
      <HeroCTA ref={ctaRefs} />
    </div>
  )
}
