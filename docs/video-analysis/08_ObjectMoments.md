# 08 — Object Moments

**Project**: 3D Atlas  
**Focus**: Every observable 3D object animation, appearance, movement, rotation, scale change, and disappearance

---

## OBJECT 01 — Earth Sphere

### Appearance

| Property            | Value                                                                |
| ------------------- | -------------------------------------------------------------------- |
| **Appears at**      | Page load (always present on hero)                                   |
| **Video Frame**     | F0001 (partially visible behind mouse)                               |
| **Entry Animation** | UNKNOWN — likely a fade-in or scale-in on page load                  |
| **Position**        | Right half of viewport, centered vertically, partially cropped right |

### Continuous Animations

| Animation           | Description                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Y-Axis Rotation** | Slow continuous counter-clockwise rotation (West→East)                                                          |
| **Speed**           | ~0.05 rad/s — very slow, barely perceptible in individual frames                                                |
| **Evidence**        | Australia visible in F0008 (upper right of globe). By F0012, Australia has rotated to be more clearly centered. |

### Scroll-Driven Animations

| Animation                | Scroll Range                 | Values                 |
| ------------------------ | ---------------------------- | ---------------------- |
| **Camera Z Pull-Back**   | Hero section 0→100%          | `camera.z: 3.5→7.0`    |
| **Globe apparent scale** | Decreases as camera retreats | 100%→50% apparent size |

### Atmosphere Moments

| Animation            | Behavior                                                                  |
| -------------------- | ------------------------------------------------------------------------- |
| **Fresnel rim glow** | Continuous, electric blue, no animation loop (static)                     |
| **Atmosphere pulse** | Possible subtle opacity oscillation. UNKNOWN — cannot confirm from video. |

### Thermal Cloud Glow Moments

| Animation    | Behavior                                         |
| ------------ | ------------------------------------------------ |
| **Position** | Northern hemisphere — upper 30% of globe visible |
| **Color**    | Orange-red gradient                              |
| **Behavior** | Appears static in video (may pulse slowly)       |

### Disappearance

| Property           | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| **Exits at**       | `~scrollY 150vh`                                            |
| **Exit method**    | Canvas exits viewport as page scrolls, OR opacity fades out |
| **Video evidence** | Globe entirely gone by F0020 (atmospheric section)          |

---

## OBJECT 02 — Route Network (Globe Surface)

### Appearance

| Property         | Value                                                               |
| ---------------- | ------------------------------------------------------------------- |
| **Appears at**   | Page load (with globe)                                              |
| **Type**         | `THREE.Points` + `THREE.Line` arcs                                  |
| **Distribution** | Globally distributed, concentrated in Asia-Pacific visible in frame |

### Continuous Animations

| Animation          | Description                                                                       |
| ------------------ | --------------------------------------------------------------------------------- |
| **Node pulse**     | Individual points scale/opacity oscillating. Staggered timing (not synchronized). |
| **Arc visibility** | Route arcs appear as faint curved lines on globe surface                          |

### Observable Node Positions (from F0012)

From the Australia-facing view:

- Dense cluster in Asia-Pacific region (visible on globe)
- Routes connecting visible nodes
- Red location pin at approximately Australia coordinates

### Disappearance

Exits with globe (same canvas).

---

## OBJECT 03 — Reach Stacker Crane

### Appearance

| Property            | Value                                                                         |
| ------------------- | ----------------------------------------------------------------------------- |
| **Appears at**      | `~scrollY 310vh`                                                              |
| **Entry**           | Canvas enters viewport from bottom (sticky section begins)                    |
| **Entry animation** | No separate entry animation — crane is in starting position when section pins |

### Animation Phase 1 — Boom Extension (0–45% scroll progress)

| Property           | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Object**         | Crane boom arm                                                      |
| **Start position** | Boom at ~30° angle (lowered, compressed)                            |
| **End position**   | Boom at ~50° angle (extended toward container stack)                |
| **Movement type**  | Rotation around boom pivot point (base of arm)                      |
| **Evidence**       | Frame comparison F0028 (arm partway up) → F0032 (arm at full reach) |

