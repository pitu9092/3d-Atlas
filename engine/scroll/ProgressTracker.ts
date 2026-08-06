/**
 * @file engine/scroll/ProgressTracker.ts
 * @description Maps global scroll position to local scene progress.
 *
 * Purpose: Allows scenes to track their own 0-1 progress based on their DOM position.
 * Responsibilities: Intersection calculation, progress normalization.
 */

import { EngineUtils } from '../shared/EngineUtils'

import { type ScrollState } from './ScrollState'

export class ProgressTracker {
  private element: HTMLElement | null = null
  private startY = 0
  private endY = 0
  private progress = 0

  /**
   * Mounts the tracker to a specific DOM element.
   */
  public mount(element: HTMLElement): void {
    this.element = element
    this.recalculate()
  }

  /**
   * Recalculates the start and end Y positions based on layout.
   */
  public recalculate(): void {
    if (!this.element) return

    const rect = this.element.getBoundingClientRect()
    // Assume document scroll is 0 during recalculation or account for it
    const scrollY = window.scrollY || 0

    // Element enters from bottom, leaves from top
    this.startY = rect.top + scrollY - window.innerHeight
    this.endY = rect.bottom + scrollY
  }

  /**
   * Updates progress based on global scroll state.
   */
  public update(state: ScrollState): void {
    if (!this.element) return

    // Calculate progress between start and end Y
    const rawProgress = EngineUtils.mapRange(state.scrollY, this.startY, this.endY, 0, 1)
    this.progress = EngineUtils.clamp(rawProgress, 0, 1)
  }

  /**
   * Returns the normalized 0-1 progress of the tracked element.
   */
  public getProgress(): number {
    return this.progress
  }

  public dispose(): void {
    this.element = null
  }
}
