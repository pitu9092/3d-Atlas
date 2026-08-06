/**
 * @file engine/scroll/index.ts
 * @description Barrel export for the scroll engine module.
 *
 * Public API:
 * - ScrollManager: Global scroll orchestrator
 * - ProgressTracker: Local DOM element progress mapper
 * - ScrollState: Interface for global scroll metrics
 * - ScrollEvents: Interfaces for scroll subscription
 */

export * from './ProgressTracker'
export * from './ScrollEvents'
export * from './ScrollManager'
export * from './ScrollState'
