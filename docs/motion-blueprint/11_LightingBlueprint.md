# 11 — Lighting Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Per-scene lighting rigs with exact values, exposure settings, and HDR environment specs

---

## Lighting Philosophy

| Principle                    | Application                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| Scene isolation              | Each canvas has its own lighting rig — no shared lights     |
| Narrative arc                | Cold (space) → Neutral (studio) → Cold (ocean) → Warm (sky) |
| No user-visible light gizmos | No helpers or light meshes visible to user                  |
| Physics-based                | All intensities calibrated for ACESFilmic tone mapping      |
| Performance                  | Minimize shadow casters — only crane + truck use shadows    |

---

## SCENE 01 — Globe Hero Lighting

### Ambient Light

| Property  | Value                                     |
| --------- | ----------------------------------------- |
| Type      | `AmbientLight`                            |
| Color     | `#04040a`                                 |
| Intensity | `0.05`                                    |
| Purpose   | Prevents globe dark side being pure black |

### Directional Light (Sun)

| Property   | Value                                                      |
| ---------- | ---------------------------------------------------------- |
| Type       | `DirectionalLight`                                         |
| Color      | `#fff4e0`                                                  |
| Intensity  | `2.0`                                                      |
| Position   | `[-5, 8, 3]` (normalized direction: `[-0.51, 0.82, 0.31]`) |
| CastShadow | `false`                                                    |
| Purpose    | Primary illumination — creates terminator line on globe    |

### Custom Shader Lights (Not THREE.Light objects)

**Fresnel Atmosphere Rim:**

| Property      | Value                                                  |
| ------------- | ------------------------------------------------------ |
| Color         | `#1a7fff` (electric blue)                              |
| Fresnel power | `4.0`                                                  |
| Intensity     | `1.5`                                                  |
| Blend         | `AdditiveBlending`                                     |
| Type          | Fragment shader — computed from `dot(viewDir, normal)` |

**Thermal Cloud Glow:**

| Property | Value                                    |
| -------- | ---------------------------------------- |
| Type     | Additive overlay mesh                    |
| Color A  | `#ff6020` (warm orange)                  |
| Color B  | `#cc2000` (deep red)                     |
| Gradient | Radial — brighter center, fades at edges |
| Coverage | Upper hemisphere only                    |
| Opacity  | `0.5`                                    |
| Blend    | `AdditiveBlending`                       |

### Tone Mapping

| Property | Value                   |
| -------- | ----------------------- |
| Type     | `ACESFilmicToneMapping` |
| Exposure | `1.2`                   |

### Post-Processing

| Effect     | Settings                                       |
| ---------- | ---------------------------------------------- |
| Bloom      | Threshold `0.85`, Strength `0.5`, Radius `0.6` |
| Anti-alias | SMAA (or FXAA if performance constrained)      |

---

## SCENE 02 — Reach Stacker Crane Lighting

### Ambient Light

| Property  | Value          |
| --------- | -------------- |
| Type      | `AmbientLight` |
| Color     | `#ffffff`      |
| Intensity | `0.8`          |

### Key Light (Primary Directional)

| Property        | Value                                        |
| --------------- | -------------------------------------------- |
| Type            | `DirectionalLight`                           |
| Color           | `#ffffff`                                    |
| Intensity       | `2.0`                                        |
| Position        | `[-5, 10, 5]` (upper-right-forward)          |
| CastShadow      | `true`                                       |
| Shadow map size | `2048 × 2048`                                |
| Shadow type     | `PCFSoftShadowMap`                           |
| Shadow radius   | `4` (soft)                                   |
| Shadow camera   | `left: -10, right: 10, top: 10, bottom: -10` |

### Fill Light (Secondary Directional)

| Property   | Value                                        |
| ---------- | -------------------------------------------- |
| Type       | `DirectionalLight`                           |
| Color      | `#b0c8e0` (cool blue-grey)                   |
| Intensity  | `0.6`                                        |
| Position   | `[5, 2, -5]` (lower-left-back, opposite key) |
| CastShadow | `false`                                      |

### Hemisphere Light

| Property     | Value             |
| ------------ | ----------------- |
| Type         | `HemisphereLight` |
| Sky color    | `#ffffff`         |
| Ground color | `#e0e0e0`         |
| Intensity    | `0.3`             |

### Environment Map

