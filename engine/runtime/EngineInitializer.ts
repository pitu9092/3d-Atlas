/**
 * @file engine/runtime/EngineInitializer.ts
 * @description Handles global setup before managers are instantiated.
 *
 * Purpose: Applies global configuration, feature flags, and plugin registrations.
 */

import { gsapConfig } from '@/config/gsap'
import { logger } from '@/lib/core'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export class EngineInitializer {
  /**
   * Run all pre-flight checks and configuration.
   */
  public static init(): void {
    logger.info('Initializing Engine Prerequisites...')

    // GSAP Defaults
    gsap.defaults(gsapConfig.globalDefaults)
    ScrollTrigger.defaults(gsapConfig.scrollTriggerDefaults)

    // Verify dependencies
    if (!gsap || !ScrollTrigger) {
      logger.error('Critical animation dependencies missing!')
    }

    logger.info('Engine Prerequisites Initialized')
  }
}
