# 12 — Camera Behavior

---

## Overview

The site uses **multiple distinct camera configurations** — one per scene. Each 3D scene has its own camera setup, positioned specifically to present the featured 3D model in the most dramatic, purposeful angle.

---

## Scene 1 — Globe Camera

| Property             | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| **Type**             | Perspective Camera                                                   |
| **Initial Position** | Close — `[0, 0, 3.5]` or similar (zoomed in, globe fills right half) |
| **Rotation**         | None initially                                                       |
| **FOV**              | ~45–60° (estimated)                                                  |
| **Look Target**      | `[0, 0, 0]` (center of Earth sphere)                                 |
| **Scroll Animation** | Z position: 3.5 → 7 (pull back to see full globe)                    |
| **Mouse Parallax**   | Possible small X/Y camera offset (~2–3%) based on mouse position     |
| **Up Vector**        | [0, 1, 0] (Y-up)                                                     |

### Camera Pull-Back Details

As the user scrolls through the hero section, the camera moves backward along the Z-axis, revealing the full size of the Earth. This creates the sensation of "launching from Earth into orbit."

```
scrollProgress: 0.0 → cameraZ: 3.5 (close)
scrollProgress: 0.5 → cameraZ: 5.5
scrollProgress: 1.0 → cameraZ: 7.0 (pulled back)
```

---

## Scene 2 — Atmosphere Camera

| Property     | Value                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **Effect**   | Camera has "descended through" the atmosphere                                                           |
| **Behavior** | This is a visual effect, not necessarily a camera movement — the background changes to simulate descent |
| **UNKNOWN**  | Whether this uses a genuine camera animation or a background color/gradient transition                  |

---

## Scene 4 — Reach Stacker Camera

| Property             | Value                                                                |
| -------------------- | -------------------------------------------------------------------- |
| **Type**             | Perspective Camera                                                   |
| **Position**         | Side-on view, slightly elevated: `[3, 2, 5]` estimated               |
| **Look Target**      | Center of crane assembly                                             |
| **FOV**              | ~50–65°                                                              |
| **Rotation**         | Static                                                               |
| **Scroll Animation** | Camera may have a very subtle dolly-in during the animation sequence |
| **UNKNOWN**          | Whether camera moves with scroll or is completely static             |

### Observation

The crane and containers fill most of the viewport. The camera appears to be positioned at a distance that shows the full vehicle from slightly above and to the side — a standard "showcase" angle.

---

## Scene 5 — Truck Camera

| Property        | Value                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| **Type**        | Perspective Camera                                                                                            |
| **Position**    | Side-on, slightly below: `[0, 0.5, 6]` estimated (looking at truck from eye level or slightly below)          |
| **Look Target** | Center of truck                                                                                               |
| **FOV**         | ~55–70°                                                                                                       |
| **Rotation**    | Static or very slight orbit                                                                                   |
| **Observation** | The truck appears to be a very long wide object — camera needs sufficient distance to show full truck+trailer |

---

## Scene 7 — Container Ship Camera (Aerial)

| Property             | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Type**             | Perspective Camera                                                                 |
| **Position**         | Top-down / aerial: `[0, 15, 0]` estimated — looking directly down                  |
| **Look Target**      | `[0, 0, 0]` (ship center)                                                          |
| **FOV**              | ~40–50° (tighter to reduce perspective distortion in aerial view)                  |
| **Rotation**         | Camera `rotation.x = -Math.PI / 2` (pointing down)                                 |
| **Scroll Animation** | Possible zoom: Y position decreases (moves closer) as user scrolls through section |

### Aerial Camera Notes

This is one of the most distinctive camera setups in the experience. The aerial view of the colorful container ship is visually striking. The camera is positioned high above looking straight down, which:

- Creates a flat, graphic, almost isometric appearance
- Makes the container colors visible as a pattern
- Shows the ship silhouette and water clearly

---

## Scene 9 — Aircraft Camera

| Property             | Value                                                                              |
| -------------------- | ---------------------------------------------------------------------------------- |
| **Type**             | Perspective Camera                                                                 |
| **Position**         | Above and slightly behind-left: estimated `[-3, 3, 5]`                             |
| **Look Target**      | Aircraft fuselage mid-point                                                        |
| **FOV**              | ~55–70°                                                                            |
| **Rotation**         | Camera tilted down ~15–25°                                                         |
| **Scroll Animation** | Camera may arc/orbit around aircraft as scroll progresses                          |
| **Observation**      | The aircraft is seen banking left with clouds below — camera is above the aircraft |

---

## Camera Control Library

**UNKNOWN** — The camera does not appear to have any user-controllable orbit (no OrbitControls). All camera movement is scroll-driven via programmatic animation.

Likely implementation:

```typescript
// No OrbitControls
// Camera position is a GSAP tween target
gsap.to(camera.position, {
  z: 7,
  scrollTrigger: { trigger: hero, scrub: 1 },
})
```

---

## FOV Strategy

- **Globe**: ~45° (standard perspective, minimal distortion)
- **Crane / Truck**: ~55–65° (slight wide angle to fit large models)
- **Ship (aerial)**: ~40–50° (narrower for aerial, reduces perspective distortion)
- **Aircraft**: ~55–65° (standard)

---

## Near / Far Planes

| Setting | Value                                        |
| ------- | -------------------------------------------- |
| Near    | 0.01 (small, for close objects)              |
| Far     | 1000 (large, for atmosphere and environment) |

---

## Depth of Field

**UNKNOWN** — Whether post-processing DOF is used. Premium sites sometimes apply subtle DOF to foreground/background elements. Cannot confirm from reference video.
