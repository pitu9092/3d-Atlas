/**
 * @file engine/camera/CameraManager.ts
 * @description Architecture shell for managing the Three.js camera.
 *
 * Purpose: Centralizes camera lifecycle, resizing, and controller delegation.
 * Responsibilities: Instantiating the camera, handling window resize aspect ratios,
 * and coordinating with CameraController.
 */

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

  // Three.js PerspectiveCamera placeholder
  private cameraInstance: unknown = null

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

    // Note: If using R3F, this class might just manage state/controller logic
    // and sync with useThree().camera, rather than instantiating it directly.

    logger.info('CameraManager initialized')
    this.state = 'ready'
  }

  /**
   * Updates camera aspect ratio on window resize.
   */
  public resize(_width: number, _height: number, _pixelRatio: number): void {
    if (this.cameraInstance) {
      // TODO: this.cameraInstance.aspect = width / height
      // TODO: this.cameraInstance.updateProjectionMatrix()
    }
  }

  /**
   * Ticks the camera controller and applies the state to the actual camera.
   */
  public tick(time: number, delta: number, _frame: number): void {
    if (this.state !== 'running') return

    this.cameraState = this.controller.tick(time, delta, this.cameraState)

    if (this.cameraInstance) {
      // TODO: Apply state to cameraInstance
      // this.cameraInstance.position.set(...)
    }
  }

  public getState(): CameraState {
    return { ...this.cameraState }
  }

  public dispose(): void {
    this.state = 'destroyed'
  }
}
