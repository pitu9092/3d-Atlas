# 16 — Camera System

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Camera architecture — controllers, presets, interpolation, and transitions

---

## Camera System Design

### Architecture

```
[ScrollTrigger onUpdate]
    │ writes progress value
    ▼
[Camera Ref (per scene)]
    │ stores target position
    ▼
[useFrame (per scene)]
    │ reads ref → applies to camera
    ▼
[THREE.PerspectiveCamera]
    │ position/rotation updated
    ▼
[Renderer renders from camera]
```

### Why Refs (Not State)

Camera position updates at 60fps. `useState` would trigger 60 React re-renders per second — catastrophic.

Refs hold the target value. `useFrame` reads and applies — bypassing React's render cycle entirely.

---

## Camera Presets

All camera initial states are defined in `lib/constants/cameras.ts`:

```typescript
export const CAMERA_PRESETS = {
  globe: {
    fov: 50,
    position: [0, 0.5, 3.5],
    target: [0, 0, 0],
    near: 0.01,
    far: 1000,
  },
  crane: {
    fov: 60,
    position: [3, 2.5, 8],
    target: [0.5, 1.5, 0],
    near: 0.01,
    far: 1000,
  },
  truck: {
    fov: 65,
    position: [0, 0.3, 8],
    target: [0, 0.5, 0],
    near: 0.01,
    far: 1000,
  },
  ship: {
    fov: 45,
    position: [0, 20, 0],
    rotation: [-Math.PI / 2, 0, 0], // Aerial, pointing down
    near: 0.01,
    far: 1000,
  },
  aircraft: {
    fov: 60,
    position: [0, 5, 30],
    target: [0, 0, 0],
    near: 0.01,
    far: 1000,
  },
}
```

---

## Camera Controllers

### Globe Camera Controller

**Type**: Scroll-driven Z position  
**Driver**: ScrollTrigger `hero-cam` `onUpdate`

```
State:
  cameraZRef: MutableRefObject<number>

ScrollTrigger onUpdate:
  cameraZRef.current = lerp(3.5, 7.0, self.progress)

useFrame:
  camera.position.z = cameraZRef.current
  camera.lookAt(0, 0, 0)   ← Re-apply lookAt every frame (position changed)
```

**No mouse parallax** (not confirmed in reference — skip).

---

### Crane Camera Controller

**Type**: Static — no movement  
**Driver**: None

```
Camera position is set once at mount:
  camera.position.set(3, 2.5, 8)
  camera.lookAt(0.5, 1.5, 0)

No useFrame camera update needed for crane.
```

---

### Truck Camera Controller

**Type**: Static — no movement  
**Driver**: None

```
camera.position.set(0, 0.3, 8)
camera.lookAt(0, 0.5, 0)
```

---

### Ship Camera Controller

**Type**: Scroll-driven Y position (3-phase)  
**Driver**: ScrollTrigger `ship-pin` `onUpdate`

```
State:
  cameraYRef: MutableRefObject<number>

ScrollTrigger onUpdate (progress = 0–1):

  if (progress < 0.40):
    local = progress / 0.40
    cameraYRef.current = lerp(20, 10, easeInOut(local))

  elif (progress >= 0.40 && progress < 0.55):
    cameraYRef.current = 10  // Hold

  else:
    local = (progress - 0.55) / 0.45
    cameraYRef.current = lerp(10, 20, easeInOut(local))

useFrame:
  camera.position.y = cameraYRef.current
  // Rotation stays fixed: rotation.x = -PI/2
  // lookAt() NOT used — camera pointing straight down
```

**Important**: Ship camera points straight down. `lookAt()` does not work when camera faces -Y axis. Set `rotation.x = -Math.PI / 2` directly, and keep it fixed.

---

### Aircraft Camera Controller

**Type**: Scroll-driven Z + Y position  
**Driver**: ScrollTrigger `aircraft-pin` `onUpdate`

```
State:
  cameraZRef: MutableRefObject<number>
  cameraYRef: MutableRefObject<number>

ScrollTrigger onUpdate:
  cameraZRef.current = lerp(30, 5, self.progress)
  cameraYRef.current = lerp(5, 3, self.progress)

useFrame:
  camera.position.z = cameraZRef.current
  camera.position.y = cameraYRef.current
  camera.lookAt(0, 0, 0)
```

---

## LookAt Strategy

| Scene    | lookAt Called | Where                             |
| -------- | ------------- | --------------------------------- |
| Globe    | Yes           | Every useFrame (position changes) |
| Crane    | Once          | At mount                          |
| Truck    | Once          | At mount                          |
| Ship     | Never         | Rotation set directly             |
| Aircraft | Yes           | Every useFrame (position changes) |

### Why lookAt Every Frame (Globe, Aircraft)

When `camera.position` changes, `camera.lookAt()` must be re-called to maintain the target. This is a Three.js requirement — lookAt is not persistent.

---

## Camera Interpolation

### Scrub Interpolation (ScrollTrigger)

ScrollTrigger's `scrub` value adds a lag to the animation:

- `scrub: 0.5` — 0.5s of smoothing lag
- `scrub: true` — direct 1:1 mapping

For cameras: use `scrub: 0.5` for organic feel.

### useFrame LERP (Optional Enhancement)

Instead of direct assignment, apply a lerp for extra smoothness:

```
// Instead of: camera.position.z = targetZ
// Use:
camera.position.z += (targetZ - camera.position.z) × 0.1
```

This adds a second layer of smoothing. Only needed if scroll scrub feels mechanical.

---

## Camera Aspect Ratio

### On Canvas Resize

R3F automatically updates camera aspect ratio when canvas resizes:

```
<PerspectiveCamera makeDefault onUpdate={(cam) => cam.updateProjectionMatrix()} />
```

The `makeDefault` prop registers this as the scene's active camera. R3F's internal resize handler calls `updateProjectionMatrix()` automatically.

---

## Camera Projection Matrix

`updateProjectionMatrix()` must be called whenever:

- FOV changes
- Aspect ratio changes (canvas resize)
- Near/far planes change

For this project, none of these change at runtime — call once at mount.

---

## Camera Handoff Between Scenes

There is NO camera handoff. Each scene has its own independent camera. When scrolling from crane to ship:

- Crane canvas pauses (frameloop="demand")
- Ship canvas activates (frameloop="always")
- Each camera is in its own WebGL context

There is no 3D camera transition between scenes.

---

## Debug Camera (Development Only)

In development, `<OrbitControls>` from Drei can be temporarily added to any scene for positioning verification:

```jsx
{
  process.env.NODE_ENV === 'development' && <OrbitControls />
}
```

**Must be removed for production.** User camera control destroys the cinematic experience.
