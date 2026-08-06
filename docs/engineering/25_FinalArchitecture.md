# 25 — Final Architecture

**Project**: 3D Atlas  
**Document Type**: Master Engineering Specification  
**Version**: 1.0  
**Status**: COMPLETE — Awaiting Phase 4 (Implementation)

---

## What This Document Is

This is the definitive synthesis of all 24 preceding engineering documents. It serves as the single-source-of-truth specification that any engineer can use to build 3D Atlas from scratch without referencing any other document.

All architectural decisions made in documents 01–24 are distilled here.

---

## 1. Project Summary

3D Atlas is a cinematic, scroll-driven marketing website for a global logistics company. The experience is defined by:

- **5 distinct 3D scenes** embedded in DOM sections
- **Smooth scroll** driving all camera and object animations
- **10 scrollable sections** totalling ~2,060vh of scroll space
- **5 pinned sections** for immersive 3D viewing
- **Zero user control** over cameras — all motion is pre-choreographed

**Stack**: Next.js (App Router) · React 18 · Three.js via R3F · GSAP + ScrollTrigger · Lenis · TypeScript

---

## 2. System Architecture (Summary)

### Layers

```
Layer 1: React DOM        → Structure, text, accessibility, layout
Layer 2: WebGL Canvas     → 5 isolated Three.js scenes
Layer 3: Animation        → GSAP timelines + ScrollTrigger
Layer 4: Scroll Engine    → Lenis + GSAP ticker (single RAF loop)
Layer 5: Asset Pipeline   → GLB preload, textures, fonts
Layer 6: Utilities        → Math, format, device detection
```

### Non-Negotiable Architectural Rules

| Rule                                      | Reason                                           |
| ----------------------------------------- | ------------------------------------------------ |
| One Lenis instance (singleton)            | Conflicting smooth scroll engines                |
| One GSAP ticker (shared RAF)              | Prevent double-frame callbacks                   |
| 5 isolated WebGL contexts                 | Context limit, isolation, cleanup                |
| All disposables explicitly freed          | Three.js does NOT garbage collect GPU resources  |
| Cameras updated via refs, not React state | 60fps updates must bypass React render cycle     |
| Fonts loaded before animations start      | Clip-path reveals depend on correct font metrics |
| Models preloaded at module level          | No loading hitches during scroll                 |

---

## 3. Directory Structure

```
src/
  app/                    Next.js App Router (layout.tsx, page.tsx)
  components/
    scenes/               5 WebGL canvas components
    sections/             10 DOM section components
    ui/                   Shared UI (Navbar, Cursor, Button, StatCounter, WordShuffle)
    layout/               PageWrapper, SectionWrapper
  hooks/                  useLenis, useScrollProgress, useCanvasVisibility, useGSAPContext, useDeviceCapability
  lib/
    scroll/               Lenis init, ScrollTrigger setup
    animation/            GSAP helpers
    math/                 lerp, clamp, easing, latLonToVec3
    format/               Number formatters
    device/               GPU tier detection
    constants/            Lights, cameras, colors, durations
  providers/              LenisProvider, LoadingProvider, ThemeProvider
  shaders/
    earth/                vertex.glsl, fragment.glsl
    atmosphere/           vertex.glsl, fragment.glsl
    thermal/              fragment.glsl
    water/                vertex.glsl, fragment.glsl
    common/               noise.glsl (shared)
  styles/                 globals.css, typography.css
  types/                  TypeScript definitions

public/
  models/                 crane.glb, truck.glb, ship.glb, aircraft.glb (Draco)
  textures/               earth-albedo.jpg, earth-normal.jpg, water-normal.jpg
  draco/                  Draco decoder (WASM + JS)
  fonts/                  Brand typeface (.woff2)
```

---

## 4. Scene Specifications

