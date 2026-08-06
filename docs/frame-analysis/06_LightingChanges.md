# 06 — Lighting Changes

**Project**: 3D Atlas  
**Purpose**: Document every lighting state, change, glow, bloom, and post-processing event frame by frame

---

## Lighting Architecture Overview

Each 3D scene uses an **isolated lighting rig**. Lighting changes occur at scene boundaries (not mid-scene), with one exception: the ship scene changes camera height which changes how the ambient light reads.

| Scene          | Lighting Type                                | Mood              | Post-Processing     |
| -------------- | -------------------------------------------- | ----------------- | ------------------- |
| Globe Hero     | Space — directional sun + Fresnel atmosphere | Epic, cosmic      | Bloom (strong)      |
| Crane          | Studio — key + fill + ambient                | Industrial, clean | None                |
| Truck          | Product — key + rim + ambient                | Commercial        | None                |
| Container Ship | Maritime — overhead + blue ambient           | Deep, moody       | Subtle bloom (foam) |
| Aircraft       | Solar — strong directional + sky ambient     | Bright, airy      | Subtle bloom        |

---

## LIGHTING STATE 01 — Globe Hero (Canonical)

**Active**: `KF-01` through `KF-02`  
**Time**: `1.46s → 2.2s`

### Ambient Light

| Property  | Value                                 | Evidence                                      |
| --------- | ------------------------------------- | --------------------------------------------- |
| Color     | `#04040a` (near-black with blue tint) | Globe dark side has faint blue cast           |
| Intensity | `0.05`                                | Dark side barely visible, prevents pure black |
| Position  | World space (no position for ambient) | —                                             |

### Directional Light (Sun Simulation)

| Property    | Value                         | Evidence                                                |
| ----------- | ----------------------------- | ------------------------------------------------------- |
| Color       | `#fff4e0` (warm white)        | Lit side of globe has warm tone                         |
| Intensity   | `2.0`                         | Strong — half of globe is significantly bright          |
| Direction   | `[-0.5, 0.8, 0.3]` normalized | Upper-right of globe is lit in KF-01 (Australia region) |
| Shadow      | Disabled                      | No shadow receiver plane                                |
| Cast shadow | false                         | —                                                       |

### Atmosphere Shader (Fresnel — not a THREE.Light)

| Property      | Value                                         | Evidence                       |
| ------------- | --------------------------------------------- | ------------------------------ |
| Type          | Custom fragment shader                        | Visible rim glow               |
| Color         | `hsl(210, 100%, 60%)` = `#0080FF` approximate | Electric blue rim in KF-01     |
| Fresnel power | `4.0`                                         | Sharp, thin rim                |
| Intensity     | `1.5`                                         | Strong glow                    |
| Blend mode    | `AdditiveBlending`                            | Adds on top of dark background |

### Thermal / Cloud Glow Layer

| Property | Value                                              | Evidence                             |
| -------- | -------------------------------------------------- | ------------------------------------ |
| Color    | `hsl(20, 90%, 55%)` → `hsl(5, 80%, 40%)`           | Orange-red in upper hemisphere KF-01 |
| Type     | Additive mesh OR custom shader on atmosphere layer | Soft circular glow                   |
| Opacity  | `0.5`                                              | Partially transparent over globe     |
| Coverage | Northern hemisphere, ~30–60°N band                 | Position in frame                    |

### Bloom Post-Processing

| Property          | Value                                            | Evidence                                         |
| ----------------- | ------------------------------------------------ | ------------------------------------------------ |
| Active            | YES                                              | Atmosphere rim appears to extend beyond geometry |
| Type              | `UnrealBloomPass` or `SelectiveBloom`            |                                                  |
| Threshold         | `0.85`                                           | Only very bright elements bloom                  |
| Strength          | `0.5`                                            | Medium bloom                                     |
| Radius            | `0.6`                                            | Moderate spread                                  |
| Affected elements | Atmosphere rim, thermal glow, bright route nodes | —                                                |

### Lighting Change Within Scene

No lighting changes within the globe hero scene. Lighting is static; globe rotation causes the apparent position of the lit/dark hemispheres to shift slightly, but the light source does not move.

---

## LIGHTING STATE 02 — Atmospheric Descent (No 3D)

**Active**: `KF-03`  
**Time**: `2.46s → 2.75s`

| Property        | Value                       |
| --------------- | --------------------------- |
| 3D lighting     | NONE                        |
| Visual effect   | CSS gradient animation only |
| Bloom           | None                        |
| Post-processing | None                        |

---

## LIGHTING STATE 03 — Editorial Section (No 3D)

**Active**: `KF-04` through `KF-05`  
**Time**: `2.75s → 3.5s`

| Property    | Value                                              |
| ----------- | -------------------------------------------------- |
| 3D lighting | NONE                                               |
| Lighting    | CSS-only (browser default rendering)               |
| Background  | `#F5F4F0` provides natural ambient-like brightness |
| Text        | Black `#111111` on off-white — maximum contrast    |
| Photo       | Small aerial photo thumbnail — naturally lit       |
| Bloom       | None                                               |

