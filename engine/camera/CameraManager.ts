/**
 * @file engine/camera/CameraManager.ts
 * @description Architecture shell for managing the Three.js camera.
 *
 * Purpose: Centralizes camera lifecycle, resizing, and controller delegation.
 * Responsibilities: Instantiating the camera, handling window resize aspect ratios,
 * and coordinating with CameraController.
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

import { CameraController } from './CameraController'
import { type CameraState } from './CameraState'

export class CameraManager implements EngineManager, Tickable, Resizable {
  public state: LifecycleState = 'uninitialized'

  public controller: CameraController

  private cameraInstance: THREE.PerspectiveCamera | null = null

  private cameraState: CameraState = {
    x: threeConfig.canvas.camera.position[0],
    y: threeConfig.canvas.camera.position[1],
    z: threeConfig.canvas.camera.position[2],
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    fov: threeConfig.canvas.camera.fov,
    isAnimating: false,
  }

  constructor() {
    this.controller = new CameraController()
  }

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    this.cameraInstance = new THREE.PerspectiveCamera(
      this.cameraState.fov,
      window.innerWidth / window.innerHeight,
      threeConfig.canvas.camera.near,
      threeConfig.canvas.camera.far,
    )
    this.cameraInstance.position.set(this.cameraState.x, this.cameraState.y, this.cameraState.z)

    logger.info('CameraManager initialized with THREE.PerspectiveCamera')
    this.state = 'ready'
  }

  /**
   * Updates camera aspect ratio on window resize.
   */
  public resize(width: number, height: number, _pixelRatio: number): void {
    if (this.cameraInstance && height > 0) {
      this.cameraInstance.aspect = width / height
      this.cameraInstance.updateProjectionMatrix()
    }
  }

  /**
   * Ticks the camera controller and applies the state to the actual camera.
   */
  public tick(time: number, delta: number, _frame: number): void {
    if (this.state !== 'running') return

    this.cameraState = this.controller.tick(time, delta, this.cameraState)

    if (this.cameraInstance) {
      this.cameraInstance.position.set(this.cameraState.x, this.cameraState.y, this.cameraState.z)
      this.cameraInstance.rotation.set(
        this.cameraState.rotationX,
        this.cameraState.rotationY,
        this.cameraState.rotationZ,
      )

      if (this.cameraInstance.fov !== this.cameraState.fov) {
        this.cameraInstance.fov = this.cameraState.fov
        this.cameraInstance.updateProjectionMatrix()
      }
    }
  }

  public getState(): CameraState {
    return { ...this.cameraState }
  }

  public getCamera(): THREE.PerspectiveCamera | null {
    return this.cameraInstance
  }

  public dispose(): void {
    this.cameraInstance = null
    this.state = 'destroyed'
  }
}