| Property   | Value                             |
| ---------- | --------------------------------- |
| Preset     | `"studio"` (Drei `<Environment>`) |
| Background | `false` (don't show environment)  |
| Intensity  | `0.5`                             |
| Purpose    | Metal/paint reflections on crane  |

### Tone Mapping

| Property | Value                   |
| -------- | ----------------------- |
| Type     | `ACESFilmicToneMapping` |
| Exposure | `1.0`                   |

### Post-Processing

| Effect     | Settings |
| ---------- | -------- |
| Bloom      | Disabled |
| Anti-alias | SMAA     |

---

## SCENE 03 — Semi-Truck Lighting

Identical to crane scene with two modifications:

### Differences from Crane

| Property          | Crane         | Truck                       |
| ----------------- | ------------- | --------------------------- |
| Ambient intensity | `0.8`         | `1.0`                       |
| Key position      | `[-5, 10, 5]` | `[-3, 8, 5]` (more frontal) |
| Rim light         | None          | Added (see below)           |

### Rim Light (Truck Only)

| Property   | Value                                               |
| ---------- | --------------------------------------------------- |
| Type       | `DirectionalLight`                                  |
| Color      | `#c0d8ff` (cool blue)                               |
| Intensity  | `1.0`                                               |
| Position   | `[2, 0, -10]` (from behind/back of truck)           |
| Purpose    | Separates dark cab silhouette from white background |
| CastShadow | `false`                                             |

---

## SCENE 04 — Container Ship Lighting

### Scene Background

| Property | Value                                           |
| -------- | ----------------------------------------------- |
| Method   | `scene.background = new THREE.Color('#133D77')` |
| Note     | Not an HDRI — solid flat color                  |

### Ambient Light

| Property  | Value                                            |
| --------- | ------------------------------------------------ |
| Type      | `AmbientLight`                                   |
| Color     | `#133D77` (matches background — deep ocean blue) |
| Intensity | `0.7`                                            |
| Purpose   | Every surface gets a maritime blue cast          |

### Directional Light (Aerial Sun)

| Property   | Value                                                   |
| ---------- | ------------------------------------------------------- |
| Type       | `DirectionalLight`                                      |
| Color      | `#c8e0ff` (blue-tinted daylight)                        |
| Intensity  | `1.8`                                                   |
| Position   | `[0, 20, -2]` (nearly directly overhead — aerial sun)   |
| CastShadow | `false`                                                 |
| Purpose    | Top-down lighting matches the aerial camera perspective |

### Container Material Emissive Values

To maintain container color saturation under heavy blue ambient:

| Container | Emissive Color | EmissiveIntensity                |
| --------- | -------------- | -------------------------------- |
| Red       | `#1a0000`      | `0.15`                           |
| Green     | `#001a00`      | `0.1`                            |
| Orange    | `#1a0800`      | `0.12`                           |
| Pink      | `#0a001a`      | `0.2`                            |
| Blue      | `#000010`      | `0.05` (already matches ambient) |
| White     | `#050505`      | `0.05`                           |

### Water Material

| Property        | Value                                     |
| --------------- | ----------------------------------------- |
| Material        | `THREE.MeshStandardMaterial`              |
| Color           | `#0a2840`                                 |
| Roughness       | `0.1`                                     |
| Metalness       | `0.0`                                     |
| NormalMap       | Ocean normal map (animated in `useFrame`) |
| EnvMapIntensity | `0.3`                                     |

### Tone Mapping

| Property | Value                   |
| -------- | ----------------------- |
| Type     | `ACESFilmicToneMapping` |
| Exposure | `1.1`                   |

### Post-Processing

| Effect     | Settings                                                   |
| ---------- | ---------------------------------------------------------- |
| Bloom      | Threshold `0.92`, Strength `0.2`, Radius `0.4` (foam only) |
| Anti-alias | SMAA                                                       |

---

## SCENE 05 — Aircraft Lighting

### Sky (Not a THREE.Light)

| Property          | Value                            |
| ----------------- | -------------------------------- |
| Component         | `<Sky>` from `@react-three/drei` |
| `turbidity`       | `8`                              |
| `rayleigh`        | `0.5`                            |
| `mieCoefficient`  | `0.005`                          |
| `mieDirectionalG` | `0.8`                            |
| `inclination`     | `0.4`                            |
| `azimuth`         | `0.25`                           |

### Ambient Light

| Property  | Value                |
| --------- | -------------------- |
| Type      | `AmbientLight`       |
| Color     | `#80b8d8` (sky blue) |
| Intensity | `0.8`                |

### Directional Light (Solar)

| Property   | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Type       | `DirectionalLight`                                           |
| Color      | `#fffef0` (warm white — above-clouds sunlight)               |
| Intensity  | `3.0`                                                        |
| Position   | `[-3, 10, 3]` (above-left — typical aviation photo lighting) |
| CastShadow | `false`                                                      |

### Tone Mapping

| Property | Value                                     |
| -------- | ----------------------------------------- |
| Type     | `ACESFilmicToneMapping`                   |
| Exposure | `1.3` (brighter — above-clouds is bright) |

---

## Lighting Summary Table

| Scene    | Ambient        | Key           | Fill          | Rim            | Special             | Bloom  |
| -------- | -------------- | ------------- | ------------- | -------------- | ------------------- | ------ |
| Globe    | #04040a @ 0.05 | Sun @ 2.0     | None          | Fresnel shader | Thermal glow        | Strong |
| Crane    | #fff @ 0.8     | #fff @ 2.0    | #b0c8e0 @ 0.6 | None           | Hemi, Env map       | None   |
| Truck    | #fff @ 1.0     | #fff @ 2.0    | #b0c8e0 @ 0.6 | #c0d8ff @ 1.0  | Env map             | None   |
| Ship     | #133D77 @ 0.7  | #c8e0ff @ 1.8 | None          | None           | Emissive containers | Subtle |
| Aircraft | #80b8d8 @ 0.8  | #fffef0 @ 3.0 | None          | None           | Sky component       | Subtle |

---

## Light Helper Policy

| Environment | Setting                                                              |
| ----------- | -------------------------------------------------------------------- |
| Development | Enable `DirectionalLightHelper` and `CameraHelper` for shadow camera |
| Production  | Remove ALL helpers — never ship with visible helpers                 |
| Conditional | Use `process.env.NODE_ENV === 'development'` guard                   |
