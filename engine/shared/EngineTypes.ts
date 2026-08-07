/**
 * @file engine/shared/EngineTypes.ts
 * @description Core types and interfaces for the 3D Atlas Engine.
 *
 * Purpose: Defines foundational types used across all engine managers.
 * Responsibilities: Type safety, enums, interface contracts.
 */

export type LifecycleState =
  'uninitialized' | 'initializing' | 'ready' | 'running' | 'paused' | 'destroyed'

/**
 * Contract every engine manager must fulfill.
 * Managers implement only the methods relevant to their role.
 */
export interface EngineManager {
  state: LifecycleState

  /** Initialize the manager. May be async. */
  init(): Promise<void> | void

  /** Update per-frame logic. Called with delta time in milliseconds. */
  update?(delta: number): void

  /** Pause the manager (stop ticking, keep state). */
  pause?(): void

  /** Resume a paused manager. */
  resume?(): void

  /** Handle viewport resize. */
  resize?(width: number, height: number, pixelRatio: number): void

  /** Dispose all resources. Manager becomes unusable after this. */
  dispose(): void
}

/**
 * Interface for objects that are updated every frame.
 */
export interface Tickable {
  tick(time: number, delta: number, frame: number): void
}

/**
 * Interface for objects that respond to viewport resizes.
 */
export interface Resizable {
  resize(width: number, height: number, pixelRatio: number): void
}

/**
 * A subscriber called every animation frame.
 */
export type FrameSubscriber = (time: number, delta: number, frame: number) => void

/**
 * Viewport dimensions snapshot.
 */
export interface ViewportInfo {
  width: number
  height: number
  pixelRatio: number
  /** Aspect ratio (width / height). */
  aspect: number
}
