/**
 * @file engine/scene/SceneRegistry.ts
 * @description Central registry for available scene implementations.
 *
 * Purpose: Allows the engine to dynamically look up and instantiate scenes by ID.
 * Responsibilities: Mapping scene IDs to their lifecycle implementations.
 */

import { type SceneLifecycle } from './SceneLifecycle'

export class SceneRegistry {
  private scenes: Map<string, SceneLifecycle> = new Map()

  /**
   * Registers a scene implementation against an ID.
   */
  public register(id: string, scene: SceneLifecycle): void {
    if (this.scenes.has(id)) {
      console.warn(`[SceneRegistry] Scene ${id} is already registered. Overwriting.`)
    }
    this.scenes.set(id, scene)
  }

  /**
   * Retrieves a scene implementation by ID.
   */
  public get(id: string): SceneLifecycle | undefined {
    return this.scenes.get(id)
  }

  /**
   * Checks if a scene is registered.
   */
  public has(id: string): boolean {
    return this.scenes.has(id)
  }
}
