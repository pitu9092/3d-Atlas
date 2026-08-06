/**
 * @file engine/scene/SceneLifecycle.ts
 * @description Interface definition for scene components.
 *
 * Purpose: Enforces a strict lifecycle contract on every scene implementation.
 * Responsibilities: Standardizing load, mount, tick, transition, and unmount.
 */

export interface SceneLifecycle {
  /**
   * Pre-loads necessary assets before the scene mounts.
   */
  load(): Promise<void>

  /**
   * Mounts the scene into the DOM/Canvas.
   */
  mount(): void

  /**
   * Called every frame if the scene is active.
   */
  tick(time: number, delta: number): void

  /**
   * Animates the scene in.
   */
  enter(): Promise<void>

  /**
   * Animates the scene out.
   */
  exit(): Promise<void>

  /**
   * Cleans up all resources, event listeners, and GSAP timelines.
   */
  unmount(): void
}
