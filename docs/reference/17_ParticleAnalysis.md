# 17 — Particle Analysis

---

## Overview

Three particle systems are identified in the reference:

1. **Globe Route Nodes** (Scene 1) — dots at shipping route endpoints
2. **Container Ship Water Foam** (Scene 7) — foam/bubble particles around vessel
3. **Atmospheric Blue Particles** (Scene 7, possible) — underwater/ocean depth particles

---

## Particle System 01 — Globe Route Nodes

### Purpose

Represent shipping route connection points (ports, airports, logistics hubs) on the Earth surface.

### Type

`THREE.Points` (GPU instanced point sprites)

### Count

Estimated **50–200 points** — representing major global shipping nodes. (Cannot precisely count from reference video resolution.)

### Behavior

- **Static position**: Points are fixed to the globe surface (on sphere)
- **Co-rotate**: Points rotate with the globe's Y-axis rotation
- **Pulsing**: Individual opacity oscillation — each point pulses independently
- **Size**: Very small (~0.01–0.03 world units = ~1–3px at viewing distance)

### Spawn

- Pre-defined coordinates (latitude/longitude converted to XYZ on unit sphere)
- No dynamic spawning

### Destroy

- Never destroyed (persistent throughout scene)

### GPU/CPU

- **GPU** — `THREE.Points` renders all points in a single draw call

### Implementation

```javascript
const positions = new Float32Array(nodeCount * 3)
const phases = new Float32Array(nodeCount) // for staggered pulsing

// Fill positions: lat/lon → XYZ on unit sphere
nodes.forEach((node, i) => {
  const phi = (90 - node.lat) * (Math.PI / 180)
  const theta = (node.lon + 180) * (Math.PI / 180)
  positions[i * 3] = -Math.sin(phi) * Math.cos(theta)
  positions[i * 3 + 1] = Math.cos(phi)
  positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta)
  phases[i] = Math.random() * Math.PI * 2 // random pulse offset
})
```

---

## Particle System 02 — Route Arc Lines

### Purpose

Show connections between global shipping route nodes.

### Type

`THREE.LineSegments` or `THREE.Line` — **not particles technically, but particle-adjacent**

### Count

Estimated **20–60 arcs** — major trade routes

### Behavior

- Follow curved 3D paths (QuadraticBezier arcs above sphere surface)
- Opacity: Static at ~0.3–0.4
- Possible: Animated dash pattern (dashes travel along the arc)

### GPU/CPU

- GPU — single draw call per line batch

---

## Particle System 03 — Container Ship Foam/Wake

### Purpose

Create the illusion that the ship is actively sailing through ocean water.

### Type

**UNKNOWN** — either:

- A: `THREE.Points` particle system (water foam sprites)
- B: Custom water shader with foam map
- C: Animated texture / normal map on water plane

### Count (if Type A — Points)

- Estimated **200–1000 particles**
- Dense around bow and sides of ship
- Sparse behind stern (trail wake)

### Behavior (if Type A)

- **Spawn**: Continuously at bow of ship + along sides
- **Movement**: Particles move outward and forward (ship is stationary, water appears to move past)
- **Life**: ~1–3 seconds per particle
- **Destroy**: Fade out (opacity → 0) after life expires
- **Loop**: Yes, continuous

### Particle Properties (if Type A)

| Property    | Value                                       |
| ----------- | ------------------------------------------- |
| Size        | Very small (1–3px at viewing distance)      |
| Color       | White (`#ffffff`)                           |
| Opacity     | 0.0 → 0.8 → 0.0 (birth → peak → death)      |
| Shape       | Soft circle (sprite with circular gradient) |
| Depth test  | true                                        |
| Depth write | false (to blend correctly)                  |

### GPU/CPU

- If using `THREE.Points`: **GPU** (instanced in single draw call)
- If using a custom particle system with JavaScript update loop: **CPU + GPU**

---

## Particle System 04 — Ocean Ambient Particles (Possible)

### Evidence

The container ship scene has a rich, deep-ocean atmosphere with subtle ambient elements. There may be additional background particles suggesting underwater/depth.

### UNKNOWN

- Cannot confirm existence from reference frames
- May be achieved purely through the blue background color and atmosphere, without actual particles

---

## Particle Performance Notes

| System      | Draw Calls | Count     | GPU Impact |
| ----------- | ---------- | --------- | ---------- |
| Route Nodes | 1          | ~200      | Minimal    |
| Route Arcs  | ~5–10      | ~50       | Very Low   |
| Ship Foam   | 1–2        | ~500–1000 | Low-Medium |

All particle systems combined should remain within budget for 60fps rendering on modern GPUs.

---

## WebGPU / GPU Particles

**Not confirmed** — the site appears to use standard WebGL (THREE.Points) rather than a compute-shader-based GPU particle system. The particle counts are modest enough to not require compute shaders.