### Animation Phase 2 — Spreader Descend + Container Lift (45–70% scroll)

| Property        | Value                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| **Object**      | Spreader bar (horizontal bar at end of cables)                                  |
| **Movement**    | Spreader Y: down toward container, then up with container attached              |
| **Container**   | White ISO container — lifts from top of stack                                   |
| **F0032 State** | Container at top of arc (apex of lift) — white container visible above spreader |

### Animation Phase 3 — Lateral Movement (70–100% scroll)

| Property       | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| **Object**     | Entire crane body + container                                                  |
| **Movement**   | Crane moves LEFT across frame                                                  |
| **Container**  | Remains suspended — now hangs below horizontal boom                            |
| **Boom angle** | Nearly horizontal (boom dropped to transport position)                         |
| **Evidence**   | F0040: crane at far left, container horizontal, remaining containers far right |

### Key Frame States

| Scroll % | Crane State                                                       |
| -------- | ----------------------------------------------------------------- |
| 0%       | Starting position — boom raised, no container held                |
| 45%      | Boom fully extended, spreader at container top                    |
| 55%      | Container attached, beginning to lift                             |
| 65%      | Container at apex of lift (F0032)                                 |
| 80%      | Crane moving left, container dropping to carry height             |
| 95%      | Crane at far left, container in horizontal carry position (F0040) |
| 100%     | Transition to truck scene                                         |

### Disappearance

| Property       | Value                                                               |
| -------------- | ------------------------------------------------------------------- |
| **Exits at**   | Crane section scroll completes                                      |
| **Method**     | Canvas exits viewport (page scrolls to truck section)               |
| **Transition** | Visual continuity — container held by crane matches truck container |

---

## OBJECT 04 — Container Stack

### Appearance

| Property          | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| **Appears at**    | Same as crane (same canvas)                                    |
| **Position**      | Right side of crane — approximately 60–70% from left edge      |
| **Initial stack** | 3 rows high, approximately: white top, blue middle, red bottom |

### Animation Phases

| Phase       | Stack State                                                      |
| ----------- | ---------------------------------------------------------------- |
| Start       | Full stack — white + blue + red containers                       |
| Mid (F0032) | 1 container removed from top (being held by crane)               |
| End (F0040) | Only 2 containers remaining — blue + red. White is now on truck. |

### Container Colors (Confirmed from frames)

| Position               | Color            |
| ---------------------- | ---------------- |
| Top (removed)          | White/light grey |
| Upper-right stack      | Dark navy blue   |
| Lower-right stack (×2) | Red/burgundy     |

---

## OBJECT 05 — Semi-Truck

### Appearance

| Property             | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| **Appears at**       | `~scrollY 660vh`                                             |
| **Entry**            | Slides into frame from right (or appears via canvas fade-in) |
| **Initial position** | Center-to-right of viewport                                  |
| **Orientation**      | Side profile — left-facing (cab right, container body left)  |

### Key Observations (F0044)

| Part          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| **Cab**       | Dark charcoal/black, truck-tractor unit, right side of model    |
| **Container** | 40ft ISO container, silver/white, corrugated texture, left side |
| **Wheels**    | 6 visible axles (4 on trailer, 2 on cab)                        |
| **Camera**    | Device/GoPro mounted on top of cab visible                      |
| **Scale**     | Truck nearly fills the horizontal viewport width                |

### Animations

| Animation      | Description                                        |
| -------------- | -------------------------------------------------- |
| **Entry**      | Slides from right to center                        |
| **Continuous** | NONE — truck appears static once positioned        |
| **Exit**       | Truck moves toward top of viewport as page scrolls |

### Disappearance

| Property     | Value                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| **Exits at** | Services section begins                                                       |
| **Method**   | Truck moves toward viewport top as dark services section rises from below     |
| **Evidence** | F0048: truck visible at top half of frame, dark section appearing bottom half |

---

## OBJECT 06 — Container Ship

### Appearance

