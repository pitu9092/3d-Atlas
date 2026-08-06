# 21 — Mobile Strategy

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Mobile performance, simplified rendering, touch support, and fallback content

---

## Mobile Device Tiers

| Tier        | Device Examples                         | GPU Capability    | Strategy                             |
| ----------- | --------------------------------------- | ----------------- | ------------------------------------ |
| High        | iPhone 15 Pro, iPad Pro M2, Samsung S24 | Full WebGL 2      | Full experience (slight adjustments) |
| Medium      | iPhone 13, Samsung A54, Pixel 7         | WebGL 2           | Reduced effects                      |
| Low         | iPhone SE (1st gen), Budget Android     | WebGL 1 / Limited | Simplified mode                      |
| Unsupported | Very old devices, no WebGL              | None              | Static fallback                      |

---

## Device Capability Detection

### Detection Strategy

```typescript
interface DeviceCapability {
  gpuTier: 'high' | 'medium' | 'low'
  prefersReducedMotion: boolean
  hasTouch: boolean
  deviceMemory: number // GB (approximate)
  pixelRatio: number
  screenWidth: number
}

function detectCapability(): DeviceCapability {
  const pixelRatio = window.devicePixelRatio || 1
  const deviceMemory = (navigator as any).deviceMemory || 4
  const hasTouch = window.matchMedia('(pointer: coarse)').matches
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // GPU tier heuristic:
  let gpuTier: 'high' | 'medium' | 'low'
  if (deviceMemory >= 4 && pixelRatio <= 3) gpuTier = 'high'
  else if (deviceMemory >= 2) gpuTier = 'medium'
  else gpuTier = 'low'

  return {
    gpuTier,
    prefersReducedMotion,
    hasTouch,
    deviceMemory,
    pixelRatio,
    screenWidth: window.innerWidth,
  }
}
```

### More Accurate GPU Detection

```
WebGL Debug Renderer Info extension:
  const gl = renderer.getContext()
  const ext = gl.getExtension('WEBGL_debug_renderer_info')
  const gpuName = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)

gpuName contains: "Apple M1 GPU", "Adreno 640", "Mali-G77", etc.
Map to tier:
  'Apple M' → high
  'Adreno 7' → high
  'Adreno 6' → medium
  'Adreno 5' → low
  etc.
```

---

## Per-Feature Mobile Adjustments

### Pixel Ratio Cap

```
Desktop: Math.min(dpr, 2)        → Max 2.0
Mobile:  Math.min(dpr, 1.5)      → Max 1.5 on medium/low tier
         Math.min(dpr, 1)        → Force 1.0 on low tier
```

### Particle Count Reduction

| Feature         | Desktop    | Mobile High | Mobile Medium | Mobile Low   |
| --------------- | ---------- | ----------- | ------------- | ------------ |
| Route nodes     | `80`       | `80`        | `40`          | `0`          |
| Water foam      | `400`      | `200`       | `100`         | `0`          |
| Cloud particles | `40/cloud` | `20/cloud`  | `10/cloud`    | `0` (static) |

### Polygon Count Reduction

| Scene                 | Desktop | Mobile (all tiers) |
| --------------------- | ------- | ------------------ |
| Globe sphere segments | `64×64` | `32×32`            |
| Atmosphere segments   | `64×64` | `32×32`            |
| Water plane segments  | `64×64` | `32×32`            |
| Arc tube segments     | `32`    | `16`               |

Globe at `32×32` = 2,048 triangles vs 8,192 at 64×64 — 4× reduction.

### Post-Processing Reduction

| Tier     | Bloom | SMAA      | ToneMapping        |
| -------- | ----- | --------- | ------------------ |
| High     | ✓     | ✓         | ✓                  |
| Medium   | ✗     | FXAA only | ✓                  |
| Low      | ✗     | ✗         | ✓                  |
| Very Low | ✗     | ✗         | renderer.antialias |

### Shadow Map Reduction

| Tier     | Shadow Map Size | Shadows Enabled |
| -------- | --------------- | --------------- |
| High     | `2048×2048`     | Yes             |
| Medium   | `1024×1024`     | Yes             |
| Low      | `512×512`       | Yes             |
| Very Low | —               | No shadows      |

### Lighting Simplification

