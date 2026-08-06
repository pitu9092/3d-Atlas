# 15 — Implementation Sequence

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Exact build order — what to build, in what order, and why each phase depends on the previous

---

## Sequence Overview

```
Phase 01: Project Setup
    ↓
Phase 02: Design Tokens + Global CSS
    ↓
Phase 03: Scroll Engine (Lenis + ScrollTrigger)
    ↓
Phase 04: Three.js Engine + Canvas Architecture
    ↓
Phase 05: Asset Pipeline + Loaders
    ↓
Phase 06: Globe Hero Scene (Priority 0)
    ↓
Phase 07: Reach Stacker Crane Scene (Priority 0)
    ↓
Phase 08: Container Ship Scene (Priority 0)
    ↓
Phase 09: DOM Sections (Editorial + Services + Wipe + Testimonials)
    ↓
Phase 10: Semi-Truck Scene (Priority 1)
    ↓
Phase 11: Aircraft Scene (Priority 1)
    ↓
Phase 12: Transitions (All 9)
    ↓
Phase 13: Text Animations (All patterns)
    ↓
Phase 14: Post-Processing
    ↓
Phase 15: Performance Optimization
    ↓
Phase 16: QA + Cross-Browser Testing
    ↓
Phase 17: Final Polish
    ↓
Phase 18: Production Build + Deploy
```

---

## PHASE 01 — Project Setup

**Duration**: 0.5 days  
**Owner**: Lead Engineer

### Tasks

```
1. Initialize Next.js project
   - Create: next.config.js (with canvas headers if needed)
   - Enable: App Router

2. Install core dependencies:
   - gsap + gsap/ScrollTrigger
   - @studio-freight/lenis (or @lenis/react)
   - three
   - @react-three/fiber
   - @react-three/drei
   - @react-three/postprocessing

3. Install dev dependencies:
   - TypeScript
   - ESLint + Prettier

4. Configure paths:
   - tsconfig.json path aliases
   - Create /src directory structure

5. Create directory structure:
   /src
     /app          ← Next.js App Router
     /components
       /scenes     ← 3D scenes
       /sections   ← DOM sections
       /ui         ← Shared UI components
     /hooks        ← Custom hooks (useLenis, useScrollTrigger)
     /lib          ← Utilities (math helpers, animation helpers)
     /shaders      ← GLSL shader files
     /styles       ← Global CSS
     /types        ← TypeScript types
   /public
     /models       ← GLB files
     /textures     ← Earth textures, normal maps
```

### Why Before Everything

Project structure and toolchain must be stable before any components exist. Changing from CRA to Next.js mid-project is catastrophic.

---

## PHASE 02 — Design Tokens + Global CSS

**Duration**: 0.5 days  
**Depends on**: Phase 01  
**Owner**: Lead Frontend Engineer

### Tasks

```
1. Create /src/styles/globals.css:
   - CSS custom properties (design tokens):
     --color-bg-dark: #080808
     --color-bg-off-white: #F5F4F0
     --color-bg-white: #FFFFFF
     --color-bg-near-black: #111111
     --color-bg-ocean: #133D77
     --color-text-primary: #111111
     --color-text-white: #FFFFFF
     --color-text-muted: rgba(255,255,255,0.65)
     --color-accent-blue: #1a7fff
     --color-accent-orange: #ff6020

     --font-headline: [brand font], system-ui
     --font-body: [brand font], system-ui

     --space-xs: 8px
     --space-sm: 16px
     --space-md: 32px
     --space-lg: 64px
     --space-xl: 120px
     --space-xxl: 200px

2. Create global reset + base styles
3. Configure @font-face for brand fonts
4. Create base component styles (buttons, typography scale)
5. Create cursor ring CSS
```

### Why Before Components

Design tokens must exist before any component references a color or spacing value. Doing this first prevents scattered hardcoded values.

---

## PHASE 03 — Scroll Engine

**Duration**: 0.5 days  
**Depends on**: Phase 01  
**Owner**: Lead Engineer

### Tasks

```
1. Create /src/lib/scroll.ts:
   - Lenis initialization with config
   - RAF integration with GSAP ticker
   - ScrollTrigger sync
   - Export: lenis instance, scrollTo utility

2. Create /src/hooks/useLenis.ts:
   - Returns lenis instance from React context

3. Create LenisProvider component:
   - Wraps app in context
   - Handles cleanup

4. Test: Verify ScrollTrigger markers appear at correct scroll positions
5. Test: Verify Lenis smoothing feel
6. Test: Verify lenis.scrollTo() works
```

### Why Before Three.js

ScrollTrigger pins create padding in the DOM — this affects page height calculations. Lenis must be initialized before Three.js canvases are mounted (canvas height affects page layout).

---

## PHASE 04 — Three.js Engine + Canvas Architecture

