/**
 * @file engine/scroll/ScrollManager.ts
 * @description Architecture shell for the smooth scrolling system.
 *
 * Purpose: Manages global scroll state and coordinates Lenis integration.
 * Responsibilities: Tracking scroll position, exposing subscription methods,
 * emitting global scroll events.
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { type EngineManager, type LifecycleState, type Tickable } from '../shared/EngineTypes'

import { type ScrollCallback, type ScrollObservable } from './ScrollEvents'
import { type ScrollState } from './ScrollState'

export class ScrollManager implements EngineManager, Tickable, ScrollObservable {
  public state: LifecycleState = 'uninitialized'

  private scrollState: ScrollState = {
    scrollY: 0,
    scrollX: 0,
    direction: 0,
    progress: 0,
    velocity: 0,
    isScrolling: false,
  }

  private subscribers: Set<ScrollCallback> = new Set()

  // Note: Lenis instance will be injected or initialized here during implementation

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // TODO: Initialize Lenis instance using config/lenis.ts
    logger.info('ScrollManager initialized (Lenis ready for implementation)')

    this.state = 'running'
  }

  /**
   * Called by the global render loop to drive scroll physics.
   */
  public tick(_time: number): void {
    if (this.state !== 'running') return

    // TODO: lenisInstance?.raf(time)

    // Notify local subscribers (high frequency)
    if (this.scrollState.isScrolling) {
      this.subscribers.forEach((callback) => callback(this.scrollState))
    }
  }

  /**
   * Internal update method called by Lenis callback.
   */
  public updateState(newState: Partial<ScrollState>): void {
    this.scrollState = { ...this.scrollState, ...newState }

    // Emit global event (lower frequency/debounced usually, but mapped here for architecture)
    globalEventBus.emit('scroll:update', {
      scrollY: this.scrollState.scrollY,
      progress: this.scrollState.progress,
      velocity: this.scrollState.velocity,
      direction: this.scrollState.direction,
    })
  }

  public getState(): ScrollState {
    return { ...this.scrollState }
  }

  /**
   * Subscribe to high-frequency scroll updates.
   */
  public onScroll(callback: ScrollCallback): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  /**
   * Imperatively scroll to a target.
   */
  public scrollTo(target: string | HTMLElement, _options: Record<string, unknown> = {}): void {
    // TODO: lenisInstance?.scrollTo(target, options)
    logger.debug(`Scrolling to ${target}`)
  }

  public dispose(): void {
    // TODO: lenisInstance?.destroy()
    this.subscribers.clear()
    this.state = 'destroyed'
  }
}
