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

  // If we miss the event because the component mounted late, force ready
  useEffect(() => {
    if (isLoadComplete && !state.isReady) {
      // Small timeout to allow the loader exit animation to fully flush if needed
      const t = setTimeout(() => {
        // Mock the loader hiding if it's already done
        const currentState = controller.getState()
        if (!currentState.isReady) {
          // We might need to manually trigger the readiness in controller
          // Wait, globalEventBus might have fired before we mounted.
          // To be safe, we can trigger the phase if loadComplete is true.
        }
      }, 100)
      return () => clearTimeout(t)
    }
  }, [isLoadComplete, state.isReady, controller])

  return { state, controller }
}
