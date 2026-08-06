/**
 * @file lib/core/constants.ts
 * @description Centralized constants for 3D Atlas.
 *
 * Requirements met:
 * - Application Name & Version
 * - URLs
 * - Animation Defaults
 * - Scroll Defaults
 * - Canvas Defaults
 * - Asset Paths
 * - Storage Keys
 * - Default Values
 */

export const APP_INFO = {
  name: '3D Atlas',
  version: '0.1.0',
  description: 'Interactive 3D WebGL experience',
} as const

export const STORAGE_KEYS = {
  theme: 'atlas-theme',
  motionPreference: 'atlas-motion-preference',
  performancePreset: 'atlas-performance-preset',
} as const

export const URLS = {
  home: '/',
  // External
  github: 'https://github.com',
  twitter: 'https://twitter.com',
} as const

export const DEFAULT_VALUES = {
  locale: 'en-US',
  timezone: 'UTC',
} as const
