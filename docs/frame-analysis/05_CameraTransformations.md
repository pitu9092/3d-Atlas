# 05 — Camera Transformations

**Project**: 3D Atlas  
**Purpose**: Per-scene camera position, target, FOV, and frame-by-frame movement analysis

---

## Camera System Architecture

| Property             | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| **Camera type**      | `THREE.PerspectiveCamera` (all scenes)                    |
| **Scenes**           | 5 independent cameras (one per 3D scene)                  |
| **User control**     | None — no OrbitControls or user input                     |
| **Primary driver**   | GSAP ScrollTrigger scrub                                  |
| **Secondary driver** | `useFrame` tick (continuous animations)                   |
| **Mouse influence**  | Globe hero only — subtle XY parallax (UNKNOWN if present) |

---

## CAMERA 01 — Globe Hero

### Setup

| Property             | Value                      |
| -------------------- | -------------------------- |
| **Position initial** | `[0, 0.5, 3.5]`            |
| **Position final**   | `[0, 0.5, 7.0]`            |
| **Target**           | `[0, 0, 0]` (globe center) |
| **Up vector**        | `[0, 1, 0]`                |
| **FOV**              | `50°`                      |
| **Near**             | `0.01`                     |
| **Far**              | `1000`                     |

### Frame-by-Frame Camera Transformation

| KF    | Time  | Pos X | Pos Y | Pos Z  | Target    | FOV   | Note           |
| ----- | ----- | ----- | ----- | ------ | --------- | ----- | -------------- |
| KF-01 | 1.46s | `0`   | `0.5` | `3.5`  | `[0,0,0]` | `50°` | Hero canonical |
| KF-02 | 1.96s | `0`   | `0.5` | `~4.5` | `[0,0,0]` | `50°` | Scroll ~35%    |
| KF-03 | 2.46s | N/A   | N/A   | N/A    | N/A       | N/A   | Camera exited  |

### Scroll Progress → Z Position

| Scroll % | Camera Z | Globe apparent size | Notes               |
| -------- | -------- | ------------------- | ------------------- |
| 0%       | `3.5`    | 100% (baseline)     | Before scroll       |
| 20%      | `4.2`    | ~80%                | Gentle pull-back    |
| 40%      | `5.0`    | ~65%                | KF-02 state         |
| 60%      | `5.7`    | ~55%                | Continued recession |
| 80%      | `6.4`    | ~47%                | Nearly at end       |
| 100%     | `7.0`    | ~43%                | Section complete    |

### Globe Apparent Size vs Z Distance

Using perspective formula: `apparent_size = (object_size / camera_z) × focal_factor`

- At Z=3.5: globe fills ~55% width
- At Z=7.0: globe fills ~27% width
- Ratio: 55/27 ≈ 2× — globe appears half the size at full pull-back

### Movement Characteristics

| Property      | Value                                        |
| ------------- | -------------------------------------------- |
| **Direction** | Positive Z (backward from scene)             |
| **Speed**     | Proportional to scroll velocity              |
| **Easing**    | None (linear scrub)                          |
| **Smoothing** | Lenis provides natural inertia at scroll end |

---

## CAMERA 02 — Atmospheric Descent (No 3D Camera)

| Property           | Value                                |
| ------------------ | ------------------------------------ |
| **Active**         | NO 3D camera in this section         |
| **Visual effect**  | Simulated by CSS background gradient |
| **Implementation** | DOM/CSS only                         |

---

## CAMERA 03 — Reach Stacker Crane

### Setup

| Property      | Value                                                             |
| ------------- | ----------------------------------------------------------------- |
| **Position**  | `[3, 2.5, 8]` (estimated)                                         |
| **Target**    | `[0.5, 1.5, 0]` (crane body mid-height, slightly right of center) |
| **Up vector** | `[0, 1, 0]`                                                       |
| **FOV**       | `60°`                                                             |

### Frame-by-Frame Camera Transformation

| KF    | Time  | Camera Change | Object Change                  | Notes                |
| ----- | ----- | ------------- | ------------------------------ | -------------------- |
| KF-06 | 3.63s | Static        | Crane in starting position     | Camera fixed         |
| KF-07 | 4.13s | NONE          | Crane extended, container apex | Camera has NOT moved |
| KF-08 | 4.71s | NONE          | Crane moved far left           | Camera static        |

### Movement Characteristics

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Direction**    | NONE — camera is static                                       |
| **Scrub**        | None                                                          |
| **Effect**       | All motion is in the 3D model, not the camera                 |
| **Confirmation** | Background horizon line consistent across KF-06, KF-07, KF-08 |

### Camera Validation (Why Static)

The consistent viewport framing of the crane across all 3 keyframes — despite the crane moving ~35% of the frame — confirms the camera is NOT following the crane. The crane moves entirely across a fixed camera view, which is the correct approach for a "watch the machine work" cinematic shot.

---

## CAMERA 04 — Semi-Truck

### Setup

| Property       | Value                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| **Position**   | `[0, 0, 9]` (estimated — direct front-on is wrong; we need side profile) |
| **CORRECTION** | Position: `[0, 0.3, 8]` — slightly above, direct side profile            |
| **Target**     | `[0, 0.5, 0]` (truck mid-height center)                                  |
| **Up vector**  | `[0, 1, 0]`                                                              |
| **FOV**        | `65°` (wider for long horizontal truck)                                  |

### Frame-by-Frame Camera Transformation