| Scene      | Canvas      | Background     | Scroll Distance | Camera                       |
| ---------- | ----------- | -------------- | --------------- | ---------------------------- |
| Globe Hero | Transparent | —              | 150vh           | PerspectiveCamera Z: 3.5→7.0 |
| Crane      | Transparent | —              | 350vh           | Static [3, 2.5, 8]           |
| Truck      | Transparent | —              | Entry only      | Static [0, 0.3, 8]           |
| Ship       | Opaque      | `#133D77`      | 200vh           | Aerial Y: 20→10→20           |
| Aircraft   | Opaque      | Procedural sky | 120vh           | Z: 30→5, Y: 5→3              |

---

## 5. Animation System

### Load Timeline (page entry)

```
Globe canvas: opacity 0→1 (t=0)
Eyebrow: opacity 0→1, y 8→0 (t=0.3)
H1 line 1: yPercent 100→0 (t=0.4)
H1 line 2: yPercent 100→0 (t=0.52)
H1 line 3: yPercent 100→0 (t=0.64)
Body copy: opacity 0→1, y 16→0 (t=0.75)
CTA buttons: opacity 0→1, y 12→0 (t=0.9, 1.0)
```

### ScrollTrigger Instances (14)

| ID                   | Type           | Effect                     |
| -------------------- | -------------- | -------------------------- |
| `hero-cam`           | scrub 0.5      | Globe camera Z             |
| `atmosphere-bg`      | scrub 1        | Background gradient        |
| `editorial-h2`       | one-shot       | H2 clip reveal             |
| `editorial-stats`    | once           | 3 count-up animations      |
| `crane-pin`          | scrub 1, pin   | mixer.setTime()            |
| `truck-enter`        | one-shot       | Canvas activate + slide-in |
| `services-reveal`    | one-shot       | Word shuffle               |
| `wipe-pin`           | scrub 1, pin   | Panel width 0→50vw         |
| `ship-pin`           | scrub 0.5, pin | Camera Y 3-phase           |
| `aircraft-pin`       | scrub 0.5, pin | Camera Z 30→5              |
| `testimonials-h2`    | one-shot       | H2 clip reveal             |
| `testimonials-cards` | one-shot       | Card stagger               |

---

## 6. Scroll Engine

### Lenis Configuration

```
duration: 1.2, easing: quartOut
smoothWheel: true, smoothTouch: false
wheelMultiplier: 1.0
```

### RAF Integration

```
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)
```

### Total Page Height: ~2,060vh

(Hero 250 + Atmosphere 60 + Editorial 100 + Crane 450 + Truck 100 + Services 100 + Wipe 280 + Ship 300 + Aircraft 220 + Testimonials 200)

---

## 7. Three.js Engine

### Renderer (Per Canvas)

```
alpha: true (Globe/Crane/Truck) | false (Ship/Aircraft)
antialias: true
powerPreference: "high-performance"
toneMapping: ACESFilmicToneMapping
toneMappingExposure: 1.0–1.3 (varies)
outputColorSpace: SRGBColorSpace
pixelRatio: Math.min(dpr, 2.0)
```

### Camera Update Pattern (Critical)

```
ST onUpdate → writes to ref
useFrame → reads ref → applies to camera.position
```

Never animate camera directly from GSAP — always use refs.

### Canvas Lifecycle

```
frameloop="demand" (inactive) → "always" (active)
Controlled by: IntersectionObserver on canvas container
```

---

## 8. Shader System

| Shader             | Type           | Scene    | Priority |
| ------------------ | -------------- | -------- | -------- |
| Earth Surface      | ShaderMaterial | Globe    | Critical |
| Atmosphere Fresnel | ShaderMaterial | Globe    | Critical |
| Thermal Glow       | Additive mesh  | Globe    | High     |
| Ocean Water        | ShaderMaterial | Ship     | High     |
| Procedural Sky     | Drei `<Sky>`   | Aircraft | High     |

### Uniform Update Rule

```
WRONG: uniform.value = new THREE.Vector3(x, y, z)  ← allocation every frame
CORRECT: uniform.value.set(x, y, z)                ← mutate existing
```

---

## 9. Lighting Summary

