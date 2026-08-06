# 04 — Object Transformations

**Project**: 3D Atlas  
**Purpose**: Frame-by-frame transform state for every animated 3D object

---

> Coordinate system: Three.js default — Y-up, right-handed  
> All values are ESTIMATED from video analysis unless marked CONFIRMED

---

## OBJECT 01 — Earth Globe

### Identity

| Property          | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| **Type**          | `THREE.Mesh`                                                     |
| **Geometry**      | `THREE.SphereGeometry(1, 64, 64)`                                |
| **Material**      | Custom shader (PBR + atmosphere)                                 |
| **Position**      | Offset right from center — world: `[0.5, 0, 0]` or camera offset |
| **Initial scale** | `[1, 1, 1]`                                                      |
| **Canvas offset** | Globe visually centered at ~55–60% from left edge of viewport    |

### Transform Timeline

| KF    | Time  | Position      | Rotation Y  | Scale     | Camera Z | Notes                 |
| ----- | ----- | ------------- | ----------- | --------- | -------- | --------------------- |
| KF-01 | 1.46s | `[0.5, 0, 0]` | `~0.52 rad` | `[1,1,1]` | `3.5`    | Hero static           |
| KF-02 | 1.96s | `[0.5, 0, 0]` | `~0.61 rad` | `[1,1,1]` | `4.5`    | Scroll beginning      |
| KF-03 | 2.46s | N/A           | N/A         | N/A       | N/A      | Globe exited viewport |

### Rotation Rate Calculation

- From KF-01 to KF-02: ~5° rotation in 0.5s video time
- Angular velocity: ~10°/s or ~0.175 rad/s
- `useFrame` rate: `globe.rotation.y += 0.003` (at 60fps)

### Visibility States

| State        | Condition                                 |
| ------------ | ----------------------------------------- |
| Full opacity | Hero section pin (scroll 0–100%)          |
| Fading       | Possible opacity fade at hero section end |
| Gone         | By `scrollY ≈ 150vh`                      |

---

## OBJECT 02 — Globe Atmosphere (Fresnel Shell)

### Identity

| Property     | Value                                                             |
| ------------ | ----------------------------------------------------------------- |
| **Type**     | `THREE.Mesh`                                                      |
| **Geometry** | `THREE.SphereGeometry(1.02, 64, 64)` — slightly larger than globe |
| **Material** | Custom Fresnel shader                                             |
| **Side**     | `THREE.FrontSide` or `THREE.BackSide`                             |
| **Blend**    | `THREE.AdditiveBlending`                                          |
| **Position** | Same as globe (child or same world position)                      |

### Transform Timeline

Same as globe — moves and rotates with it. No independent animation.

### Shader Parameters (Estimated)

| Parameter      | Value     | Effect                        |
| -------------- | --------- | ----------------------------- |
| `fresnelPower` | `4.0`     | Sharp rim — thin band of glow |
| `fresnelColor` | `#1a7fff` | Electric blue                 |
| `opacity`      | `0.8`     | Slightly transparent          |

---

## OBJECT 03 — Globe Route Network (Points + Arcs)

### Identity

| Property         | Value                                          |
| ---------------- | ---------------------------------------------- |
| **Points type**  | `THREE.Points`                                 |
| **Arc type**     | `THREE.Line` (per arc) OR `THREE.TubeGeometry` |
| **Position**     | On globe surface — `radius 1.005`              |
| **Count (est.)** | 40–80 nodes visible on visible hemisphere      |

### Transform

Route network is a child of the globe — inherits all globe transforms.

### Animation

| Property      | Animation                    | Rate                  |
| ------------- | ---------------------------- | --------------------- |
| Point size    | Oscillates `2px → 4px → 2px` | ~2s period per point  |
| Point opacity | Oscillates `0.6 → 1.0 → 0.6` | ~2s period, staggered |
| Arc opacity   | Static or very slow fade     | UNKNOWN               |

---

## OBJECT 04 — Globe Red Pin Marker

