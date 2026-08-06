# 07 — Three.js Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Complete Three.js system design — renderer, scene, environment, loaders, organization, render loop

---

## Three.js Integration Strategy

| Property        | Choice                                     | Reason                                          |
| --------------- | ------------------------------------------ | ----------------------------------------------- |
| Integration     | React-Three-Fiber (R3F)                    | Next.js native, declarative, hooks-friendly     |
| Helper library  | `@react-three/drei`                        | Provides Sky, Cloud, useGLTF, Environment, etc. |
| Post-processing | `@react-three/postprocessing`              | Declarative post-processing for R3F             |
| Loader          | `useGLTF` from Drei                        | Auto-caches, Suspense-compatible                |
| Canvas count    | **5 separate canvases** (one per 3D scene) | Isolation, performance, background transparency |

---

## WebGLRenderer Spec

### Per-Canvas Renderer Settings

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

### Clear Color

| Scene    | clearColor        | clearAlpha        |
| -------- | ----------------- | ----------------- |
| Globe    | —                 | `0` (transparent) |
| Crane    | —                 | `0` (transparent) |
| Truck    | —                 | `0` (transparent) |
| Ship     | `#133D77`         | `1` (opaque)      |
| Aircraft | (sky provides bg) | `1` (opaque)      |

### Pixel Ratio

```
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0))
```

Cap at 2.0 prevents performance issues on high-DPI displays.

---

## Scene Organization

### Globe Scene

```
scene
├── AmbientLight (#04040a, 0.05)
├── DirectionalLight (sun) (#fff4e0, 2.0)
├── globe (Group)
│   ├── EarthMesh (SphereGeometry, ShaderMaterial)
│   ├── AtmosphereShell (SphereGeometry, custom Fresnel shader)
│   └── ThermalGlow (mesh, additive)
├── RouteNetwork (Group)
│   ├── NodePoints (Points)
│   └── RouteArcs (Group of Lines)
└── LocationPin (Mesh/Sprite)
```

### Crane Scene

```
scene
├── AmbientLight (#ffffff, 0.8)
├── DirectionalLight (key) (#ffffff, 2.0)
├── DirectionalLight (fill) (#b0c8e0, 0.6)
├── HemisphereLight (#ffffff, #e0e0e0, 0.3)
└── CraneModel (GLTF Group)
    ├── CraneBody
    ├── Boom
    ├── Spreader
    ├── Wheels
    └── ContainerStack
        ├── WhiteContainer (removable)
        ├── NavyContainer
        └── RedContainers (×2)
```

### Truck Scene

```
scene
├── AmbientLight (#ffffff, 1.0)
├── DirectionalLight (key) (#ffffff, 2.0)
├── DirectionalLight (rim) (#c0d8ff, 1.0)
└── TruckModel (GLTF Group)
    ├── Cab
    ├── Chassis
    ├── Trailer
    └── Wheels
```

### Ship Scene

```
scene
├── scene.background = Color('#133D77')
├── AmbientLight (#133D77 blue, 0.7)
├── DirectionalLight (aerial sun) (#c8e0ff, 1.8)
└── ShipModel (GLTF Group)
    ├── Hull
    ├── ContainerGrid (Group)
    │   └── Containers[] (Individual meshes — colored)
    ├── WaterPlane (Water material)
    └── FoamParticles (Points)
```

### Aircraft Scene

```
scene
├── Sky (Drei <Sky> component)
├── Clouds (Drei <Cloud> components, multiple)
├── AmbientLight (sky blue, 0.8)
├── DirectionalLight (sun) (#fffef0, 3.0)
└── AircraftModel (GLTF Group)
    ├── Fuselage
    ├── Wings
    ├── Tail
    └── Engines
```

---

## Canvas Component Architecture

### Canvas Placement Strategy

Each 3D scene is a separate React component with its own R3F `<Canvas>`:

```
<section class="hero-section" style="position: sticky; height: 100vh">
  <div class="hero-canvas" style="position: absolute; inset: 0; z-index: 0">
    <Canvas>...</Canvas>  ← Globe canvas
  </div>
  <div class="hero-dom" style="position: absolute; z-index: 1">
    ... hero text ...
  </div>
</section>
```

