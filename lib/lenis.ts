/**
 * @file lib/lenis.ts
 * @description Lenis smooth scroll singleton and configuration.
 * Lenis instance is created once via LenisProvider.
 * Do not instantiate Lenis directly in components — use the context hook instead.
 */

import Lenis from 'lenis'

// ─── Lenis Configuration ────────────────────────────────────────────────────
export const LENIS_OPTIONS: ConstructorParameters<typeof Lenis>[0] = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 2,
  infinite: false,
}

/**
 * Create a new Lenis instance with the default configuration.
 * This factory is used by LenisProvider.
 */
export const createLenisInstance = (): Lenis => {
  return new Lenis(LENIS_OPTIONS)
}

export type { Lenis }
