/**
 * @file engine/scroll/ScrollManager.ts
 * @description Architecture shell for the smooth scrolling system.
 *
 * Purpose: Manages global scroll state and coordinates Lenis integration.
 * Responsibilities: Tracking scroll position, exposing subscription methods,
 * emitting global scroll events.
 */

import Lenis from 'lenis'

import { lenisConfig } from '@/config/lenis'
import { logger } from '@/lib/core'
import { gsap } from '@/lib/gsap'

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

  private _lenisInstance: Lenis | null = null

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    this._lenisInstance = new Lenis({
      duration: lenisConfig.duration,
      easing: lenisConfig.easing,
      smoothWheel: lenisConfig.smoothWheel,
      touchMultiplier: lenisConfig.touchMultiplier,
      infinite: lenisConfig.infinite,
    })

    this._lenisInstance.on('scroll', (e: Lenis) => {
      this.updateState({
        scrollY: e.scroll,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
        isScrolling: e.velocity !== 0,
      })
    })

    // Bind to GSAP Ticker to keep animations and scroll perfectly synced
    if (lenisConfig.syncStrategy === 'gsap-ticker') {
      gsap.ticker.add(this.onGsapTick)
    }

    logger.info('ScrollManager initialized with Lenis')

    this.state = 'running'
  }

  private onGsapTick = (time: number, _deltaTime: number, _frame: number): void => {
    if (this.state === 'running' && this._lenisInstance) {
      // Lenis expects ms time
      this._lenisInstance.raf(time * 1000)
    }
  }

  /**
   * Called by the global render loop to drive scroll physics if not using GSAP ticker.
   */
  public tick(_time: number): void {
    if (this.state !== 'running') return

    if (lenisConfig.syncStrategy !== 'gsap-ticker' && this._lenisInstance) {
      this._lenisInstance.raf(_time)
    }

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
    if (this._lenisInstance) {
      this._lenisInstance.scrollTo(target, _options)
    }
    logger.debug(`Scrolling to ${target}`)
  }

  public dispose(): void {
    if (lenisConfig.syncStrategy === 'gsap-ticker') {
      gsap.ticker.remove(this.onGsapTick)
    }

    if (this._lenisInstance) {
      this._lenisInstance.destroy()
      this._lenisInstance = null
    }
    this.subscribers.clear()
    this.state = 'destroyed'
  }
}
