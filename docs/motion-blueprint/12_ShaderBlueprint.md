# 12 — Shader Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Every shader requirement — purpose, inputs, outputs, complexity, and fallback

---

## Shader Inventory

| ID    | Name                | Scene    | Type                                 | Priority |
| ----- | ------------------- | -------- | ------------------------------------ | -------- |
| SH-01 | Earth Surface       | Globe    | `ShaderMaterial` (vertex + fragment) | Critical |
| SH-02 | Atmosphere Fresnel  | Globe    | `ShaderMaterial` (fragment)          | Critical |
| SH-03 | Thermal Glow        | Globe    | `ShaderMaterial` (fragment)          | High     |
| SH-04 | Route Network Pulse | Globe    | Custom `PointsMaterial` OR shader    | Medium   |
| SH-05 | Ocean Water         | Ship     | `ShaderMaterial` (vertex + fragment) | High     |
| SH-06 | Water Foam          | Ship     | `PointsMaterial` + custom attr       | Medium   |
| SH-07 | Sky                 | Aircraft | Procedural (Drei `<Sky>`)            | High     |
| SH-08 | Atmosphere Gradient | DOM      | CSS + GSAP                           | Medium   |

---

## SH-01 — Earth Surface Shader

### Purpose

Render an Earth globe with:

- Visible landmass / ocean distinction
- Directional sun illumination (terminator line)
- Specular highlight on ocean
- Night lights (optional — not confirmed in reference)

### Inputs (Uniforms)

| Uniform                | Type        | Value                                             |
| ---------------------- | ----------- | ------------------------------------------------- |
| `uDayTexture`          | `sampler2D` | Earth albedo map (day)                            |
| `uNightTexture`        | `sampler2D` | Earth night lights (optional)                     |
| `uNormalMap`           | `sampler2D` | Ocean normal map                                  |
| `uSpecularMap`         | `sampler2D` | Ocean/land specular mask                          |
| `uSunDirection`        | `vec3`      | Normalized direction to sun `[-0.51, 0.82, 0.31]` |
| `uTime`                | `float`     | Elapsed time (for ocean shimmer)                  |
| `uAtmosphereColor`     | `vec3`      | `[0.1, 0.47, 1.0]` (blue atmosphere blend)        |
| `uAtmosphereThickness` | `float`     | `0.15`                                            |

### Vertex Shader Outputs

| Output      | Purpose                             |
| ----------- | ----------------------------------- |
| `vNormal`   | World-space normal for lighting     |
| `vUv`       | UV coordinates for texture sampling |
| `vPosition` | World position for atmosphere blend |

### Fragment Shader Logic

```
1. Sample day texture at vUv
2. Compute dot(normal, sunDir) → sunFactor (0–1)
3. Apply smoothstep(0.0, 0.2, sunFactor) for soft terminator
4. Mix day/night texture based on sunFactor (if night texture available)
5. Compute specular: pow(dot(reflect, viewDir), 32) × specularMask
6. Compute atmosphere fringe: add blue near terminator
7. Output: dayColor × sunFactor + specular + atmosphereFringe
```

### Fallback

If shader compilation fails: use `MeshPhongMaterial` with earth texture + directional light.

### Performance Impact

**Medium** — single texture lookup per fragment. Acceptable for a single sphere at 64×64 segments.

---

## SH-02 — Atmosphere Fresnel Shader

### Purpose

Create the electric blue rim glow around the Earth visible from space.

### Inputs (Uniforms)

| Uniform             | Type    | Value                              |
| ------------------- | ------- | ---------------------------------- |
| `uGlowColor`        | `vec3`  | `[0.1, 0.47, 1.0]` (electric blue) |
| `uFresnelPower`     | `float` | `4.0`                              |
| `uFresnelIntensity` | `float` | `1.5`                              |

### Fragment Shader Logic

```
1. viewDirection = normalize(cameraPosition - worldPosition)
2. fresnelFactor = 1.0 - dot(viewDirection, normal)
3. fresnelFactor = pow(fresnelFactor, uFresnelPower)
4. outputColor = uGlowColor × fresnelFactor × uFresnelIntensity
5. gl_FragColor = vec4(outputColor, fresnelFactor)  ← alpha = glow intensity
```

### Material Config

| Property      | Value                    |
| ------------- | ------------------------ |
| `transparent` | `true`                   |
| `blending`    | `THREE.AdditiveBlending` |
| `depthWrite`  | `false`                  |
| `side`        | `THREE.FrontSide`        |

### Why AdditiveBlending

The atmosphere glow should ADD to whatever is behind it (the dark space background), not replace it. Additive blending produces the "luminous" halo effect.

### Fallback

Static blue rim effect via `MeshBasicMaterial` with a pre-baked rim texture. Quality is lower but acceptable.

### Performance Impact

**Low** — simple math per fragment.

---

## SH-03 — Thermal Glow Overlay

### Purpose

Orange-red circular glow on upper hemisphere of globe — simulates atmospheric heat or cloud glow.

### Implementation Options

**Option A (Shader):**

```
Fragment shader:
  1. Compute latitude from UV (y coordinate)
  2. Target latitude range: 0.3–0.7 (northern hemisphere)
  3. Mix orange-red gradient radially from center of glow
  4. Output with AdditiveBlending
```

**Option B (Mesh — Simpler):**

```
SphericalGeometry(1.03, 64, 32) — larger than atmosphere
Material: MeshBasicMaterial, orange, AdditiveBlending
UV manipulation to show only upper hemisphere
Opacity: 0.4–0.6
```

**Recommended**: Option B — simpler, no shader compilation needed.

### Colors

