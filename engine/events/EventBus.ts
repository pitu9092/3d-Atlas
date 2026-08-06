/**
 * @file engine/events/EventBus.ts
 * @description Centralized event bus for the 3D Atlas Engine.
 *
 * Purpose: Decouples engine modules through a strongly-typed pub/sub system.
 * Responsibilities: Event emitting, subscribing, unsubscribing, clearing.
 */

import { logger } from '@/lib/core'

import { type EventPayloadMap, type EventCallback } from './EventTypes'

export class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<keyof EventPayloadMap, Set<any>> = new Map()

  /**
   * Subscribes to an event.
   */
  public on<K extends keyof EventPayloadMap>(event: K, callback: EventCallback<K>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  /**
   * Subscribes to an event, executing only once.
   */
  public once<K extends keyof EventPayloadMap>(event: K, callback: EventCallback<K>): void {
    const wrappedCallback = (payload: EventPayloadMap[K]) => {
      this.off(event, wrappedCallback)
      callback(payload)
    }
    this.on(event, wrappedCallback)
  }

  /**
   * Unsubscribes from an event.
   */
  public off<K extends keyof EventPayloadMap>(event: K, callback: EventCallback<K>): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Emits an event with the corresponding payload.
   */
  public emit<K extends keyof EventPayloadMap>(event: K, payload?: EventPayloadMap[K]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      // Create an array to avoid issues if listeners mutate the Set during iteration
      Array.from(eventListeners).forEach((callback) => {
        try {
          // Type casting since payload might be undefined if not strictly required,
          // though TS usually enforces it based on EventPayloadMap definition.
          callback(payload as EventPayloadMap[K])
        } catch (error) {
          logger.error(`Error in event listener for ${event as string}`, error)
        }
      })
    }
  }

  /**
   * Removes all listeners for a specific event or all events if none provided.
   */
  public clear(event?: keyof EventPayloadMap): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

// Singleton instance for global engine events
export const globalEventBus = new EventBus()
