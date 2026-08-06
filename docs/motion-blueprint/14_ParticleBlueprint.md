# 14 — Particle Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Every particle system — spawn, lifetime, motion, count, GPU vs CPU, and performance

---

## Particle Systems Inventory

| ID    | Name                     | Scene    | Type                      | Priority |
| ----- | ------------------------ | -------- | ------------------------- | -------- |
| PS-01 | Route Network Nodes      | Globe    | Three.Points (CPU)        | High     |
| PS-02 | Route Network Arcs       | Globe    | Three.Line / TubeGeometry | Medium   |
| PS-03 | Water Foam               | Ship     | Three.Points (CPU)        | High     |
| PS-04 | Possible Cloud Particles | Aircraft | Drei `<Cloud>`            | Medium   |

---

## PS-01 — Route Network Nodes (Globe)

### Purpose

Glowing white dots on globe surface representing logistics hubs. Pulse individually to suggest activity.

### Spawn

| Property         | Value                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Trigger          | Scene mount (page load)                                                                                   |
| Count            | `50–80` nodes                                                                                             |
| Positions        | Pre-defined lat/lon coordinates distributed globally, concentrated in Asia-Pacific, Europe, North America |
| Position mapping | Lat/lon → 3D sphere coordinate                                                                            |
| Depth            | On surface: `radius = 1.005`                                                                              |

### Lat/Lon to 3D Conversion

```
x = radius × cos(lat) × cos(lon)
y = radius × sin(lat)
z = radius × cos(lat) × sin(lon)
```

### Geometry

| Property    | Value                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Type        | `THREE.BufferGeometry`                                                          |
| Attributes  | `position` (Float32Array, 3 floats per point), `color` (Float32Array, 3 floats) |
| Point count | `~60`                                                                           |

### Material

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| Type            | `THREE.PointsMaterial`                  |
| Color           | `#ffffff` (overridden by vertex colors) |
| Size            | `0.03` (world units)                    |
| SizeAttenuation | `true`                                  |
| VertexColors    | `true`                                  |
| Transparent     | `true`                                  |

### Lifetime

| Property       | Value                                       |
| -------------- | ------------------------------------------- |
| Destroy timing | Never — persistent throughout globe section |
| Loop           | Continuous pulse                            |

### Animation (CPU — useFrame)

```
Per frame:
  for each node:
    phase = nodeIndex × 0.7  ← stagger offset
    brightness = 0.6 + 0.4 × Math.sin(time × 2.0 + phase)
    color[i×3 + 0] = brightness  (R)
    color[i×3 + 1] = brightness  (G)
    color[i×3 + 2] = brightness  (B)

  pointsGeometry.attributes.color.needsUpdate = true
```

### Performance Budget

| Property         | Value                      |
| ---------------- | -------------------------- |
| Update per frame | 60 × 3 floats = 180 writes |
| GPU cost         | Trivial — 60 points        |
| CPU cost         | ~0.01ms                    |

---

## PS-02 — Route Network Arcs (Globe)

### Purpose

Curved lines connecting logistics hub nodes — showing route relationships.

### Type

NOT a particle system — these are `THREE.TubeGeometry` meshes along Bezier curves.

### Geometry

| Property         | Value                                          |
| ---------------- | ---------------------------------------------- |
| Type             | `THREE.TubeGeometry` along `CubicBezierCurve3` |
| Radius           | `0.002` (very thin)                            |
| Radial segments  | `4`                                            |
| Tubular segments | `32`                                           |
| Arc height       | Control point at `radius × 1.2` from surface   |

### Material

| Property    | Value                      |
| ----------- | -------------------------- |
| Type        | `THREE.MeshBasicMaterial`  |
| Color       | `rgba(255, 255, 255, 0.3)` |
| Transparent | `true`                     |
| DepthWrite  | `false`                    |

### Count

| Property | Value                           |
| -------- | ------------------------------- |
| Arcs     | `~20–30` visible                |
| Focus    | Asia-Pacific region connections |

### Animation

Static — arcs do not animate. Only nodes pulse.

---

## PS-03 — Water Foam (Ship Scene)

### Purpose

White foam along ship hull perimeter — indicates vessel movement through water.

### Spawn

| Property   | Value                                                        |
| ---------- | ------------------------------------------------------------ |
| Trigger    | Ship section canvas activation                               |
| Count      | `200–400` particles at any time                              |
| Position   | Along ship hull outline (both port and starboard sides), bow |
| Spawn rate | `~50` new particles per second                               |

