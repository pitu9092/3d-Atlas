/**
 * @file engine/animation/AnimationManager.ts
 * @description GSAP animation system manager.
 *
 * Purpose: Manages global animation state, plugin registration (once), reduced-motion
 * support, matchMedia breakpoints, and timeline registry coordination.
 *
 * Responsibilities:
 *   - Detect OS prefers-reduced-motion and apply global GSAP timescale
 *   - Listen for real-time media query changes (user changes OS setting mid-session)
 *   - Expose pause() / resume() to halt all GSAP timelines globally
 *   - Expose matchMedia context for responsive animations
 *   - Manage TimelineRegistry lifecycle
 */

import { logger } from '@/lib/core'
import { featureFlags } from '@/lib/core/featureFlags'
import { gsap, ScrollTrigger } from '@/lib/gsap'

import { type EngineManager, type LifecycleState } from '../shared/EngineTypes'

import { type AnimationState } from './AnimationState'
import { TimelineRegistry } from './TimelineRegistry'

export class AnimationManager implements EngineManager {
  public state: LifecycleState = 'uninitialized'

  public readonly registry: TimelineRegistry

  /** GSAP MatchMedia context for responsive animations. */
  public readonly mm: gsap.MatchMedia = gsap.matchMedia()

  private animationState: AnimationState = {
    isGSAPReady: false,
    isReducedMotion: false,
    globalTimeScale: 1.0,
    activeTimelines: 0,
  }

  /**
   * Media query list for reduced motion preference.
   * Kept as a class field so we can remove the listener on dispose.
   */
  private reducedMotionMql: MediaQueryList | null = null
  private onReducedMotionChange: ((e: MediaQueryListEvent) => void) | null = null

  constructor() {
    this.registry = new TimelineRegistry()
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // ── Reduced motion detection ─────────────────────────────────────────
    if (typeof window !== 'undefined') {
      this.reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
      this.animationState.isReducedMotion =
        this.reducedMotionMql.matches || featureFlags.forceReducedMotion

      // Listen for OS-level changes mid-session
      this.onReducedMotionChange = (e: MediaQueryListEvent) => {
        const reduced = e.matches || featureFlags.forceReducedMotion
        this.animationState.isReducedMotion = reduced
        this.applyReducedMotion(reduced)
        logger.info(`[AnimationManager] Reduced motion changed: ${reduced}`)
      }

      this.reducedMotionMql.addEventListener('change', this.onReducedMotionChange)
    } else {
      // SSR — no reduced motion detection
      this.animationState.isReducedMotion = featureFlags.forceReducedMotion
    }

    this.applyReducedMotion(this.animationState.isReducedMotion)

    this.animationState.isGSAPReady = true
    this.state = 'ready'
    logger.info(
      `AnimationManager initialized. ReducedMotion: ${this.animationState.isReducedMotion}`,
    )
  }

  /**
   * Called by EngineRuntime each frame.
   * GSAP drives itself via its own ticker — this is a contract stub.
   */
  public update(_delta: number): void {
    // GSAP self-ticks via gsap.ticker; nothing to do here.
  }

  /**
   * Pauses all GSAP animations globally.
   * Equivalent to stopping the global timeline.
   */
  public pause(): void {
    if (this.state === 'paused') return
    gsap.globalTimeline.pause()
    ScrollTrigger.getAll().forEach((st) => st.disable())
    this.state = 'paused'
    logger.info('[AnimationManager] Paused all GSAP animations')
  }

  /**
   * Resumes all GSAP animations globally.
   */
  public resume(): void {
    if (this.state !== 'paused') return
    gsap.globalTimeline.resume()
    ScrollTrigger.getAll().forEach((st) => st.enable())
    this.state = 'running'
    logger.info('[AnimationManager] Resumed all GSAP animations')
  }

  /** No-op — animation system is not affected by viewport changes. */
  public resize(_width: number, _height: number, _pixelRatio: number): void {
    // ScrollTrigger refreshes itself via its ResizeObserver integration.
    ScrollTrigger.refresh()
  }

  public dispose(): void {
    // ── Remove media query listener ──────────────────────────────────────
    if (this.reducedMotionMql && this.onReducedMotionChange) {
      this.reducedMotionMql.removeEventListener('change', this.onReducedMotionChange)
    }

    // ── Kill matchMedia context ──────────────────────────────────────────
    this.mm.revert()

    // ── Kill all registered timelines ───────────────────────────────────
    this.registry.clear()

    // ── Kill all ScrollTrigger instances ────────────────────────────────
    ScrollTrigger.getAll().forEach((st) => st.kill())

    this.state = 'destroyed'
    logger.info('[AnimationManager] Disposed')
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Sets the global time scale for all GSAP animations.
   * 0 = frozen, 1 = normal, 2 = 2× speed.
   */
  public setGlobalTimeScale(scale: number): void {
    this.animationState.globalTimeScale = scale
    gsap.globalTimeline.timeScale(scale)
  }

  public getState(): AnimationState {
    return {
      ...this.animationState,
      activeTimelines: this.registry.count,
    }
  }

  public get isReducedMotion(): boolean {
    return this.animationState.isReducedMotion
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private applyReducedMotion(reduced: boolean): void {
    if (reduced) {
      // Jump all animations to their end state instantly
      gsap.globalTimeline.timeScale(1000)
    } else {
      // Restore to user-defined time scale
      gsap.globalTimeline.timeScale(this.animationState.globalTimeScale)
    }
  }
}