**Duration**: 1 day  
**Depends on**: Phase 03  
**Owner**: 3D Engineer

### Tasks

```
1. Create base canvas component /src/components/scenes/BaseCanvas.tsx:
   - R3F <Canvas> with shared renderer config
   - Performance monitoring (r3f-perf in dev)
   - Resize handling
   - frameloop management prop

2. Create canvas visibility hook:
   - IntersectionObserver on canvas container
   - Toggle frameloop: "always" | "demand"
   - Pauses rendering when off-screen

3. Test: Verify transparent background canvas shows DOM behind it
4. Test: Verify canvas pauses when off-screen
5. Test: Verify pixel ratio capping at 2.0
```

### Why Before Scenes

All 5 scenes share the same canvas architecture. Building the base canvas first ensures consistency.

---

## PHASE 05 — Asset Pipeline

**Duration**: 1 day  
**Depends on**: Phase 04  
**Owner**: 3D Artist + Engineer

### Tasks

```
1. Obtain/create 3D models:
   - crane.glb  ← Source or create with embedded animation clips
   - truck.glb  ← Source or create
   - ship.glb   ← Source or create (needs individual container meshes)
   - aircraft.glb ← Source or create

2. Process models:
   - Apply Draco compression: npx gltf-pipeline -i model.glb -o model-draco.glb --draco.compressionLevel=10
   - Verify model scales (1 unit = ~1 meter)
   - Verify material names (for runtime access)

3. Obtain/create textures:
   - earth-albedo.jpg (4K recommended, 2K minimum)
   - earth-normal.jpg
   - earth-specular.jpg
   - water-normal.jpg

4. Configure Next.js for model serving:
   - Place GLBs in /public/models/
   - Verify paths resolve correctly in production

5. Add preload calls for all models
6. Test: All models load via useGLTF without errors
```

### Why Before Scene Development

No scene can be built without the assets it requires. Missing models = blocked scene development.

---

## PHASE 06 — Globe Hero Scene

**Duration**: 3–4 days  
**Depends on**: Phase 04, Phase 05 (textures)  
**Owner**: 3D Engineer + Shader Engineer

### Tasks

```
Day 1:
  1. Build SH-01 (Earth surface shader)
  2. Globe sphere with shader material
  3. Directional light (sun) setup
  4. Verify terminator line

Day 2:
  1. Build SH-02 (Atmosphere Fresnel shader)
  2. Build SH-03 (Thermal glow)
  3. Verify atmosphere rim appearance

Day 3:
  1. Route network node positions
  2. PS-01 (Points geometry + pulsing)
  3. PS-02 (Arc geometries)
  4. Red location pin

Day 4:
  1. ScrollTrigger camera Z pull-back
  2. Load animations (H1 clip reveal, eyebrow, body, buttons)
  3. Atmosphere gradient transition
  4. Post-processing (Bloom + SMAA)
```

### Why This Early

The globe is the first thing users see. It must be perfect before other scenes are touched. Also, the globe's shader work is the most technically demanding — early discovery of issues is critical.

---

## PHASE 07 — Reach Stacker Crane Scene

**Duration**: 2–3 days  
**Depends on**: Phase 04, Phase 05 (crane.glb)  
**Owner**: 3D Engineer

### Tasks

```
Day 1:
  1. Crane canvas setup (alpha: true)
  2. Studio lighting rig
  3. Load crane GLB
  4. Verify model displays correctly

Day 2:
  1. ScrollTrigger pin setup (450vh wrapper)
  2. AnimationMixer → scroll scrub connection
  3. Verify all 4 animation phases visible
  4. Camera positioning

Day 3:
  1. Test full animation from 0→100% scroll
  2. Verify crane→truck visual narrative
  3. SMAA + ToneMapping
```

### Why Second

The crane animation is the most unique element. If GLB animation clips don't work as expected, alternative custom implementation requires maximum time to redesign.

---

## PHASE 08 — Container Ship Scene

**Duration**: 2–3 days  
**Depends on**: Phase 04, Phase 05 (ship.glb)  
**Owner**: 3D Engineer

### Tasks

```
Day 1:
  1. Ship canvas setup (opaque, ocean blue bg)
  2. Maritime lighting rig
  3. Load ship GLB
  4. Aerial camera setup (rotation.x = -PI/2)

Day 2:
  1. ScrollTrigger pin (300vh wrapper)
  2. Camera Y phase animation (zoom in/hold/zoom out)
  3. Water/ocean plane
  4. Foam particles (PS-03)

Day 3:
  1. Text overlay DOM element + scroll trigger
  2. Feature labels DOM elements + scroll trigger
  3. Subtle bloom (foam)
  4. Full integration test
```

---

## PHASE 09 — DOM Sections

