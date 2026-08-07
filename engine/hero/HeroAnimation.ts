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
  headlineWords: Element[]
  bodyWords: Element[]
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
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete })
  const d = (ms: number) => dur(ms, reducedMotion)

  // t=0.0: Globe canvas (handled via CSS transition mostly, but we can ensure it's visible if passed)
  if (els.globeContainer) {
    gsap.set(els.globeContainer, { opacity: 0 })
    tl.to(els.globeContainer, { opacity: 1, duration: d(1200) }, 0)
  }

  // t=0.2: Eyebrow
  if (els.eyebrow) {
    tl.addLabel('eyebrow', d(200))
    gsap.set(els.eyebrow, { opacity: 0, y: 15 })
    tl.to(els.eyebrow, { opacity: 1, y: 0, duration: d(800), ease: 'power3.out' }, 'eyebrow')
  }

  // t=0.3: Headline Words (Staggered)
  tl.addLabel('headline', d(300))
  if (els.headlineWords.length > 0) {
    gsap.set(els.headlineWords, { yPercent: 110, rotateZ: 2 })
    tl.to(
      els.headlineWords,
      {
        yPercent: 0,
        rotateZ: 0,
        duration: d(1200),
        ease: 'power4.out',
        stagger: d(50),
      },
      'headline',
    )
  }

  // t=0.7: Body copy Words (Staggered)
  tl.addLabel('body', d(700))
  if (els.bodyWords.length > 0) {
    gsap.set(els.bodyWords, { opacity: 0, y: 15 })
    tl.to(
      els.bodyWords,
      {
        opacity: 1,
        y: 0,
        duration: d(800),
        ease: 'power3.out',
        stagger: d(15),
      },
      'body',
    )
  }

  // t=0.9: Buttons
  tl.addLabel('cta', d(900))
  if (els.buttons.length > 0) {
    els.buttons.forEach((btn, index) => {
      gsap.set(btn, { opacity: 0, y: 20 })
      tl.to(btn, { opacity: 1, y: 0, duration: d(800), ease: 'expo.out' }, d(900) + d(150 * index))
    })
  }

  return tl
}
