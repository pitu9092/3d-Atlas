'use client'

import { useEffect, useRef, useState } from 'react'

import type { LoaderStateValue } from '@/engine/loader/LoaderState'
import {
  animateCounter,
  animateProgressBar,
  buildExitTimeline,
  buildIntroTimeline,
  type IntroElements,
} from '@/engine/loader/LoaderTimeline'
import { useAnimation } from '@/providers/AnimationProvider'

import { LoaderBackground, type LoaderBackgroundRefs } from './LoaderBackground'
import { LoaderLogo, type LoaderLogoRefs } from './LoaderLogo'
import { LoaderOverlay } from './LoaderOverlay'
import { LoaderParticles } from './LoaderParticles'
import { LoaderProgress, type LoaderProgressRefs } from './LoaderProgress'
import { LoaderStatus } from './LoaderStatus'

interface LoaderAnimationProps {
  state: LoaderStateValue
  onExitComplete: () => void
}

/**
 * Orchestrates GSAP animations for the loader elements.
 * Connects the UI refs to the engine's LoaderTimeline.
 */
export function LoaderAnimation({ state, onExitComplete }: LoaderAnimationProps) {
  const { motionPreferences, isGSAPReady } = useAnimation()
  const { reducedMotion } = motionPreferences

  // ── Refs ─────────────────────────────────────────────────────────────
  const overlayRef = useRef<HTMLDivElement>(null)
  const bgRefs = useRef<LoaderBackgroundRefs>({ bg: null, glow: null, grid: null })
  const particlesRef = useRef<HTMLDivElement>(null)
  const logoRefs = useRef<LoaderLogoRefs>({ container: null, text: null })
  const progressRefs = useRef<LoaderProgressRefs>({ container: null, bar: null })
  const statusRef = useRef<HTMLDivElement>(null)

  // ── Local State for Smoothed Progress ────────────────────────────────
  const [smoothedPercent, setSmoothedPercent] = useState(0)

  // Track previous progress to animate from
  const prevProgressRef = useRef(0)

  // ── 1. Intro Animation (runs once when GSAP is ready) ───────────────
  const introPlayedRef = useRef(false)

  useEffect(() => {
    if (!isGSAPReady || introPlayedRef.current) return
    introPlayedRef.current = true

    const els: IntroElements = {
      overlay: overlayRef.current,
      background: bgRefs.current.bg,
      grid: bgRefs.current.grid,
      glow: bgRefs.current.glow,
      logo: logoRefs.current.container,
      logoText: logoRefs.current.text,
      progress: progressRefs.current.container,
      progressBar: progressRefs.current.bar,
      status: statusRef.current,
      particles: particlesRef.current,
    }

    buildIntroTimeline(els, reducedMotion)
  }, [isGSAPReady, reducedMotion])

  // ── 2. Progress Animation (runs when state.progress updates) ─────────
  useEffect(() => {
    if (!isGSAPReady || state.progress === prevProgressRef.current) return

    const targetPercent = Math.round(state.progress * 100)
    const prevPercent = Math.round(prevProgressRef.current * 100)

    // Animate the bar scaleX
    animateProgressBar(progressRefs.current.bar, state.progress, reducedMotion)

    // Animate the numeric counter
    if (targetPercent !== prevPercent) {
      animateCounter(setSmoothedPercent, prevPercent, targetPercent, reducedMotion)
    }

    prevProgressRef.current = state.progress
  }, [isGSAPReady, state.progress, reducedMotion])

  // ── 3. Exit Animation (runs when phase changes to 'complete') ───────
  const exitPlayedRef = useRef(false)

  useEffect(() => {
    if (!isGSAPReady || state.phase !== 'complete' || exitPlayedRef.current) return
    exitPlayedRef.current = true

    // Note: The main content is outside the loader, so we just animate the overlay
    // to fade/scale out and then trigger onExitComplete.
    buildExitTimeline(
      { overlay: overlayRef.current, content: null }, // content handled by global app logic if needed
      reducedMotion,
      onExitComplete,
    )
  }, [isGSAPReady, state.phase, reducedMotion, onExitComplete])

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="absolute inset-0 z-[var(--z-loader)] h-full w-full" ref={overlayRef}>
      <LoaderOverlay>
        <LoaderBackground ref={bgRefs} />
        <LoaderParticles ref={particlesRef} />

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center">
          <LoaderLogo ref={logoRefs} />

          <LoaderProgress percent={smoothedPercent} progress={state.progress} ref={progressRefs} />

          <LoaderStatus currentItem={state.currentItem} phase={state.phase} ref={statusRef} />
        </div>
      </LoaderOverlay>
    </div>
  )
}
