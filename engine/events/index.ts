/**
 * @file engine/events/index.ts
 * @description Barrel export for the events engine module.
 *
 * Public API:
 * - EventBus: The core pub/sub class
 * - globalEventBus: Singleton instance for application-wide events
 * - EventTypes: Event payload mapping and callback types
 * - SubscriptionManager: Lifecycle-aware subscription grouping
 */

export * from './EventBus'
export * from './EventTypes'
export * from './Subscriptions'