| KF    | Time  | Change | Notes                                       |
| ----- | ----- | ------ | ------------------------------------------- |
| KF-09 | 5.33s | Static | Truck centered in frame                     |
| KF-10 | 5.96s | NONE   | Truck has moved toward top (page scrolling) |

### Camera Analysis

Camera is STATIC. The truck appears to move upward because the page is scrolling the truck's section upward while the dark services section rises from below. The camera is NOT scrolling — the DOM layout is scrolling.

---

## CAMERA 05 — Container Ship (Aerial)

### Setup

| Property             | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| **Initial position** | `[0, 20, 0]`                                           |
| **Rotation X**       | `-Math.PI / 2` (pointing straight down)                |
| **Target**           | `[0, 0, 0]` (ship center on ocean floor plane)         |
| **Up vector**        | `[0, 0, -1]` (since camera points down, forward is -Z) |
| **FOV**              | `45°`                                                  |

### Frame-by-Frame Camera Transformation

| KF    | Time  | Pos Y    | Ship Apparent Size   | Notes                  |
| ----- | ----- | -------- | -------------------- | ---------------------- |
| KF-13 | 8.29s | `~20`    | ~40% viewport height | Initial position       |
| KF-14 | 9.38s | `~10`    | ~60% viewport height | Maximum zoom-in        |
| KF-15 | 9.88s | `~18–20` | ~25% viewport height | Pulled back for labels |

### Ship Camera Phase Analysis

**Phase 1: Zoom-In** (Scroll 0% → 40%)

| Property | Value                           |
| -------- | ------------------------------- |
| Camera Y | `20 → 10`                       |
| Effect   | Ship grows 50% in apparent size |
| Ease     | `power2.inOut`                  |

**Phase 2: Hold** (Scroll 40% → 55%)

| Property | Value                                       |
| -------- | ------------------------------------------- |
| Camera Y | `~10` (static hold)                         |
| Effect   | Ship at maximum zoom, text overlay fades in |
| Ease     | None (hold)                                 |

**Phase 3: Pull-Back** (Scroll 55% → 100%)

| Property | Value                                    |
| -------- | ---------------------------------------- |
| Camera Y | `10 → 20`                                |
| Effect   | Ship shrinks, feature labels enter frame |
| Ease     | `power2.inOut`                           |

### FOV Rationale

`45°` chosen for aerial because wider FOV would create perspective distortion that makes the ship look like it's falling away at the edges. Narrow FOV maintains the "flat top-down map" aesthetic expected for a cargo/logistics overview.

---

## CAMERA 06 — Commercial Aircraft

### Setup (Initial)

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| **Position** | `[0, 5, 30]` (estimated — aircraft appears at 3% size) |
| **Target**   | `[0, 0, 0]` (aircraft center)                          |
| **FOV**      | `60°`                                                  |

### Apparent Size Analysis

At KF-16 (t=10.38s), aircraft appears at ~3% of viewport height.  
At KF-17 (t=10.88s), aircraft appears at ~25% of viewport height.

Size ratio: 25/3 ≈ 8.3×

Using perspective: `size ∝ 1/z`  
So camera Z decreased by ~8× factor: `30 → ~3.6 units`

This is an EXTREME zoom — the aircraft starts essentially at the vanishing point.

### Frame-by-Frame Camera Transformation

| KF    | Time   | Pos Z | Aircraft Size | Notes        |
| ----- | ------ | ----- | ------------- | ------------ |
| KF-16 | 10.38s | `~30` | ~3% viewport  | Just visible |
| KF-17 | 10.88s | `~8`  | ~25% viewport | Close, clear |

### Camera Phase

**Single zoom-in** (Scroll 0% → 100% of aircraft pin)

| Property  | Value                        |
| --------- | ---------------------------- |
| Camera Z  | `30 → 5` (approximately)     |
| Direction | Negative Z (toward aircraft) |
| Ease      | `power2.inOut`               |

### Continuous Aircraft Banking

The aircraft appears to have a continuous banking motion (roll around its flight axis). This suggests the aircraft itself has an animation (Z-rotation oscillation) running in `useFrame`, while the camera zoom is scroll-driven.

---

## Camera Transformation Summary

| Scene      | Initial Pos     | Final Pos               | Movement   | Scrub | FOV |
| ---------- | --------------- | ----------------------- | ---------- | ----- | --- |
| Globe      | `[0, 0.5, 3.5]` | `[0, 0.5, 7.0]`         | Z+         | YES   | 50° |
| Atmosphere | N/A             | N/A                     | None (CSS) | N/A   | N/A |
| Crane      | `[3, 2.5, 8]`   | Same                    | NONE       | NO    | 60° |
| Truck      | `[0, 0.3, 8]`   | Same                    | NONE       | NO    | 65° |
| Ship       | `[0, 20, 0]`    | `[0, 10, 0]→[0, 20, 0]` | Y- then Y+ | YES   | 45° |
| Aircraft   | `[0, 5, 30]`    | `[0, 5, 5]`             | Z-         | YES   | 60° |

---

## Camera Positioning Rationale

| Scene              | Rationale                                                                       |
| ------------------ | ------------------------------------------------------------------------------- |
| Globe Z pull-back  | Simulates "launching from Earth's surface to orbit" — departure                 |
| Crane static       | Industrial observation post — the crane's movement is the story, not the camera |
| Truck static       | Product photography — clean side profile like an automotive reveal              |
| Ship aerial Y-down | God-view — surveys the whole operation like a logistics manager                 |
| Aircraft Z zoom    | "Approaching" — the camera comes to the aircraft, like landing approach         |
