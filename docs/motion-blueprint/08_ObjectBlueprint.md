# 08 — Object Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Per-object lifecycle, transforms, opacity, interaction, and animation dependencies

---

## OBJECT 01 — Earth Globe

### Lifecycle

| State          | Condition            | Action                                  |
| -------------- | -------------------- | --------------------------------------- |
| Mount          | Page load            | Create geometry + material              |
| Activate       | Immediately on mount | Begin Y-rotation in `useFrame`          |
| Scroll animate | Hero section scroll  | Camera Z pull-back (camera, not object) |
| Deactivate     | Hero section exits   | Canvas `frameloop="demand"`             |
| Unmount        | Component cleanup    | Dispose geometry, material, textures    |

### Transforms

| Property     | Start       | End        | Driver                           |
| ------------ | ----------- | ---------- | -------------------------------- |
| `position`   | `[0, 0, 0]` | Same       | None                             |
| `rotation.y` | `0`         | Continuous | `useFrame`: `+= 0.001` per frame |
| `rotation.x` | `0.1`       | Same       | Static tilt (Earth's axial tilt) |
| `scale`      | `[1, 1, 1]` | Same       | None                             |

### Visibility

| Condition             | Opacity                   |
| --------------------- | ------------------------- |
| Page load → hero exit | `1`                       |
| Hero section exiting  | Fade out `1→0` over ~0.3s |
| All other sections    | `0` (canvas deactivated)  |

### Material Properties

| Property    | Value                     |
| ----------- | ------------------------- |
| Type        | `ShaderMaterial`          |
| Lighting    | Custom (not standard PBR) |
| Transparent | `false`                   |
| DepthWrite  | `true`                    |

### Dependencies

- Custom earth shader compiled and ready
- Earth albedo texture loaded
- Atmosphere shell mounted

---

## OBJECT 02 — Atmosphere Shell

### Lifecycle

| State     | Action                                   |
| --------- | ---------------------------------------- |
| Mount     | Same time as globe                       |
| Always on | Renders with globe, no independent state |
| Unmount   | With globe                               |

### Transforms

| Property   | Value                | Notes                                                    |
| ---------- | -------------------- | -------------------------------------------------------- |
| `position` | `[0, 0, 0]`          | Same as globe                                            |
| `scale`    | `[1.02, 1.02, 1.02]` | 2% larger than globe                                     |
| `rotation` | Inherits globe?      | Only if child of globe Group                             |
| Animation  | None                 | Static shader — rim responds to view angle automatically |

### Material

| Property    | Value                      |
| ----------- | -------------------------- |
| Type        | `ShaderMaterial` (Fresnel) |
| Side        | `THREE.FrontSide`          |
| Transparent | `true`                     |
| Blending    | `THREE.AdditiveBlending`   |
| DepthWrite  | `false`                    |

---

## OBJECT 03 — Route Network

### Lifecycle

Same as globe — mounted and deactivated with globe.

### Node Points

| Property        | Value                                             |
| --------------- | ------------------------------------------------- |
| Geometry        | `BufferGeometry` with positions on sphere surface |
| Material        | `PointsMaterial` or custom shader                 |
| Size            | `2–3px` in world space                            |
| Color           | `#ffffff`                                         |
| sizeAttenuation | `true`                                            |

### Animation (Per Node)

| Property              | Driver                                      | Range                         |
| --------------------- | ------------------------------------------- | ----------------------------- |
| `size` or custom attr | `useFrame` + `Math.sin` with stagger offset | `2px → 4px → 2px`             |
| Period                | Node index offset                           | Each node has different phase |
| Opacity               | Same oscillation                            | `0.6 → 1.0 → 0.6`             |

### Arc Lines

| Property | Value                                 |
| -------- | ------------------------------------- |
| Geometry | `THREE.TubeGeometry` along Bezier arc |
| Material | `LineBasicMaterial` or custom shader  |
| Opacity  | `0.3–0.5`                             |
| Count    | `~20–30` visible arcs                 |

---

## OBJECT 04 — Reach Stacker Crane

### Lifecycle

| State      | Condition                     | Action                                   |
| ---------- | ----------------------------- | ---------------------------------------- |
| Preload    | At page load                  | `useGLTF.preload('/models/crane.glb')`   |
| Mount      | Crane section approaches      | GLB loaded and ready                     |
| Activate   | Crane section enters viewport | Canvas activates                         |
| Animate    | Scroll progress `0→1`         | `mixer.setTime(progress × clipDuration)` |
| Deactivate | Crane section exits           | Canvas pauses                            |

### Animation Phase Mapping

| Progress | Crane State                                    |
| -------- | ---------------------------------------------- |
| `0.00`   | Starting pose: boom 40°, no container held     |
| `0.20`   | Boom partially extended to 45°                 |
| `0.40`   | Boom at full 50°, spreader descending          |
| `0.55`   | Container attached, lifting begins             |
| `0.65`   | Container at apex (Y maximum)                  |
| `0.75`   | Crane body moving left, boom beginning to drop |
| `0.90`   | Crane far left, boom nearly horizontal         |
| `1.00`   | Full carry position                            |

### Transforms (if not using GLB clips)

| Object     | Property     | Start            | End                  |
| ---------- | ------------ | ---------------- | -------------------- |
| Boom       | `rotation.z` | `0.70 rad` (40°) | `0.17 rad` (10°)     |
| Crane body | `position.x` | `0`              | `-2`                 |
| Spreader   | `position.y` | `2`              | `0.5` (carry height) |
| Container  | `position.y` | Stack top        | Carry height         |
| Container  | `rotation.z` | `0`              | `0` (stays level)    |

### Visibility

| Condition       | State                                                  |
| --------------- | ------------------------------------------------------ |
| Section active  | Fully visible                                          |
| Section exiting | Canvas deactivated (no fade needed — white background) |

---

## OBJECT 05 — Container Stack

### Lifecycle

Mounted with crane model (part of same GLB). Animated as part of crane animation.

### Individual Container State Changes

| Container    | Initial      | After crane picks up    | Final                     |
| ------------ | ------------ | ----------------------- | ------------------------- |
| White (40ft) | Top of stack | Removed — held by crane | On truck (separate scene) |
| Navy blue    | Below white  | Exposed at top          | Remains                   |
| Red × 2      | Bottom       | Remains                 | Remains                   |

### If implementing containers separately (not as GLB children):

| Property        | Type                   | Color     |
| --------------- | ---------------------- | --------- |
| White container | `BoxGeometry(4, 1, 1)` | `#D8D8D8` |
| Navy container  | `BoxGeometry(2, 1, 1)` | `#1A2E5A` |
| Red containers  | `BoxGeometry(2, 1, 1)` | `#8B1A1A` |

---

## OBJECT 06 — Semi-Truck

### Lifecycle

| State           | Condition               | Action                                       |
| --------------- | ----------------------- | -------------------------------------------- |
| Preload         | At page load            | `useGLTF.preload('/models/truck.glb')`       |
| Mount           | Truck section           | GLB ready                                    |
| Entry animation | Section enters          | Slide from X=12 to X=0, `power2.out`, `0.8s` |
| Hold            | Static display          | No animation                                 |
| Deactivate      | Services section covers | Canvas pauses                                |

### Transforms

| Phase      | `position.x` | `rotation.y` | Note         |
| ---------- | ------------ | ------------ | ------------ |
| Off-screen | `12`         | `0`          | Before entry |
| Entering   | `12 → 0`     | `0`          | Slide-in     |
| Settled    | `0`          | `0`          | Static hold  |

### Visibility

| Condition             | Opacity                                |
| --------------------- | -------------------------------------- |
| Truck section         | `1`                                    |
| Services split begins | Truck canvas clips behind dark section |

---

## OBJECT 07 — Container Ship

### Lifecycle

| State          | Condition            | Action                                |
| -------------- | -------------------- | ------------------------------------- |
| Preload        | At page load         | `useGLTF.preload('/models/ship.glb')` |
| Mount          | Ship section         | GLB ready, camera at Y=20             |
| Animate        | Ship scroll progress | Camera Y changes                      |
| Feature labels | Progress > 0.62      | DOM labels fade in                    |
| Deactivate     | Ship section exits   | Canvas pauses                         |

### Transforms

| Property     | Value                                            |
| ------------ | ------------------------------------------------ |
| `position`   | `[0, 0, 0]`                                      |
| `rotation.y` | `0` (bow pointing positive Z, viewed from above) |
| `scale`      | `[1, 1, 1]`                                      |

The ship is static. All apparent motion comes from camera movement.

### Water / Foam

| Property       | Spec                                              |
| -------------- | ------------------------------------------------- |
| Water material | Three.js Water or custom shader                   |
| Foam           | `Points` with white material along hull perimeter |
| Foam animation | Position offset in `useFrame` — drift effect      |
| Color          | `#FFFFFF`                                         |

---

## OBJECT 08 — Commercial Aircraft

### Lifecycle

| State      | Condition             | Action                                    |
| ---------- | --------------------- | ----------------------------------------- |
| Preload    | At page load          | `useGLTF.preload('/models/aircraft.glb')` |
| Mount      | Aircraft section      | GLB ready, camera at Z=30                 |
| Zoom       | Scroll progress `0→1` | Camera Z: `30→5`                          |
| Banking    | Always active         | `useFrame` sine oscillation               |
| Deactivate | Testimonials covers   | Canvas pauses                             |

### Transforms

| Property     | Driver     | Formula                          |
| ------------ | ---------- | -------------------------------- |
| `rotation.z` | `useFrame` | `Math.sin(elapsed × 0.5) × 0.05` |
| `position.y` | `useFrame` | `Math.sin(elapsed × 0.3) × 0.1`  |
| `position.x` | None       | `0`                              |
| `scale`      | None       | `[1, 1, 1]`                      |

### Visibility

| Condition            | Opacity                                                      |
| -------------------- | ------------------------------------------------------------ |
| Aircraft section     | `1`                                                          |
| Testimonials section | Canvas behind DOM — aircraft fades as testimonials covers it |

---

## Object Priority for Implementation

| Priority | Object            | Reason                         |
| -------- | ----------------- | ------------------------------ |
| 1        | Globe + shaders   | Core hero experience           |
| 2        | Crane + animation | Most complex, longest dev time |
| 3        | Ship + water      | Visual centrepiece             |
| 4        | Aircraft + sky    | Second major 3D scene          |
| 5        | Route network     | Enhancement on top of globe    |
| 6        | Truck             | Simpler model                  |
| 7        | Atmosphere shell  | Shader enhancement             |
| 8        | Foam particles    | Ship enhancement               |

---

## Shared Object Rules

| Rule                | All Objects                             |
| ------------------- | --------------------------------------- |
| No user interaction | `raycast` disabled on all 3D objects    |
| No shadows (globe)  | Only crane + truck cast/receive shadows |
| Material disposal   | All materials disposed on unmount       |
| Geometry disposal   | All geometries disposed on unmount      |
| Texture disposal    | All textures disposed on unmount        |
