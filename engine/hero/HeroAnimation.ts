/**
 * @file engine/hero/HeroAnimation.ts
 * @description GSAP timeline factory for the Hero entry sequence.
 *
 * Implements the Load Timeline from the 03_GSAPBlueprint:
 * t=0.0: Globe canvas opacity 0→1, duration 0.8
 * t=0.3: Eyebrow opacity 0→1, y 8→0, duration 0.5
 * t=0.4: H1 line 1 yPercent 100→0, duration 0.9
 * t=0.52: H1 line 2 yPercent 100→0, duration 0.9
 * t=0.64: H1 line 3 yPercent 100→0, duration 0.9
 * t=0.75: Body copy opacity 0→1, y 16→0, duration 0.6
 * t=0.9: Button 1 opacity 0→1, y 12→0, duration 0.5
 * t=1.0: Button 2 opacity 0→1, y 12→0, duration 0.5
 */

import gsap from 'gsap'

export interface HeroEntryElements {
  globeContainer: Element | null
  eyebrow: Element | null
  headlineLines: Element[]
  body: Element | null
  buttons: Element[]
}

/** When reducedMotion is true, all durations collapse to 0. */
function dur(ms: number, reducedMotion: boolean): number {
  return reducedMotion ? 0 : ms / 1000
}

export function buildHeroEntryTimeline(
  els: HeroEntryElements,
  reducedMotion: boolean,
  onComplete: () => void,
): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete })
  const d = (ms: number) => dur(ms, reducedMotion)

  // t=0.0: Globe canvas
  if (els.globeContainer) {
    gsap.set(els.globeContainer, { opacity: 0 })
    tl.to(els.globeContainer, { opacity: 1, duration: d(800) }, 0)
  }

  // t=0.3: Eyebrow
  if (els.eyebrow) {
    tl.addLabel('eyebrow', d(300))
    gsap.set(els.eyebrow, { opacity: 0, y: 8 })
    tl.to(els.eyebrow, { opacity: 1, y: 0, duration: d(500) }, 'eyebrow')
  }

  // t=0.4: Headline
  tl.addLabel('headline', d(400))
  if (els.headlineLines.length > 0) {
    // We assume the headline elements have overflow: hidden and inner elements doing the yPercent
    els.headlineLines.forEach((line, index) => {
      gsap.set(line, { yPercent: 100 })
      // staggered by 0.12s
      tl.to(line, { yPercent: 0, duration: d(900), ease: 'power4.out' }, d(400) + d(120 * index))
    })
  }

  // t=0.75: Body copy
  if (els.body) {
    tl.addLabel('body', d(750))
    gsap.set(els.body, { opacity: 0, y: 16 })
    tl.to(els.body, { opacity: 1, y: 0, duration: d(600) }, 'body')
  }

  // t=0.9: Buttons
  tl.addLabel('cta', d(900))
  if (els.buttons.length > 0) {
    els.buttons.forEach((btn, index) => {
      gsap.set(btn, { opacity: 0, y: 12 })
      tl.to(btn, { opacity: 1, y: 0, duration: d(500) }, d(900) + d(100 * index))
    })
  }

  return tl
}
