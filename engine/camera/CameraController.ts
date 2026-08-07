/**
 * @file engine/camera/CameraController.ts
 * @description Logic for specific camera behaviors (e.g., OrbitControls, Scroll-driven).
 *
 * Purpose: Separates camera manipulation logic from the Three.js camera instance.
 * Responsibilities: Handling parallax, scroll-driven movement, and lookAt targets.
 */

import { type CameraState } from './CameraState'

export class CameraController {
  private targetPosition = { x: 0, y: 0, z: 5 }
  // focal point for the camera
  private parallaxOffset = { x: 0, y: 0 }

  /**
   * Sets the base target position for the camera.
   */
  public setTargetPosition(x: number, y: number, z: number): void {
    this.targetPosition = { x, y, z }
  }

  /**
   * Sets the focal point for the camera.
   */
  public setLookAt(_x: number, _y: number, _z: number): void {
    // Math logic to update focal point will go here
  }

  /**
   * Applies mouse/touch parallax offsets.
   */
  public setParallax(x: number, y: number): void {
    this.parallaxOffset = { x, y }
  }

  /**
   * Called every frame to compute the next camera state smoothly.
   */
  public tick(_time: number, _delta: number, currentState: CameraState): CameraState {
    // Simple lerp factor
    const lerpFactor = 0.05

    // Target pos
    const tx = this.targetPosition.x + this.parallaxOffset.x
    const ty = this.targetPosition.y + this.parallaxOffset.y
    const tz = this.targetPosition.z

    // Lerp
    const x = currentState.x + (tx - currentState.x) * lerpFactor
    const y = currentState.y + (ty - currentState.y) * lerpFactor
    const z = currentState.z + (tz - currentState.z) * lerpFactor

    return {
      ...currentState,
      x,
      y,
      z,
    }
  }
}
