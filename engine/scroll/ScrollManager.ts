/**
 * @file engine/scroll/ScrollManager.ts
 * @description Smooth scroll engine built on Lenis.
 *
 * Purpose: Manages global scroll state and coordinates Lenis + GSAP integration.
 * Responsibilities:
 *   - Single Lenis instance driven by GSAP ticker
 *   - Exposing scroll state (position, velocity, direction, progress)
 *   - Subscription system for high-frequency scroll callbacks
 *   - Pause / resume (lenis.stop / lenis.start)
 *   - Resize refresh (ScrollTrigger.refresh)
 *   - Tick-safe cleanup on dispose
 */

import Lenis from 'lenis'

import { lenisConfig } from '@/config/lenis'
import { logger } from '@/lib/core'
import { gsap, ScrollTrigger } from '@/lib/gsap'

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

  /** High-frequency per-scroll-update subscribers. */
  private subscribers: Set<ScrollCallback> = new Set()

  private _lenisInstance: Lenis | null = null

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

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

    // ── Scroll event handler ───────────────────────────────────────────────
    this._lenisInstance.on('scroll', (e: Lenis) => {
      this.updateState({
        scrollY: e.scroll,
        velocity: e.velocity,
        direction: e.direction as 1 | -1 | 0,
        progress: e.progress,
        isScrolling: e.velocity !== 0,
      })
    })

    // ── GSAP Ticker synchronisation ───────────────────────────────────────
    // Using GSAP's ticker as the single RAF loop.
    // lagSmoothing(0) ensures Lenis never gets huge time jumps.
    if (lenisConfig.syncStrategy === 'gsap-ticker') {
      gsap.ticker.add(this.onGsapTick)
      gsap.ticker.lagSmoothing(0)
    }

    // ── ScrollTrigger integration ─────────────────────────────────────────
    this._lenisInstance.on('scroll', ScrollTrigger.update)

    logger.info('ScrollManager initialized with Lenis + GSAP ticker')
    this.state = 'running'
  }

  public update(_delta: number): void {
    // Lenis drives itself via the GSAP ticker callback.
    // Notify local subscribers when scrolling (high frequency).
    if (this.scrollState.isScrolling) {
      this.subscribers.forEach((cb) => cb(this.scrollState))
    }
  }

  /**
   * Pauses smooth scroll (Lenis stops processing input).
   */
  public pause(): void {
    if (this.state !== 'running') return
    this._lenisInstance?.stop()
    this.state = 'paused'
    logger.info('[ScrollManager] Paused')
  }

  /**
   * Resumes smooth scroll.
   */
  public resume(): void {
    if (this.state !== 'paused') return
    this._lenisInstance?.start()
    this.state = 'running'
    logger.info('[ScrollManager] Resumed')
  }

  /**
   * Refreshes all ScrollTrigger instances after layout changes or orientation change.
   */
  public resize(_width: number, _height: number, _pixelRatio: number): void {
    ScrollTrigger.refresh()
  }

  public dispose(): void {
    // ── Remove GSAP ticker ────────────────────────────────────────────────
    if (lenisConfig.syncStrategy === 'gsap-ticker') {
      gsap.ticker.remove(this.onGsapTick)
    }

    // ── Destroy Lenis ─────────────────────────────────────────────────────
    if (this._lenisInstance) {
      this._lenisInstance.destroy()
      this._lenisInstance = null
    }

    this.subscribers.clear()
    this.state = 'destroyed'
    logger.info('[ScrollManager] Disposed')
  }

  // ─── Tickable ─────────────────────────────────────────────────────────────

  /**
   * Called every frame by EngineRuntime if NOT using GSAP-ticker strategy.
   */
  public tick(time: number, _delta: number, _frame: number): void {
    if (this.state !== 'running') return

    if (lenisConfig.syncStrategy !== 'gsap-ticker' && this._lenisInstance) {
      this._lenisInstance.raf(time)
    }

    if (this.scrollState.isScrolling) {
      this.subscribers.forEach((cb) => cb(this.scrollState))
    }
  }

  // ─── ScrollObservable ─────────────────────────────────────────────────────

  /**
   * Subscribe to high-frequency scroll updates.
   * Returns an unsubscribe function.
   */
  public onScroll(callback: ScrollCallback): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Imperatively scroll to a target element or position.
   */
  public scrollTo(target: string | HTMLElement | number, options: object = {}): void {
    if (this._lenisInstance) {
      this._lenisInstance.scrollTo(target as string | HTMLElement, options)
    }
  }

  public getState(): ScrollState {
    return { ...this.scrollState }
  }

  public getLenis(): Lenis | null {
    return this._lenisInstance
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private onGsapTick = (time: number): void => {
    if (this.state === 'running' && this._lenisInstance) {
      // GSAP ticker provides time in seconds; Lenis expects milliseconds.
      this._lenisInstance.raf(time * 1000)
    }
  }

  public updateState(newState: Partial<ScrollState>): void {
    this.scrollState = { ...this.scrollState, ...newState }

    globalEventBus.emit('scroll:update', {
      scrollY: this.scrollState.scrollY,
      progress: this.scrollState.progress,
      velocity: this.scrollState.velocity,
      direction: this.scrollState.direction,
    })
  }
}
