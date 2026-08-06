# 11 — Model Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: GLB model processing, compression, optimization, and reuse strategy

---

## Model Inventory

| Model               | File           | Compressed Target | Animation Clips | LOD |
| ------------------- | -------------- | ----------------- | --------------- | --- |
| Reach Stacker Crane | `crane.glb`    | `< 2MB`           | YES (1 clip)    | No  |
| Semi-Truck          | `truck.glb`    | `< 1.5MB`         | NO              | No  |
| Container Ship      | `ship.glb`     | `< 2MB`           | NO              | No  |
| Commercial Aircraft | `aircraft.glb` | `< 1MB`           | NO              | No  |

---

## GLB Format Requirements

### Per-Model Checklist

```
✓ Coordinate system: Y-up (Three.js native)
✓ Scale: 1 unit = 1 meter (Three.js convention)
✓ Origin: At model center or base
✓ Materials: PBR (metallic-roughness workflow)
✓ Textures: Embedded in GLB (not separate files)
✓ Normals: Present and correct
✓ Animation clips: Named (crane only)
✓ Node names: Descriptive (for runtime access by name)
```

---

## Draco Compression

### Why Draco

Draco compresses geometry (vertex positions, normals, UVs) achieving 5–10× size reduction.

### Compression Command

```
npx gltf-pipeline -i input.glb -o output.glb \
  --draco.compressionLevel=10 \
  --draco.quantizePositionBits=14 \
  --draco.quantizeNormalBits=10 \
  --draco.quantizeTexcoordBits=12
```

### Compression Settings

| Setting                | Value | Tradeoff                          |
| ---------------------- | ----- | --------------------------------- |
| `compressionLevel`     | `10`  | Max compression, slower decode    |
| `quantizePositionBits` | `14`  | High vertex precision             |
| `quantizeNormalBits`   | `10`  | Normal precision (16 is overkill) |
| `quantizeTexcoordBits` | `12`  | UV precision                      |

### Draco Decoder Location

```
/public/draco/
  ├── draco_decoder.js
  ├── draco_decoder.wasm
  └── draco_wasm_wrapper.js
```

---

## Model Optimization Guidelines

### Polygon Budget (Per Model)

| Model    | Max Triangles | Reason                         |
| -------- | ------------- | ------------------------------ |
| Crane    | `≤ 80,000`    | Complex machinery, high detail |
| Truck    | `≤ 50,000`    | Simpler form factor            |
| Ship     | `≤ 80,000`    | Large, many containers         |
| Aircraft | `≤ 50,000`    | Clean aerodynamic shape        |

### Optimization Process

```
Source model (may be high-poly)
  ↓
Decimation (Blender Decimate modifier OR Simplygon)
  ↓
Normal bake (from high-poly to low-poly — preserves surface detail)
  ↓
UV unwrap (clean, no overlaps)
  ↓
Material assignment (PBR metallic-roughness)
  ↓
Export GLB
  ↓
Draco compression
  ↓
Verify in Three.js viewer (model-viewer.dev)
```

### Embedded Textures

All textures embedded in GLB:

- Reduces HTTP requests
- One file = one load
- Maximum size per embedded texture: `512×512` (material details)
- Prefer baked texture maps over runtime lighting for static materials

---

## Crane Animation Clip

### Requirements

```
Clip name: "CraneAnimation" (or any consistent name)
Clip duration: arbitrary (e.g., 10 seconds)
  The duration doesn't matter — scroll drives time, not clock

Keyframe data:
  ├── Boom rotation (Z-axis): 40°→50° then 50°→10°
  ├── Crane body position (X): 0 → -2 meters
  ├── Spreader position (Y): down and up
  └── Container position (Y): lift arc

Keyframe count: minimum needed for smooth playback
  ~20–30 keyframes for full clip
  (scrub requires smooth interpolation between all keyframes)
```

### Clip Access at Runtime

```
gltf.animations[0]          ← First (and only) clip
animationMixer.clipAction(gltf.animations[0])
mixer.setTime(progress × clip.duration)
```

### Important: AnimationAction Setup

```
const action = mixer.clipAction(clip)
action.play()    ← Must call play() even for scrub-based animation
action.paused = false
```

---

## Geometry Merging (Ship Containers)

The ship's container grid may contain 40+ individual container meshes. Merging them reduces draw calls.

### Merging Strategy

| Approach                    | Draw Calls | Memory   | Flexibility       |
| --------------------------- | ---------- | -------- | ----------------- |
| Individual meshes           | 40+        | Moderate | Full              |
| Merge by color group        | ~6–8       | Lower    | Color only        |
| InstancedMesh per color     | ~6–8       | Lowest   | Color + transform |
| Full merge (all containers) | 1          | Lowest   | None              |

**Recommended**: InstancedMesh per color group  
**Reason**: Reduces draw calls to ~8 (one per container color) while keeping transforms accessible.

---

## LOD Strategy

**Decision: No LOD for this project.**

Reasons:

- All 3D scenes are pinned sections — user cannot zoom arbitrarily
- Camera positions are pre-determined — no need for distance-based LOD
- Models are already optimized to polygon budget

UNKNOWN — May require LOD on very low-end mobile if performance is insufficient.

---

## Model Reuse Strategy

| Situation                            | Strategy                                           |
| ------------------------------------ | -------------------------------------------------- |
| Same model in multiple scenes        | Load once, clone scene graph: `gltf.scene.clone()` |
| Crane and truck (similar containers) | Different models — no reuse                        |
| Ship containers (repeated shapes)    | InstancedMesh within ship GLB                      |

### Clone vs Share

```
Shared (read-only):
  const { scene } = useGLTF('/models/crane.glb')
  // scene is shared — mutating it affects all consumers

Cloned (per-instance):
  const { scene } = useGLTF('/models/crane.glb')
  const clone = scene.clone(true)  // true = deep clone (includes materials)
  // Safe to mutate clone independently
```

For this project, each model is used in exactly one scene — sharing vs cloning is not relevant.

---

## Model Loading Verification

### Pre-Deployment Checklist

```
✓ model-viewer.dev preview — correct appearance
✓ No missing normals (smooth shading correct)
✓ Correct Y-up orientation
✓ Scale is 1:1 meters (test: crane should be ~15m tall)
✓ Animation clip present and named (crane)
✓ Draco decode successful (no decoder errors in console)
✓ File size under budget
✓ Embedded textures load correctly
```
