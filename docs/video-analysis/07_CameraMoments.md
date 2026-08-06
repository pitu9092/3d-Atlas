# 07 — Camera Moments

**Project**: 3D Atlas  
**Focus**: Every observable camera event — position, target, movement, FOV, and scroll driver

---

## Camera System Overview

| Property                | Value                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| **Camera Type**         | `THREE.PerspectiveCamera` (all scenes)                                |
| **User Control**        | None — no OrbitControls                                               |
| **Movement Driver**     | GSAP ScrollTrigger scrub (primary), continuous `useFrame` (secondary) |
| **Total Camera Setups** | 5 distinct cameras (one per 3D scene)                                 |
| **Mouse Control**       | Possible subtle offset on globe scene only                            |

---

## CAMERA 01 — Globe Hero

### Static State (Before Scroll)

| Property             | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| **Position**         | `[0, 0.5, 3.5]` (estimated — slightly above center, close) |
| **Target**           | `[0, 0, 0]` (globe center)                                 |
| **Up Vector**        | `[0, 1, 0]`                                                |
| **FOV**              | `50°` (estimated)                                          |
| **Near / Far**       | `0.01 / 1000`                                              |
| **Initial Distance** | Globe fills right ~50% of viewport at this position        |

### Camera Moment 01 — Globe Hero Pull-Back

| Property           | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| **Trigger**        | Hero section scroll progress `0 → 1`                  |
| **Animation**      | `position.z: 3.5 → 7.0`                               |
| **Duration**       | ~150vh of scroll                                      |
| **Ease**           | Linear (scrub: none / 1:1)                            |
| **Effect**         | Globe appears to shrink — camera retreating to space  |
| **Frame Evidence** | F0012 (close globe) vs F0016 (slightly smaller globe) |
| **Direction**      | Positive Z (backward from globe)                      |

### Camera Moment 02 — Mouse Parallax (Possible)

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| **Trigger**      | Mouse X/Y movement                        |
| **Animation**    | `camera.position.x/y: ±0.1` (tiny offset) |
| **Effect**       | Globe appears to subtly respond to cursor |
| **Confirmation** | UNKNOWN — cannot confirm from video       |

---

## CAMERA 02 — Atmospheric Descent

### Camera Moment 03

| Property          | Value                                                       |
| ----------------- | ----------------------------------------------------------- |
| **Type**          | Not a 3D camera — this is a DOM/CSS animation               |
| **Effect**        | Achieved through background color gradient animation        |
| **3D Component**  | None — globe has exited/faded, no 3D camera in this section |
| **Visual Result** | Simulates camera descending through atmosphere              |

---

## CAMERA 03 — Reach Stacker

### Static State

| Property        | Value                                                |
| --------------- | ---------------------------------------------------- |
| **Position**    | `[3, 2, 7]` (estimated — right side, elevated, back) |
| **Target**      | `[0, 1, 0]` (crane body midpoint)                    |
| **FOV**         | `60°` (wider to fit crane)                           |
| **Orientation** | Side-on to crane — slightly elevated perspective     |

### Camera Moment 04 — Crane Scene (Static Camera)

| Property            | Value                                                                               |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Trigger**         | Scroll progress through crane pin section                                           |
| **Animation**       | Camera appears STATIC — no camera movement                                          |
| **What Moves**      | Only the crane model itself animates                                                |
| **Evidence**        | Background horizon line does not shift between F0032 and F0040                      |
| **Possible Subtle** | Camera may have a very small dolly-in over the full duration but it's imperceptible |

---

## CAMERA 04 — Semi-Truck

### Static State

| Property     | Value                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| **Position** | `[0, 0.3, 8]` (estimated — direct side profile, slightly below eye level)    |
| **Target**   | `[0, 0.5, 0]` (truck mid-height)                                             |
| **FOV**      | `65°` (wide — to capture full truck length)                                  |
| **Special**  | Camera must be far enough back to show the full ~16m length of truck+trailer |

### Camera Moment 05 — Truck Camera

| Property      | Value                                                             |
| ------------- | ----------------------------------------------------------------- |
| **Trigger**   | Section enter                                                     |
| **Animation** | Camera appears STATIC                                             |
| **Effect**    | Truck model slides into position (model moves, not camera)        |
| **Evidence**  | Truck position changes between frames 0040→0044, not camera angle |

---

## CAMERA 05 — Container Ship (Aerial)

### Initial State

| Property     | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| **Position** | `[0, 20, 0]` (estimated — directly above, looking down)      |
| **Target**   | `[0, 0, 0]` (ship center)                                    |
| **Rotation** | `x: -Math.PI/2` (camera points straight down)                |
| **FOV**      | `45°` (narrower for aerial — reduces perspective distortion) |
| **Effect**   | Ship appears as a flat top-down graphic                      |