| Stop                  | Color                    |
| --------------------- | ------------------------ |
| Center                | `#ff6020` (vivid orange) |
| Edge                  | `#cc2000` (deep red)     |
| Outside coverage area | Transparent              |

### Performance Impact

**Low** — simple mesh with basic material.

---

## SH-04 — Route Network Pulse

### Purpose

Animated nodes on globe surface — pulsing glow indicating active logistics routes.

### Implementation

```
Points material with:
  size: 3.0 (world units at globe scale)
  sizeAttenuation: true
  vertexColors: true (per-point color)

Animation (useFrame):
  For each node:
    phase = nodeIndex × 0.7 (stagger offset)
    brightness = 0.6 + 0.4 × sin(time × 2 + phase)
    Update point color attribute

  pointsGeometry.attributes.color.needsUpdate = true
```

### Alternative (Custom Shader)

```
Vertex shader:
  Passes nodeIndex as varying to fragment

Fragment shader:
  Computes time-based brightness per node
  Output: white color × brightness
```

**Recommendation**: Per-attribute approach with `useFrame` for simplicity.

### Performance Impact

**Medium** — updating vertex buffer every frame for ~50–80 nodes. Acceptable.

---

## SH-05 — Ocean Water (Ship Scene)

### Purpose

Animated ocean surface beneath the container ship — realistic water appearance from aerial view.

### Inputs (Uniforms)

| Uniform       | Type        | Value                                  |
| ------------- | ----------- | -------------------------------------- |
| `uTime`       | `float`     | Elapsed time                           |
| `uWaterColor` | `vec3`      | `[0.05, 0.19, 0.42]` (deep ocean blue) |
| `uNormalMap`  | `sampler2D` | Water normal map (scrolling)           |
| `uWaveHeight` | `float`     | `0.1`                                  |
| `uWaveSpeed`  | `float`     | `0.3`                                  |

### Fragment Logic

```
1. Scroll normalMap UV by time: uv1 = vUv + uTime × 0.02
2. Sample normalMap at uv1 and uv1 rotated 45°
3. Blend two samples for more complex ripple pattern
4. Apply normal-based lighting
5. Add fresnel: specular highlight when viewing angle grazes surface
6. Output: ocean color + specular
```

### Alternative

Use `THREE.Water` (available in Three.js examples) which provides realistic water with:

- Animated normal maps
- Fresnel reflection
- Built-in sun reflection

### Performance Impact

**Medium** — dual texture samples + lighting per fragment.

---

## SH-06 — Water Foam Particles

### Purpose

White foam along ship hull perimeter — indicates ship movement through water.

### Implementation

```
Points system:
  Geometry: Custom positions along hull outline
  Material: PointsMaterial, white color, sizeAttenuation: true

Animation (useFrame):
  Drift particles outward from hull over time
  Reset particle when it drifts too far
  Vary opacity: fade in at spawn, fade out at max distance
```

### Performance Impact

**Low** — points geometry, no shader needed.

---

## SH-07 — Sky (Aircraft Scene)

### Purpose

Realistic procedural sky for the aircraft section.

### Implementation

Drei `<Sky>` component — no custom shader needed.

### Parameters

| Param             | Value   | Effect                                     |
| ----------------- | ------- | ------------------------------------------ |
| `turbidity`       | `8`     | Atmospheric haziness                       |
| `rayleigh`        | `0.5`   | Blue sky scattering                        |
| `mieCoefficient`  | `0.005` | Aerosol scattering                         |
| `mieDirectionalG` | `0.8`   | Sun halo size                              |
| `inclination`     | `0.4`   | Sun position (0 = horizon, 0.5 = overhead) |
| `azimuth`         | `0.25`  | Sun compass direction                      |

### Performance Impact

**Low** — rendered as a large dome mesh, single draw call.

---

## SH-08 — Atmosphere Background Gradient (CSS/GSAP)

### Purpose

The atmospheric descent background — not a WebGL shader but CSS.

### Implementation

CSS: Linear gradient with 8 color stops  
GSAP: Animates the gradient's values via scroll scrub

### Performance Impact

**Very Low** — CSS repaint, not GPU shader.

---

## Shader Complexity Summary

| Shader              | Lines (est.)  | Custom Uniforms | Textures | Priority |
| ------------------- | ------------- | --------------- | -------- | -------- |
| SH-01 Earth Surface | ~100–150      | 7               | 2–3      | Critical |
| SH-02 Fresnel       | ~30–40        | 3               | 0        | Critical |
| SH-03 Thermal       | ~20–30        | 2               | 0        | High     |
| SH-04 Route Pulse   | ~10 (shader)  | 1               | 0        | Medium   |
| SH-05 Ocean Water   | ~80–100       | 5               | 1        | High     |
| SH-06 Foam          | None          | 0               | 0        | Medium   |
| SH-07 Sky           | Drei built-in | 5               | 0        | High     |

---

## Shader Development Sequence

```
1. SH-02 (Fresnel) — simplest, build first to validate shader pipeline
2. SH-01 (Earth) — build in stages: texture → lighting → terminator → specular
3. SH-03 (Thermal) — add to globe after SH-01 working
4. SH-05 (Ocean) — independent, build during ship section work
5. SH-04 (Pulse) — enhancement, add after core globe works
6. SH-07 (Sky) — use Drei preset, minimal work
```

---

## Shader Testing Strategy

| Test               | Method                                                   |
| ------------------ | -------------------------------------------------------- |
| Fresnel visible    | Check atmosphere rim appears with correct color          |
| Terminator correct | Sun direction matches expected hemisphere                |
| No shader errors   | Check browser console for WebGL errors                   |
| Performance        | Monitor `renderer.info.render.calls` — should be minimal |
| Mobile             | Test on low-end GPU — simplify if below 30fps            |
