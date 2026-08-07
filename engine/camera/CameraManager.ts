/**
 * @file engine/camera/CameraManager.ts
 * @description Manages the Three.js camera system.
 *
 * Purpose: Centralizes camera lifecycle, resizing, registry, and controller delegation.
 * Responsibilities:
 *   - Camera registry (multiple named cameras, one active at a time)
 *   - Perspective camera creation with config defaults
 *   - Aspect ratio updates on resize
 *   - Smooth interpolation via CameraController
 *   - pause / resume (halts per-frame interpolation)
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

  /** Registry of named cameras. */
  private registry: Map<string, THREE.Camera> = new Map()

  /** ID of the currently active camera. */
  private activeCameraId: string | null = null

  /** The primary perspective camera instance. */
  private primaryCamera: THREE.PerspectiveCamera | null = null

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

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  public init(): void {
    if (this.state !== 'uninitialized') return
    this.state = 'initializing'

    const cam = new THREE.PerspectiveCamera(
      this.cameraState.fov,
      typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1,
      threeConfig.canvas.camera.near,
      threeConfig.canvas.camera.far,
    )
    cam.position.set(this.cameraState.x, this.cameraState.y, this.cameraState.z)

    this.primaryCamera = cam
    this.registerCamera('primary', cam)
    this.setActiveCamera('primary')

    logger.info('CameraManager initialized with PRIMARY perspective camera')
    this.state = 'ready'
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

  // ─── Tickable ─────────────────────────────────────────────────────────────

  public tick(time: number, delta: number, _frame: number): void {
    if (this.state !== 'running') return

    this.cameraState = this.controller.tick(time, delta, this.cameraState)

    if (this.primaryCamera) {
      this.primaryCamera.position.set(this.cameraState.x, this.cameraState.y, this.cameraState.z)
      this.primaryCamera.rotation.set(
        this.cameraState.rotationX,
        this.cameraState.rotationY,
        this.cameraState.rotationZ,
      )

      if (this.primaryCamera.fov !== this.cameraState.fov) {
        this.primaryCamera.fov = this.cameraState.fov
        this.primaryCamera.updateProjectionMatrix()
      }
    }
  }

  // ─── Resizable ────────────────────────────────────────────────────────────

  public resize(width: number, height: number, _pixelRatio: number): void {
    if (this.primaryCamera && height > 0) {
      this.primaryCamera.aspect = width / height
      this.primaryCamera.updateProjectionMatrix()
    }
  }

  // ─── Camera Registry ──────────────────────────────────────────────────────

  /**
   * Registers a named camera in the registry.
   */
  public registerCamera(id: string, camera: THREE.Camera): void {
    if (this.registry.has(id)) {
      logger.warn(`[CameraManager] Camera '${id}' already registered. Overwriting.`)
    }
    this.registry.set(id, camera)
    logger.info(`[CameraManager] Registered camera: '${id}'`)
  }

  /**
   * Retrieves a camera from the registry.
   */
  public getCamera(id: string): THREE.Camera | undefined {
    return this.registry.get(id)
  }

  /**
   * Sets the active camera by ID.
   */
  public setActiveCamera(id: string): void {
    if (!this.registry.has(id)) {
      logger.error(`[CameraManager] Camera '${id}' not found in registry.`)
      return
    }
    this.activeCameraId = id
    logger.info(`[CameraManager] Active camera set to: '${id}'`)
  }

  /**
   * Returns the currently active camera.
   */
  public getActiveCamera(): THREE.Camera | null {
    if (!this.activeCameraId) return this.primaryCamera
    return this.registry.get(this.activeCameraId) ?? this.primaryCamera
  }

  /**
   * Returns the primary perspective camera (always available after init).
   */
  public getPrimaryCamera(): THREE.PerspectiveCamera | null {
    return this.primaryCamera
  }

  public getCameraState(): CameraState {
    return { ...this.cameraState }
  }

  // ─── Dispose ──────────────────────────────────────────────────────────────

  public dispose(): void {
    this.registry.clear()
    this.primaryCamera = null
    this.activeCameraId = null
    this.state = 'destroyed'
    logger.info('[CameraManager] Disposed')
  }
}
