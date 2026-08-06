/**
 * @file engine/animation/TimelineRegistry.ts
 * @description Central registry for managing GSAP timelines.
 *
 * Purpose: Keeps track of all active timelines so they can be paused,
 * resumed, or killed globally (e.g., during scene transitions or unmount).
 * Responsibilities: Timeline storage, global playback control, cleanup.
 */

import { logger } from '@/lib/core'

export class TimelineRegistry {
  private timelines: Map<string, unknown> = new Map() // 'any' placeholder for GSAP timeline

  /**
   * Registers a new timeline.
   */
  public register(id: string, timeline: unknown): void {
    if (this.timelines.has(id)) {
      logger.warn(`Timeline with ID ${id} is already registered. Overwriting.`)
      this.kill(id)
    }
    this.timelines.set(id, timeline)
  }

  /**
   * Retrieves a timeline by ID.
   */
  public get(id: string): unknown | undefined {
    return this.timelines.get(id)
  }

  /**
   * Kills and removes a specific timeline.
   */
  public kill(id: string): void {
    const tl = this.timelines.get(id)
    if (tl) {
      // TODO: tl.kill() (GSAP integration)
      this.timelines.delete(id)
    }
  }

  /**
   * Pauses all registered timelines.
   */
  public pauseAll(): void {
    this.timelines.forEach((_tl) => {
      // TODO: tl.pause()
    })
  }

  /**
   * Resumes all registered timelines.
   */
  public resumeAll(): void {
    this.timelines.forEach((_tl) => {
      // TODO: tl.resume()
    })
  }

  /**
   * Kills all registered timelines and clears the registry.
   */
  public clear(): void {
    this.timelines.forEach((_tl) => {
      // TODO: tl.kill()
    })
    this.timelines.clear()
  }

  public get count(): number {
    return this.timelines.size
  }
}
