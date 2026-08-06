/**
 * @file config/animation.ts
 * @description Central animation configuration for 3D Atlas.
 *
 * Requirements met:
 * - Default duration
 * - Default easing
 * - Stagger
 * - Delay
 * - Motion presets
 */

import { designTokens } from '@/lib/design-system'

export const animationConfig = {
  defaults: {
    duration: 1.2, // seconds, for GSAP
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0,
  },

  presets: {
    heroReveal: {
      duration: 1.5,
      ease: 'power4.out',
      y: 50,
      opacity: 0,
    },
    fadeIn: {
      duration: 0.8,
      ease: 'power2.out',
      opacity: 0,
    },
    slideUp: {
      duration: 1.0,
      ease: 'power3.out',
      y: 30,
      opacity: 0,
    },
    scaleUp: {
      duration: 1.2,
      ease: 'back.out(1.7)',
      scale: 0.9,
      opacity: 0,
    },
  },

  // Mapping for CSS variable durations directly from design system
  cssDurations: designTokens.durations,

  // Mapping for CSS variable easings directly from design system
  cssEasings: designTokens.easings,
} as const

export type AnimationConfig = typeof animationConfig