### Canvas Lifecycle Management

| Scene    | Activate When                    | Deactivate When                 |
| -------- | -------------------------------- | ------------------------------- |
| Globe    | Page load                        | Hero section exits viewport     |
| Crane    | Crane section enters viewport    | Crane section exits viewport    |
| Truck    | Truck section enters viewport    | Truck section exits viewport    |
| Ship     | Ship section enters viewport     | Ship section exits viewport     |
| Aircraft | Aircraft section enters viewport | Aircraft section exits viewport |

**Deactivation method**: `frameloop="demand"` on `<Canvas>` — pause rendering when scene not visible. Or use `<Canvas frameloop={isActive ? "always" : "demand"}>`.

---

## Model Loading Strategy

### Asset Organization

```
public/
  models/
    globe/ (procedural — no GLB)
    crane.glb
    truck.glb
    ship.glb
    aircraft.glb
  textures/
    earth-albedo.jpg
    earth-normal.jpg
    earth-specular.jpg
    earth-night.jpg (if needed)
```

### Preloading

```
useGLTF.preload('/models/crane.glb')
useGLTF.preload('/models/truck.glb')
useGLTF.preload('/models/ship.glb')
useGLTF.preload('/models/aircraft.glb')
```

Place preload calls at module level to start loading immediately on page load.

### Suspense Boundaries

Each canvas should be wrapped in `<Suspense fallback={<LoadingPlaceholder />}>` to handle model loading states gracefully.

---

## Environment Maps

| Scene    | Environment                       | Implementation                              |
| -------- | --------------------------------- | ------------------------------------------- |
| Globe    | None (custom shader handles all)  | —                                           |
| Crane    | Studio neutral                    | `<Environment preset="studio" />` from Drei |
| Truck    | Same as crane                     | `<Environment preset="studio" />`           |
| Ship     | None (custom lighting sufficient) | —                                           |
| Aircraft | Sky environment                   | Sky component serves as env                 |

---

## Render Loop Strategy

### R3F Default Loop

R3F uses `requestAnimationFrame` internally. GSAP ticker is connected via Lenis — these are separate RAF loops. To unify:

```
Option A: Let R3F and GSAP run separate RAF loops
  → Simplest, may have 1-frame lag between GSAP and Three.js
  → Acceptable for this project

Option B: Advance R3F manually
  → frameloop="demand" + manual advance()
  → Complex — not recommended unless A causes issues
```

**Recommendation**: Option A — separate RAF loops. The 1-frame lag is imperceptible in scroll-driven animations.

### useFrame Hook Usage

```
useFrame(({ clock }) => {
  const elapsed = clock.getElapsedTime()

  // Globe: rotation
  globeRef.current.rotation.y += 0.001

  // Aircraft: banking
  aircraftRef.current.rotation.z = Math.sin(elapsed × 0.5) × 0.05
  aircraftRef.current.position.y = Math.sin(elapsed × 0.3) × 0.1
})
```

---

## Three.js Performance Optimizations

| Optimization       | Implementation                                                       |
| ------------------ | -------------------------------------------------------------------- |
| Geometry merging   | Merge static container geometries into BufferGeometry                |
| Instance meshes    | Use `<instancedMesh>` for container grids (ship scene)               |
| Texture atlasing   | Pack earth textures into single atlas if possible                    |
| Draco compression  | All GLB files should use Draco compression                           |
| Polygon budget     | Globe: 64×64 = ~8K verts. Crane: ≤50K. Truck: ≤50K. Ship: ≤80K       |
| Material sharing   | Share materials between same-color containers (reference, not clone) |
| Dispose on unmount | Call `geometry.dispose()`, `material.dispose()` in cleanup           |
| Canvas resize      | Use `<Canvas resize={{ debounce: { scroll: 50, resize: 0 } }}`       |

---

## Three.js Error Handling

| Error               | Recovery                                                            |
| ------------------- | ------------------------------------------------------------------- |
| GLB load failure    | Show static image fallback inside Suspense fallback                 |
| WebGL not supported | Show full-page static message                                       |
| Memory pressure     | `renderer.info.memory` monitoring, dispose unused geometries        |
| Context loss        | `renderer.domElement.addEventListener('webglcontextlost', handler)` |
