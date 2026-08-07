/**
 * @file engine/scenes/Scene01Manager.ts
 * @description Engine lifecycle manager for Scene 01 — Atmosphere Transition.
 *
 * Scene 01 is the cinematic bridge between the Hero Globe section and the
 * Editorial Brand Statement. It lives at scroll range 150vh–200vh.
 *
 * Per the 02_SceneMap.md and 03_GSAPBlueprint.md:
 *   - Background transitions from deep black → electric blue band → off-white
 *   - Driven by GSAP ScrollTrigger with scrub
 *   - No 3D canvas — purely a DOM/CSS transition layer
 *   - The atmosphere overlay div is the key visual element
 *
 * This class implements SceneLifecycle and can be registered with SceneManager.
 */

import { logger } from '@/lib/core'
import { gsap, ScrollTrigger } from '@/lib/gsap'

import { globalEventBus } from '../events'
import { type SceneLifecycle } from '../scene/SceneLifecycle'

// ─── Scene Configuration (sourced from reference docs, not magic numbers) ─────

/** CSS custom property names used by the Scene 01 gradient overlay. */
export const SCENE01_CSS_VARS = {
  /** The atmosphere midband color, interpolated from black → blue → transparent */
  atmoBandOpacity: '--scene01-atmo-opacity',
  /** The final off-white background reveal progress */
  lightProgress: '--scene01-light-progress',
} as const

export class Scene01Manager implements SceneLifecycle {
  /** The sentinel trigger element for ScrollTrigger (must be set before load). */
  private triggerElement: HTMLElement | null = null

  /** The atmosphere overlay DOM element (set by React component). */
  private overlayElement: HTMLElement | null = null

  /** The GSAP ScrollTrigger instance for the atmosphere timeline. */
  private scrollTrigger: ScrollTrigger | null = null

  /** The GSAP timeline controlling atmosphere color transition. */
  private timeline: gsap.core.Timeline | null = null

  // ─── SceneLifecycle ──────────────────────────────────────────────────────────

  /**
   * Called by SceneManager before mount.
   * Scene 01 has no async assets to load; resolves immediately.
   */
  public async load(): Promise<void> {
    logger.info('[Scene01Manager] load()')
    // No async assets for this scene
    return Promise.resolve()
  }

  /**
   * Called by SceneManager to mount scene DOM/logic.
   * The React component sets trigger/overlay elements before this runs.
   */
  public mount(): void {
    logger.info('[Scene01Manager] mount()')
  }

  /**
   * Per-frame tick — Scene 01 is scroll-driven via ScrollTrigger,
   * so the tick is a no-op (GSAP manages updates via its own ticker).
   */
  public tick(_time: number, _delta: number): void {
    // ScrollTrigger handles all frame updates for this scene
  }

  /**
   * Animates scene into view.
   * Builds the scroll-driven atmosphere timeline via ScrollTrigger.
   */
  public async enter(): Promise<void> {
    logger.info('[Scene01Manager] enter() — building atmosphere timeline')
    this.buildScrollTimeline()
    globalEventBus.emit('scene01:enter', undefined)
    return Promise.resolve()
  }

  /**
   * Animates scene out. Kills the scroll timeline.
   */
  public async exit(): Promise<void> {
    logger.info('[Scene01Manager] exit()')
    globalEventBus.emit('scene01:exit', undefined)
    this.destroyScrollTimeline()
    return Promise.resolve()
  }

  /**
   * Fully cleans up all resources, timelines, and event listeners.
   */
  public unmount(): void {
    logger.info('[Scene01Manager] unmount()')
    this.destroyScrollTimeline()
    this.triggerElement = null
    this.overlayElement = null
  }

  // ─── Public API (called by React component) ───────────────────────────────────

  /**
   * Registers the trigger element used by ScrollTrigger.
   * Must be called by the React component during mount (useEffect).
   */
  public setTriggerElement(el: HTMLElement | null): void {
    this.triggerElement = el
  }

  /**
   * Registers the atmosphere overlay element targeted by the GSAP tween.
   */
  public setOverlayElement(el: HTMLElement | null): void {
    this.overlayElement = el
  }

  /**
   * Lazily builds (or rebuilds) the scroll-driven atmosphere timeline.
   * Safe to call multiple times — kills previous instance first.
   */
  public buildScrollTimeline(reducedMotion = false): void {
    this.destroyScrollTimeline()

    if (!this.triggerElement) {
      logger.warn('[Scene01Manager] buildScrollTimeline: no trigger element set.')
      return
    }

    const scrub = reducedMotion ? false : 1

    // ── Main atmosphere gradient timeline ──────────────────────────────────
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.triggerElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub,
        id: 'scene01-atmosphere',
        onUpdate: (self) => {
          globalEventBus.emit('scene01:progress', { progress: self.progress })
        },
      },
    })

    // Phase 1 (0→0.4 progress): Black → Electric blue band
    // Phase 2 (0.4→0.7 progress): Blue band peaks
    // Phase 3 (0.7→1.0 progress): Blue → off-white reveal
    if (this.overlayElement) {
      this.timeline
        .addLabel('atmo-start', 0)
        .fromTo(
          this.overlayElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'none' },
          'atmo-start',
        )
        .addLabel('atmo-peak', 0.4)
        .to(this.overlayElement, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 'atmo-peak')
    }

    this.scrollTrigger = ScrollTrigger.getById('scene01-atmosphere') ?? null
    logger.info('[Scene01Manager] Scroll timeline built.')
  }

  /** Kills and nullifies the current scroll timeline. */
  private destroyScrollTimeline(): void {
    this.scrollTrigger?.kill()
    this.scrollTrigger = null
    this.timeline?.kill()
    this.timeline = null
  }
}

// Singleton — one instance shared across React mounts/unmounts
export const scene01Manager = new Scene01Manager()
