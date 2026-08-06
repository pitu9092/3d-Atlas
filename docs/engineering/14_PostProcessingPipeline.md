# 14 — Post-Processing Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Post-processing architecture — effects, ordering, performance, and mobile fallbacks

---

## Post-Processing Library

| Library                       | Role                                  |
| ----------------------------- | ------------------------------------- |
| `@react-three/postprocessing` | React/R3F wrapper for post-processing |
| `postprocessing` (PMNDrs)     | Core engine, optimized passes         |
| R3F `<EffectComposer>`        | Declarative container                 |

---

## Effects Used (Confirmed from Reference)

| Effect               | Used                      | Reason                           |
| -------------------- | ------------------------- | -------------------------------- |
| Bloom                | ✓ (Globe, Ship, Aircraft) | Glow on atmosphere, foam, clouds |
| SMAA                 | ✓ (All scenes)            | Anti-aliasing                    |
| ToneMapping          | ✓ (All scenes)            | ACESFilmic exposure control      |
| FXAA                 | Not primary               | Fallback if SMAA too expensive   |
| Depth of Field       | ✗                         | Not in reference                 |
| Chromatic Aberration | ✗                         | Not in reference                 |
| Noise / Film Grain   | ✗                         | Not in reference                 |
| Motion Blur          | ✗                         | Incompatible with scroll-scrub   |
| SSAO                 | ✗                         | Not needed for these scenes      |
| Vignette             | ✗                         | Not in reference                 |

---

## Effect Composer Per Canvas

### Globe EffectComposer

```
EffectComposer (multisampling: 0)
├── SelectiveBloom
│   ├── layers: [1]  ← Atmosphere + thermal meshes only
│   ├── luminanceThreshold: 0.85
│   ├── intensity: 0.5
│   └── radius: 0.6
└── SMAA
    └── preset: SMAAPreset.MEDIUM

ToneMapping: Set on renderer (ACESFilmic, exposure 1.2)
  NOT as pass — renderer handles it
```

### Crane EffectComposer

```
EffectComposer (multisampling: 4)
└── SMAA
    └── preset: SMAAPreset.MEDIUM

ToneMapping: renderer (ACESFilmic, exposure 1.0)
```

### Truck EffectComposer

Same as Crane.

### Ship EffectComposer

```
EffectComposer (multisampling: 0)
├── Bloom
│   ├── luminanceThreshold: 0.92
│   ├── intensity: 0.2
│   └── radius: 0.3
└── SMAA
    └── preset: SMAAPreset.MEDIUM

ToneMapping: renderer (ACESFilmic, exposure 1.1)
```

### Aircraft EffectComposer

```
EffectComposer (multisampling: 0)
├── Bloom
│   ├── luminanceThreshold: 0.88
│   ├── intensity: 0.15
│   └── radius: 0.3
└── SMAA
    └── preset: SMAAPreset.MEDIUM

ToneMapping: renderer (ACESFilmic, exposure 1.3)
```

---

## SelectiveBloom (Globe)

### Why SelectiveBloom

Standard bloom affects ALL bright pixels in the scene. The globe's sunlit surface would bloom — making it look overexposed and unintentional.

Selective bloom restricts bloom to specific objects (atmosphere shell + thermal overlay) using Three.js layer system.

### Layer Configuration

```
Globe mesh: layer 0 (default)
Atmosphere mesh: layer 0 AND 1
Thermal overlay: layer 0 AND 1

SelectiveBloom targets: layer 1 only
Result: Only atmosphere + thermal glow
```

---

## Bloom Configuration Rationale

| Scene    | Intensity            | Threshold | Why                                   |
| -------- | -------------------- | --------- | ------------------------------------- |
| Globe    | `0.5` (strong)       | `0.85`    | Atmosphere must visibly glow in space |
| Ship     | `0.2` (subtle)       | `0.92`    | Foam needs soft glow, not excessive   |
| Aircraft | `0.15` (very subtle) | `0.88`    | Cloud edges and fuselage              |

---

## SMAA vs MSAA vs FXAA

| Method          | Quality    | Performance | Notes                                  |
| --------------- | ---------- | ----------- | -------------------------------------- |
| MSAA (hardware) | Best       | Expensive   | CANNOT use with post-processing passes |
| SMAA (software) | Very good  | Medium      | ✓ Compatible with post-processing      |
| FXAA (software) | Acceptable | Cheap       | Blurry but fast                        |

**Primary**: SMAA at medium preset  
**Mobile fallback**: FXAA  
**Low-end mobile**: No anti-aliasing (renderer `antialias: true` only)

---

## ToneMapping Architecture

Tone mapping is applied at the RENDERER level — NOT as a post-processing pass.

```
renderer.toneMapping = ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2  // varies per scene
```

### Why Renderer-Level

Applying tone mapping in a pass requires an additional render target. At renderer level, it's essentially free.

### Exposure Adjustment

If a scene appears too bright or too dark, adjust `toneMappingExposure`:

- Increase → brighter (washed out highlights)
- Decrease → darker (richer shadows)

---

## Effect Ordering

```
Render:
1. Main scene → internal render target
2. SelectiveBloom OR Bloom (if configured)
3. SMAA
Output → screen

ToneMapping: Applied by renderer before output
```

Post-processing passes run in declaration order. Order matters:

- Bloom BEFORE SMAA (bloom artifacts then smoothed by SMAA)
- SMAA LAST (final anti-aliasing on the complete composited image)

---

## Performance Impact

| Effect                         | GPU Cost (approx) | Can Disable             |
| ------------------------------ | ----------------- | ----------------------- |
| Bloom                          | `~1.5ms`          | YES — remove on low-end |
| SMAA                           | `~0.8ms`          | YES — fallback to FXAA  |
| EffectComposer overhead        | `~0.3ms`          | N/A                     |
| **Total per canvas**           | **`~2.6ms`**      |                         |
| **Total (3 canvases with PP)** | **`~7.8ms`**      |                         |

Budget per canvas (from Performance Budget doc): `≤ 4ms`  
Including post-processing: `~4ms scene + 2.6ms PP = 6.6ms` — may exceed budget.

**Mitigation**: Bloom is worth the cost for the globe. Ship and aircraft bloom is optional.

---

## Mobile Fallback Cascade

```
GPU Tier Detection:
  High   → Full pipeline (Bloom + SMAA)
  Medium → SMAA only (no Bloom)
  Low    → No post-processing (renderer antialias only)

Detection method:
  navigator.deviceMemory < 2 → Low
  GPU string detection (WebGL debug info) → Medium/High
```

### Implementation

```typescript
function buildEffectComposer(tier: 'high' | 'medium' | 'low') {
  if (tier === 'low') return null  // No composer
  if (tier === 'medium') {
    return <EffectComposer><SMAA /></EffectComposer>
  }
  return (
    <EffectComposer>
      <Bloom intensity={0.5} luminanceThreshold={0.85} />
      <SMAA />
    </EffectComposer>
  )
}
```

---

## EffectComposer Cleanup

```
// R3F handles EffectComposer lifecycle with React component unmount
// Ensure no lingering render targets:
// R3F @react-three/postprocessing handles dispose() internally

// If manual cleanup needed:
effectComposerRef.current?.dispose()
```
