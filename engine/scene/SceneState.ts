/**
 * @file engine/scene/SceneState.ts
 * @description State interfaces for scene management.
 *
 * Purpose: Tracks the status of the current, next, and previous scenes.
 */

export type ScenePhase = 'unloaded' | 'loading' | 'ready' | 'entering' | 'active' | 'exiting'

export interface SceneState {
  id: string
  phase: ScenePhase
  progress: number // Scroll or time progress within the scene
}

export interface SceneManagerContext {
  currentScene: SceneState | null
  nextScene: SceneState | null
  previousScene: SceneState | null
  isTransitioning: boolean
}
