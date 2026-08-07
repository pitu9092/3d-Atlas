'use client'

import { useEffect } from 'react'

import { useLoaderController } from '@/engine/loader/LoaderHooks'
import { useAnimation } from '@/providers/AnimationProvider'

import { LoaderAnimation } from './LoaderAnimation'

/**
 * Root cinematic loader component.
 * Manages the state machine (via useLoaderController) and mounts the GSAP orchestrator.
 * When the exit animation completes and phase becomes 'hidden', it unmounts itself.
 */
export function Loader() {
  const { state, onExitComplete } = useLoaderController()
  const { setLoadComplete } = useAnimation()

  // Notify AnimationProvider when loader is fully done and hidden
  useEffect(() => {
    if (state.phase === 'hidden') {
      setLoadComplete(true)
    }
  }, [state.phase, setLoadComplete])

  // Unmount entirely once hidden
  if (state.phase === 'hidden') {
    return null
  }

  return <LoaderAnimation state={state} onExitComplete={onExitComplete} />
}
