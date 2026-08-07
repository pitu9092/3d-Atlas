/**
 * @file components/scenes/scene01/Scene01Controller.ts
 * @description React-side controller for Scene 01 state management.
 *
 * Listens to globalEventBus 'scene01:progress' to sync state.
 */

import { globalEventBus } from '@/engine/events'
import { logger } from '@/lib/core'

import {
  createInitialScene01State,
  type Scene01Phase,
  type Scene01StateValue,
} from './Scene01State'

export interface Scene01ControllerCallbacks {
  onStateChange: (state: Scene01StateValue) => void
}

export class Scene01Controller {
  private state: Scene01StateValue = createInitialScene01State()
  private callbacks: Scene01ControllerCallbacks
  private cleanupFns: Array<() => void> = []

  constructor(callbacks: Scene01ControllerCallbacks) {
    this.callbacks = callbacks
  }

  public mount(): void {
    const onProgress = (payload: { progress: number }) => {
      this.setProgress(payload.progress)
    }

    const onEnter = () => {
      this.setPhase('entering')
    }

    const onExit = () => {
      this.setPhase('exiting')
    }

    globalEventBus.on('scene01:progress', onProgress)
    globalEventBus.on('scene01:enter', onEnter)
    globalEventBus.on('scene01:exit', onExit)

    this.cleanupFns.push(
      () => globalEventBus.off('scene01:progress', onProgress),
      () => globalEventBus.off('scene01:enter', onEnter),
      () => globalEventBus.off('scene01:exit', onExit),
    )

    logger.info('[Scene01Controller] Mounted.')
  }

  public setInitialized(): void {
    this.state = { ...this.state, isInitialized: true }
    this.setPhase('active')
    this.callbacks.onStateChange({ ...this.state })
  }

  public dispose(): void {
    this.cleanupFns.forEach((fn) => fn())
    this.cleanupFns = []
    logger.info('[Scene01Controller] Disposed.')
  }

  public getState(): Scene01StateValue {
    return { ...this.state }
  }

  private setProgress(progress: number): void {
    this.state = { ...this.state, progress }
    if (progress > 0 && progress < 1 && this.state.phase !== 'active') {
      this.setPhase('active')
    }
    this.callbacks.onStateChange({ ...this.state })
  }

  private setPhase(phase: Scene01Phase): void {
    this.state = { ...this.state, phase }
    this.callbacks.onStateChange({ ...this.state })
    logger.debug(`[Scene01Controller] Phase: ${phase}`)
  }
}
