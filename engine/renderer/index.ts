/**
 * @file engine/renderer/index.ts
 * @description Barrel export for the renderer engine module.
 *
 * Public API:
 * - Renderer: Global WebGL orchestrator
 * - CanvasManager: DOM Canvas management
 * - ResizeManager: Window resizing and pixel ratio logic
 * - RenderLoop: Central RequestAnimationFrame driver
 */

export * from './CanvasManager'
export * from './Renderer'
export * from './RenderLoop'
export * from './ResizeManager'
