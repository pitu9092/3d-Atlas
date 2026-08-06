/**
 * @file engine/animation/index.ts
 * @description Barrel export for the animation engine module.
 *
 * Public API:
 * - AnimationManager: Global GSAP orchestrator
 * - TimelineRegistry: Registry for tracking and cleaning up timelines
 * - AnimationState: Interface for global animation metrics
 * - AnimationEvents: Internal lifecycle callbacks
 */

export * from './AnimationEvents'
export * from './AnimationManager'
export * from './AnimationState'
export * from './TimelineRegistry'
