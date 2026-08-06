/**
 * @file engine/animation/AnimationEvents.ts
 * @description Internal animation event definitions.
 *
 * Purpose: Defines local callbacks for timeline lifecycle hooks.
 */

export type TimelineCallback = (id: string) => void

export interface TimelineOptions {
  id: string
  onStart?: TimelineCallback
  onComplete?: TimelineCallback
  onReverseComplete?: TimelineCallback
}
