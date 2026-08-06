# 18 — Asset Manifest

All assets required to build the 3D Atlas experience. Items marked UNKNOWN require the original design source or further investigation.

---

## Fonts

| Asset                                 | Format | Usage                  | Status                          |
| ------------------------------------- | ------ | ---------------------- | ------------------------------- |
| Display font (Bold/Black weights)     | WOFF2  | H1, H2, major headings | UNKNOWN — identify via DevTools |
| Display font (Regular/Medium weights) | WOFF2  | Body copy, nav, UI     | UNKNOWN                         |
| **Candidate**: Neue Haas Grotesk      | WOFF2  | All text               | Requires verification           |

---

## 3D Models

| Asset                 | Format   | Scene           | Details                                                              | Priority |
| --------------------- | -------- | --------------- | -------------------------------------------------------------------- | -------- |
| `earth-sphere.glb`    | GLB/GLTF | Scene 1 (Globe) | Simple sphere geometry — may be procedural (no model needed)         | Optional |
| `reach-stacker.glb`   | GLB/GLTF | Scene 4         | Full reach stacker crane, textured, potentially rigged for animation | HIGH     |
| `container-stack.glb` | GLB/GLTF | Scene 4         | Stack of shipping containers (3–4 colors)                            | HIGH     |
| `semi-truck.glb`      | GLB/GLTF | Scene 5         | Semi-truck cab + 40ft trailer, dark cab, silver container            | HIGH     |
| `container-ship.glb`  | GLB/GLTF | Scene 7         | Top-down aerial vessel with multi-colored containers on deck         | HIGH     |
| `aircraft.glb`        | GLB/GLTF | Scene 9         | Wide-body commercial aircraft, white/grey with red tail              | HIGH     |

### Model Sources (Estimated)

- Most likely from licensed 3D model libraries: Turbosquid, CGTrader, Sketchfab Pro
- May be custom-modeled
- All models are likely pre-processed: Draco compression, optimized mesh topology

### Model Optimization Requirements

- All GLB models must be Draco-compressed
- Texture dimensions: ≤ 2048×2048 (ideally 1024×1024 for performance)
- Polygon budget per model: See `05_PerformanceGuide.md`
- No model should exceed ~5MB compressed

---

## Textures

| Asset                              | Format      | Usage                               | Size                   |
| ---------------------------------- | ----------- | ----------------------------------- | ---------------------- |
| `earth-day.jpg` / `earth-day.ktx2` | JPG or KTX2 | Globe surface color map             | 2048×1024 or 4096×2048 |
| `earth-specular.jpg`               | JPG         | Globe ocean specularity             | 2048×1024              |
| `earth-clouds.png`                 | PNG/JPG     | Optional cloud layer                | 2048×1024              |
| `water-normal.jpg`                 | JPG         | Ocean surface normals (animated UV) | 512×512 or 1024×1024   |
| `water-foam.png`                   | PNG         | Foam texture for ship wake          | 512×512                |
| `cloud-noise.png`                  | PNG         | 2D or 3D noise for cloud shader     | 256×256                |

### Notes on Earth Texture

- NASA Blue Marble: `https://eoimages.gsfc.nasa.gov/images/imagerecords/74000/74117/world.200410.3x5400x2700.jpg`
- Free to use for non-commercial and educational purposes (credit required)
- Must be heavily darkened via shader — raw Blue Marble is too bright/colorful

---

## HDRI Environment Maps

| Asset                  | Format  | Usage                | Notes                      |
| ---------------------- | ------- | -------------------- | -------------------------- |
| `neutral-studio.hdr`   | HDR/EXR | Crane + Truck scenes | Studio neutral lighting    |
| `sky-overcast.hdr`     | HDR/EXR | Aircraft scene       | Bright sky, soft shadows   |
| UNKNOWN for ship scene | HDR/EXR | Ship scene           | May be color-only, no HDRI |

---

## Images (Raster)

| Asset                      | Format | Usage                                 | Approximate Size            |
| -------------------------- | ------ | ------------------------------------- | --------------------------- |
| `highway-aerial.jpg`       | JPG    | Editorial section (Scene 3) thumbnail | ~80×80 to 120×120px display |
| `testimonial-client-1.jpg` | JPG    | Testimonials section                  | ~100×100px display          |
| `[logo].svg`               | SVG    | Navbar logo/wordmark                  | Small, scalable             |

---

## SVG / Icons

| Asset                   | Usage                           | Notes                  |
| ----------------------- | ------------------------------- | ---------------------- |
| Navbar logo             | Top-left of navbar              | UNKNOWN — text or icon |
| Feature icons (×4+)     | Services grid section (Scene 6) | Small circular icons   |
| Ship feature icons (×5) | Container ship labels (Scene 7) | Very small icons       |
| Cursor SVG              | Custom cursor ring              | Simple circle outline  |

---

## Video

| Asset           | Format | Usage | Notes                                      |
| --------------- | ------ | ----- | ------------------------------------------ |
| None identified | —      | —     | No background videos observed in reference |

---

## Audio

| Asset           | Usage | Notes                                                                                              |
| --------------- | ----- | -------------------------------------------------------------------------------------------------- |
| None identified | —     | No audio detected in reference (AAC track in mp4 has very low bitrate — likely ambient or silence) |

---

## Data Files

| Asset                  | Format | Usage                              | Notes                                |
| ---------------------- | ------ | ---------------------------------- | ------------------------------------ |
| `shipping-routes.json` | JSON   | Globe route network node positions | Lat/lon coordinates for 50–200 nodes |
| `route-arcs.json`      | JSON   | Globe arc connections              | Pairs of node IDs to connect         |

---

## Asset Loading Strategy

| Priority      | Asset                               | Load Time                  |
| ------------- | ----------------------------------- | -------------------------- |
| P0 (critical) | Fonts                               | Before any text renders    |
| P0 (critical) | Earth texture (low-res placeholder) | Hero loads                 |
| P1 (high)     | Earth texture (full res)            | Immediately after P0       |
| P1 (high)     | Shipping route data JSON            | Hero loads                 |
| P2 (medium)   | Reach stacker GLB                   | Before Scene 4 is visible  |
| P2 (medium)   | Truck GLB                           | Before Scene 5 is visible  |
| P2 (medium)   | Container ship GLB                  | Before Scene 7 is visible  |
| P2 (medium)   | Aircraft GLB                        | Before Scene 9 is visible  |
| P3 (low)      | HDRI files                          | Background load after hero |
| P3 (low)      | Testimonial images                  | Lazy load                  |

### Preloading Strategy

```javascript
// Preload all GLB models using Drei's `useGLTF.preload`
useGLTF.preload('/models/reach-stacker.glb')
useGLTF.preload('/models/truck.glb')
useGLTF.preload('/models/container-ship.glb')
useGLTF.preload('/models/aircraft.glb')
```