### Identity

| Property     | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| **Type**     | `THREE.Mesh` (cone) OR `THREE.Sprite`                                 |
| **Color**    | Red `#FF2020`                                                         |
| **Position** | Globe surface at approximately Australia SW — lat/lon: `(-31°, 115°)` |

### Transform

Always perpendicular to globe surface at its lat/lon position. Rotates with globe.

### Animation

| Property | Animation                    |
| -------- | ---------------------------- |
| Scale Y  | Possible pulse/bob (UNKNOWN) |
| Opacity  | UNKNOWN                      |

---

## OBJECT 05 — Reach Stacker Crane

### Identity

| Property         | Value                                                 |
| ---------------- | ----------------------------------------------------- |
| **Type**         | `THREE.Group` containing multiple child meshes        |
| **File**         | GLB model (path unknown)                              |
| **Color (body)** | Teal `#2A90C5`                                        |
| **Scale**        | Fills approximately 50% viewport height when centered |

### Transform Timeline

| KF    | Time  | Body X               | Boom Angle | Container Y         | Container Hold |
| ----- | ----- | -------------------- | ---------- | ------------------- | -------------- |
| KF-06 | 3.63s | `0` (center-left)    | `40°`      | N/A (not held)      | false          |
| KF-07 | 4.13s | `~0` (slightly left) | `50°`      | Apex (`+3 units`)   | true           |
| KF-08 | 4.71s | `~-2` (far left)     | `10°`      | `+0` (carry height) | true           |

### Scroll Progress → State Mapping

| Progress | Body X  | Boom Angle | Container State               |
| -------- | ------- | ---------- | ----------------------------- |
| 0%       | `0`     | `40°`      | Not attached                  |
| 20%      | `~-0.2` | `45°`      | Spreader descending           |
| 40%      | `~-0.3` | `50°`      | Locked onto container         |
| 55%      | `~-0.4` | `50°`      | Container rising              |
| 65%      | `~-0.5` | `50°`      | Container at apex             |
| 75%      | `~-1.0` | `40°`      | Crane moving left             |
| 90%      | `~-1.8` | `15°`      | Crane far left, boom dropping |
| 100%     | `~-2.0` | `10°`      | Full carry position           |

### Animation Driver

GLB model has embedded animation clip. GSAP ScrollTrigger drives `animationMixer.setTime(progress * clipDuration)`.

---

## OBJECT 06 — Container Stack

### Identity

Individual container meshes (GLB children or instanced)

### Transform Timeline

| KF    | Time  | White Container      | Navy Stack                 | Red Stack (×2)  |
| ----- | ----- | -------------------- | -------------------------- | --------------- |
| KF-06 | 3.63s | Top of stack         | Below white                | Bottom of stack |
| KF-07 | 4.13s | Held by crane (apex) | Exposed (top of remaining) | Still in place  |
| KF-08 | 4.71s | Hanging horizontal   | Far right                  | Far right       |

### Container Dimensions (Estimated)

| Container           | Type   | Width           | Height | Color                 |
| ------------------- | ------ | --------------- | ------ | --------------------- |
| White (40ft)        | ISO 40 | ~10m equivalent | ~2.6m  | `#D8D8D8` / `#E8E8E8` |
| Navy blue (20ft)    | ISO 20 | ~5m equivalent  | ~2.6m  | `#1A2E5A`             |
| Red × 2 (20ft each) | ISO 20 | ~5m each        | ~2.6m  | `#8B1A1A`             |

---

## OBJECT 07 — Semi-Truck

### Identity

| Property            | Value                    |
| ------------------- | ------------------------ |
| **Type**            | GLB model, `THREE.Group` |
| **Cab color**       | Dark charcoal `#2A2A2A`  |
| **Container color** | Silver/white `#C8C8C8`   |
| **Orientation**     | Side-on, cab at right    |

### Transform Timeline

