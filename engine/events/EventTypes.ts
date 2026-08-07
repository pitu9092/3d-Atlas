/**
 * @file engine/events/EventTypes.ts
 * @description Type definitions for the Engine EventBus.
 *
 * Purpose: Defines the shape of event payloads.
 * Responsibilities: Type mapping for events.
 */

// import { EngineEvent } from '../shared/EngineEvents'

/**
 * Mapping of event names to their payload types.
 * Add new event payloads here to ensure type safety when emitting/subscribing.
 */
export interface EventPayloadMap {
  [key: string]: unknown // Fallback

  'system:init': void
  'system:ready': void
  'system:pause': void
  'system:resume': void
  'system:dispose': void

  'frame:tick': { time: number; delta: number; frame: number }
  'window:resize': { width: number; height: number; pixelRatio: number }

  'scene:load_start': { sceneId: string }
  'scene:load_progress': { sceneId: string; progress: number }
  'scene:load_complete': { sceneId: string }
  'scene:transition_start': { from: string; to: string }
  'scene:transition_complete': { current: string }

  'scroll:update': { scrollY: number; progress: number; velocity: number; direction: number }
  'scroll:snap_start': { targetId: string }
  'scroll:snap_complete': { targetId: string }

  'perf:fps_drop': { currentFps: number; targetFps: number }
  'perf:quality_adjust': { previousQuality: string; newQuality: string }

  // Asset Pipeline (Phase 6)
  'asset:load_start': { id: string; url: string; type: string }
  'asset:load_progress': { id: string; progress: number }
  'asset:load_complete': { id: string; url: string; durationMs: number; sizeBytes: number }
  'asset:load_error': { id: string; url: string; error: string; attempts: number }
  'asset:cache_hit': { id: string }
  'asset:cache_evict': { id: string; reason: 'lru' | 'manual' | 'memory_pressure' }
  'asset:queue_drain': { totalLoaded: number; totalErrors: number }

  // Cinematic Loader (Phase 7)
  'loader:mount': void
  'loader:start': void
  'loader:progress': void
  'loader:complete': void
  'loader:exit': void
  'loader:hidden': void
}

export type EventCallback<T extends keyof EventPayloadMap = string> = (
  payload: EventPayloadMap[T],
) => void
