# 06 — Camera Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Complete per-scene camera specifications — position, target, FOV, movement, interpolation

---

## Camera System Design

| Property             | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| **Camera type**      | `THREE.PerspectiveCamera` (all 5 scenes)                             |
| **User control**     | None                                                                 |
| **Near plane**       | `0.01` (all scenes)                                                  |
| **Far plane**        | `1000` (all scenes)                                                  |
| **Primary driver**   | GSAP ScrollTrigger scrub                                             |
| **Secondary driver** | `useFrame` (Globe: mouse parallax if implemented)                    |
| **Anti-jitter**      | Use `MathUtils.lerp` inside `useFrame` for smooth camera transitions |

---

## CAMERA 01 — Globe Hero

### Setup

| Property         | Spec                                        |
| ---------------- | ------------------------------------------- |
| Type             | `PerspectiveCamera(50, aspect, 0.01, 1000)` |
| Initial position | `new Vector3(0, 0.5, 3.5)`                  |
| Target (lookAt)  | `new Vector3(0, 0, 0)`                      |
| Up               | `new Vector3(0, 1, 0)`                      |

### Scroll-Driven Movement

| Property          | Spec                                                                 |
| ----------------- | -------------------------------------------------------------------- |
| Property animated | `camera.position.z`                                                  |
| Start value       | `3.5`                                                                |
| End value         | `7.0`                                                                |
| Range             | ScrollTrigger progress `0.0 → 1.0`                                   |
| Formula           | `z = 3.5 + (progress × 3.5)` = `lerp(3.5, 7.0, progress)`            |
| Interpolation     | Direct set (no additional lerp needed — ST scrub provides smoothing) |

### Optional Mouse Parallax

```
If implementing mouse parallax:
  camera.position.x += (targetX - camera.position.x) × 0.05
  camera.position.y += (targetY - camera.position.y) × 0.05

  Where targetX = (mouseX / window.innerWidth - 0.5) × 0.5
  Where targetY = -(mouseY / window.innerHeight - 0.5) × 0.3

  Magnitude: very small (±0.25 units) to not break globe composition
```

### Reactive Events

| Event               | Camera Response                                |
| ------------------- | ---------------------------------------------- |
| Globe section enter | Camera at `z=3.5`                              |
| Scroll 50%          | Camera at `z=5.25`                             |
| Globe section exit  | Camera at `z=7.0`                              |
| Section left        | Camera state preserved until scene deactivates |

---

## CAMERA 02 — Reach Stacker Crane

### Setup

| Property | Spec                                        |
| -------- | ------------------------------------------- |
| Type     | `PerspectiveCamera(60, aspect, 0.01, 1000)` |
| Position | `new Vector3(3, 2.5, 8)`                    |
| Target   | `new Vector3(0.5, 1.5, 0)`                  |
| Up       | `new Vector3(0, 1, 0)`                      |

### Movement

| Property           | Spec                                              |
| ------------------ | ------------------------------------------------- |
| Movement type      | **NONE — fully static**                           |
| Reason             | All animation is in the GLB model, not the camera |
| Dynamic properties | None                                              |

### Framing Rationale

Position `[3, 2.5, 8]`:

- X=3: Slightly right of center — crane moves left during animation, ending near X=0. Starting camera right ensures crane stays in frame throughout.
- Y=2.5: Slightly elevated — shows crane in context, readable boom angle
- Z=8: Far enough back to see full crane height at 60° FOV

---

## CAMERA 03 — Semi-Truck

### Setup

| Property | Spec                                        |
| -------- | ------------------------------------------- |
| Type     | `PerspectiveCamera(65, aspect, 0.01, 1000)` |
| Position | `new Vector3(0, 0.3, 8)`                    |
| Target   | `new Vector3(0, 0.5, 0)`                    |
| Up       | `new Vector3(0, 1, 0)`                      |

### Movement

| Property      | Spec                                                 |
| ------------- | ---------------------------------------------------- |
| Movement type | **NONE — fully static**                              |
| Reason        | Truck entry is handled by model movement, not camera |

### FOV Rationale

`65°` (wider than other scenes) — the truck+trailer combination is extremely wide (40ft container + cab). A wider FOV allows the entire vehicle to fit in frame while maintaining the direct side-on aesthetic.

---

## CAMERA 04 — Container Ship (Aerial)

### Setup