**Duration**: 2 days  
**Depends on**: Phase 02, Phase 03  
**Owner**: Frontend Engineer

### Tasks

```
Day 1:
  1. Editorial section (layout + H2 + stats)
  2. H2 clip-path reveal (ScrollTrigger)
  3. Stat count-up (ScrollTrigger)
  4. Aerial photo reveal

Day 2:
  1. Services grid (5 columns, dark bg)
  2. Word shuffle implementation
  3. Wipe panel (CSS + GSAP scrub)
  4. Testimonials (layout + H2 + client cards)
  5. Navbar theme switching
  6. Custom cursor
```

---

## PHASE 10 — Semi-Truck Scene

**Duration**: 1 day  
**Depends on**: Phase 04, Phase 05 (truck.glb)  
**Owner**: 3D Engineer

### Tasks

```
1. Truck canvas setup
2. Lighting rig (same as crane + rim light)
3. Load truck GLB
4. Entry slide animation
5. Truck→Services split transition
6. Canvas lifecycle management
```

---

## PHASE 11 — Aircraft Scene

**Duration**: 2 days  
**Depends on**: Phase 04, Phase 05 (aircraft.glb)  
**Owner**: 3D Engineer

### Tasks

```
Day 1:
  1. Aircraft canvas setup
  2. Sky component (Drei)
  3. Cloud components (Drei, multiple)
  4. Solar + sky ambient lighting
  5. Load aircraft GLB

Day 2:
  1. Camera Z zoom ScrollTrigger
  2. Aircraft banking (useFrame)
  3. Aircraft→Testimonials overlap z-index
  4. Subtle bloom
```

---

## PHASE 12 — Transitions

**Duration**: 1 day  
**Depends on**: All scene phases  
**Owner**: Frontend Engineer + 3D Engineer

### Tasks

```
1. TR-01: Atmosphere gradient (hero exit)
2. TR-03: White-on-white crane entry
3. TR-04: Crane→Truck match-cut validation
4. TR-05: Dark services rise (verify split timing)
5. TR-06: Wipe panel grow timing
6. TR-07: Ship blue flood reveal
7. TR-08: Ship→Aircraft color continuity
8. TR-09: Aircraft→Testimonials z-index
9. Test ALL 9 transitions in sequence
```

---

## PHASE 13 — Text Animations

**Duration**: 0.5 days  
**Depends on**: Phase 09  
**Owner**: Frontend Engineer

### Tasks

```
1. Verify H1 clip-path reveal (timing, font loaded)
2. Verify H2 clip-path reveals (editorial, testimonials)
3. Verify all 3 stat count-ups
4. Verify word shuffle (services, wipe)
5. Verify ship text overlay
6. Verify feature labels stagger
7. Verify navbar theme switching
8. Custom cursor ring behavior
```

---

## PHASE 14 — Post-Processing

**Duration**: 0.5 days  
**Depends on**: All scene phases  
**Owner**: 3D Engineer

### Tasks

```
1. Globe EffectComposer (SelectiveBloom + SMAA)
2. Ship EffectComposer (subtle Bloom + SMAA)
3. Aircraft EffectComposer (subtle Bloom + SMAA)
4. Crane + Truck (SMAA only)
5. Verify tone mapping exposure per scene
6. Performance check — all canvases under budget
```

---

## PHASE 15 — Performance Optimization

**Duration**: 1 day  
**Depends on**: Phase 14  
**Owner**: Lead Engineer

### Tasks

```
1. Run Lighthouse performance audit
2. Check GPU frame time per canvas (target: ≤4ms each)
3. Verify 60fps on mid-range hardware (GTX 1060 equivalent)
4. Optimize texture compression (convert to KTX2 if needed)
5. Enable GLB Draco compression for all models
6. Implement lazy canvas activation (frameloop: "demand")
7. Reduce polygon count if needed
8. Implement reduced-motion fallbacks
9. Mobile-specific canvas resolution reduction
```

---

## PHASE 16 — QA + Cross-Browser Testing

**Duration**: 1 day

### Test Matrix

| Browser    | Version | Globe | Crane | Truck | Ship | Aircraft |
| ---------- | ------- | ----- | ----- | ----- | ---- | -------- |
| Chrome     | Latest  | ✓     | ✓     | ✓     | ✓    | ✓        |
| Safari     | 16+     | ✓     | ✓     | ✓     | ✓    | ✓        |
| Firefox    | Latest  | ✓     | ✓     | ✓     | ✓    | ✓        |
| Edge       | Latest  | ✓     | ✓     | ✓     | ✓    | ✓        |
| iOS Safari | 16+     | Test  | Test  | Test  | Test | Test     |

---

## PHASE 17 — Final Polish

**Duration**: 1 day

### Tasks

