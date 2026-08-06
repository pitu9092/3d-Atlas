/**
 * @file engine/scene/index.ts
 * @description Barrel export for the scene engine module.
 *
 * Public API:
 * - SceneManager: Global scene orchestrator
 * - SceneRegistry: Store for available scenes
 * - SceneLifecycle: Interface for scene implementations
 * - SceneState: Interface for scene transition tracking
 */

export * from './SceneLifecycle'
export * from './SceneManager'
export * from './SceneRegistry'
export * from './SceneState'