| Scene    | Ambient          | Key Dir.         | Fill/Rim | Special          |
| -------- | ---------------- | ---------------- | -------- | ---------------- |
| Globe    | `#04040a @ 0.05` | Sun `2.0`        | —        | Fresnel, Thermal |
| Crane    | `#fff @ 0.8`     | `2.0 + 0.6 fill` | Hemi     | Env map          |
| Truck    | `#fff @ 1.0`     | `2.0 + 1.0 rim`  | —        | Env map          |
| Ship     | `#133D77 @ 0.7`  | Aerial `1.8`     | —        | —                |
| Aircraft | `#80b8d8 @ 0.8`  | Solar `3.0`      | —        | Sky              |

---

## 10. Post-Processing

| Canvas   | Bloom                    | AA   | ToneMapping    |
| -------- | ------------------------ | ---- | -------------- |
| Globe    | SelectiveBloom (layer 1) | SMAA | ACESFilmic 1.2 |
| Crane    | —                        | SMAA | ACESFilmic 1.0 |
| Truck    | —                        | SMAA | ACESFilmic 1.0 |
| Ship     | Subtle 0.2               | SMAA | ACESFilmic 1.1 |
| Aircraft | Subtle 0.15              | SMAA | ACESFilmic 1.3 |

---

## 11. Performance Budgets

| Metric                | Budget                      |
| --------------------- | --------------------------- |
| Target FPS            | 60fps desktop, 30fps mobile |
| Frame budget          | 16.7ms total                |
| GPU per canvas        | ≤ 4ms                       |
| Triangles (max scene) | ≤ 100,000                   |
| Draw calls per canvas | ≤ 15                        |
| GPU texture memory    | ≤ 128MB total               |
| JS heap               | ≤ 50MB                      |
| GLB size per model    | ≤ 2MB (Draco)               |

---

## 12. Memory Management

### Disposal on Unmount

```
1. frameloop = "demand"
2. ctx.revert() (GSAP cleanup)
3. trigger.kill() (ScrollTrigger)
4. geometry.dispose() (all custom geometries)
5. material.dispose() (unique materials only)
6. texture.dispose() (own textures only, NOT GLB cache)
7. effectComposer.dispose()
8. mixer.uncacheRoot() (crane only)
```

---

## 13. Mobile Strategy

| Tier   | Pixel Ratio     | Globe Segments | Bloom    | Foam Particles |
| ------ | --------------- | -------------- | -------- | -------------- |
| High   | `min(dpr, 2)`   | `64×64`        | Full     | `400`          |
| Medium | `min(dpr, 1.5)` | `32×32`        | Disabled | `100`          |
| Low    | `1.0`           | `32×32`        | Disabled | `0`            |

---

## 14. State Architecture

| State           | Storage          | Owner             |
| --------------- | ---------------- | ----------------- |
| Loading         | React Context    | `LoadingProvider` |
| Lenis instance  | React Context    | `LenisProvider`   |
| Nav theme       | React Context    | `ThemeProvider`   |
| Camera position | `useRef<number>` | Per scene         |
| Scroll progress | `useRef<number>` | Per section ST    |
| 3D scene graph  | Three.js         | R3F canvas        |
| GSAP animations | GSAP internals   | GSAP              |

**Rule**: Never store Three.js values in React `useState`. Never trigger React re-renders from animation loops.

---

## 15. Event System Summary

| Event              | Handler                                     | Cleanup               |
| ------------------ | ------------------------------------------- | --------------------- |
| `resize`           | Debounced 200ms → `ScrollTrigger.refresh()` | `removeEventListener` |
| `scroll`           | Lenis internal → `ScrollTrigger.update`     | `lenis.destroy()`     |
| `mousemove`        | GSAP cursor ring                            | `removeEventListener` |
| `visibilitychange` | `lenis.stop/start`                          | `removeEventListener` |
| `webglcontextlost` | Prevent default                             | Per canvas            |

---

## 16. Testing Coverage

