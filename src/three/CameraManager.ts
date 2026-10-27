import * as THREE from 'three';
import { CameraKeyframe } from '@/types';

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Sequence 01: Hero Scene (Slightly tilted high-tech perspective)
  {
    progress: 0.0,
    position: [0, 0.4, 5.2],
    target: [0, 0, 0],
    fov: 45,
  },
  // Sequence 02: Editorial Statement (Camera orbits and pulls back slightly)
  {
    progress: 0.22,
    position: [2.2, 1.2, 4.4],
    target: [0, 0, 0],
    fov: 42,
  },
  // Sequence 03: Global Logistics Network (Close-up zoom on northern hemisphere hubs)
  {
    progress: 0.48,
    position: [1.1, 1.8, 3.1],
    target: [0.3, 0.5, 0],
    fov: 38,
  },
  // Sequence 04: Command Matrix HUD (Top-angled tactical telemetry view)
  {
    progress: 0.74,
    position: [0.0, 3.4, 3.2],
    target: [0, 0.2, 0],
    fov: 40,
  },
  // Sequence 05: Climax & CTA (Hyper-drive pull-back through satellite ring)
  {
    progress: 1.0,
    position: [0, 0.8, 6.2],
    target: [0, 0, 0],
    fov: 48,
  },
];

export class CameraManager {
  private camera: THREE.PerspectiveCamera;
  private currentPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 5.2);
  private currentTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private targetPos: THREE.Vector3 = new THREE.Vector3(0, 0.4, 5.2);
  private lookAtTarget: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private mouseOffset: THREE.Vector2 = new THREE.Vector2(0, 0);

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);
  }

  public setMouseParallax(normalizedX: number, normalizedY: number) {
    // Parallax damping
    this.mouseOffset.set(normalizedX * 0.4, -normalizedY * 0.3);
  }

  public update(progress: number, delta: number) {
    // Determine keyframe interpolation interval
    const clampedProgress = Math.max(0, Math.min(1, progress));
    let startFrame = CAMERA_KEYFRAMES[0];
    let endFrame = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1];

    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (
        clampedProgress >= CAMERA_KEYFRAMES[i].progress &&
        clampedProgress <= CAMERA_KEYFRAMES[i + 1].progress
      ) {
        startFrame = CAMERA_KEYFRAMES[i];
        endFrame = CAMERA_KEYFRAMES[i + 1];
        break;
      }
    }

    const range = endFrame.progress - startFrame.progress;
    const localT = range > 0 ? (clampedProgress - startFrame.progress) / range : 0;
    // Cubic smoothstep easing
    const smoothT = localT * localT * (3 - 2 * localT);

    // Interpolate target position
    this.targetPos.set(
      THREE.MathUtils.lerp(startFrame.position[0], endFrame.position[0], smoothT),
      THREE.MathUtils.lerp(startFrame.position[1], endFrame.position[1], smoothT),
      THREE.MathUtils.lerp(startFrame.position[2], endFrame.position[2], smoothT)
    );

    this.lookAtTarget.set(
      THREE.MathUtils.lerp(startFrame.target[0], endFrame.target[0], smoothT),
      THREE.MathUtils.lerp(startFrame.target[1], endFrame.target[1], smoothT),
      THREE.MathUtils.lerp(startFrame.target[2], endFrame.target[2], smoothT)
    );

    const targetFov = THREE.MathUtils.lerp(startFrame.fov, endFrame.fov, smoothT);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, delta * 4);
    this.camera.updateProjectionMatrix();

    // Smooth lerp to camera position with mouse parallax added
    const lerpFactor = Math.min(1, delta * 3.5);
    this.currentPos.x = THREE.MathUtils.lerp(
      this.currentPos.x,
      this.targetPos.x + this.mouseOffset.x,
      lerpFactor
    );
    this.currentPos.y = THREE.MathUtils.lerp(
      this.currentPos.y,
      this.targetPos.y + this.mouseOffset.y,
      lerpFactor
    );
    this.currentPos.z = THREE.MathUtils.lerp(
      this.currentPos.z,
      this.targetPos.z,
      lerpFactor
    );

    this.currentTarget.lerp(this.lookAtTarget, lerpFactor);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);
  }
}
