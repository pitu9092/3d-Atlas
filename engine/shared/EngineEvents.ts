/**
 * @file engine/shared/EngineEvents.ts
 * @description Centralized event constants for the Engine EventBus.
 *
 * Purpose: Strongly typed event names to prevent typos and enable reliable pub/sub.
 * Responsibilities: Event naming taxonomy.
 */

export const EngineEvents = {
  // System Lifecycle
  SYSTEM_INIT: 'system:init',
  SYSTEM_READY: 'system:ready',
  SYSTEM_PAUSE: 'system:pause',
  SYSTEM_RESUME: 'system:resume',
  SYSTEM_DISPOSE: 'system:dispose',

  // Render & Frame
  FRAME_TICK: 'frame:tick',
  WINDOW_RESIZE: 'window:resize',

  // Scene
  SCENE_LOAD_START: 'scene:load_start',
  SCENE_LOAD_PROGRESS: 'scene:load_progress',
  SCENE_LOAD_COMPLETE: 'scene:load_complete',
  SCENE_TRANSITION_START: 'scene:transition_start',
  SCENE_TRANSITION_COMPLETE: 'scene:transition_complete',

  // Scroll
  SCROLL_UPDATE: 'scroll:update',
  SCROLL_SNAP_START: 'scroll:snap_start',
  SCROLL_SNAP_COMPLETE: 'scroll:snap_complete',

  // Performance
  PERF_FPS_DROP: 'perf:fps_drop',
  PERF_QUALITY_ADJUST: 'perf:quality_adjust',
} as const

export type EngineEvent = (typeof EngineEvents)[keyof typeof EngineEvents]