---

## LIGHTING STATE 04 — Reach Stacker Crane (Studio)

**Active**: `KF-06` through `KF-08`  
**Time**: `3.63s → 5.3s`

### Ambient Light

| Property  | Value     | Evidence                                           |
| --------- | --------- | -------------------------------------------------- |
| Color     | `#ffffff` | All surfaces have warm-white base illumination     |
| Intensity | `0.8`     | High — but objects still have visible shadow sides |

### Key Light (Primary Directional)

| Property         | Value                                  | Evidence                                            |
| ---------------- | -------------------------------------- | --------------------------------------------------- |
| Color            | `#ffffff`                              | Neutral white                                       |
| Intensity        | `2.0`                                  | Strong top-right highlight on crane body            |
| Direction        | `[-0.5, 1, 0.5]` (upper-right-forward) | KF-06: bright highlight on crane top-right surfaces |
| Shadow           | PCFSoftShadowMap                       | Soft shadows cast                                   |
| Shadow intensity | Moderate                               | Shadows visible on container undersides             |

### Fill Light (Secondary Directional)

| Property  | Value                                                 | Evidence                           |
| --------- | ----------------------------------------------------- | ---------------------------------- |
| Color     | `#b0c8e0` (cool blue-grey)                            | Shadow sides have slight cool cast |
| Intensity | `0.6`                                                 | Fills shadow side, prevents black  |
| Direction | `[0.5, 0.2, -0.5]` (lower-left-back, opposite to key) |                                    |

### Hemisphere Light (Possible)

| Property     | Value                                   |
| ------------ | --------------------------------------- |
| Sky color    | `#ffffff`                               |
| Ground color | `#e0e0e0`                               |
| Intensity    | `0.3`                                   |
| Purpose      | Simulates studio light bounce off floor |

### Environment Map

| Property  | Value                                      |
| --------- | ------------------------------------------ |
| Type      | Neutral studio preset                      |
| Format    | HDRI or PMREMGenerator cube                |
| Intensity | `0.5`                                      |
| Effect    | Subtle reflections on crane metal surfaces |

### Bloom

| Property | Value                                            |
| -------- | ------------------------------------------------ |
| Active   | NO                                               |
| Reason   | White background scenes don't benefit from bloom |

### Lighting Changes Within Scene

No lighting changes. Camera and model move; lighting is static.

---

## LIGHTING STATE 05 — Semi-Truck (Product)

**Active**: `KF-09` through `KF-10`  
**Time**: `5.33s → 5.96s`

### Lighting is nearly identical to crane studio setup, with additions:

| Difference    | Crane       | Truck                                     |
| ------------- | ----------- | ----------------------------------------- |
| Ambient       | `0.8`       | `1.0` (slightly brighter — pure white bg) |
| Key direction | Upper-right | Slightly more frontal                     |
| Rim light     | None        | YES — separates dark cab from white bg    |

### Rim Light (Separating Shot)

| Property  | Value                                      | Evidence                                   |
| --------- | ------------------------------------------ | ------------------------------------------ |
| Color     | `#c0d8ff` (cool blue)                      | Dark cab shows cool highlight at rear edge |
| Intensity | `1.0`                                      | Strong enough to silhouette against white  |
| Direction | `[0.2, 0, -1]` (from behind/back of truck) | Creates edge separation                    |

### Bloom

| Property | Value |
| -------- | ----- |
| Active   | NO    |

---

## LIGHTING STATE 06 — Container Ship (Maritime)

**Active**: `KF-13` through `KF-15`  
**Time**: `8.29s → 10.4s`

### Background

| Property | Value                                     | Evidence                   |
| -------- | ----------------------------------------- | -------------------------- |
| Color    | `#133D77` → `#0A2855`                     | Deep ocean blue from F0068 |
| Type     | `scene.background = new THREE.Color(...)` | Flat solid color, no sky   |

### Ambient Light

| Property  | Value                            | Evidence                                        |
| --------- | -------------------------------- | ----------------------------------------------- |
| Color     | `hsl(215, 65%, 22%)` — deep blue | All container surfaces have blue-cast dark fill |
| Intensity | `0.7`                            | Significant ambient — maritime atmosphere       |

### Directional Light (Aerial Sun)

| Property  | Value                                                      | Evidence                                       |
| --------- | ---------------------------------------------------------- | ---------------------------------------------- |
| Color     | `#c8e0ff`                                                  | Slightly blue-white (sky light)                |
| Intensity | `1.8`                                                      | Strong — top surfaces of containers are bright |
| Direction | `[0, -1, -0.2]` (almost directly down — aerial sun)        | Aerial view means sun is overhead              |
| Evidence  | Container tops are clearly the brightest surfaces in KF-13 |

### Container Emissive Values

