/**
 * @file engine/scroll/ScrollEvents.ts
 * @description Internal scroll event definitions.
 *
 * Purpose: Defines specialized scroll event handlers outside the global EventBus
 * to avoid polluting global events with high-frequency local callbacks.
 */

import { type ScrollState } from './ScrollState'

export type ScrollCallback = (state: ScrollState) => void

export interface ScrollObservable {
  onScroll(callback: ScrollCallback): () => void
}
