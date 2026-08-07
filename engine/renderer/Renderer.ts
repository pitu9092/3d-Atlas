/**
 * @file engine/renderer/Renderer.ts
 * @description WebGL Rendering system built on Three.js.
 *
 * Purpose: Centralizes Three.js WebGLRenderer initialization, configuration,
 * and lifecycle. In the R3F path, the renderer is managed by CanvasRoot/
 * RendererManager — this class provides the raw Three.js fallback path and
 * the shared resize/tick contract.
 */

import * as THREE from 'three'

import { threeConfig } from '@/config/three'
import { logger } from '@/lib/core'

import { globalEventBus } from '../events'
import {
  type EngineManager,
  type LifecycleState,
  type Tickable,
  type Resizable,
} from '../shared/EngineTypes'

import { CanvasManager } from './CanvasManager'
import { RenderLoop } from './RenderLoop'
import { ResizeManager } from './ResizeManager'

export class Renderer implements EngineManager, Tickable, Resizable {
  public state: LifecycleState = 'uninitialized'

  public canvasManager: CanvasManager
  public resizeManager: ResizeManager
  public loop: RenderLoop

  private gl: THREE.WebGLRenderer | null = null

  constructor() {
    this.canvasManager = new CanvasManager()
    this.resizeManager = new ResizeManager()
    this.loop = new RenderLoop()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    this.resizeManager.init()

    const canvas = this.canvasManager.getCanvas()
    if (canvas) {
      this.gl = new THREE.WebGLRenderer({
        canvas,
        alpha: threeConfig.canvas.gl.alpha,
        antialias: threeConfig.canvas.gl.antialias,
        powerPreference: threeConfig.canvas.gl.powerPreference as WebGLPowerPreference,
      })

      this.gl.outputColorSpace = THREE.SRGBColorSpace
      this.gl.toneMapping = THREE.ACESFilmicToneMapping
      this.gl.shadowMap.enabled = threeConfig.shadows.enabled
      this.gl.shadowMap.type = THREE.PCFSoftShadowMap
    }

    // Subscribe to resize events so renderer stays in sync
    globalEventBus.on('window:resize', ({ width, height, pixelRatio }) => {
      this.resize(width, height, pixelRatio)
    })

    logger.info('Renderer initialized with THREE.WebGLRenderer')
    this.state = 'ready'
  }

  public update(_delta: number): void {
    // Rendering is driven by scene manager via render()
  }

  public pause(): void {
    this.loop.pause()
  }

  public resume(): void {
    this.loop.resume()
  }

  public resize(width: number, height: number, pixelRatio: number): void {
    if (this.gl) {
      this.gl.setSize(width, height)
      this.gl.setPixelRatio(pixelRatio)
    }
  }

  public tick(_time: number, _delta: number, _frame: number): void {
    // Called externally by SceneManager or RenderLoop when ready to render
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    if (!this.gl) return
    this.gl.render(scene, camera)
  }

  /** Expose the raw WebGLRenderer (e.g., for post-processing setup). */
  public getGL(): THREE.WebGLRenderer | null {
    return this.gl
  }

  public dispose(): void {
    this.loop.dispose()
    this.resizeManager.dispose()
    this.canvasManager.dispose()

    globalEventBus.clear('window:resize')

    if (this.gl) {
      this.gl.dispose()
      this.gl = null
    }

    this.state = 'destroyed'
  }
}
