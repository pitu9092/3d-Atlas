# 05 — Three Engine

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Three.js engine architecture — renderer, managers, and organization

---

## Engine Overview

The Three.js engine is NOT a monolithic singleton. Instead, it is composed of **5 isolated engine instances** — one per canvas. Each instance owns its own renderer, scene, camera, and resource manager.

```
Engine Instance (×5)
├── WebGLRenderer        ← GPU context owner
├── Scene               ← Scene graph root
├── PerspectiveCamera   ← View frustum
├── AnimationMixer?     ← GLB animation (crane only)
├── EffectComposer?     ← Post-processing (globe, ship, aircraft)
└── ResourceRegistry    ← Tracks all disposable resources
```

---

## WebGLRenderer

### Per-Instance Configuration

| Property              | Globe                | Crane                | Truck                | Ship                 | Aircraft             |
| --------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| `alpha`               | `true`               | `true`               | `true`               | `false`              | `false`              |
| `antialias`           | `true`               | `true`               | `true`               | `true`               | `true`               |
| `powerPreference`     | `"high-performance"` | `"high-performance"` | `"high-performance"` | `"high-performance"` | `"high-performance"` |
| `toneMapping`         | `ACESFilmic`         | `ACESFilmic`         | `ACESFilmic`         | `ACESFilmic`         | `ACESFilmic`         |
| `toneMappingExposure` | `1.2`                | `1.0`                | `1.0`                | `1.1`                | `1.3`                |
| `outputColorSpace`    | `SRGBColorSpace`     | `SRGBColorSpace`     | `SRGBColorSpace`     | `SRGBColorSpace`     | `SRGBColorSpace`     |
| `shadowMap.enabled`   | `false`              | `true`               | `true`               | `false`              | `false`              |
| `shadowMap.type`      | —                    | `PCFSoftShadowMap`   | `PCFSoftShadowMap`   | —                    | —                    |

### Pixel Ratio Policy

```
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0))
```

Cap at 2.0. `devicePixelRatio = 3` on retina mobile would triple fill rate — unacceptable.

### Canvas Resize

R3F handles canvas resize automatically via its internal ResizeObserver. Manual `renderer.setSize()` is NOT needed.

---

## Scene Manager

### Per-Scene Graph

**Globe Scene**

```
Scene
├── AmbientLight
├── DirectionalLight (sun)
└── Group "globe"
    ├── Mesh "earth"       ← SphereGeometry + ShaderMaterial
    ├── Mesh "atmosphere"  ← SphereGeometry + Fresnel ShaderMaterial
    ├── Mesh "thermal"     ← Additive overlay
    ├── Points "nodes"     ← Route network dots
    ├── Group "arcs"       ← TubeGeometry route arcs
    └── Mesh/Sprite "pin"  ← Location marker
```

**Crane Scene**

```
Scene
├── AmbientLight
├── DirectionalLight (key)
├── DirectionalLight (fill)
├── HemisphereLight
└── Group "crane" (GLTF root)
    ├── CraneBody (Mesh)
    ├── Boom (Mesh)
    ├── Spreader (Mesh)
    └── ContainerStack (Group)
```

**Truck Scene**

```
Scene
├── AmbientLight
├── DirectionalLight (key)
├── DirectionalLight (rim)
└── Group "truck" (GLTF root)
```

**Ship Scene**

```
Scene (background: Color #133D77)
├── AmbientLight
├── DirectionalLight (aerial sun)
├── Group "ship" (GLTF root)
│   ├── Hull
│   └── ContainerGrid
├── Mesh "water"
└── Points "foam"
```

**Aircraft Scene**

```
Scene
├── Sky (Drei built-in)
├── AmbientLight
├── DirectionalLight (sun)
├── Group "aircraft" (GLTF root)
└── Cloud ×4 (Drei built-in)
```

---

## Camera Manager

### Camera per Scene (No sharing)

| Scene    | Type              | Initial Position      | FOV   |
| -------- | ----------------- | --------------------- | ----- |
| Globe    | PerspectiveCamera | `[0, 0.5, 3.5]`       | `50°` |
| Crane    | PerspectiveCamera | `[3, 2.5, 8]`         | `60°` |
| Truck    | PerspectiveCamera | `[0, 0.3, 8]`         | `65°` |
| Ship     | PerspectiveCamera | `[0, 20, 0]` (aerial) | `45°` |
| Aircraft | PerspectiveCamera | `[0, 5, 30]`          | `60°` |

### Camera Update Strategy

Cameras are NOT animated by GSAP directly. Instead:

