/**
 * @file engine/runtime/EngineRuntime.ts
 * @description Master orchestrator for the 3D Atlas Engine.
 *
 * Purpose: Centralizes instantiation, lifecycle, and ticker of all engine managers.
 */

import { logger } from '@/lib/core'

import { AnimationManager } from '../animation'
import { CameraManager } from '../camera'
import { LoadingManager, Preloader } from '../loader'
import { PerformanceMonitor } from '../performance'
import { Renderer } from '../renderer'
import { SceneManager } from '../scene'
import { ScrollManager } from '../scroll'
import { type LifecycleState } from '../shared/EngineTypes'

export class EngineRuntime {
  public state: LifecycleState = 'uninitialized'

  public performance: PerformanceMonitor
  public loader: LoadingManager
  public preloader: Preloader
  public animation: AnimationManager
  public scroll: ScrollManager
  public renderer: Renderer
  public camera: CameraManager
  public scene: SceneManager

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

  public async init(): Promise<void> {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    logger.info('Initializing Engine Runtime Managers...')

    // Initialize core infrastructure first
    this.performance.init()
    this.loader.init()

    // Initialize interaction systems
    this.animation.init()
    this.scroll.init()

    // Initialize 3D context managers
    this.camera.init()
    this.renderer.init()
    this.scene.init()

    this.state = 'ready'
    logger.info('Engine Runtime Managers Initialized')
  }

  public dispose(): void {
    logger.info('Disposing Engine Runtime...')

    this.scene.dispose()
    this.renderer.dispose()
    this.camera.dispose()
    this.scroll.dispose()
    this.animation.dispose()
    this.loader.dispose()
    this.performance.dispose()

    this.state = 'destroyed'
  }
}