| KF    | Time  | Position                 | Rotation Y    | Scale     |
| ----- | ----- | ------------------------ | ------------- | --------- |
| KF-09 | 5.33s | Center viewport          | `0` (side-on) | `[1,1,1]` |
| KF-10 | 5.96s | Slightly left, moving up | `0`           | `[1,1,1]` |

### Entry Animation

- **UNKNOWN** whether truck slides in from right or appears at position
- **Most likely**: truck slides in from right (positive X direction) with `power2.out`

### Canvas Positioning

The truck canvas has `position: sticky` or the canvas element extends above the services section — truck appears to straddle the split line in KF-10.

---

## OBJECT 08 — Container Ship

### Identity

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| **Type**        | GLB model, `THREE.Group`                 |
| **Orientation** | Bow at top (positive Z), stern at bottom |
| **View**        | Aerial (camera looking down Y-axis)      |

### Container Arrangement (Confirmed from F0068, F0072, F0076)

Looking down from above, visible container grid:

```
BOW (top)
┌─────────────────────────────────┐
│  G  │  R  │  R  │  DK │  R    │  ← Row 1
│ PNK │  W  │  BG │  R  │ ORG   │  ← Row 2 (widest)
│  B  │  W  │  R  │ PNK │  .    │  ← Row 3
│  B  │  W  │  R  │ ORG │  .    │  ← Row 4 (if visible)
└─────────────────────────────────┘
STERN (bottom)

G=Green, R=Red, B=Blue, W=White, PNK=Pink/Magenta, ORG=Orange, BG=Blue-Green, DK=Dark
```

### Transform Timeline (Camera-relative sizes)

| KF    | Time  | Apparent Size | Camera Y | Notes                    |
| ----- | ----- | ------------- | -------- | ------------------------ |
| KF-13 | 8.29s | ~40% viewport | `~20`    | Initial state            |
| KF-14 | 9.38s | ~60% viewport | `~10`    | Zoomed in (text appears) |
| KF-15 | 9.88s | ~25% viewport | `~20`    | Pulled back (labels)     |

---

## OBJECT 09 — Commercial Aircraft

### Identity

| Property            | Value                              |
| ------------------- | ---------------------------------- |
| **Type**            | GLB model                          |
| **Fuselage**        | White/light grey                   |
| **Tail**            | Red livery (airline brand)         |
| **Engine config**   | 2 underwing, podded                |
| **Type estimation** | Narrow or wide-body commercial jet |

### Transform Timeline

| KF    | Time   | Apparent Size | Camera Distance         | Notes                  |
| ----- | ------ | ------------- | ----------------------- | ---------------------- |
| KF-16 | 10.38s | ~3% viewport  | Far (`Z ≈ 50 units`)    | Just visible in clouds |
| KF-17 | 10.88s | ~25% viewport | Closer (`Z ≈ 15 units`) | Clearly visible        |

### Continuous Animation

| Property   | Animation                                 | Rate                     |
| ---------- | ----------------------------------------- | ------------------------ |
| Roll Z     | `±3°` continuous oscillation              | ~4–6s period             |
| Position Y | Possible gentle bob                       | `±0.1 units`, ~3s period |
| Evidence   | F0088 shows aircraft at slight bank angle |

---

## Object Transformation Summary Table

| Object           | X Move     | Y Move       | Z Move              | Rotation     | Scale | Driver            |
| ---------------- | ---------- | ------------ | ------------------- | ------------ | ----- | ----------------- |
| Globe            | None       | None         | None (camera moves) | Y continuous | None  | useFrame          |
| Crane body       | Left (X-)  | None         | None                | None         | None  | Scroll scrub      |
| Crane boom       | None       | None         | None                | Z (pitch)    | None  | Scroll scrub      |
| Container (held) | With crane | Up then down | None                | With boom    | None  | Follows boom      |
| Truck            | Into frame | Up (exit)    | None                | None         | None  | Scroll            |
| Ship             | None       | None         | None                | None         | None  | Camera moves      |
| Aircraft         | None       | Subtle bob   | None                | Z (bank)     | None  | useFrame + scroll |
