/**
 * @file engine/loader/LoaderHooks.ts
 * @description React hooks connecting the cinematic loader UI to the Engine.
 *
 * Purpose: Bridges the headless `LoaderController` to React state.
 * Responsibilities:
 *   - Instantiates the LoaderController on mount.
 *   - Synchronizes LoaderStateValue to React state.
 *   - Handles component unmount / engine dispose.
 */

import { useEffect, useState, useMemo } from 'react'

import { LoaderController } from './LoaderController'
import { createInitialLoaderState, type LoaderStateValue } from './LoaderState'

/**
 * Hook to manage the cinematic loader lifecycle.
 * @returns The current LoaderStateValue, an `onExitComplete` callback to be fired
 *          by the GSAP exit timeline, and the controller instance.
 */
export function useLoaderController() {
  const [state, setState] = useState<LoaderStateValue>(createInitialLoaderState())

  // Keep controller instance stable across renders
  const controller = useMemo(() => {
    return new LoaderController({
      onStateChange: (newState) => setState(newState),
      onPhaseChange: (_phase) => {
        // Additional phase-specific logic could go here if needed
      },
      onComplete: () => {
        // Fired when loading is 100% and min display time is reached.
        // The Loader UI component observes `state.phase === 'complete'` to trigger the exit timeline.
      },
    })
  }, [])

  // Mount the controller on component mount
  useEffect(() => {
    controller.mount()

    return () => {
      controller.dispose()
    }
  }, [controller])

  const onExitComplete = () => {
    controller.onExitComplete()
  }

  return { state, onExitComplete, controller }
}
