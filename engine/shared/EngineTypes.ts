/**
 * @file engine/shared/EngineTypes.ts
 * @description Core types and interfaces for the 3D Atlas Engine.
 *
 * Purpose: Defines foundational types used across all engine managers.
 * Responsibilities: Type safety, enums, interface contracts.
 */

export type LifecycleState =
  'uninitialized' | 'initializing' | 'ready' | 'running' | 'paused' | 'destroyed'

export interface EngineManager {
  state: LifecycleState
  init(): Promise<void> | void
  dispose(): void
}

export interface Tickable {
  tick(time: number, delta: number, frame: number): void
}

export interface Resizable {
  resize(width: number, height: number, pixelRatio: number): void
}
