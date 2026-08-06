# 19 — GPU Optimization

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: GPU-side optimization strategies — instancing, culling, batching, material reuse, LOD

---

## Optimization Priority

```
Priority 1: Eliminate unnecessary render calls (frameloop="demand")
Priority 2: Reduce draw calls (instancing, merging)
Priority 3: Reduce fragment work (simpler shaders, smaller textures)
Priority 4: Reduce vertex work (lower polygon count)
Priority 5: Reduce memory bandwidth (material/texture reuse)
```

---

## Instanced Mesh (Ship Containers)

### Problem

The container ship has 40–80 identical container shapes, each of the same few sizes. Individual `THREE.Mesh` per container = 40–80 draw calls.

### Solution: `THREE.InstancedMesh`

```
Strategy: Group containers by color + size
  Red containers (2m × 1m × 1m): InstancedMesh with N instances
  Blue containers (4m × 1m × 1m): InstancedMesh with M instances
  etc.

Result: ~6–8 draw calls total for all containers
  (one per color-size group)
```

### InstancedMesh Setup

```
For each color group:
  geometry: BoxGeometry(width, height, depth)  ← Shared geometry
  material: MeshStandardMaterial({ color })    ← Shared material
  count: numberOfContainersInGroup

  For each instance (i):
    dummy.position.set(x, y, z)
    dummy.rotation.set(0, 0, 0)
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)

  instancedMesh.instanceMatrix.needsUpdate = true
```

### Instance Data from GLTF

If the ship GLB has individual container meshes (not instances):

1. Parse GLTF on load, extract container transforms
2. Group by material color
3. Create InstancedMesh per group
4. Dispose original individual meshes

---

## Frustum Culling

### Built-In Culling

Three.js performs frustum culling automatically:

- Objects outside camera frustum are NOT rendered
- `mesh.frustumCulled = true` (default)

### When to Disable Frustum Culling

```
// For particles that may extend outside frustum bounds:
points.frustumCulled = false

// For route arcs on globe (some arcs on back of globe):
arcMesh.frustumCulled = false
// Alternative: Use accurate bounding sphere
arcMesh.geometry.computeBoundingSphere()
```

### Bounding Sphere Update

When geometry changes (particle positions), update bounding sphere:

```
geometry.attributes.position.needsUpdate = true
geometry.computeBoundingSphere()  // Recompute for correct frustum culling
```

---

## LOD (Level of Detail)

**Decision: Not implemented** for initial version.

Reasons:

- All camera positions are pre-determined — no arbitrary zoom
- Polygon budgets already conservative
- Camera never gets close enough to see low-poly artifacts

**Future consideration**: If ship section needs more detail, implement LOD for container geometry at close camera distance.

```
If implemented:
  THREE.LOD object
  lod.addLevel(highPolyMesh, 0)     ← distance 0–5m
  lod.addLevel(medPolyMesh, 5)      ← distance 5–15m
  lod.addLevel(lowPolyMesh, 15)     ← distance 15+m
```

---

## Texture Compression (GPU)

### Current: Uncompressed JPEG

JPEG is compressed for download but decompressed when uploaded to GPU. A `2048×1024` RGBA texture = 8MB on GPU regardless of file size.

### Future: KTX2/Basis Universal

KTX2 stays compressed on GPU:

- `2048×1024` → ~2MB on GPU (4× reduction)
- Supported on modern GPUs (ETC2, BC7, ASTC)
- Falls back to uncompressed on unsupported hardware

### KTX2 Toolchain

```
Tool: toktx (from Khronos)
Command: toktx --encode uastc --uastc_quality 4 output.ktx2 input.jpg

Loader: KTX2Loader from @react-three/drei:
  <KTX2Loader ... />
  useTexture('/textures/earth.ktx2')
```

---

## Material Reuse

### Policy

| Situation                                    | Action                      |
| -------------------------------------------- | --------------------------- |
| Same color, same mesh type (ship containers) | Share one material instance |
| Different scene                              | NEVER share materials       |
| Standard vs Shader material                  | Never mix on same mesh      |

### Material Pool (Ship Scene)

```typescript
const containerMaterials = new Map([
  ['red', new MeshStandardMaterial({ color: '#8B1A1A' })],
  ['navy', new MeshStandardMaterial({ color: '#1A2E5A' })],
  ['white', new MeshStandardMaterial({ color: '#D8D8D8' })],
  // etc.
])
```

Shared across all instances — GPU only uploads the material once.

---

## Geometry Reuse

### Policy

InstancedMesh uses one geometry shared across all instances — geometry is the most expensive part to upload to GPU.

### Static Scene Geometry (Globe Arcs)

If arcs are static and never change, merge all arc geometries into one `BufferGeometry`:

```
THREE.BufferGeometryUtils.mergeGeometries(arcGeometries)
→ Single draw call for all arcs
→ Single geometry on GPU
```

Cost: Cannot animate or remove individual arcs without re-merging.  
**For this project**: Arcs are static → merge is acceptable.

---

## Render Call Elimination

### Canvas Pause Strategy

The single most impactful GPU optimization: **pause rendering inactive canvases**.

```
When canvas section not visible:
  canvas.frameloop = "demand"

  → R3F's render loop exits
  → GPU renders 0 frames per second
  → GPU is completely idle for that canvas
  → Zero draw calls, zero shader invocations
```

This alone reduces GPU work by ~80% during normal scrolling (only 1 active scene at a time).

### IntersectionObserver for Activation

```
threshold: 0.01  ← Activate when even 1% visible
root: null       ← Relative to viewport
rootMargin: '200px'  ← Activate 200px before entering viewport (preload)
```

---

## Batching Strategy Summary

| Scene             | Strategy                        | Draw Calls Reduction |
| ----------------- | ------------------------------- | -------------------- |
| Globe route arcs  | Merge geometries                | 30 → 1               |
| Globe route nodes | Points (already 1)              | Already optimal      |
| Ship containers   | InstancedMesh                   | 40–80 → 6–8          |
| Aircraft clouds   | Drei Cloud (batched internally) | Already optimal      |
| Foam particles    | Points (1 draw call)            | Already optimal      |

---

## GPU Optimization Checklist

```
Pre-launch verification:
✓ frameloop="demand" on inactive canvases
✓ All earth textures ≤ 2048×1024
✓ Ship containers use InstancedMesh
✓ Globe route arcs merged into one geometry
✓ Material sharing for same-color containers
✓ frustumCulled = false on globe particle system
✓ renderer.setPixelRatio(Math.min(dpr, 2))
✓ No unused imported Three.js modules (tree shaking)
✓ Draco compression on all GLB files
✓ Shadow maps only on crane + truck
✓ Post-processing disabled on inactive canvases
```

---

## GPU Profiling Tools

| Tool                                | Metric                   |
| ----------------------------------- | ------------------------ |
| Chrome DevTools → Performance → GPU | GPU frame time           |
| `renderer.info.render`              | Draw calls, triangles    |
| `r3f-perf` component                | Per-canvas GPU/CPU ms    |
| WebGL Insight (Chrome extension)    | WebGL call trace         |
| Spector.js                          | Full WebGL frame capture |

---

## Three.js Tree Shaking

Next.js + Webpack tree-shakes unused imports. To ensure Three.js is tree-shaken:

```
WRONG: import * as THREE from 'three'
  → Imports entire Three.js library

CORRECT: import { BufferGeometry, MeshStandardMaterial, ... } from 'three'
  → Only imports used classes
```

R3F's `<Canvas>` imports from three internally — those are always included.  
Custom code should use named imports only.
