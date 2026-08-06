/**
 * @file config/gsap.ts
 * @description Central GSAP configuration for 3D Atlas.
 *
 * Requirements met:
 * - Register plugins configuration
 * - Global defaults
 * - Timeline defaults
 * - ScrollTrigger defaults
 * - Development options
 */

import { featureFlags } from '@/lib/core/featureFlags'

import { animationConfig } from './animation'

export const gsapConfig = {
  // Plugins that need to be registered at boot
  plugins: ['ScrollTrigger', 'CustomEase', 'SplitText'],

  // Applied to all GSAP tweens globally
  globalDefaults: {
    ease: animationConfig.defaults.ease,
    duration: animationConfig.defaults.duration,
  },

  // Applied to new GSAP timelines
  timelineDefaults: {
    smoothChildTiming: true,
    autoRemoveChildren: true,
  },

  // Applied to ScrollTrigger globally
  scrollTriggerDefaults: {
    markers: featureFlags.enableDebug, // Show markers only if debug is enabled
    scrub: 1, // Default smooth scrub
    toggleActions: 'play none none reverse',
  },
} as const

export type GsapConfig = typeof gsapConfig
