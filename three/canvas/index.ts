/**
 * @file three/canvas/index.ts
 * @description Public API barrel for the canvas system.
 *
 * Exports the full R3F canvas composition layer:
 * - CanvasProvider: All-in-one engine + canvas wrapper
 * - CanvasRoot: Standalone R3F Canvas with engine config
 * - EngineProvider: Engine bootstrap provider (no Canvas)
 * - RendererManager: R3F inner renderer configuration component
 * - SceneRoot: Base 3D scene graph with lighting and helpers
 * - EngineContext: Context value and hook types
 * - useEngineContext: Hook to access engine context
 * - useEngine: Convenience hook for EngineRuntime
 */

export { CanvasProvider } from './CanvasProvider'
export { CanvasRoot } from './CanvasRoot'
export { EngineProvider } from './EngineProvider'
export { RendererManager } from './RendererManager'
export { SceneRoot } from './SceneRoot'
export { EngineContext, useEngineContext, useEngine } from './EngineContext'
export type { EngineContextValue } from './EngineContext'
