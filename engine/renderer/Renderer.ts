/**
 * @file engine/renderer/Renderer.ts
 * @description Architecture shell for the WebGL Rendering system.
 *
 * Purpose: Centralizes Three.js WebGLRenderer initialization, post-processing, and render passes.
 * Responsibilities: WebGL initialization, applying threeConfig, managing render loops.
 */

import * as THREE from 'three'

import { threeConfig } from '@/config/three'
import { logger } from '@/lib/core'

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

  // WebGLRenderer instance placeholder
  private gl: THREE.WebGLRenderer | null = null

  constructor() {
    this.canvasManager = new CanvasManager()
    this.resizeManager = new ResizeManager()
    this.loop = new RenderLoop()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    const canvas = this.canvasManager.getCanvas()
    if (canvas) {
      this.gl = new THREE.WebGLRenderer({
        canvas,
        alpha: threeConfig.canvas.gl.alpha,
        antialias: threeConfig.canvas.gl.antialias,
        powerPreference: threeConfig.canvas.gl.powerPreference,
      })

      this.gl.outputColorSpace = THREE.SRGBColorSpace
      this.gl.toneMapping = THREE.ACESFilmicToneMapping
    }

    logger.info('Renderer initialized with THREE.WebGLRenderer')
    this.state = 'ready'
  }

  public resize(width: number, height: number, pixelRatio: number): void {
    if (this.gl) {
      this.gl.setSize(width, height)
      this.gl.setPixelRatio(pixelRatio)
    }
  }

  public tick(_time: number, _delta: number, _frame: number): void {
    if (this.state !== 'running' || !this.gl) return

    // Called externally by SceneManager or RenderLoop when ready to render
  }

  public render(scene: THREE.Scene, camera: THREE.Camera): void {
    if (this.state !== 'running' || !this.gl) return
    this.gl.render(scene, camera)
  }

  public dispose(): void {
    this.loop.dispose()
    this.resizeManager.dispose()
    this.canvasManager.dispose()

    if (this.gl) {
      this.gl.dispose()
      this.gl = null
    }

    this.state = 'destroyed'
  }
}
