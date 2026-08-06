/**
 * @file engine/index.ts
 * @description Master Barrel export for the 3D Atlas Engine.
 *
 * This file serves as the primary entry point for the runtime engine architecture.
 * It strictly controls the public API boundary to prevent deep imports across the application.
 */

export * from './animation'
export * from './camera'
export * from './events'
export * from './loader'
export * from './performance'
export * from './renderer'
export * from './scene'
export * from './scroll'
export * from './shared'
