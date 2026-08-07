/**
 * @file engine/scenes/Scene01Manager.ts
 * @description Engine lifecycle manager for Scene 01 — Atmosphere Transition (TR-01).
 *
 * Per 10_TransitionBlueprint.md (TR-01) and 09_BackgroundEvolution.md (BG-02):
 *   - Background transitions from #080808 → multi-stop atmosphere gradient → #F5F4F0
 *   - Blue atmosphere band peaks at ~50% of this section's scroll
 *   - Driven by GSAP ScrollTrigger with scrub: 1
 *   - No 3D canvas — purely a DOM/CSS transition layer
 *
 * Gradient stops (09_BackgroundEvolution.md BG-02):
 *   #080808 0% | #0a1040 15% | #0f2a80 30% | #1a5ec8 45%
 *   #4a9ae0 58% | #8ac8f0 70% | #c8e8f8 80% | #F5F4F0 100%
 *
 * Animation phases (08_TransitionFrames.md TR-01):
 *   0→0.4  : Black → Electric blue atmosphere
 *   0.4→0.7: Blue at peak (horizon visible)
 *   0.7→1.0: Blue fades, off-white resolves
 */

import { logger } from '@/lib/core'
import { gsap, ScrollTrigger } from '@/lib/gsap'

import { globalEventBus } from '../events'
import { type SceneLifecycle } from '../scene/SceneLifecycle'

// ─── Configuration ────────────────────────────────────────────────────────────

export const SCENE01_CSS_VARS = {
  atmoBandOpacity: '--scene01-atmo-opacity',
  lightProgress: '--scene01-light-progress',
} as const

/**
 * Reference-exact atmosphere gradient (09_BackgroundEvolution.md BG-02).
 * Used by the React component to render the gradient overlay.
 */
export const ATMOSPHERE_GRADIENT = [
  '#080808 0%',
  '#0a1040 15%',
  '#0f2a80 30%',
  '#1a5ec8 45%',
  '#4a9ae0 58%',
  '#8ac8f0 70%',
  '#c8e8f8 80%',
  '#F5F4F0 100%',
].join(', ')

/** Selector for the Hero globe canvas — faded out during atmosphere transition. */
const HERO_CANVAS_SELECTOR = '[data-hero-canvas]'

export class Scene01Manager implements SceneLifecycle {
  private triggerElement: HTMLElement | null = null
  private overlayElement: HTMLElement | null = null
  private gradientElement: HTMLElement | null = null
  private scrollTrigger: ScrollTrigger | null = null
  private timeline: gsap.core.Timeline | null = null
  private originalBodyBg = ''

  // ─── SceneLifecycle ──────────────────────────────────────────────────────────

  public async load(): Promise<void> {
    logger.info('[Scene01Manager] load()')
    return Promise.resolve()
  }

  public mount(): void {
    logger.info('[Scene01Manager] mount()')
    // Pin body background to space-black when this scene mounts
    this.originalBodyBg = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#080808'
  }

  public tick(_time: number, _delta: number): void {
    // ScrollTrigger handles all frame updates
  }

  public async enter(): Promise<void> {
    logger.info('[Scene01Manager] enter()')
    this.buildScrollTimeline()
    globalEventBus.emit('scene01:enter', undefined)
    return Promise.resolve()
  }

  public async exit(): Promise<void> {
    logger.info('[Scene01Manager] exit()')
    globalEventBus.emit('scene01:exit', undefined)
    this.destroyScrollTimeline()
    return Promise.resolve()
  }

  public unmount(): void {
    logger.info('[Scene01Manager] unmount()')
    this.destroyScrollTimeline()
    document.body.style.backgroundColor = this.originalBodyBg
    this.triggerElement = null
    this.overlayElement = null
    this.gradientElement = null
  }

  // ─── Public API ───────────────────────────────────────────────────────────────

  public setTriggerElement(el: HTMLElement | null): void {
    this.triggerElement = el
  }

