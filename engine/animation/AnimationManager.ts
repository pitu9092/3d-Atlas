/**
 * @file engine/animation/AnimationManager.ts
 * @description Architecture shell for the GSAP animation system.
 *
 * Purpose: Manages global animation state, registry, and configuration.
 * Responsibilities: Initialization of GSAP plugins, applying reduced motion
 * overrides, and coordinating global timeline pausing/resuming.
 */

import { logger } from '@/lib/core'
import { featureFlags } from '@/lib/core/featureFlags'

import { type EngineManager, type LifecycleState } from '../shared/EngineTypes'

import { type AnimationState } from './AnimationState'
import { TimelineRegistry } from './TimelineRegistry'

export class AnimationManager implements EngineManager {
  public state: LifecycleState = 'uninitialized'

  public readonly registry: TimelineRegistry

  private animationState: AnimationState = {
    isGSAPReady: false,
    isReducedMotion: false,
    globalTimeScale: 1.0,
    activeTimelines: 0,
  }

  constructor() {
    this.registry = new TimelineRegistry()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // Check OS reduced motion preference + feature flag override
    const mql =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false }
    this.animationState.isReducedMotion = mql.matches || featureFlags.forceReducedMotion

    // TODO: Initialize GSAP plugins using config/gsap.ts
    // TODO: Apply global GSAP defaults

    if (this.animationState.isReducedMotion) {
      logger.info('Reduced motion enabled. Setting global timescale or replacing tweens.')
      // TODO: GSAP global timeScale or replace timelines
    }

    this.animationState.isGSAPReady = true
    this.state = 'ready'
    logger.info('AnimationManager initialized (GSAP ready for implementation)')
  }

  /**
   * Sets the global time scale for all animations (slow-mo, fast-forward).
   */
  public setGlobalTimeScale(scale: number): void {
    this.animationState.globalTimeScale = scale
    // TODO: gsap.globalTimeline.timeScale(scale)
  }

  public getState(): AnimationState {
    return {
      ...this.animationState,
      activeTimelines: this.registry.count,
    }
  }

  public dispose(): void {
    this.registry.clear()
    this.state = 'destroyed'
  }
}