### Camera Moment 06 — Ship Aerial Zoom-In

| Property      | Value                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------- |
| **Trigger**   | Ship section scroll progress `0 → 0.4`                                                            |
| **Animation** | `position.y: 20 → 10` (moving closer while looking down)                                          |
| **Effect**    | Ship appears to grow — camera descending toward it                                                |
| **Duration**  | First ~40% of ship pin                                                                            |
| **Evidence**  | F0068: ship at medium scale. F0072: ship noticeably larger. F0076: even larger with text overlay. |

### Camera Moment 07 — Ship Camera Pull-Back (for labels)

| Property      | Value                                          |
| ------------- | ---------------------------------------------- |
| **Trigger**   | Ship section scroll progress `0.6 → 1.0`       |
| **Animation** | `position.y: 10 → 20` (pulling back up)        |
| **Effect**    | Ship appears smaller — feature labels frame it |
| **Evidence**  | F0080: ship smaller, labels surrounding it     |

### Ship Camera Timeline

```
Scroll 0%   → Camera Y=20, ship small
Scroll 40%  → Camera Y=10, ship large (text appears)
Scroll 60%  → Camera Y=10, text still visible
Scroll 80%  → Camera Y=16, ship medium, labels appearing
Scroll 100% → Camera Y=20, ship small, all labels visible
```

---

## CAMERA 06 — Aircraft

### Initial State

| Property     | Value                                                         |
| ------------ | ------------------------------------------------------------- |
| **Position** | `[-5, 3, 15]` (estimated — far away, slightly left, elevated) |
| **Target**   | `[0, 0, 0]` (aircraft center)                                 |
| **FOV**      | `60°`                                                         |
| **Effect**   | Aircraft appears very small in center frame (F0084)           |

### Camera Moment 08 — Aircraft Zoom-In

| Property      | Value                                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| **Trigger**   | Aircraft section scroll progress `0 → 1`                                          |
| **Animation** | `position.z: 15 → 5` (moving toward aircraft) OR camera moves around aircraft     |
| **Effect**    | Aircraft grows from tiny dot to clearly visible aircraft                          |
| **Evidence**  | F0084: aircraft ~3% screen size. F0088: aircraft ~30% screen size. Dramatic zoom. |

### Camera Moment 09 — Aircraft Banking View

| Property      | Value                                                                       |
| ------------- | --------------------------------------------------------------------------- |
| **Type**      | Continuous animation (not scroll-driven)                                    |
| **Animation** | Camera orbit slightly OR aircraft model rotates                             |
| **Effect**    | Aircraft visible from slightly above-rear — wing sweep visible              |
| **Evidence**  | F0088: aircraft shows fuselage + wing + tail from a slight upper-rear angle |

---

## Camera Comparison Table

| Scene    | Position           | Target      | FOV | Movement        | Driver       |
| -------- | ------------------ | ----------- | --- | --------------- | ------------ |
| Globe    | `[0, 0.5, 3.5→7]`  | `[0,0,0]`   | 50° | Z pull-back     | Scroll scrub |
| Crane    | `[3, 2, 7]`        | `[0,1,0]`   | 60° | Static          | None         |
| Truck    | `[0, 0.3, 8]`      | `[0,0.5,0]` | 65° | Static          | None         |
| Ship     | `[0, 20→10→20, 0]` | `[0,0,0]`   | 45° | Y zoom + Y pull | Scroll scrub |
| Aircraft | `[-5, 3, 15→5]`    | `[0,0,0]`   | 60° | Z zoom-in       | Scroll scrub |

---

## FOV Rationale

| Scene    | FOV | Reason                                                                  |
| -------- | --- | ----------------------------------------------------------------------- |
| Globe    | 50° | Standard cinematic. Globe in half-frame.                                |
| Crane    | 60° | Slightly wider to contain tall crane + containers                       |
| Truck    | 65° | Wide to capture full truck+trailer length (long horizontal)             |
| Ship     | 45° | Narrow for aerial — reduces perspective distortion, keeps ship readable |
| Aircraft | 60° | Standard cinematic for aircraft showcase                                |

---

## Perspective Change Summary

```
Globe:    Intimate → Distance (Z pull-back, "launching from Earth")
Crane:    Fixed side-view (industrial, methodical)
Truck:    Fixed side-view (same continuity as crane)
Ship:     God-view (aerial descent → zoom-in → pull-back, "surveying the fleet")
Aircraft: Distant → Close (Z zoom-in, "approaching from the clouds")
```
