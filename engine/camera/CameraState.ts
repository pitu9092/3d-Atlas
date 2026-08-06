/**
 * @file engine/camera/CameraState.ts
 * @description State interface for the engine camera.
 *
 * Purpose: Tracks the current position, rotation, and field of view of the camera.
 */

export interface CameraState {
  x: number
  y: number
  z: number
  rotationX: number
  rotationY: number
  rotationZ: number
  fov: number
  isAnimating: boolean
}
