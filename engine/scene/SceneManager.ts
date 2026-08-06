/**
 * @file engine/scene/SceneManager.ts
 * @description Architecture shell for scene orchestration.
 *
 * Purpose: Manages scene lifecycles, mounting, unmounting, and transitions.
 * Responsibilities: State tracking, coordinating transitions via EventBus.
 */

import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import { type EngineManager, type LifecycleState, type Tickable } from '../shared/EngineTypes'

import { SceneRegistry } from './SceneRegistry'
import { type SceneState, type SceneManagerContext, type ScenePhase } from './SceneState'

export class SceneManager implements EngineManager, Tickable {
  public state: LifecycleState = 'uninitialized'

  public readonly registry: SceneRegistry

  private context: SceneManagerContext = {
    currentScene: null,
    nextScene: null,
    previousScene: null,
    isTransitioning: false,
  }

  constructor() {
    this.registry = new SceneRegistry()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    // SceneManager relies heavily on other systems (Loader, Animation)
    // which will be injected or coordinated at the top Engine level.

    this.state = 'ready'
    logger.info('SceneManager initialized')
  }

  /**
   * Called by the global render loop to tick the active scene.
   */
  public tick(time: number, delta: number, _frame: number): void {
    if (this.state !== 'running' || !this.context.currentScene) return

    const sceneInstance = this.registry.get(this.context.currentScene.id)
    if (sceneInstance && this.context.currentScene.phase === 'active') {
      sceneInstance.tick(time, delta)
    }
  }

  /**
   * Requests a transition to a new scene.
   */
  public async transitionTo(sceneId: string): Promise<void> {
    if (this.context.isTransitioning) {
      logger.warn('Transition already in progress. Ignoring request.')
      return
    }

    if (!this.registry.has(sceneId)) {
      logger.error(`Cannot transition to unknown scene: ${sceneId}`)
      return
    }

    this.context.isTransitioning = true
    this.context.nextScene = this.createSceneState(sceneId, 'loading')

    const currentId = this.context.currentScene?.id || 'none'
    globalEventBus.emit('scene:transition_start', { from: currentId, to: sceneId })

    try {
      const nextInstance = this.registry.get(sceneId)!

      // 1. Load Next Scene
      await nextInstance.load()
      this.context.nextScene.phase = 'ready'

      // 2. Mount Next Scene (usually invisible at first)
      nextInstance.mount()

      // 3. Exit Current Scene
      if (this.context.currentScene) {
        this.context.currentScene.phase = 'exiting'
        const currentInstance = this.registry.get(this.context.currentScene.id)
        if (currentInstance) {
          await currentInstance.exit()
          currentInstance.unmount()
        }
        this.context.previousScene = this.context.currentScene
      }

      // 4. Enter Next Scene
      this.context.currentScene = this.context.nextScene
      this.context.currentScene.phase = 'entering'
      this.context.nextScene = null

      await nextInstance.enter()
      this.context.currentScene.phase = 'active'

      globalEventBus.emit('scene:transition_complete', { current: sceneId })
    } catch (error) {
      logger.error(`Transition to ${sceneId} failed`, error)
      // Transition error recovery strategy goes here
    } finally {
      this.context.isTransitioning = false
    }
  }

  private createSceneState(id: string, phase: ScenePhase): SceneState {
    return { id, phase, progress: 0 }
  }

  public getContext(): SceneManagerContext {
    return { ...this.context }
  }

  public dispose(): void {
    if (this.context.currentScene) {
      const instance = this.registry.get(this.context.currentScene.id)
      instance?.unmount()
    }
    this.state = 'destroyed'
  }
}