### Particle State

| Property         | Value                        |
| ---------------- | ---------------------------- |
| Initial position | Random point along hull edge |
| Lifetime         | `2.0–4.0s`                   |
| Loop             | Yes — respawn at hull edge   |

### Motion

| Property   | Value                                               |
| ---------- | --------------------------------------------------- |
| Velocity X | `±0.002–0.008 units/frame` (outward from hull)      |
| Velocity Z | `0.001–0.003 units/frame` (trailing toward stern)   |
| Damping    | `0.95` (velocity × 0.95 each frame — slows to rest) |

### Opacity Lifecycle

| Life Stage          | Opacity            |
| ------------------- | ------------------ |
| 0–20% of lifetime   | `0 → 1` (fade in)  |
| 20–80% of lifetime  | `1.0` (full)       |
| 80–100% of lifetime | `1 → 0` (fade out) |

### Geometry

| Property    | Value                                           |
| ----------- | ----------------------------------------------- |
| Type        | `THREE.BufferGeometry`                          |
| Attributes  | `position`, `opacity` (custom), `size` (custom) |
| Buffer size | `400` (static, reuse slots)                     |

### Material

| Property        | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| Type            | `THREE.PointsMaterial`                                     |
| Color           | `#ffffff`                                                  |
| Size            | `0.5–1.0` world units                                      |
| SizeAttenuation | `true`                                                     |
| Transparent     | `true`                                                     |
| Opacity         | Controlled per-particle via `alphaTest` + custom attribute |

### CPU vs GPU

| Property    | Value                                      |
| ----------- | ------------------------------------------ |
| Type        | CPU simulation                             |
| Update      | `useFrame` — move particles, update buffer |
| Reason      | Low count (400) — CPU is fine              |
| GPU compute | NOT needed at this particle count          |

### Performance Budget

| Property                | Value                         |
| ----------------------- | ----------------------------- |
| Particles               | 400                           |
| Buffer writes per frame | 400 × 4 floats = 1,600 writes |
| CPU cost                | `~0.1ms`                      |
| GPU cost                | Trivial                       |

---

## PS-04 — Cloud Particles (Aircraft Scene)

### Purpose

Volumetric cloud formations visible during aircraft section.

### Implementation

**Primary**: Use Drei `<Cloud>` component — handles particle distribution automatically.

| `<Cloud>` Property | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| `bounds`           | `[40, 10, 40]` (width, height, depth of cloud volume) |
| `segments`         | `40` (particle count per cloud)                       |
| `volume`           | `8.0`                                                 |
| `smallestVolume`   | `0.1`                                                 |
| `color`            | `#ffffff`                                             |
| `fade`             | `10`                                                  |
| `speed`            | `0.2` (animation speed)                               |
| `growth`           | `4`                                                   |

### Cloud Positions (Multiple instances)

```
Cloud 1: position [-20, -10, -30] — far left, below aircraft
Cloud 2: position [15, -8, -20]   — right side
Cloud 3: position [0, -15, -50]   — distant background
Cloud 4: position [-30, -5, 10]   — near left
```

### Animation

`<Cloud>` animates internally — clouds slowly drift and morph.

### Performance Budget

| Property            | Value           |
| ------------------- | --------------- |
| Particles per cloud | 40              |
| Cloud count         | 4               |
| Total particles     | ~160            |
| CPU cost            | Managed by Drei |

---

## Particle Performance Rules

| Rule                                                             | Reason                          |
| ---------------------------------------------------------------- | ------------------------------- |
| Never exceed 5,000 CPU particles total                           | At 400+ per scene, stay CPU     |
| Use instanced mesh over Points for non-circular particles        | Better GPU batching             |
| Reuse buffer slots (dead particle → respawn)                     | Avoid allocation every frame    |
| Set `geometry.attributes.X.needsUpdate = true` only when changed | Prevents unnecessary GPU upload |
| `dispose()` buffers on scene unmount                             | Memory cleanup                  |
| Use `alphaTest = 0.05` to discard transparent fragments          | Saves GPU fillrate              |

---

## GPU Particle Strategy (If Needed)

If foam particles exceed 1,000 count (for higher quality):

```
Consider:
  - THREE.InstancedMesh (billboarded quads)
  - Position stored in texture (shader reads position from tex)
  - Transform feedback (WebGL2 only)

For 3D Atlas at current particle counts: GPU not needed.
```
