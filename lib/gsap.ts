/**
 * @file lib/gsap.ts
 * @description GSAP registration and global configuration.
 * Import this file ONCE at the application root (providers or layout).
 * Never register plugins multiple times.
 */

import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Plugin Registration ────────────────────────────────────────────────────
// All GSAP plugins must be registered once at the application level.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ─── Global GSAP Defaults ───────────────────────────────────────────────────
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
})

// ─── ScrollTrigger Defaults ─────────────────────────────────────────────────
ScrollTrigger.config({
  // Use ResizeObserver for performance (vs interval polling)
  ignoreMobileResize: true,
})

// ─── Exports ────────────────────────────────────────────────────────────────
export { gsap, ScrollTrigger, ScrollToPlugin }

/**
 * Refresh all ScrollTrigger instances.
 * Call after dynamic content is loaded or layout changes.
 */
export const refreshScrollTrigger = (): void => {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTrigger instances.
 * Call on page unmount or route change.
 */
export const killAllScrollTriggers = (): void => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}
