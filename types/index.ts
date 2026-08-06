/**
 * @file types/index.ts
 * @description Global shared TypeScript types and interfaces.
 * Feature-specific types live in features/<name>/types.ts.
 * Only app-wide, reusable types belong here.
 */

// ─── Utility Types ──────────────────────────────────────────────────────────

/** Makes all properties of T recursively required */
export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K]
}

/** Makes all properties of T recursively partial */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/** Extract the value type from a readonly array */
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

/** Stringify union for discriminated patterns */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & NonNullable<unknown>

// ─── Layout Types ───────────────────────────────────────────────────────────

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type Orientation = 'horizontal' | 'vertical'

export type Direction = 'ltr' | 'rtl'

// ─── Animation Types ────────────────────────────────────────────────────────

export interface AnimationState {
  isPlaying: boolean
  isPaused: boolean
  progress: number
}

export interface TransitionConfig {
  duration: number
  delay?: number
  ease?: string
}

// ─── Scroll Types ───────────────────────────────────────────────────────────

export interface ScrollState {
  scrollY: number
  scrollX: number
  direction: 'up' | 'down' | null
  progress: number
}

// ─── Three.js / Scene Types ─────────────────────────────────────────────────

export interface Vec2 {
  x: number
  y: number
}

export interface Vec3 extends Vec2 {
  z: number
}

export interface SceneConfig {
  id: string
  label: string
}

// ─── SEO / Metadata ─────────────────────────────────────────────────────────

export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
}
