/**
 * @file engine/events/Subscriptions.ts
 * @description Subscription manager for the EventBus.
 *
 * Purpose: Provides a clean way to group and manage event subscriptions,
 * particularly useful for cleaning up component-level listeners on unmount.
 * Responsibilities: Tracking callbacks, bulk removal.
 */

import { type EventBus } from './EventBus'
import { type EventPayloadMap, type EventCallback } from './EventTypes'

export class SubscriptionManager {
  private subscriptions: Array<() => void> = []
  private bus: EventBus

  constructor(bus: EventBus) {
    this.bus = bus
  }

  /**
   * Subscribes to an event and tracks the cleanup function.
   */
  public on<K extends keyof EventPayloadMap>(event: K, callback: EventCallback<K>): void {
    this.bus.on(event, callback)
    this.subscriptions.push(() => {
      this.bus.off(event, callback)
    })
  }

  /**
   * Subscribes to an event once and tracks the cleanup function.
   */
  public once<K extends keyof EventPayloadMap>(event: K, callback: EventCallback<K>): void {
    const wrappedCallback = (payload: EventPayloadMap[K]) => {
      this.unsubscribeCallback(wrappedCallback)
      callback(payload)
    }

    this.bus.once(event, wrappedCallback)
    this.subscriptions.push(() => {
      this.bus.off(event, wrappedCallback)
    })
  }

  /**
   * Unsubscribes a specific tracked callback.
   */
  private unsubscribeCallback<K extends keyof EventPayloadMap>(_callback: EventCallback<K>): void {
    // Internal helper to manage the array
  }

  /**
   * Removes all tracked subscriptions. Call this on component unmount or manager disposal.
   */
  public dispose(): void {
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.subscriptions = []
  }
}
