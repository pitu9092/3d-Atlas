/**
 * @file engine/scene/SceneManager.ts
 * @description Scene orchestration manager.
 *
 * Purpose: Manages scene lifecycles, mounting, transitions, and per-frame ticking.
 * Responsibilities:
 *   - Scene registry lookup
 *   - Transition orchestration with load / mount / enter / exit / unmount phases
 *   - Propagates pause, resume, resize to the active scene
 *   - Emits global EventBus events for scene lifecycle changes
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

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'
    this.state = 'ready'
    logger.info('SceneManager initialized')
  }

  public update(delta: number): void {
    this.tick(performance.now(), delta, 0)
  }

  public pause(): void {
    if (this.state === 'paused') return
    this.state = 'paused'
  }

  public resume(): void {
    if (this.state !== 'paused') return
    this.state = 'running'
  }

  public resize(width: number, height: number, pixelRatio: number): void {
    // Forward resize to active scene if it exposes the method
    if (this.context.currentScene) {
      const instance = this.registry.get(this.context.currentScene.id)
      if (instance && 'resize' in instance && typeof instance.resize === 'function') {
        ;(instance as { resize: (w: number, h: number, dpr: number) => void }).resize(
          width,
          height,
          pixelRatio,
        )
      }
    }
  }

  // ─── Tickable ─────────────────────────────────────────────────────────────

  public tick(time: number, delta: number, _frame: number): void {
    if (this.state !== 'running' || !this.context.currentScene) return

    const instance = this.registry.get(this.context.currentScene.id)
    if (instance && this.context.currentScene.phase === 'active') {
      instance.tick(time, delta)
    }
  }

  // ─── Transitions ──────────────────────────────────────────────────────────

  /**
   * Transitions to a registered scene.
   * Orchestrates: load → mount → (exit current) → enter → active.
   */
  public async transitionTo(sceneId: string): Promise<void> {
    if (this.context.isTransitioning) {
      logger.warn('[SceneManager] Transition already in progress. Ignoring request.')
      return
    }

    if (!this.registry.has(sceneId)) {
      logger.error(`[SceneManager] Cannot transition to unknown scene: '${sceneId}'`)
      return
    }

    this.context.isTransitioning = true
    this.context.nextScene = this.createSceneState(sceneId, 'loading')

    const currentId = this.context.currentScene?.id ?? 'none'
    globalEventBus.emit('scene:transition_start', { from: currentId, to: sceneId })

    try {
      const nextInstance = this.registry.get(sceneId)!

      // 1. Load
      globalEventBus.emit('scene:load_start', { sceneId })
      await nextInstance.load()
      this.context.nextScene.phase = 'ready'
      globalEventBus.emit('scene:load_complete', { sceneId })

      // 2. Mount (invisible)
      nextInstance.mount()

      // 3. Exit current
      if (this.context.currentScene) {
        this.context.currentScene.phase = 'exiting'
        const currentInstance = this.registry.get(this.context.currentScene.id)
        if (currentInstance) {
          await currentInstance.exit()
          currentInstance.unmount()
        }
        this.context.previousScene = this.context.currentScene
      }

      // 4. Enter next
      this.context.currentScene = this.context.nextScene
      this.context.currentScene.phase = 'entering'
      this.context.nextScene = null

      await nextInstance.enter()
      this.context.currentScene.phase = 'active'
      this.state = 'running'

      globalEventBus.emit('scene:transition_complete', { current: sceneId })
      logger.info(`[SceneManager] Transitioned to scene: '${sceneId}'`)
    } catch (error) {
      logger.error(`[SceneManager] Transition to '${sceneId}' failed`, error)
      // Reset next scene pointer on failure
      this.context.nextScene = null
    } finally {
      this.context.isTransitioning = false
    }
  }

  // ─── Accessors ────────────────────────────────────────────────────────────

  public getContext(): SceneManagerContext {
    return { ...this.context }
  }

  // ─── Dispose ──────────────────────────────────────────────────────────────

  public dispose(): void {
    if (this.context.currentScene) {
      const instance = this.registry.get(this.context.currentScene.id)
      instance?.unmount()
    }
    this.context = {
      currentScene: null,
      nextScene: null,
      previousScene: null,
      isTransitioning: false,
    }
    this.state = 'destroyed'
    logger.info('[SceneManager] Disposed')
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private createSceneState(id: string, phase: ScenePhase): SceneState {
    return { id, phase, progress: 0 }
  }
}
