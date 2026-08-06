/**
 * @file types/tokens.ts
 * @description Design token type definitions for 3D Atlas.
 *
 * Provides TypeScript types derived from the token system.
 * Used for type-safe access to design token values throughout the codebase.
 */

import type {
  ColorName,
  ColorShade,
  BlurKey,
  BreakpointKey,
  DurationKey,
  EasingKey,
  GradientKey,
  MotionKey,
  OpacityKey,
  RadiusKey,
  ShadowKey,
  SpacingKey,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  ZIndexKey,
} from '@/styles/tokens'

// ─── Re-exports of token keys for convenience ─────────────────────────────────
export type {
  ColorName,
  ColorShade,
  BlurKey,
  BreakpointKey,
  DurationKey,
  EasingKey,
  GradientKey,
  MotionKey,
  OpacityKey,
  RadiusKey,
  ShadowKey,
  SpacingKey,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  ZIndexKey,
}

// ─── Token Reference Types ────────────────────────────────────────────────────

/** A color token reference (e.g. "primary.500") */
export type ColorToken = `${ColorName}.${ColorShade}`

/** A spacing token reference as a pixel value key */
export type SpacingToken = SpacingKey

/** A CSS variable reference string */
export type CSSVar = `var(--${string})`

/** A raw CSS value (not a token reference) */
export type RawValue = string

/** Either a token reference or a raw CSS value */
export type TokenOrValue<T extends string> = T | RawValue

// ─── Animation Token References ───────────────────────────────────────────────

/** Fade animation token */
export interface FadeToken {
  from: string
  to: string
  duration: DurationKey
  ease: EasingKey
}

/** Scale animation token */
export interface ScaleToken {
  from: string
  to: string
  duration: DurationKey
  ease: EasingKey
}

/** Translate animation token */
export interface TranslateToken {
  fromX?: string
  fromY?: string
  toX?: string
  toY?: string
  duration: DurationKey
  ease: EasingKey
}

/** Stagger animation token */
export interface StaggerToken {
  delay: string // per-item stagger delay
  duration: DurationKey
  ease: EasingKey
}

// ─── Design Token System ─────────────────────────────────────────────────────

/** The complete resolved design token system */
export interface DesignTokenSystem {
  colors: Record<ColorName, Record<ColorShade, string>>
  spacing: Record<SpacingKey, string>
  typography: {
    fontFamily: Record<string, string>
    fontSize: Record<FontSize, string>
    fontWeight: Record<FontWeight, string>
    lineHeight: Record<LineHeight, string>
    letterSpacing: Record<LetterSpacing, string>
  }
  radius: Record<RadiusKey, string>
  shadows: Record<ShadowKey, string>
  zIndex: Record<ZIndexKey, number>
  breakpoints: Record<BreakpointKey, string>
  durations: Record<DurationKey, string>
  easings: Record<EasingKey, string>
  blur: Record<BlurKey, string>
  opacity: Record<OpacityKey, string>
  gradients: Record<GradientKey, string>
  motion: Record<MotionKey, { duration: string; ease: string; transition: string }>
}