| Tier   | Fill Light | Hemisphere Light | Environment Map |
| ------ | ---------- | ---------------- | --------------- |
| High   | ✓          | ✓                | ✓               |
| Medium | ✓          | ✓                | ✗               |
| Low    | ✗          | ✗                | ✗               |

---

## Touch Scroll Support

### Strategy

Lenis is initialized with `smoothTouch: false`. This means:

- Touch devices use native momentum scrolling
- Native scroll events are forwarded to ScrollTrigger
- All scroll animations still work
- Pin sections work with native scroll

### No TouchEvent Override

Native touch scroll is NOT overridden. This ensures:

- Accessibility (no trapped scroll)
- iOS elastic bounce behavior preserved
- No scroll velocity calculation needed

---

## Mobile Canvas Layout

### Full-Width Canvases on Mobile

On narrow screens (<768px), all canvases remain full viewport:

```css
.canvas-container {
  width: 100vw;
  height: 100vh;
}
```

### 3D Model Reframing

On mobile, wide-scene models (crane, truck) may need camera FOV adjustment to prevent clipping:

```
Mobile camera FOV adjustment:
  If screenWidth < 768px:
    truck: fov = 80 (wider, shows full truck)
    crane: fov = 75 (wider, shows full crane)
```

---

## Mobile Scroll Distance Reduction

On mobile, pinned sections with excessive scroll distance create very long pages:

```
Desktop pin distances:
  Hero: 150vh, Crane: 350vh, Wipe: 180vh, Ship: 200vh, Aircraft: 120vh

Mobile reduction (medium/low tier):
  Hero: 100vh
  Crane: 200vh (shorter animation)
  Wipe: 120vh
  Ship: 150vh
  Aircraft: 80vh

Total: ~650vh mobile vs ~1,000vh desktop
```

UNKNOWN — Requires testing to confirm if shorter distances feel natural.

---

## Alternative Assets (Mobile)

### Earth Texture Downgrade

| Tier   | Resolution  |
| ------ | ----------- |
| High   | `2048×1024` |
| Medium | `1024×512`  |
| Low    | `512×256`   |

### Model Complexity

Current models are already at mobile-safe polygon counts. No alternative mobile-specific models needed.

---

## Static Fallback Content

For browsers without WebGL or very low-end devices:

### Fallback Detection

```
try {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (!gl) throw new Error('No WebGL')
} catch (e) {
  showStaticFallback()
}
```

### Fallback Content

| Section  | Fallback                                  |
| -------- | ----------------------------------------- |
| Globe    | Static PNG of globe from reference        |
| Crane    | Static PNG of crane in final position     |
| Truck    | Static PNG of truck                       |
| Ship     | Static PNG of ship aerial view            |
| Aircraft | Static PNG of aircraft in clouds          |
| All text | Visible with CSS animation only (fade-in) |

---

## Reduced Motion Mode

### Detection

```
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

### Behavior Changes

| Animation        | Normal            | Reduced Motion      |
| ---------------- | ----------------- | ------------------- |
| Globe rotation   | Continuous        | Stopped (static)    |
| H1 clip reveal   | `yPercent` slide  | `opacity` fade only |
| Word shuffle     | Character cycling | Instant reveal      |
| Camera pull-back | Scroll-driven     | Static              |
| Stats count-up   | Animated          | Instant final value |
| Load animations  | Staggered         | All instant         |
| Lenis            | `duration: 1.2`   | `duration: 0`       |

### Implementation

```
Lenis: if (reducedMotion) duration = 0
GSAP: if (reducedMotion) gsap.globalTimeline.timeScale(999)
       OR: skip animations, set final state immediately
```

---

## Mobile QA Checklist

```
iOS Safari 16+ (iPhone 13):
  ✓ Smooth scroll functions
  ✓ Pin sections work
  ✓ Globe renders at acceptable quality
  ✓ No canvas memory warnings
  ✓ Load time ≤ 8s on LTE

Chrome Android (Pixel 7):
  ✓ Smooth scroll functions
  ✓ 3D scenes render
  ✓ FPS ≥ 30

iPad Pro:
  ✓ Full desktop experience (high tier detected)
  ✓ 60fps maintained

Budget Android (low tier):
  ✓ Simplified mode activates
  ✓ Static fallbacks visible where 3D removed
  ✓ All text content readable
```