  public setOverlayElement(el: HTMLElement | null): void {
    this.overlayElement = el
  }

  public setGradientElement(el: HTMLElement | null): void {
    this.gradientElement = el
  }

  /**
   * Builds the full reference-accurate scroll-driven atmosphere timeline.
   *
   * Phase 1 (0→0.4):   #080808 → electric blue atmosphere appears
   * Phase 2 (0.4→0.7): Blue held at peak (horizon visible)
   * Phase 3 (0.7→1.0): Blue fades, #F5F4F0 editorial resolves
   *
   * Parallel: body background color, hero canvas fade
   */
  public buildScrollTimeline(reducedMotion = false): void {
    this.destroyScrollTimeline()

    if (!this.triggerElement) {
      logger.warn('[Scene01Manager] buildScrollTimeline: no trigger element set.')
      return
    }

    const scrub = reducedMotion ? 0 : 1
    const proxy = { t: 0 }

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
        onLeave: () => {
          document.body.style.backgroundColor = '#F5F4F0'
        },
        onLeaveBack: () => {
          document.body.style.backgroundColor = '#080808'
        },
      },
    })

    // ── Atmosphere blue glow overlay ──────────────────────────────────────
    if (this.overlayElement) {
      this.timeline
        .addLabel('atmo-start', 0)
        .fromTo(
          this.overlayElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.in' },
          'atmo-start',
        )
        .addLabel('atmo-peak', 0.4)
        .addLabel('atmo-end', 0.7)
        .to(this.overlayElement, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'atmo-end')
    }

    // ── Full-frame atmosphere gradient (the 8-stop gradient) ──────────────
    if (this.gradientElement) {
      this.timeline
        .fromTo(
          this.gradientElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: 'none' },
          0,
        )
        .to(this.gradientElement, { opacity: 0, duration: 0.45, ease: 'power3.out' }, 0.55)
    }

    // ── Body background: #080808 → intermediate → #F5F4F0 ────────────────
    // Per BG-01→BG-03 in 09_BackgroundEvolution.md
    this.timeline.fromTo(
      proxy,
      { t: 0 },
      {
        t: 1,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          const t = proxy.t
          let r: number, g: number, b: number
          if (t < 0.4) {
            const f = t / 0.4
            r = Math.round(8 + (15 - 8) * f)
            g = Math.round(8 + (42 - 8) * f)
            b = Math.round(8 + (128 - 8) * f)
          } else if (t < 0.7) {
            const f = (t - 0.4) / 0.3
            r = Math.round(15 + (74 - 15) * f)
            g = Math.round(42 + (154 - 42) * f)
            b = Math.round(128 + (224 - 128) * f)
          } else {
            const f = (t - 0.7) / 0.3
            r = Math.round(74 + (245 - 74) * f)
            g = Math.round(154 + (244 - 154) * f)
            b = Math.round(224 + (240 - 224) * f)
          }
          document.body.style.backgroundColor = `rgb(${r},${g},${b})`
        },
      },
      0,
    )

    // ── Hero globe canvas fade-out ─────────────────────────────────────────
    // Per TR-01: globe fades as atmosphere transition begins
    if (typeof document !== 'undefined') {
      const heroCanvas = document.querySelector<HTMLElement>(HERO_CANVAS_SELECTOR)
      if (heroCanvas) {
        this.timeline.fromTo(
          heroCanvas,
          { opacity: 1 },
          { opacity: 0, duration: 0.6, ease: 'power2.inOut' },
          0.05,
        )
      }
    }

    this.scrollTrigger = ScrollTrigger.getById('scene01-atmosphere') ?? null
    logger.info('[Scene01Manager] Scroll timeline built.')
  }

  private destroyScrollTimeline(): void {
    this.scrollTrigger?.kill()
    this.scrollTrigger = null
    this.timeline?.kill()
    this.timeline = null
  }
}

// Singleton — one instance shared across React mounts/unmounts
export const scene01Manager = new Scene01Manager()