| Type              | Tool                 | Frequency  |
| ----------------- | -------------------- | ---------- |
| Unit tests        | Vitest               | Every PR   |
| Lighthouse CI     | lhci                 | Every PR   |
| Visual regression | Playwright snapshots | On merge   |
| Cross-browser     | Manual               | On release |
| Performance FPS   | Manual + r3f-perf    | On release |
| Accessibility     | axe + VoiceOver      | On release |

---

## 17. Deployment

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Platform    | Vercel                                        |
| Build       | `next build` (SSR + static assets)            |
| 3D scenes   | `ssr: false` (dynamic imports)                |
| Asset cache | `immutable, 1 year` (models, textures, fonts) |
| HTML        | `no-cache`                                    |
| Code split  | Automatic (Next.js) + scene dynamic imports   |

---

## 18. Accessibility Commitments

| Requirement    | Implementation                                |
| -------------- | --------------------------------------------- |
| WCAG 2.1 AA    | Semantic HTML, color contrast ≥ 4.5:1         |
| Reduced motion | Zero-duration animations, no GSAP transitions |
| Keyboard nav   | Tab order, skip link, visible focus styles    |
| Screen reader  | `aria-hidden` on canvases, `sr-only` text     |
| Color contrast | All text pairs verified                       |

---

## 19. Implementation Sequence

```
Phase 01: Project setup + dependencies
Phase 02: Design tokens + global CSS
Phase 03: Scroll engine (Lenis + ScrollTrigger)
Phase 04: BaseCanvas architecture
Phase 05: Asset pipeline (models + textures + fonts)
Phase 06: Globe Hero (shaders + particles + scroll)
Phase 07: Crane scene (GLB + animation mixer + scroll)
Phase 08: Ship scene (aerial camera + water + particles)
Phase 09: DOM sections (editorial, services, wipe, testimonials)
Phase 10: Truck scene
Phase 11: Aircraft scene
Phase 12: All 9 transitions
Phase 13: Text animation system
Phase 14: Post-processing
Phase 15: Performance optimization
Phase 16: QA + cross-browser testing
Phase 17: Final polish
Phase 18: Production build + deploy
```

**Total engineering days**: ~24 days (solo) · ~14–16 days (2 engineers parallel)

---

## 20. Validation Checklist

### Architecture Completeness

- ✓ Every system has documented ownership
- ✓ Every dependency is documented
- ✓ Every render path is documented (06_RenderPipeline)
- ✓ Every animation system is documented (07_GSAPArchitecture, 08_ScrollEngine)
- ✓ Every cleanup strategy exists (20_MemoryManagement)
- ✓ Performance constraints are defined (18_PerformanceBudget)
- ✓ Mobile strategy exists (21_MobileStrategy)
- ✓ Accessibility strategy exists (22_AccessibilityStrategy)
- ✓ Deployment strategy exists (24_DeploymentStrategy)
- ✓ Testing strategy exists (23_TestingStrategy)

### Scene Coverage

- ✓ Globe Hero — complete specification
- ✓ Reach Stacker Crane — complete specification
- ✓ Semi-Truck — complete specification
- ✓ Container Ship — complete specification
- ✓ Commercial Aircraft — complete specification

### Animation Coverage

- ✓ Page load timeline
- ✓ 14 ScrollTrigger instances
- ✓ All text animation patterns
- ✓ All 9 scene transitions

### System Coverage

- ✓ Three.js engine (05)
- ✓ Render pipeline (06)
- ✓ GSAP architecture (07)
- ✓ Scroll engine (08)
- ✓ State management (09)
- ✓ Asset pipeline (10)
- ✓ Model pipeline (11)
- ✓ Texture pipeline (12)
- ✓ Shader pipeline (13)
- ✓ Post-processing (14)
- ✓ Lighting (15)
- ✓ Camera system (16)
- ✓ Event system (17)
- ✓ Performance budget (18)
- ✓ GPU optimization (19)
- ✓ Memory management (20)

---

**Phase 3D — ENGINEERING ARCHITECTURE — COMPLETE.**

**Waiting for Phase 4.**
