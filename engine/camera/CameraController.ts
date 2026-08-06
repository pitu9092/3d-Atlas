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
    // Math logic for lerping camera position and applying parallax goes here

    return {
      ...currentState,
      x: this.targetPosition.x + this.parallaxOffset.x,
      y: this.targetPosition.y + this.parallaxOffset.y,
      z: this.targetPosition.z,
    }
  }
}
