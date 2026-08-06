# 13 — Post-Processing Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Post-processing effects per scene — bloom, tone mapping, anti-alias, and effect ordering

---

## Post-Processing Library

**Package**: `@react-three/postprocessing`  
**Backed by**: `postprocessing` (PMNDrs)  
**Canvas integration**: `<EffectComposer>` wraps the `<Canvas>`

---

## Post-Processing Per Scene

| Scene    | Bloom    | SMAA | ToneMap      | Other |
| -------- | -------- | ---- | ------------ | ----- |
| Globe    | ✓ Strong | ✓    | ✓ ACESFilmic | —     |
| Crane    | ✗        | ✓    | ✓ ACESFilmic | —     |
| Truck    | ✗        | ✓    | ✓ ACESFilmic | —     |
| Ship     | ✓ Subtle | ✓    | ✓ ACESFilmic | —     |
| Aircraft | ✓ Subtle | ✓    | ✓ ACESFilmic | —     |

---

## EFFECT 01 — Bloom (Globe)

### Purpose

The atmosphere Fresnel glow and thermal overlay should bleed beyond their geometry — cinematic glow effect.

### Settings

| Property             | Value  | Notes                                         |
| -------------------- | ------ | --------------------------------------------- |
| `intensity`          | `0.5`  | Overall bloom strength                        |
| `luminanceThreshold` | `0.85` | Only very bright areas bloom                  |
| `luminanceSmoothing` | `0.1`  | Transition smoothness at threshold            |
| `radius`             | `0.6`  | How far bloom spreads                         |
| `mipmapBlur`         | `true` | Better quality bloom (R3F postprocessing v6+) |

### Implementation Note

The atmosphere rim glow must output luminance > 0.85 to catch the bloom threshold. With `AdditiveBlending`, the rim adds on top of space black — this brings its brightness well above the threshold naturally.

### Selective Bloom Strategy

If bloom affects ALL scene objects (including the globe body, which should NOT bloom):

```
Option A: SelectiveBloom — only specific layers bloom
  Add atmosphere mesh to bloom layer
  globe body NOT in bloom layer

Option B: Lower luminanceThreshold to 0.75
  More aggressive — may bloom globe highlights too

Option C: Separate render passes
  Render globe body to render target
  Render atmosphere + glow to another
  Bloom only the second
  Composite together

Recommended: Option A (SelectiveBloom) for precision
```

---

## EFFECT 02 — Bloom (Ship — Subtle)

### Purpose

Water foam particles should have a very slight glow — they are the brightest objects in the scene.

### Settings

| Property             | Value  |
| -------------------- | ------ |
| `intensity`          | `0.2`  |
| `luminanceThreshold` | `0.9`  |
| `luminanceSmoothing` | `0.05` |
| `radius`             | `0.3`  |

### Note

Ship containers should NOT bloom. Only the white foam particles exceed the 0.9 threshold. Keep container materials at max brightness 0.85 to avoid accidental bloom.

---

## EFFECT 03 — Bloom (Aircraft — Subtle)

### Purpose

Bright cloud edges and aircraft fuselage highlights should have a slight cinematic glow.

### Settings

| Property             | Value  |
| -------------------- | ------ |
| `intensity`          | `0.15` |
| `luminanceThreshold` | `0.88` |
| `luminanceSmoothing` | `0.05` |
| `radius`             | `0.3`  |

### Note

Aircraft tail (red) should NOT bloom. Fuselage top (bright white in sunlight) may bloom subtly.

---

## EFFECT 04 — Anti-Aliasing (SMAA)

### Usage

All 5 canvases use SMAA (Subpixel Morphological Anti-Aliasing).

### Settings

| Property        | Value                     |
| --------------- | ------------------------- |
| `preset`        | `SMAAPreset.MEDIUM`       |
| `edgeDetection` | `EdgeDetectionMode.COLOR` |

### Why SMAA over FXAA

SMAA produces better results on 3D geometry edges. FXAA is simpler but produces blurrier results. For a premium experience, SMAA is preferred.

### Why Not MSAA

