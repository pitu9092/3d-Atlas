# 15 — Material Analysis

---

## Overview

The site uses a mix of:

1. **Custom GLSL shader materials** (Globe, Atmosphere)
2. **Standard PBR materials** (GLB-embedded for vehicles/models)
3. **MeshStandardMaterial / MeshPhysicalMaterial** (common in GLB models)
4. **Sprite / Point materials** (route network, water particles)

---

## Globe — Earth Surface Material

### Type

`ShaderMaterial` (custom GLSL — confirmed by unique visual appearance)

### Properties

| Property    | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Base color  | Very dark navy (`#0a0a20` to `#1a1a35`)               |
| Land color  | Slightly lighter navy (`#1f2045`)                     |
| Ocean color | Very dark (`#080820`)                                 |
| Texture map | Earth texture (grayscale or colored) mapped to sphere |
| Roughness   | Not applicable (custom shader)                        |
| Metalness   | Not applicable                                        |
| Emissive    | Minimal or none on base surface                       |

### Blending

`THREE.NormalBlending`

### Notes

- Earth texture map required — likely a NASA Blue Marble variant or similar
- Dark color treatment applied in shader (very dark, near-black tones dominate)
- Country/continent borders barely visible — very subtle

---

## Globe — Atmosphere Material

### Type

`ShaderMaterial` — Custom Fresnel-based rim glow

### Properties

| Property          | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Base transparency | `transparent: true`, `depthWrite: false`             |
| Blending          | `THREE.AdditiveBlending`                             |
| Side              | `THREE.BackSide` or `THREE.FrontSide` with inversion |
| Color             | Electric blue (`hsl(210, 100%, 65%)`)                |
| Fresnel power     | ~3–5 (sharp falloff at center, bright at edges)      |

### Technique

```glsl
// Fresnel effect in fragment shader
float fresnel = pow(1.0 - dot(vNormal, vViewDir), power);
vec3 atmosphereColor = vec3(0.1, 0.5, 1.0);
gl_FragColor = vec4(atmosphereColor * fresnel, fresnel * 0.8);
```

---

## Globe — Thermal Glow Material

### Type

`ShaderMaterial` with `THREE.AdditiveBlending`

### Properties

| Property | Value                                                           |
| -------- | --------------------------------------------------------------- |
| Color    | Orange-red gradient (`hsl(20, 90%, 55%)` to `hsl(5, 80%, 45%)`) |
| Location | Northern hemisphere only (cloud layer effect)                   |
| Blending | `THREE.AdditiveBlending`                                        |
| Opacity  | Animated (pulsing)                                              |

---

## Globe — Route Network Material

### Type

`THREE.PointsMaterial` (for dots) + `THREE.LineBasicMaterial` (for arc lines)

### Properties

| Property          | Value                                   |
| ----------------- | --------------------------------------- |
| Color             | White (`#ffffff`)                       |
| Size (points)     | ~0.01–0.02 world units                  |
| Opacity           | 0.6–0.8                                 |
| Transparent       | true                                    |
| `sizeAttenuation` | true (perspective-correct point sizing) |

---

## Reach Stacker — Vehicle Material

### Type

`MeshStandardMaterial` (embedded in GLB)

### Properties (estimated from visual)

| Property   | Value                                          |
| ---------- | ---------------------------------------------- |
| Color      | Teal/mid-blue (`#2A90C5`)                      |
| Roughness  | ~0.4–0.6 (semi-matte)                          |
| Metalness  | ~0.0–0.2 (low metal, painted steel appearance) |
| Normal map | Likely present (surface detail on panels)      |

### Tires

| Property  | Value                          |
| --------- | ------------------------------ |
| Color     | Black (`#1a1a1a`)              |
| Roughness | ~0.85–0.95 (very rough rubber) |
| Metalness | 0.0                            |

### Cab Glass

| Property     | Value                  |
| ------------ | ---------------------- |
| Material     | `MeshPhysicalMaterial` |
| Transmission | ~0.7–0.9               |
| Roughness    | ~0.0–0.1 (clear glass) |
| IOR          | 1.5                    |

---

## Shipping Containers — Material

### Type

`MeshStandardMaterial` (embedded in GLB)

| Container Color | Roughness | Metalness | Notes                       |
| --------------- | --------- | --------- | --------------------------- |
| White/Silver    | ~0.4      | ~0.3      | Light painted steel         |
| Navy Blue       | ~0.5      | ~0.2      | Darker, slightly rough      |
| Red             | ~0.5      | ~0.2      | Standard shipping red       |
| Teal/Green      | ~0.5      | ~0.2      | Standard ISO color          |
| Pink/Magenta    | ~0.5      | ~0.2      | Visible in ship aerial view |

All containers likely have a **normal map** for the corrugated texture pattern visible on shipping containers.

---

## Semi-Truck — Material

### Cab

| Property  | Value                               |
| --------- | ----------------------------------- |
| Color     | Near-black (`#1a1a1a` to `#2a2a2a`) |
| Roughness | ~0.3                                |
| Metalness | ~0.4 (painted metal)                |

### Container Trailer

| Property   | Value                         |
| ---------- | ----------------------------- |
| Color      | Light grey/silver (`#c0c0c0`) |
| Roughness  | ~0.5                          |
| Metalness  | ~0.3                          |
| Normal map | Corrugated pattern            |

---

## Container Ship — Material

### Hull (above waterline)

| Property  | Value                              |
| --------- | ---------------------------------- |
| Color     | Dark grey/charcoal (hull exterior) |
| Roughness | ~0.7 (weathered steel)             |
| Metalness | ~0.5                               |

### Deck

| Property  | Value     |
| --------- | --------- |
| Color     | Dark grey |
| Roughness | ~0.8      |

### Containers (on deck)

Multi-colored as described in color palette.

---

## Water Material

### Type

Either `THREE.Water` (built-in Three.js add-on) OR custom shader

### Properties

| Property     | Value                             |
| ------------ | --------------------------------- |
| Color        | Deep blue matching scene          |
| Normal map   | Animated water ripple normal map  |
| Foam         | Particle system or sprite overlay |
| Transparency | Slight (surface reflections)      |
| Reflectivity | UNKNOWN                           |

---

## Aircraft — Material

### Fuselage

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Color      | White/light grey                      |
| Roughness  | ~0.2–0.3 (polished aircraft aluminum) |
| Metalness  | ~0.5–0.7                              |
| Reflection | Clear sky environment reflected       |

### Tail Livery (Red)

| Property  | Value           |
| --------- | --------------- |
| Color     | Red (`#cc0000`) |
| Roughness | ~0.3            |
| Metalness | ~0.3            |

### Engines

| Property  | Value         |
| --------- | ------------- |
| Color     | Dark metallic |
| Roughness | ~0.2          |
| Metalness | ~0.9          |

---

## Cloud Material

### Type

Either custom cloud shader OR `MeshStandardMaterial` with white color and no metalness

### Properties

| Property     | Value                                |
| ------------ | ------------------------------------ |
| Color        | White (`#ffffff`)                    |
| Roughness    | 1.0                                  |
| Metalness    | 0.0                                  |
| Transparency | Possible soft edges with opacity map |
| Depth write  | Possibly false for proper blending   |
