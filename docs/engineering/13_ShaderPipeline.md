# 13 — Shader Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Shader types, compilation, uniform strategy, shared functions, and performance constraints

---

## Shader Inventory

| ID    | Name               | Type                                | Location              | Priority |
| ----- | ------------------ | ----------------------------------- | --------------------- | -------- |
| SH-01 | Earth Surface      | ShaderMaterial                      | `shaders/earth/`      | Critical |
| SH-02 | Atmosphere Fresnel | ShaderMaterial                      | `shaders/atmosphere/` | Critical |
| SH-03 | Thermal Glow       | ShaderMaterial or MeshBasicMaterial | `shaders/thermal/`    | High     |
| SH-04 | Route Node Pulse   | PointsMaterial (custom attr)        | CPU animation         | Medium   |
| SH-05 | Ocean Water        | ShaderMaterial                      | `shaders/water/`      | High     |
| SH-06 | Water Foam         | PointsMaterial                      | CPU animation         | Medium   |
| SH-07 | Sky                | Built-in Drei `<Sky>`               | —                     | High     |

---

## Shader File Organization

```
src/shaders/
├── earth/
│   ├── vertex.glsl       ← Earth surface vertex shader
│   └── fragment.glsl     ← Earth surface fragment shader
├── atmosphere/
│   ├── vertex.glsl       ← Atmosphere Fresnel vertex
│   └── fragment.glsl     ← Atmosphere Fresnel fragment
├── thermal/
│   └── fragment.glsl     ← Thermal overlay (vertex shared with atmosphere)
├── water/
│   ├── vertex.glsl       ← Ocean displacement
│   └── fragment.glsl     ← Ocean lighting + specular
└── common/
    └── noise.glsl        ← Shared noise functions (if needed)
```

---

## Shader Compilation

### When Shaders Compile

Three.js compiles GLSL shaders on first render — creating a GPU program. This can stall the render for a few frames.

### Precompilation Strategy

```
Problem: Shader stall on first render (visible jank)

Solution: Warm up shaders during loading phase
  1. Create materials during loading (LoadingScreen visible)
  2. R3F renders one invisible frame to compile shaders
  3. By the time LoadingScreen fades, shaders are pre-compiled

Implementation: frameloop="demand" + invalidate() during loading
  → Forces one render frame → compiles all shaders → no jank on reveal
```

### Shader Compile Error Handling

```
Three.js logs GLSL errors to console.
Strategy:
  - In development: console.error visible — fix immediately
  - In production: Catch via renderer.getContext().getShaderInfoLog()
    → Fall back to MeshBasicMaterial/MeshStandardMaterial
```

---

## Uniform Strategy

### Uniform Declaration

All uniforms typed and documented at material creation:

```typescript
interface EarthUniforms {
  uDayTexture: { value: THREE.Texture }
  uNormalMap: { value: THREE.Texture }
  uSpecularMap: { value: THREE.Texture }
  uSunDirection: { value: THREE.Vector3 }
  uTime: { value: number }
  uAtmosphereColor: { value: THREE.Vector3 }
}
```

### Uniform Update Strategy

| Uniform Type     | Update Frequency | Method                              |
| ---------------- | ---------------- | ----------------------------------- |
| Textures         | Once (on load)   | `uniform.value = texture`           |
| Sun direction    | Once             | `uniform.value.set(x, y, z)`        |
| Time             | Every frame      | `uniform.value = clock.elapsedTime` |
| Atmosphere color | Once             | `uniform.value.set(r, g, b)`        |

### Uniform Anti-Patterns

```
WRONG: material.uniforms.uTime.value = new THREE.Vector3(...)
  → Creates new object every frame → garbage collection pressure

CORRECT: material.uniforms.uTime.value = elapsed
  → Mutates the existing value → no allocation

WRONG: material.uniforms.uSunDirection.value = new THREE.Vector3(x, y, z)
  → New object every frame

CORRECT: material.uniforms.uSunDirection.value.set(x, y, z)
  → Mutates existing Vector3
```

---

## Shared Functions (GLSL)

### `src/shaders/common/noise.glsl`

If noise is needed for thermal or water effects:

```glsl
// Simplex noise 2D
vec3 permute(vec3 x) { ... }
float snoise(vec2 v) { ... }
```

Import via JavaScript string concatenation:

```typescript
import noiseGLSL from '../common/noise.glsl?raw'
import fragmentGLSL from './fragment.glsl?raw'

const fullFragment = noiseGLSL + fragmentGLSL
```

### Fresnel Function (Shared)

```glsl
// Used in: atmosphere, thermal, water
float fresnel(vec3 viewDir, vec3 normal, float power) {
  return pow(1.0 - abs(dot(viewDir, normal)), power);
}
```

---

## Performance Constraints Per Shader

| Shader             | Max Texture Samples          | Max Instructions | Max Lights |
| ------------------ | ---------------------------- | ---------------- | ---------- |
| Earth surface      | 3 (albedo, normal, specular) | ~100             | 1          |
| Atmosphere Fresnel | 0                            | ~20              | 0          |
| Thermal glow       | 0                            | ~30              | 0          |
| Ocean water        | 2 (2× normal samples)        | ~80              | 1          |

### Fragment Shader Complexity Budget

Target: **< 100ms** total shader time across all active canvases.

- Per-pixel operations: minimize branching (if/else in GLSL is expensive)
- Texture samples: each sample costs ~20–40 GPU cycles
- Math operations: `pow()` is expensive; use lookup texture for complex curves

---

## ShaderMaterial vs MeshStandardMaterial

| Feature                    | ShaderMaterial          | MeshStandardMaterial    |
| -------------------------- | ----------------------- | ----------------------- |
| Custom lighting            | ✓                       | ✗ (fixed PBR)           |
| Fresnel                    | ✓                       | Partial (via roughness) |
| Custom vertex displacement | ✓                       | ✗                       |
| Performance                | Better (fewer features) | Worse (full PBR)        |
| Dev time                   | High                    | Low                     |

**Globe and atmosphere**: Must use `ShaderMaterial`  
**Crane, truck containers**: Can use `MeshStandardMaterial` (standard PBR)  
**Ship containers**: Can use `MeshStandardMaterial` with emissive  
**Ocean water**: Should use `ShaderMaterial` for animated normals

---

## Shader Development Sequence

```
1. SH-02 (Fresnel) — 30 lines — validate pipeline works
2. SH-01 (Earth) — build incrementally:
   Stage A: flat texture only
   Stage B: + sun lighting (diffuse term)
   Stage C: + terminator (smoothstep)
   Stage D: + specular (pow term)
   Stage E: + atmosphere blend near terminator
3. SH-03 (Thermal) — additive overlay on globe
4. SH-05 (Water) — during ship section build
5. SH-07 (Sky) — Drei built-in, no code needed
```

---

## GLSL → JavaScript Import (Next.js)

### Configuration in `next.config.js`

```javascript
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.glsl$/,
      use: 'raw-loader',
    })
    return config
  },
}
```

### Usage

```typescript
import vertexShader from '../shaders/earth/vertex.glsl'
import fragmentShader from '../shaders/earth/fragment.glsl'

const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
```