MSAA (hardware multi-sampling) cannot be used with post-processing passes — they require a single render buffer. Use SMAA instead.

### Performance Impact

**Low-Medium** — SMAA is a 3-pass process but each pass is lightweight.

---

## EFFECT 05 — Tone Mapping

### Per-Canvas Settings

| Canvas   | Type                    | Exposure |
| -------- | ----------------------- | -------- |
| Globe    | `ACESFilmicToneMapping` | `1.2`    |
| Crane    | `ACESFilmicToneMapping` | `1.0`    |
| Truck    | `ACESFilmicToneMapping` | `1.0`    |
| Ship     | `ACESFilmicToneMapping` | `1.1`    |
| Aircraft | `ACESFilmicToneMapping` | `1.3`    |

### Why ACESFilmic

- Produces cinematic contrast
- Handles high-dynamic-range scenes (sun + space black)
- Prevents harsh white clipping
- Industry standard for film/VFX

### Implementation

```
In R3F:
  <Canvas gl={{ toneMapping: ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
```

---

## Effects NOT Used

| Effect               | Reason Not Used                                                  |
| -------------------- | ---------------------------------------------------------------- |
| Depth of Field       | Would compete with scroll animations — too distracting           |
| Chromatic Aberration | Not visible in reference                                         |
| Vignette             | Not visible in reference                                         |
| Noise/Film Grain     | Not visible in reference                                         |
| Motion Blur          | Not viable with scroll-scrub animation — would smear incorrectly |
| SSAO                 | Not needed — scenes are simple enough without ambient occlusion  |

---

## Effect Rendering Order

### Globe EffectComposer Stack

```
1. Main scene render (globe + atmosphere + thermal + route network)
2. SelectiveBloom (on atmosphere + thermal only)
3. SMAA
4. ToneMapping (ACESFilmic @ 1.2)
→ Output to screen
```

### Crane / Truck EffectComposer Stack

```
1. Main scene render
2. SMAA
3. ToneMapping (ACESFilmic @ 1.0)
→ Output to screen
```

### Ship EffectComposer Stack

```
1. Main scene render (ship + water + foam particles)
2. Bloom (subtle — foam only)
3. SMAA
4. ToneMapping (ACESFilmic @ 1.1)
→ Output to screen
```

### Aircraft EffectComposer Stack

```
1. Main scene render (sky + clouds + aircraft)
2. Bloom (subtle — cloud edges + highlights)
3. SMAA
4. ToneMapping (ACESFilmic @ 1.3)
→ Output to screen
```

---

## Performance Budget for Post-Processing

| Canvas   | Target GPU Frame Time | Acceptable Max |
| -------- | --------------------- | -------------- |
| Globe    | `≤ 4ms`               | `6ms`          |
| Crane    | `≤ 2ms`               | `4ms`          |
| Truck    | `≤ 2ms`               | `4ms`          |
| Ship     | `≤ 3ms`               | `5ms`          |
| Aircraft | `≤ 3ms`               | `5ms`          |

### If Frame Time Exceeds Budget

```
1. Reduce SMAA to SMAAPreset.LOW
2. Disable bloom on aircraft / ship (ship foam accepts loss of bloom)
3. Reduce bloom radius
4. Switch to FXAA (lower quality but faster)
5. On mobile: disable ALL post-processing, use renderer antialiasing only
```

---

## Mobile Fallback Strategy

| Device Category            | Post-Processing                                |
| -------------------------- | ---------------------------------------------- |
| Desktop (GPU ≥ 4GB VRAM)   | Full pipeline                                  |
| Desktop (GPU < 4GB)        | SMAA + ToneMapping only, no bloom              |
| iPad Pro / High-end tablet | FXAA + ToneMapping, no bloom                   |
| Mobile phone               | ToneMapping only, hardware antialias           |
| Low-end mobile             | No post-processing; renderer `antialias: true` |

### Detection

```
const gl = renderer.getContext()
const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
const gpuName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)

// OR: use device memory API
const deviceMemory = navigator.deviceMemory || 4  // default 4GB
const isLowEnd = deviceMemory < 2
```