| Container Color  | Emissive                                     | Reason                                     |
| ---------------- | -------------------------------------------- | ------------------------------------------ |
| Red containers   | `emissive: #1A0000, emissiveIntensity: 0.15` | Maintain red saturation under blue ambient |
| Green containers | `emissive: #001A00, emissiveIntensity: 0.1`  | Same                                       |
| Blue containers  | Already matches ambient — no emissive needed | —                                          |
| Pink/Magenta     | `emissive: #0A0010, emissiveIntensity: 0.2`  | Most at risk from blue cast                |

### Water Foam Material

| Property      | Value                                | Evidence                             |
| ------------- | ------------------------------------ | ------------------------------------ |
| Color         | `#FFFFFF`                            | Bright white foam                    |
| Emissive      | `#404040` or emissiveIntensity `0.3` | Foam stays bright against dark water |
| Material      | MeshStandardMaterial, fully rough    | No specular — water foam is matte    |
| Possible type | Points system OR animated texture    | UNKNOWN                              |

### Bloom on Ship

| Property  | Value  | Evidence                                    |
| --------- | ------ | ------------------------------------------- |
| Active    | Slight | Foam edges appear to have soft glow         |
| Threshold | `0.9`  | Only foam (brightest element) catches bloom |
| Strength  | `0.2`  | Subtle — not dominant                       |

### Lighting Changes Within Scene

No lighting changes. Camera Y changes (zoom in/out) change how the ambient light reads — at low Y (close), the overhead light dominates more; at high Y (far), the scene reads flatter.

---

## LIGHTING STATE 07 — Aircraft (Solar)

**Active**: `KF-16` through `KF-17`  
**Time**: `10.38s → 11.4s`

### Background / Sky

| Property       | Value                                          | Evidence                           |
| -------------- | ---------------------------------------------- | ---------------------------------- |
| Type           | Procedural sky OR sky HDRI                     | Gradient sky visible behind clouds |
| Upper color    | `hsl(215, 55%, 35%)` — blue-purple             | Upper sky color in F0084           |
| Lower color    | `hsl(200, 30%, 80%)` — pale blue               | Near-clouds color                  |
| Implementation | `<Sky>` component (Drei) OR custom skybox mesh |

### Clouds

| Property | Value                                                     |
| -------- | --------------------------------------------------------- |
| Type     | `THREE.Mesh` with cloud material OR volumetric shader     |
| Color    | White `#FFFFFF`                                           |
| Opacity  | `0.95`                                                    |
| Material | `MeshStandardMaterial` fully rough OR custom cloud shader |
| Possible | `@react-three/drei` `<Cloud>` component                   |

### Ambient Light

| Property  | Value                           | Evidence                                      |
| --------- | ------------------------------- | --------------------------------------------- |
| Color     | `hsl(195, 60%, 65%)` — sky blue | Aircraft surfaces have blue-tinted fill light |
| Intensity | `0.8`                           | Good fill — aircraft visible from all angles  |

### Directional Light (Solar)

| Property  | Value                                                                     | Evidence                                                 |
| --------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| Color     | `#fffef0`                                                                 | Warm white — "above the clouds" sunlight                 |
| Intensity | `3.0`                                                                     | Extremely strong — aircraft top surfaces are very bright |
| Direction | `[-0.3, -1, 0.3]`                                                         | Slightly angled from above-left                          |
| Evidence  | KF-17: aircraft fuselage top is bright white, wings show strong highlight |

### Bloom on Aircraft

| Property | Value                                   |
| -------- | --------------------------------------- |
| Active   | Slight                                  |
| Affected | Bright cloud edges, aircraft highlights |
| Strength | `0.15`                                  |

---

## Lighting Transition Events

| From Scene | To Scene     | Time    | Transition Type                                |
| ---------- | ------------ | ------- | ---------------------------------------------- |
| Globe      | Atmosphere   | `2.2s`  | 3D canvas deactivates — no lighting transition |
| Crane      | Truck        | `5.3s`  | Nearly identical lighting — seamless           |
| Services   | Wipe         | `7.0s`  | CSS-only — no 3D change                        |
| Wipe       | Ship         | `7.9s`  | Dramatic: studio white → ocean blue            |
| Ship       | Aircraft     | `10.4s` | Ocean blue → sky blue                          |
| Aircraft   | Testimonials | `10.9s` | Sky fades → CSS white background               |

---

## Color Temperature Arc

```
Page load: 6500K+ (space cold-black)
     ↓
Globe lit side: 5000K (neutral daylight)
Atmosphere: 9000K (blue-shifted — sky)
     ↓
Editorial: 6500K (natural daylight)
Crane/Truck: 6000K (studio neutral)
     ↓
Ship: 10000K+ (deep blue — maritime cold)
     ↓
Aircraft: 5500K (above-clouds warm sun)
```

The experience progresses from cold (space) → neutral → cold (ocean) → warm (sky). This is a deliberate emotional progression: epic → commercial → deep → hopeful.