| Property         | Spec                                                              |
| ---------------- | ----------------------------------------------------------------- |
| Type             | `PerspectiveCamera(45, aspect, 0.01, 1000)`                       |
| Initial position | `new Vector3(0, 20, 0)`                                           |
| Rotation         | `x: -Math.PI / 2` (pointing straight down)                        |
| Up vector        | `new Vector3(0, 0, -1)` (required when camera points down Y-axis) |
| Target           | `new Vector3(0, 0, 0)`                                            |

### Scroll-Driven Movement

| Phase              | Scroll Progress | Camera Y  | Ease                                      |
| ------------------ | --------------- | --------- | ----------------------------------------- |
| Phase 1 (zoom in)  | `0.0 → 0.40`    | `20 → 10` | `power2.inOut` applied via progress curve |
| Phase 2 (hold)     | `0.40 → 0.55`   | `10`      | —                                         |
| Phase 3 (zoom out) | `0.55 → 1.00`   | `10 → 20` | `power2.inOut` applied via progress curve |

### Phase Progress Curves

```
Phase 1: localProgress = progress / 0.4
Phase 3: localProgress = (progress - 0.55) / 0.45

Camera Y:
  Phase 1: Y = lerp(20, 10, ease(localProgress))
  Phase 2: Y = 10
  Phase 3: Y = lerp(10, 20, ease(localProgress))
```

### FOV Rationale

`45°` for aerial view prevents perspective distortion on the ship edges. A wider FOV would cause the ship to appear to "curve away" at the edges like a fisheye effect.

### Camera Implementation Note

When camera points straight down (`rotation.x = -PI/2`), the `lookAt()` method does not work as expected. Must set rotation directly:

```
camera.position.set(0, Y, 0)
camera.rotation.set(-Math.PI/2, 0, 0)
camera.updateProjectionMatrix()
```

---

## CAMERA 05 — Commercial Aircraft

### Setup

| Property         | Spec                                        |
| ---------------- | ------------------------------------------- |
| Type             | `PerspectiveCamera(60, aspect, 0.01, 1000)` |
| Initial position | `new Vector3(0, 5, 30)`                     |
| Target           | `new Vector3(0, 0, 0)`                      |
| Up               | `new Vector3(0, 1, 0)`                      |

### Scroll-Driven Movement

| Property          | Spec                                                          |
| ----------------- | ------------------------------------------------------------- |
| Property animated | `camera.position.z` and `camera.position.y`                   |
| Z range           | `30 → 5`                                                      |
| Y range           | `5 → 3`                                                       |
| Formula           | `z = lerp(30, 5, progress)`                                   |
| Formula           | `y = lerp(5, 3, progress)`                                    |
| Driver            | ScrollTrigger scrub `onUpdate`                                |
| Effect            | Aircraft grows from tiny to ~30% of viewport — cinematic zoom |

### Continuous Banking

| Property | Spec                                 |
| -------- | ------------------------------------ |
| Driver   | `useFrame` — independent of scroll   |
| Property | Aircraft model `rotation.z`          |
| Formula  | `Math.sin(elapsedTime × 0.5) × 0.05` |
| Range    | `±3°` (`±0.052 rad`)                 |
| Period   | `~12.6s`                             |
| Y bob    | `Math.sin(elapsedTime × 0.3) × 0.1`  |

---

## Camera Transition Summary

| Transition              | Method                                       | Duration |
| ----------------------- | -------------------------------------------- | -------- |
| Globe → (deactivate)    | Camera holds at final position, canvas fades | ~0.5s    |
| Crane (activate)        | Camera already at position, static           | Instant  |
| Crane → Truck           | Different camera (different canvas)          | Instant  |
| Ship (activate)         | Camera at `[0, 20, 0]` from start            | Instant  |
| Ship → Aircraft         | Different camera (different canvas)          | Instant  |
| Aircraft → (deactivate) | Canvas covered by testimonials DOM           | Gradual  |

---

## Camera Validation Checklist

| Check                                            | Expected                                             |
| ------------------------------------------------ | ---------------------------------------------------- |
| Globe: globe visible in right half of viewport   | `camera.position.x ≥ 0`, globe mesh `position.x ≥ 0` |
| Globe: camera pull-back visible                  | Globe apparent size decreases during scroll          |
| Crane: crane stays in frame throughout animation | Camera position `[3, 2.5, 8]` captures full range    |
| Ship: ship in center of aerial view              | Ship at `[0, 0, 0]`, camera directly above           |
| Aircraft: aircraft starts very small             | Camera Z=30 correct if aircraft at 3% of viewport    |
| All cameras: no gimbal lock                      | Check up vectors, especially aerial camera           |
