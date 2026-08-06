/**
 * @file types/animation.ts
 * @description Animation type definitions for 3D Atlas.
 *
 * Derived from: docs/motion-blueprint/03_GSAPBlueprint.md
 *               docs/reference/10_AnimationInventory.md
 *               docs/engineering/07_GSAPArchitecture.md
 *
 * Covers: GSAP-compatible configs, scroll animation, transform states,
 * animation context, and motion preference types.
 */

import type { DurationKey, EasingKey } from '@/styles/tokens'

// ─── Animation State ──────────────────────────────────────────────────────────

export interface AnimationState {
  isPlaying: boolean
  isPaused: boolean
  isComplete: boolean
  progress: number // 0–1
}

export type AnimationPhase = 'idle' | 'entering' | 'active' | 'exiting' | 'complete'

// ─── Motion Preference ────────────────────────────────────────────────────────

export interface MotionPreferences {
  /** User has prefers-reduced-motion: reduce in their OS settings */
  reducedMotion: boolean
  /** Effective motion scale (0 = no motion, 1 = full motion) */
  motionScale: 0 | 0.5 | 1
}

// ─── Transition Config ────────────────────────────────────────────────────────

export interface TransitionConfig {
  duration: number // in seconds (GSAP convention)
  delay?: number
  ease?: string // GSAP ease string (e.g. "power4.out")
  stagger?: number // seconds between staggered elements
  repeat?: number // -1 for infinite
  yoyo?: boolean
}

export interface CSSTransitionConfig {
  duration: DurationKey
  delay?: string
  ease: EasingKey
  property?: string // CSS property to transition
}

// ─── Scroll Animation ─────────────────────────────────────────────────────────

export type ScrollTriggerType = 'scrub' | 'one-shot' | 'toggle'

export interface ScrollAnimationConfig {
  /** ScrollTrigger type */
  type: ScrollTriggerType
  /** CSS selector or element trigger */
  trigger: string
  /** ScrollTrigger start position */
  start?: string
  /** ScrollTrigger end position */
  end?: string
  /** Scrub value (true = 1:1, number = smoothing seconds) */
  scrub?: boolean | number
  /** Pin the trigger element */
  pin?: boolean | string
  /** Fire once and not reverse */
  once?: boolean
  /** toggleActions format */
  toggleActions?: string
}

// ─── GSAP Animation Targets ───────────────────────────────────────────────────

/** Text reveal animation config (H1/H2 clip-path + translateY) */
export interface TextRevealConfig {
  /** Container element class (clip-path parent) */
  containerSelector: string
  /** Line selector inside container */
  lineSelector: string
  /** Duration per line (seconds) */
  duration: number
  /** Stagger between lines (seconds) */
  stagger: number
  /** GSAP ease */
  ease: string
  /** Initial translateY value */
  fromY: number | string
  /** ScrollTrigger config (optional — if scroll-triggered) */
  scrollTrigger?: Partial<ScrollAnimationConfig>
}

/** Fade-in animation config */
export interface FadeConfig {
  /** Opacity start */
  fromOpacity: number
  /** translateY start (px) */
  fromY?: number
  /** Duration (seconds) */
  duration: number
  /** Delay (seconds) */
  delay?: number
  /** GSAP ease */
  ease: string
}

/** Counter animation config (stat count-up) */
export interface CounterConfig {
  /** Start value */
  from: number
  /** End value */
  to: number
  /** Format function (adds space separator: 2500 → "2 500+") */
  format: (value: number) => string
  /** Duration (seconds) */
  duration: number
  /** GSAP ease */
  ease: string
}

/** Card stagger entrance config */
export interface StaggerConfig {
  /** Selector for all stagger targets */
  selector: string
  /** Per-element duration (seconds) */
  duration: number
  /** Stagger delay between elements (seconds) */
  stagger: number
  /** translateY start (px) */
  fromY: number
  /** Opacity start */
  fromOpacity: number
  /** GSAP ease */
  ease: string
}

// ─── Animation Context Value ──────────────────────────────────────────────────

export interface AnimationContextValue {
  /** Is the page load animation complete? */
  isLoadComplete: boolean
  /** Mark page load as complete (fires after initial animations finish) */
  setLoadComplete: (complete: boolean) => void
  /** User motion preferences */
  motionPreferences: MotionPreferences
  /** Is GSAP ready (registered plugins, config applied)? */
  isGSAPReady: boolean
}

// ─── Canvas Animation Types ───────────────────────────────────────────────────

/** Camera position for Three.js scroll-driven cameras */
export interface CameraPosition {
  x: number
  y: number
  z: number
}

/** Camera animation phase (used in ship scene 3-phase camera) */
export interface CameraPhase {
  /** Progress start (0–1) */
  start: number
  /** Progress end (0–1) */
  end: number
  /** Camera position at phase start */
  from: CameraPosition
  /** Camera position at phase end */
  to: CameraPosition
}

// ─── Load Timeline Types ──────────────────────────────────────────────────────

/** Items in the page load animation timeline */
export interface LoadTimelineItem {
  /** GSAP timeline position (seconds or label) */
  position: number | string
  /** CSS selector for target element */
  selector: string
  /** GSAP tween config */
  from: Record<string, number | string>
  to: Record<string, number | string>
  /** Duration (seconds) */
  duration: number
  /** GSAP ease */
  ease: string
}
