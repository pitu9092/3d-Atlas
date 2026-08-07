/**
 * @file engine/loader/LoaderTimeline.ts
 * @description GSAP timeline factory for all cinematic loader animations.
 *
 * Purpose: Centralizes all GSAP animation definitions for the loader sequence.
 * Responsibilities:
 *   - `buildIntroTimeline()`: initial reveal of logo, grid, particles, progress
 *   - `buildProgressTimeline()`: smooth progress bar animation
 *   - `buildExitTimeline()`: exit: blur content, scale down, fade out overlay
 *
 * All timelines use existing design tokens (easings, durations) from globals.css.
 * Reduced motion: all durations collapse to 0 when reducedMotion = true.
 */

import gsap from 'gsap'

// ─── Duration multiplier ──────────────────────────────────────────────────────

/** When reducedMotion is true, all durations collapse to 0. */
function dur(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : ms / 1000
}

// ─── Intro Timeline ───────────────────────────────────────────────────────────

export interface IntroElements {
  overlay: Element | null
  background: Element | null
  grid: Element | null
  glow: Element | null
  logo: Element | null
  logoText: Element | null
  progress: Element | null
  progressBar: Element | null
  status: Element | null
  particles: Element | null
}

/**
 * Builds the intro timeline: fade in overlay → reveal logo → reveal progress.
 * Returns the GSAP Timeline (already playing).
 */
export function buildIntroTimeline(els: IntroElements, reducedMotion: boolean): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  const d = (ms: number) => dur(ms, reducedMotion)

  // ── Overlay fade in ──────────────────────────────────────────────
  if (els.overlay) {
    gsap.set(els.overlay, { opacity: 0 })
    tl.to(els.overlay, { opacity: 1, duration: d(400) }, 0)
  }

  // ── Background glow pulse in ─────────────────────────────────────
  if (els.glow) {
    gsap.set(els.glow, { opacity: 0, scale: 0.6 })
    tl.to(els.glow, { opacity: 1, scale: 1, duration: d(1200), ease: 'power4.out' }, 0.1)
  }

  // ── Grid fade in ─────────────────────────────────────────────────
  if (els.grid) {
    gsap.set(els.grid, { opacity: 0 })
    tl.to(els.grid, { opacity: 1, duration: d(800) }, 0.2)
  }

  // ── Particles fade in ────────────────────────────────────────────
  if (els.particles) {
    gsap.set(els.particles, { opacity: 0 })
    tl.to(els.particles, { opacity: 1, duration: d(1000) }, 0.3)
  }

  // ── Logo scale + fade in ─────────────────────────────────────────
  if (els.logo) {
    gsap.set(els.logo, { opacity: 0, scale: 0.85, y: 20 })
    tl.to(els.logo, { opacity: 1, scale: 1, y: 0, duration: d(900), ease: 'power4.out' }, 0.5)
  }

  // ── Logo text clip reveal ────────────────────────────────────────
  if (els.logoText) {
    gsap.set(els.logoText, { clipPath: 'inset(0 100% 0 0)', opacity: 1 })
    tl.to(
      els.logoText,
      { clipPath: 'inset(0 0% 0 0)', duration: d(700), ease: 'power3.inOut' },
      0.9,
    )
  }

  // ── Progress bar reveal ──────────────────────────────────────────
  if (els.progress) {
    gsap.set(els.progress, { opacity: 0, y: 16 })
    tl.to(els.progress, { opacity: 1, y: 0, duration: d(600), ease: 'power3.out' }, 1.1)
  }

  // ── Status text reveal ───────────────────────────────────────────
  if (els.status) {
    gsap.set(els.status, { opacity: 0, y: 8 })
    tl.to(els.status, { opacity: 1, y: 0, duration: d(500) }, 1.3)
  }

  return tl
}

// ─── Progress Animation ───────────────────────────────────────────────────────

/**
 * Smoothly animates the progress bar fill to a target value.
 * Called whenever progress updates.
 */
export function animateProgressBar(
  barElement: Element | null,
  targetProgress: number,
  reducedMotion: boolean,
): gsap.core.Tween | null {
  if (!barElement) return null

  return gsap.to(barElement, {
    scaleX: targetProgress,
    duration: reducedMotion ? 0 : 0.4,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}

/**
 * Smoothly animates a numeric counter from current value to target.
 */
export function animateCounter(
  setter: (val: number) => void,
  from: number,
  to: number,
  reducedMotion: boolean,
): gsap.core.Tween {
  const obj = { value: from }
  return gsap.to(obj, {
    value: to,
    duration: reducedMotion ? 0 : 0.5,
    ease: 'power2.out',
    overwrite: 'auto',
    onUpdate: () => setter(Math.round(obj.value)),
  })
}

// ─── Exit Timeline ────────────────────────────────────────────────────────────

export interface ExitElements {
  overlay: Element | null
  content: Element | null // children of page (below loader)
}

/**
 * Builds the cinematic exit timeline.
 * Fades out the loader while scaling + revealing the page content below.
 * Returns a Timeline that calls `onComplete` when done.
 */
export function buildExitTimeline(
  els: ExitElements,
  reducedMotion: boolean,
  onComplete: () => void,
): gsap.core.Timeline {
  const tl = gsap.timeline({ onComplete })
  const d = (ms: number) => dur(ms, reducedMotion)

  // ── Fade + scale out the loader overlay ──────────────────────────
  if (els.overlay) {
    tl.to(
      els.overlay,
      {
        opacity: 0,
        scale: 1.04,
        filter: 'blur(12px)',
        duration: d(900),
        ease: 'power3.inOut',
      },
      0,
    )
  }

  return tl
}
