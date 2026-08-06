# 13 — Three.js Analysis

---

## Canvas Setup

### Number of Canvases

**Estimated 3–5 separate WebGL canvases** (one per major 3D scene), OR a single canvas with scene swapping. The white-background scenes (crane, truck) suggest transparent canvases over white DOM backgrounds.

| Scene          | Canvas Type                | Background                        |
| -------------- | -------------------------- | --------------------------------- |
| Globe          | Full-viewport, dark        | `THREE.Color(0x080808)`           |
| Reach Stacker  | Full-viewport, transparent | `alpha: true`, DOM bg = white     |
| Truck          | Full-viewport, transparent | `alpha: true`, DOM bg = off-white |
| Container Ship | Full-viewport, colored     | `THREE.Color` = deep blue         |
| Aircraft       | Full-viewport, sky         | Sky color or environment          |

---

## Renderer Configuration

```javascript
// Estimated WebGLRenderer setup:
renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,        // for transparent scenes
  powerPreference: 'high-performance',
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0–1.5  // estimated
renderer.outputColorSpace = THREE.SRGBColorSpace
```

---

## Scene Objects by Canvas

### Globe Scene

```
THREE.Scene
├── AmbientLight (very dim, ~0.1 intensity)
├── DirectionalLight (sun — off to one side)
├── Earth Mesh
│   ├── SphereGeometry(1, 64, 64)  // high-res sphere
│   └── Custom ShaderMaterial       // dark surface + atmosphere
├── Atmosphere Mesh
│   ├── SphereGeometry(1.02, 64, 64) // slightly larger
│   └── ShaderMaterial (Fresnel, additive blend)
├── ThermalGlow Mesh
│   ├── SphereGeometry(1.04, 32, 32)
│   └── ShaderMaterial (orange-red, additive, top hemisphere only)
├── RouteNetwork (Points or LineSegments)
│   └── Points material with size, opacity
└── LocationPin (Sprite or small Mesh)
```

### Reach Stacker Scene

```
THREE.Scene
├── AmbientLight
├── DirectionalLight (top-right, main fill)
├── DirectionalLight (fill, softer, opposite side)
├── ReachStackerModel (GLB loaded via useGLTF)
│   └── Animated via scroll-driven scrubbing
├── ContainerStack Group
│   ├── Container_White (Box mesh or GLB part)
│   ├── Container_Blue
│   └── Container_Red
```

### Container Ship Scene

```
THREE.Scene
├── AmbientLight (~0.5 intensity, blue-tinted)
├── DirectionalLight
├── ContainerShipModel (GLB)
│   └── Aerial view
├── WaterEffect (one of):
│   ├── THREE.Water (built-in) / drei Water
│   ├── Custom ocean shader mesh
│   └── Particle system for foam
```

### Aircraft Scene

```
THREE.Scene
├── AmbientLight (bright, ~0.8, blue-white)
├── DirectionalLight (sun)
├── AircraftModel (GLB)
├── CloudSystem (one of):
│   ├── Multiple cloud meshes (SphereGeometry, custom cloud material)
│   ├── THREE.Sprite cloud billboards
│   └── Volumetric cloud shader
├── EnvironmentMap (sky gradient or HDRI)
```

---

## Performance Optimizations (Inferred)

| Optimization          | Evidence                                                  |
| --------------------- | --------------------------------------------------------- |
| DPR cap at 2          | Site appears smooth at 60fps — standard practice          |
| Frustum culling       | Default Three.js behavior                                 |
| LOD                   | UNKNOWN — models may have LOD variants                    |
| Texture compression   | UNKNOWN                                                   |
| GLB/GLTF optimization | Models are clearly pre-processed (Draco likely)           |
| Scene switching       | Scenes not visible to camera likely have `visible: false` |
| `dispose()` on exit   | UNKNOWN — best practice                                   |

---

## Post-Processing

**Highly probable**. The visual quality (bloom, subtle color grading) suggests post-processing is active.

Likely post-processing stack (using `@react-three/postprocessing`):

```typescript
// Estimated post-processing pipeline:
<EffectComposer>
  <Bloom
    intensity={0.3}
    luminanceThreshold={0.9}
    luminanceSmoothing={0.025}
  />
  // Maybe:
  <SMAA />  // anti-aliasing (if not using renderer.antialias)
  // Possibly:
  <Vignette opacity={0.3} />
</EffectComposer>
```

**Globe scene** clearly has bloom — the atmosphere rim glow and thermal effect appear to overflow their geometry slightly, which is characteristic of bloom post-processing.

---

## R3F Specific Patterns

### useGLTF for model loading

```typescript
const { scene } = useGLTF('/models/reach-stacker.glb')
```

### useAnimations for crane sequence

```typescript
const { animations, mixer } = useAnimations(scene.animations)
// Scrub via:
mixer.setTime(scrollProgress * totalDuration)
```

### useFrame for continuous animations

```typescript
useFrame((state, delta) => {
  globeRef.current.rotation.y += delta * 0.05
  atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime
})
```

### Suspense + loader

```typescript
<Suspense fallback={<LoadingFallback />}>
  <ReachStackerModel />
</Suspense>
```
