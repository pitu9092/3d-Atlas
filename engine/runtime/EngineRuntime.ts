/**
 * @file engine/runtime/EngineRuntime.ts
 * @description Master orchestrator for the 3D Atlas Engine.
 *
 * Purpose: Instantiates all managers, drives their shared lifecycle,
 * and wires the render loop to per-frame updates and resize events.
 *
 * Responsibilities:
 *   - Manager instantiation in dependency order
 *   - Sequential initialization (performance → loader → animation → scroll → camera → renderer → scene)
 *   - Per-frame update dispatch to all Tickable managers via RenderLoop subscriber
 *   - Global resize dispatch to all Resizable managers via EventBus
 *   - Global pause / resume orchestration
 *   - Graceful disposal in reverse order
 */

import { logger } from '@/lib/core'

import { AnimationManager } from '../animation'
import { CameraManager } from '../camera'
import { globalEventBus } from '../events'
import { LoadingManager, Preloader } from '../loader'
import { PerformanceMonitor } from '../performance'
import { Renderer } from '../renderer'
import { SceneManager } from '../scene'
import { ScrollManager } from '../scroll'
import { type LifecycleState } from '../shared/EngineTypes'

export class EngineRuntime {
  public state: LifecycleState = 'uninitialized'

  // ── Managers ───────────────────────────────────────────────────────────────
  public readonly performance: PerformanceMonitor
  public readonly loader: LoadingManager
  public readonly preloader: Preloader
  public readonly animation: AnimationManager
  public readonly scroll: ScrollManager
  public readonly renderer: Renderer
  public readonly camera: CameraManager
  public readonly scene: SceneManager

  /** Unsubscribe from global resize events. */
  private unsubscribeResize: (() => void) | null = null

  /** Unsubscribe from the render loop. */
  private unsubscribeLoop: (() => void) | null = null

  constructor() {
    this.performance = new PerformanceMonitor()
    this.loader = new LoadingManager()
    this.preloader = new Preloader(this.loader)
    this.animation = new AnimationManager()
    this.scroll = new ScrollManager()
    this.renderer = new Renderer()
    this.camera = new CameraManager()
    this.scene = new SceneManager()
  }

  // ─── Initialization ────────────────────────────────────────────────────────

  public async init(): Promise<void> {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    logger.info('[EngineRuntime] Initializing managers...')

    // 1. Core infrastructure
    this.performance.init()
    this.loader.init()

    // 2. Interaction systems
    this.animation.init()
    this.scroll.init()

    // 3. 3D context managers
    this.camera.init()
    this.renderer.init()
    this.scene.init()

    // ── Wire resize events → all Resizable managers ─────────────────────
    this.unsubscribeResize = this.wireResize()

    // ── Wire render loop → per-frame update dispatch ─────────────────────
    this.unsubscribeLoop = this.wireRenderLoop()

    this.state = 'ready'
    logger.info('[EngineRuntime] All managers initialized.')
  }

  // ─── Engine Contract ───────────────────────────────────────────────────────

  /**
   * Per-frame update dispatched by the render loop.
   * Called with delta time in milliseconds.
   */
  public update(time: number, delta: number, frame: number): void {
    if (this.state !== 'running') return

    this.performance.tick(time, delta, frame)
    this.camera.tick(time, delta, frame)
    this.scene.tick(time, delta, frame)
  }

  /**
   * Pauses all engine managers (stops ticking, freezes scroll).
   */
  public pause(): void {
    if (this.state !== 'running') return
    this.state = 'paused'

    this.animation.pause?.()
    this.scroll.pause?.()
    this.camera.pause?.()
    this.performance.pause?.()
    this.renderer.pause?.()

    logger.info('[EngineRuntime] Paused.')
  }

  /**
   * Resumes all paused managers.
   */
  public resume(): void {
    if (this.state !== 'paused') return
    this.state = 'running'

    this.animation.resume?.()
    this.scroll.resume?.()
    this.camera.resume?.()
    this.performance.resume?.()
    this.renderer.resume?.()

    logger.info('[EngineRuntime] Resumed.')
  }

  /**
   * Handles viewport resize. Propagates to all Resizable managers.
   */
  public resize(width: number, height: number, pixelRatio: number): void {
    this.renderer.resize(width, height, pixelRatio)
    this.camera.resize(width, height, pixelRatio)
    this.scene.resize?.(width, height, pixelRatio)
    this.scroll.resize?.(width, height, pixelRatio)
    this.animation.resize?.(width, height, pixelRatio)
  }

  /**
   * Disposes all managers in reverse init order (scene → renderer → camera → scroll → animation → loader → performance).
   */
  public dispose(): void {
    logger.info('[EngineRuntime] Disposing...')

    // ── Unsubscribe internal listeners ───────────────────────────────────
    this.unsubscribeLoop?.()
    this.unsubscribeResize?.()
    this.unsubscribeLoop = null
    this.unsubscribeResize = null

    // ── Stop render loop before disposing managers ───────────────────────
    this.renderer.loop.stop()

    // ── Dispose in reverse init order ────────────────────────────────────
    this.scene.dispose()
    this.renderer.dispose()
    this.camera.dispose()
    this.scroll.dispose()
    this.animation.dispose()
    this.loader.dispose()
    this.performance.dispose()

    this.state = 'destroyed'
    logger.info('[EngineRuntime] Disposed.')
  }

  // ─── Internal Wiring ──────────────────────────────────────────────────────

  /**
   * Subscribes to the global EventBus resize event and calls `this.resize()`.
   * Returns an unsubscribe function.
   */
  private wireResize(): () => void {
    const handler = ({
      width,
      height,
      pixelRatio,
    }: {
      width: number
      height: number
      pixelRatio: number
    }): void => {
      this.resize(width, height, pixelRatio)
    }

    globalEventBus.on('window:resize', handler)

    return () => {
      globalEventBus.off('window:resize', handler)
    }
  }

  /**
   * Registers a per-frame subscriber on the RenderLoop.
   * Returns an unsubscribe function.
   */
  private wireRenderLoop(): () => void {
    const subscriber = (time: number, delta: number, frame: number): void => {
      // Transition to running on first frame
      if (this.state === 'ready') {
        this.state = 'running'
      }

      this.update(time, delta, frame)
    }

    return this.renderer.loop.subscribe(subscriber)
  }
}
