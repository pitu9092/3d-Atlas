/**
 * @file engine/loader/LoaderEvents.ts
 * @description Event name constants for the cinematic loader.
 *
 * Purpose: Typed constants for loader-specific EventBus events.
 * All events are dispatched on `globalEventBus`.
 */

export const LoaderEvents = {
  /** Loader has mounted and is visible. */
  LOADER_MOUNT: 'loader:mount',

  /** Asset loading sequence has started. */
  LOADER_START: 'loader:start',

  /** Loader progress updated (0–1). */
  LOADER_PROGRESS: 'loader:progress',

  /** All assets loaded — beginning hold / completing phase. */
  LOADER_COMPLETE: 'loader:complete',

  /** Exit animation started. */
  LOADER_EXIT: 'loader:exit',

  /** Loader fully hidden, component unmounted. */
  LOADER_HIDDEN: 'loader:hidden',
} as const

export type LoaderEventName = (typeof LoaderEvents)[keyof typeof LoaderEvents]
