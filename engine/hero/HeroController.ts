/**
 * @file engine/hero/HeroController.ts
 * @description Orchestrates the Hero scene state logic.
 *
 * Subscribes to loader events and scroll events to drive the Hero state.
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { LoaderEvents } from '../loader/LoaderEvents'

import { HeroEvents } from './HeroEvents'
import {
  createInitialHeroState,
  isValidHeroTransition,
  type HeroPhase,
  type HeroStateValue,
} from './HeroState'

export interface HeroControllerCallbacks {
  onStateChange: (state: HeroStateValue) => void
  onPhaseChange: (phase: HeroPhase) => void
}

export class HeroController {
  private state: HeroStateValue = createInitialHeroState()
  private callbacks: HeroControllerCallbacks
  private cleanupFns: Array<() => void> = []

  constructor(callbacks: HeroControllerCallbacks) {
    this.callbacks = callbacks
  }

  public mount(): void {
    // Listen for loader completion
    const onLoaderHidden = () => {
      this.state = { ...this.state, isReady: true }
      this.callbacks.onStateChange(this.state)
      globalEventBus.emit(HeroEvents.HERO_READY as string, undefined)
      this.transition('entering')
      logger.info('[HeroController] Hero ready.')
    }

    const onScrollUpdate = (_payload: { scrollY: number; progress: number }) => {
      // We will map scroll progress locally in the component via ScrollTrigger,
      // but we could also track it here if we want global access.
      // For now, we rely on GSAP ScrollTrigger for precise scroll mapping.
    }

    globalEventBus.on(LoaderEvents.LOADER_HIDDEN as string, onLoaderHidden)
    globalEventBus.on('scroll:update', onScrollUpdate)

    this.cleanupFns.push(
      () => globalEventBus.off(LoaderEvents.LOADER_HIDDEN as string, onLoaderHidden),
      () => globalEventBus.off('scroll:update', onScrollUpdate),
    )

    // Safety fallback: if mounted after loader already hid, we should auto-trigger.
    // In a real robust system, we check a global state store.
    // Here we assume it mounts in parallel or we listen to AnimationProvider.

    logger.info('[HeroController] Mounted.')
  }

  /**
   * Forces the hero to the ready state.
   * Used by HeroHooks when isLoadComplete is already true but hero missed the event.
   */
  public forceReady(): void {
    if (this.state.isReady) return
    this.state = { ...this.state, isReady: true }
    this.callbacks.onStateChange(this.state)
    globalEventBus.emit(HeroEvents.HERO_READY as string, undefined)
    this.transition('entering')
    logger.info('[HeroController] forceReady() called.')
  }

  public markEntryComplete(): void {
    if (this.state.phase === 'entering') {
      this.transition('active')
    }
  }

  public setScrollProgress(progress: number): void {
    this.state = { ...this.state, scrollProgress: progress }
    this.callbacks.onStateChange(this.state)
    globalEventBus.emit(HeroEvents.HERO_SCROLL as string, { progress })

    if (progress > 0.99 && this.state.phase === 'active') {
      this.transition('exiting')
    } else if (progress < 0.99 && this.state.phase === 'exiting') {
      this.transition('active')
    }
  }

  public dispose(): void {
    this.cleanupFns.forEach((fn) => fn())
    this.cleanupFns = []
    logger.info('[HeroController] Disposed.')
  }

  public getState(): HeroStateValue {
    return { ...this.state }
  }

  private transition(to: HeroPhase): void {
    const from = this.state.phase
    if (!isValidHeroTransition(from, to)) {
      logger.warn(`[HeroController] Invalid transition: ${from} → ${to}`)
      return
    }

    this.state = { ...this.state, phase: to }
    this.callbacks.onPhaseChange(to)
    this.callbacks.onStateChange({ ...this.state })
    logger.debug(`[HeroController] Phase: ${from} → ${to}`)
  }
}
