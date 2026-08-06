/**
 * @file constants/index.ts
 * @description Application-wide constants.
 * All magic numbers, strings, and configuration values live here.
 * Never use inline literals — always reference a named constant.
 */

// ─── App ────────────────────────────────────────────────────────────────────

export const APP_NAME = '3D Atlas' as const
export const APP_DESCRIPTION = 'A cinematic, scroll-driven 3D web experience.' as const
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// ─── Breakpoints (px) ───────────────────────────────────────────────────────
// Must match the CSS media queries in globals.css

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const satisfies Record<string, number>

export type BreakpointKey = keyof typeof BREAKPOINTS

// ─── Animation ──────────────────────────────────────────────────────────────

export const ANIMATION = {
  /** GSAP default duration in seconds */
  DURATION: {
    INSTANT: 0.05,
    FAST: 0.15,
    NORMAL: 0.3,
    SLOW: 0.5,
    SLOWER: 0.8,
    SLOWEST: 1.2,
  },
  /** GSAP easing strings */
  EASE: {
    DEFAULT: 'power3.out',
    IN: 'power2.in',
    IN_OUT: 'power3.inOut',
    EXPO_OUT: 'expo.out',
    EXPO_IN_OUT: 'expo.inOut',
    ELASTIC: 'elastic.out(1, 0.3)',
    BACK: 'back.out(1.7)',
    CINEMATIC: 'power4.inOut',
  },
} as const

// ─── Scroll ─────────────────────────────────────────────────────────────────

export const SCROLL = {
  /** Lenis default duration in seconds */
  DURATION: 1.2,
  /** ScrollTrigger default scroller */
  SCROLLER: typeof window !== 'undefined' ? window : null,
} as const

// ─── Three.js / Scene ───────────────────────────────────────────────────────

export const THREE_CONFIG = {
  /** Default camera FOV */
  CAMERA_FOV: 75,
  /** Default camera near clipping plane */
  CAMERA_NEAR: 0.1,
  /** Default camera far clipping plane */
  CAMERA_FAR: 1000,
  /** Default camera position (z-axis) */
  CAMERA_Z: 5,
  /** Default pixel ratio cap for performance */
  MAX_PIXEL_RATIO: 2,
} as const

// ─── Assets ─────────────────────────────────────────────────────────────────

export const ASSET_PATHS = {
  MODELS: '/models',
  TEXTURES: '/textures',
  VIDEOS: '/videos',
  IMAGES: '/images',
  HDR: '/hdr',
} as const

// ─── Performance ────────────────────────────────────────────────────────────

export const PERF = {
  /** Target FPS for RAF-based animations */
  TARGET_FPS: 60,
  /** Frame budget in ms at 60fps */
  FRAME_BUDGET_MS: 1000 / 60,
} as const
