/**
 * @file config/lenis.ts
 * @description Smooth scrolling configuration for 3D Atlas using Lenis.
 *
 * Requirements met:
 * - Interpolation
 * - Duration
 * - Touch behavior
 * - Wheel behavior
 * - Synchronization strategy
 */

export const lenisConfig = {
  // Core scroll feel
  duration: 1.2, // Scroll duration
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo.easeOut equivalent

  // Input settings
  smoothWheel: true,
  smoothTouch: false, // Usually best to let native touch scrolling handle mobile
  touchMultiplier: 2,
  wheelMultiplier: 1,

  // Advanced behavior
  infinite: false,
  normalizeWheel: true,

  // Synchronization (how it syncs with GSAP)
  syncStrategy: 'gsap-ticker', // We use GSAP's ticker to drive Lenis
} as const

export type LenisConfig = typeof lenisConfig