| Property             | Value                                                         |
| -------------------- | ------------------------------------------------------------- |
| **Appears at**       | `~scrollY 940vh`                                              |
| **Entry**            | Revealed as wipe transition completes (blue flood from below) |
| **Initial position** | Center of viewport, aerial top-down view                      |
| **Initial scale**    | Medium — ship occupies ~40% of viewport height                |

### Ship Anatomy (from F0068)

| Feature            | Description                                     |
| ------------------ | ----------------------------------------------- |
| **Orientation**    | Vertical — bow at top, stern at bottom          |
| **Width**          | ~25% of viewport width                          |
| **Length**         | ~40% of viewport height                         |
| **Container deck** | 3 rows wide, multiple columns deep              |
| **Hull**           | Dark grey, barely visible at top/bottom of deck |
| **Superstructure** | Not clearly visible (aerial view)               |
| **Water effect**   | White foam along sides and bow                  |

### Container Grid (Aerial View, top-down)

Top row (bow area): Green, Red, Red, Red/Dark  
Middle row (widest): Pink, White, Blue/Green, Red, Orange, Pink  
Bottom row (stern): Blue, White, Red, Pink, [more]

### Animations

| Animation               | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| **Water foam**          | Continuous particle loop — appears active throughout |
| **Camera zoom-in**      | Scroll-driven — ship grows as camera descends        |
| **Camera pull-back**    | Scroll-driven — ship shrinks for labels              |
| **Continuous rotation** | None — ship is stationary                            |

### Scroll-Driven Scale States

| Scroll % | Ship Apparent Size                             |
| -------- | ---------------------------------------------- |
| 0%       | Medium (~40% viewport)                         |
| 40%      | Large (~60% viewport) — maximum zoom           |
| 80%      | Small (~25% viewport) — pulled back for labels |
| 100%     | Small — all feature labels visible             |

---

## OBJECT 07 — Commercial Aircraft

### Appearance

| Property         | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **Appears at**   | `~scrollY 1140vh`                                        |
| **Entry**        | Appears very small in center frame, emerging from clouds |
| **Initial size** | Tiny — ~3% of viewport                                   |

### Aircraft Anatomy (from F0088)

| Feature      | Description                                                            |
| ------------ | ---------------------------------------------------------------------- |
| **Fuselage** | White/light grey — standard commercial jet proportions                 |
| **Wings**    | Swept back, wide — appears to be a wide-body aircraft                  |
| **Tail**     | Vertical stabilizer with RED livery — airline branding                 |
| **Engines**  | Under-wing podded engines (2, one per wing) — narrow-body OR wide-body |
| **Banking**  | Aircraft appears to bank slightly left                                 |

### Animations

| Animation          | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| **Camera zoom-in** | Scroll-driven — aircraft grows from tiny to large               |
| **Banking**        | Continuous subtle roll (Z-rotation) ~±3°                        |
| **Flight path**    | Aircraft may move slightly across frame (not confirmed)         |
| **Cloud parallax** | Clouds drift slowly — relative motion implies aircraft movement |

### Persistence into Testimonials

- Aircraft remains visible in F0088 even as testimonials content appears
- Aircraft positioned top-right of viewport during testimonials section entry
- Appears to drift/fade as testimonials section fully covers viewport

---

## Object Moment Summary

| Object          | Appears   | Exits         | Driver              | Key State                          |
| --------------- | --------- | ------------- | ------------------- | ---------------------------------- |
| Earth Globe     | Page load | ~150vh scroll | Continuous + scroll | Rotating, atmosphere glowing       |
| Route Network   | Page load | ~150vh scroll | Continuous (pulse)  | Dots pulsing                       |
| Reach Stacker   | ~310vh    | ~660vh        | Scroll scrub 1:1    | 4-phase crane animation            |
| Container Stack | ~310vh    | ~660vh        | Implied by crane    | Reduced as crane removes container |
| Semi-Truck      | ~660vh    | ~760vh        | Scroll entry        | Static side profile                |
| Container Ship  | ~940vh    | ~1140vh       | Scroll scrub        | Aerial zoom in/out                 |
| Aircraft        | ~1140vh   | ~1320vh       | Scroll scrub        | Zoom in from tiny to large         |