```
1. Compare against reference video at every keyframe
2. Adjust camera positions if framing is off
3. Tune easing curves
4. Verify scroll distances feel correct
5. Typography fine-tuning (tracking, line-height)
6. Color calibration (monitor profiles vary)
7. Animation timing fine-tuning
```

---

## PHASE 18 — Production Build + Deploy

**Duration**: 0.5 days

### Tasks

```
1. npm run build — verify zero errors
2. Verify all static assets in /public served correctly
3. Configure CDN headers (cache-control for models/textures)
4. Deploy to Vercel or target host
5. Run Lighthouse on production URL
6. Final stakeholder review
```

---

## Implementation Timeline Summary

| Phase              | Duration | Cumulative |
| ------------------ | -------- | ---------- |
| 01 Setup           | 0.5d     | 0.5d       |
| 02 Design Tokens   | 0.5d     | 1d         |
| 03 Scroll Engine   | 0.5d     | 1.5d       |
| 04 Three.js Engine | 1d       | 2.5d       |
| 05 Assets          | 1d       | 3.5d       |
| 06 Globe           | 4d       | 7.5d       |
| 07 Crane           | 3d       | 10.5d      |
| 08 Ship            | 3d       | 13.5d      |
| 09 DOM Sections    | 2d       | 15.5d      |
| 10 Truck           | 1d       | 16.5d      |
| 11 Aircraft        | 2d       | 18.5d      |
| 12 Transitions     | 1d       | 19.5d      |
| 13 Text Animations | 0.5d     | 20d        |
| 14 Post-Processing | 0.5d     | 20.5d      |
| 15 Performance     | 1d       | 21.5d      |
| 16 QA              | 1d       | 22.5d      |
| 17 Polish          | 1d       | 23.5d      |
| 18 Deploy          | 0.5d     | 24d        |

**Total estimated build time: ~24 engineering days (one engineer)**  
With 2 engineers working in parallel (3D + Frontend): **~14–16 days**

---

## Validation Checklist

### Scene Coverage

- ✓ Every analyzed scene has a blueprint (02_SceneBlueprints.md)
- ✓ Globe Hero: Camera, lighting, shaders, DOM, and load animations specified
- ✓ Crane: GLB animation, scroll scrub, static camera specified
- ✓ Truck: Entry animation, rim light, canvas lifecycle specified
- ✓ Ship: Aerial camera, 3-phase zoom, text overlay, feature labels specified
- ✓ Aircraft: Zoom camera, banking, sky, clouds specified
- ✓ All DOM sections (Editorial, Services, Wipe, Testimonials) specified

### Animation Coverage

- ✓ Every GSAP timeline documented (03_GSAPBlueprint.md)
- ✓ Every ScrollTrigger instance specified (04_ScrollTriggerBlueprint.md)
- ✓ Lenis configuration and RAF strategy documented (05_LenisBlueprint.md)
- ✓ All text animation patterns specified (09_TextBlueprint.md)
- ✓ All 9 transitions documented (10_TransitionBlueprint.md)

### Camera Coverage

- ✓ All 5 cameras specified with exact positions (06_CameraBlueprint.md)
- ✓ Globe camera scroll formula documented
- ✓ Ship aerial camera phase curves documented
- ✓ Aircraft zoom formula documented
- ✓ Crane + Truck static cameras confirmed

### Shader Coverage

- ✓ All 8 shaders inventoried (12_ShaderBlueprint.md)
- ✓ Earth surface shader: inputs, logic, fallback specified
- ✓ Fresnel atmosphere shader: complete spec
- ✓ Ocean water shader: complete spec
- ✓ Sky shader: Drei parameters specified

### Three.js Coverage

- ✓ Renderer settings per canvas (07_ThreeBlueprint.md)
- ✓ Scene hierarchy trees for all 5 scenes
- ✓ Model loading strategy (Draco + preload)
- ✓ Canvas lifecycle management
- ✓ Performance optimizations

### Lighting Coverage

- ✓ Every scene's full lighting rig (11_LightingBlueprint.md)
- ✓ All ambient, directional, hemisphere, and rim lights specified
- ✓ Tone mapping and exposure per scene
- ✓ Post-processing per scene (13_PostProcessingBlueprint.md)

### Particle Coverage

- ✓ All 4 particle systems specified (14_ParticleBlueprint.md)
- ✓ Route nodes: count, animation, CPU budget
- ✓ Water foam: spawn, lifetime, motion, performance
- ✓ Clouds: Drei component parameters

### Dependency Coverage

- ✓ Full dependency tree in Master Timeline
- ✓ Lenis → ScrollTrigger dependency documented
- ✓ Font loading → text animation dependency documented
- ✓ Model loading → scene activation dependency documented
- ✓ Phase-by-phase build dependencies in this document

---

**Phase 3C — COMPLETE. Waiting for Phase 3D.**
