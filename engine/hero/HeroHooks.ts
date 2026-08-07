/**
 * @file engine/hero/HeroHooks.ts
 * @description React hooks connecting the Hero UI to the Engine controller.
 */

import { useEffect, useState, useMemo } from 'react'

import { useAnimation } from '@/providers/AnimationProvider'

import { HeroController } from './HeroController'
import { createInitialHeroState, type HeroStateValue } from './HeroState'

export function useHeroController() {
  const [state, setState] = useState<HeroStateValue>(createInitialHeroState())
  const { isLoadComplete } = useAnimation()

  const controller = useMemo(() => {
    return new HeroController({
      onStateChange: (newState) => setState(newState),
      onPhaseChange: () => {},
    })
  }, [])

  useEffect(() => {
    controller.mount()
    return () => {
      controller.dispose()
    }
  }, [controller])

  // Fallback: if the hero component mounted AFTER loader:hidden was emitted
  // (race condition — event already fired), force the ready state now.
  useEffect(() => {
    if (isLoadComplete && !state.isReady) {
      // Small delay to allow GSAP to settle after the loader exit animation
      const t = setTimeout(() => {
        controller.forceReady()
      }, 150)
      return () => clearTimeout(t)
    }
  }, [isLoadComplete, state.isReady, controller])

  return { state, controller }
}