```
ScrollTrigger onUpdate → writes value to ref
useFrame → reads ref → applies to camera.position
```

This decouples GSAP timing from the render loop — prevents frame-skip artifacts.

---

## Animation Manager (Crane Only)

| Property   | Value                                    |
| ---------- | ---------------------------------------- |
| Type       | `THREE.AnimationMixer`                   |
| Source     | Crane GLB embedded clips                 |
| Drive      | `mixer.setTime(progress × clipDuration)` |
| Clock      | NOT used — driven by scroll progress     |
| `update()` | NOT called — `setTime()` directly        |

### Important

`mixer.update(delta)` is for time-based playback.  
`mixer.setTime(t)` is for scrub-based playback.  
The crane uses `setTime()` — NOT `update()`.

---

## Lighting Manager

### Studio Lighting Rig (Crane + Truck)

Identical rig, independently instantiated. No sharing.

```
AmbientLight     → created once per scene
DirectionalLight (key) → created once per scene
DirectionalLight (fill) → created once per scene
HemisphereLight → created once per scene
```

### Light Configuration Storage

Light parameters are stored in `lib/constants/lights.ts`:

```
CRANE_LIGHTS = { ambient: { color, intensity }, key: {...}, fill: {...} }
TRUCK_LIGHTS = { ...CRANE_LIGHTS, rim: {...} }
```

---

## Loader Manager

### Asset Loading Flow

```
Module Load Time:
  useGLTF.preload('/models/crane.glb')
  useGLTF.preload('/models/truck.glb')
  useGLTF.preload('/models/ship.glb')
  useGLTF.preload('/models/aircraft.glb')
  ↓
  All 4 models download in parallel
  ↓
  DracoLoader decodes compressed geometry
  ↓
  Models cached in useGLTF internal cache
  ↓
React Component Mount:
  useGLTF('/models/crane.glb') → returns cached GLTF immediately
```

### Draco Loader Configuration

```
DracoLoader decoder path: '/draco/'  ← In /public/draco/
Must copy: node_modules/three/examples/jsm/libs/draco/ → public/draco/
```

---

## Material Manager

### Material Sharing Policy

| Situation                   | Policy                                                  |
| --------------------------- | ------------------------------------------------------- |
| Same container color (ship) | Share one material instance across meshes               |
| Different scenes            | Never share — risk of cross-renderer contamination      |
| ShaderMaterial              | One instance per scene (uniforms are instance-specific) |

### Material Registry

Each scene tracks created materials in a `Map<string, THREE.Material>`:

```
materialsMap.set('red-container', new MeshStandardMaterial({...}))
```

On scene unmount, iterate map and call `.dispose()` on each.

---

## Resource Registry (Cleanup)

Each scene maintains a registry of all disposable resources:

```typescript
interface ResourceRegistry {
  geometries: THREE.BufferGeometry[]
  materials: THREE.Material[]
  textures: THREE.Texture[]
  renderTargets: THREE.WebGLRenderTarget[]
}
```

On unmount:

```
registry.geometries.forEach(g => g.dispose())
registry.materials.forEach(m => m.dispose())
registry.textures.forEach(t => t.dispose())
registry.renderTargets.forEach(rt => rt.dispose())
```

---

## Post-Processing Manager

| Scene    | Has Post-Processing       | Composer Type                                       |
| -------- | ------------------------- | --------------------------------------------------- |
| Globe    | Yes (Bloom + SMAA)        | `EffectComposer` from `@react-three/postprocessing` |
| Crane    | No                        | —                                                   |
| Truck    | No                        | —                                                   |
| Ship     | Yes (subtle Bloom + SMAA) | `EffectComposer`                                    |
| Aircraft | Yes (subtle Bloom + SMAA) | `EffectComposer`                                    |

### EffectComposer Cleanup

```
effectComposer.dispose()
```

Dispose render targets and passes — must be called explicitly.

---

## Render Loop Strategy

### R3F Default (Recommended)

R3F manages its own `requestAnimationFrame` loop internally. GSAP runs its own separate RAF via `gsap.ticker`.

```
Two parallel RAF loops:
  R3F RAF  → renders WebGL
  GSAP RAF → Lenis + ScrollTrigger

Frame lag: ≤1 frame (imperceptible for scroll-driven animation)
```

### frameloop="demand" Optimization

When a canvas is not visible:

```
<Canvas frameloop="demand">
```

R3F only renders when `invalidate()` is called. No rendering happens during idle.

This is the PRIMARY performance optimization for multiple canvases.
