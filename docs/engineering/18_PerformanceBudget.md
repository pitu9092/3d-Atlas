# 18 — Performance Budget

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Hard performance ceilings for all metrics — triangles, draw calls, memory, frame time, FPS

---

## Target Hardware

| Device            | Spec                              | Target FPS          |
| ----------------- | --------------------------------- | ------------------- |
| Primary (Desktop) | GPU: GTX 1060 / RX 580 equivalent | 60fps               |
| High-end Desktop  | RTX 3080+                         | 60fps (trivially)   |
| Mid MacBook (M1)  | Apple M1 GPU                      | 60fps               |
| iPad Pro          | A14+ GPU                          | 60fps               |
| Mid-range mobile  | Snapdragon 778G                   | 30fps (fallback)    |
| Low-end mobile    | Snapdragon 665                    | Fallback/simplified |

---

## Frame Budget

### Target: 16.7ms per frame (60fps)

```
16.7ms frame budget breakdown:
  JavaScript (GSAP + RAF logic):   ≤ 2ms
  Lenis + ScrollTrigger:           ≤ 1ms
  React renders:                   ≤ 0.5ms (minimal re-renders)
  WebGL (all canvases combined):   ≤ 10ms
  Browser overhead:                ≤ 3ms
  Buffer:                          ≤ 0.2ms
```

### Per-Canvas GPU Frame Budget

| Canvas            | GPU Target | Max Acceptable |
| ----------------- | ---------- | -------------- |
| Globe (active)    | `≤ 4ms`    | `6ms`          |
| Crane (active)    | `≤ 2ms`    | `4ms`          |
| Truck (active)    | `≤ 2ms`    | `4ms`          |
| Ship (active)     | `≤ 3ms`    | `5ms`          |
| Aircraft (active) | `≤ 3ms`    | `5ms`          |

Note: Only 1–2 canvases are active simultaneously (pin sections overlap). Combined max: `~7ms` GPU.

---

## Triangle Budget

| Scene                 | Triangle Budget | Notes                         |
| --------------------- | --------------- | ----------------------------- |
| Globe mesh            | `≤ 8,192`       | 64×64 sphere = 8K             |
| Atmosphere shell      | `≤ 8,192`       | Same resolution as globe      |
| Route arcs            | `≤ 10,000`      | ~25 arcs × 8×32 tube          |
| Crane model           | `≤ 80,000`      | Complex machinery             |
| Truck model           | `≤ 50,000`      | Simpler form                  |
| Ship model            | `≤ 80,000`      | Hull + containers             |
| Aircraft model        | `≤ 50,000`      | Clean aerodynamic shape       |
| Water plane           | `≤ 5,000`       | Large but simple              |
| Sky dome              | `≤ 5,000`       | Drei Sky mesh                 |
| **Total (max scene)** | **≤ 100,000**   | Only one complex scene active |

---

## Draw Call Budget

| Canvas   | Max Draw Calls |
| -------- | -------------- |
| Globe    | `≤ 8`          |
| Crane    | `≤ 15`         |
| Truck    | `≤ 10`         |
| Ship     | `≤ 12`         |
| Aircraft | `≤ 10`         |

### How to Reduce Draw Calls

- InstancedMesh for repeated containers (ship)
- Merge static geometries
- Share materials between similar objects
- Use single Point cloud (1 draw call) vs many Point objects

---

## Texture Memory Budget

| Budget Category           | Limit                     |
| ------------------------- | ------------------------- |
| Total GPU texture memory  | `≤ 128MB`                 |
| Per-canvas texture budget | `≤ 32MB`                  |
| Single texture max        | `≤ 16MB` (4096×4096 RGBA) |

### Actual Estimated Usage

| Canvas    | Texture Memory           |
| --------- | ------------------------ |
| Globe     | `~18MB`                  |
| Crane     | `~3MB`                   |
| Truck     | `~2MB`                   |
| Ship      | `~5MB`                   |
| Aircraft  | `~2MB`                   |
| **Total** | **~30MB** (within 128MB) |

---

## Shader Performance Budget

| Metric                               | Budget                               |
| ------------------------------------ | ------------------------------------ |
| Fragment shader instructions (earth) | `≤ 150`                              |
| Texture samples per fragment (earth) | `≤ 3`                                |
| Active shader programs (per canvas)  | `≤ 5`                                |
| Shader compile time (per canvas)     | `≤ 500ms` (during load, not visible) |

---

## Light Budget

| Scene    | Max Lights                           | Shadow Maps |
| -------- | ------------------------------------ | ----------- |
| Globe    | `2` (ambient + directional)          | `0`         |
| Crane    | `4` (ambient + 2 directional + hemi) | `1 (2048²)` |
| Truck    | `4` (ambient + 2 directional + rim)  | `1 (2048²)` |
| Ship     | `2` (ambient + directional)          | `0`         |
| Aircraft | `2` (ambient + directional)          | `0`         |

---

## Particle Budget

| System                      | Max Particles         |
| --------------------------- | --------------------- |
| Route nodes (globe)         | `80`                  |
| Route arcs                  | `30 arcs`             |
| Water foam (ship)           | `400`                 |
| Cloud particles (aircraft)  | `~160` (Drei managed) |
| **Total across all scenes** | `≤ 700`               |

CPU particle budget: **`< 5,000` total** (well within limit).

---

## Animation Budget

| Category                | Max Active Simultaneously        |
| ----------------------- | -------------------------------- |
| GSAP tweens             | `≤ 20`                           |
| ScrollTrigger instances | `14` (all registered, most idle) |
| useFrame callbacks      | `≤ 3` (per active canvas)        |
| AnimationMixer clips    | `1` (crane only)                 |
| CSS transitions         | `≤ 5`                            |

---

## Memory Budget (RAM)

| Category                     | Budget    |
| ---------------------------- | --------- |
| JavaScript heap              | `≤ 50MB`  |
| Three.js geometry (CPU side) | `≤ 20MB`  |
| GSAP internal                | `≤ 5MB`   |
| Asset cache (decoded GLBs)   | `≤ 30MB`  |
| **Total RAM**                | `≤ 105MB` |

---

## Monitoring Strategy

### Development Tools

| Tool                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `r3f-perf`                    | Per-canvas GPU/CPU time, draw calls      |
| Chrome DevTools → Performance | JavaScript profiling                     |
| Chrome DevTools → Memory      | Heap snapshot, allocation profiling      |
| Chrome DevTools → Rendering   | FPS meter, GPU memory                    |
| `renderer.info`               | Draw calls, triangles, textures (in-app) |

### Performance Regression Alerts

Before each commit to main:

- Run Lighthouse CI (performance score ≥ 80)
- Run FPS monitor (≥ 60fps on target hardware)

---

## Budget Violation Response

| Violation                   | Response                               |
| --------------------------- | -------------------------------------- |
| FPS < 60 on target hardware | Profile → find bottleneck → optimize   |
| GPU > 6ms per canvas        | Reduce polygon count OR disable bloom  |
| RAM > 100MB                 | Check for texture leaks → add disposal |
| Draw calls > 15             | Add instancing or geometry merging     |
| Shader > 6ms                | Simplify fragment shader               |
