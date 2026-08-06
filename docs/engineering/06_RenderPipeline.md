# 06 — Render Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Complete render pipeline — initialization, loading, frame updates, post-processing, and cleanup

---

## Pipeline Overview

```
[App Start]
    │
    ▼
[Phase 1: Initialization]
  ├── Lenis init
  ├── GSAP ticker sync
  ├── Preload all GLBs (parallel)
  ├── Load fonts
  └── Mount React tree
    │
    ▼
[Phase 2: Loading]
  ├── GLBs download (parallel, background)
  ├── Earth textures download
  ├── Fonts ready (document.fonts.ready)
  └── All sources → LoadingProvider resolves
    │
    ▼
[Phase 3: Ready State]
  ├── LoadingScreen fades out
  ├── Load animations fire (H1, globe canvas)
  └── ScrollTrigger.refresh() called
    │
    ▼
[Phase 4: Render Loop — Per Frame]
    │
    ├── [GSAP RAF Tick]
    │   ├── lenis.raf(time)           → Smooth scroll position update
    │   ├── ScrollTrigger.update()    → All ST onUpdate callbacks fire
    │   │   ├── Hero onUpdate → set camera.position.z ref
    │   │   ├── Crane onUpdate → mixer.setTime()
    │   │   ├── Ship onUpdate → set camera.position.y ref
    │   │   ├── Aircraft onUpdate → set camera.position.z ref
    │   │   └── Wipe onUpdate → set panel.style.width
    │   └── GSAP timeline updates → DOM animations
    │
    └── [R3F RAF Tick] (independent)
        ├── useFrame callbacks fire (per active canvas)
        │   ├── Globe: globe.rotation.y += 0.001
        │   ├── Globe: apply camera Z from ref
        │   ├── Ship: apply camera Y from ref
        │   ├── Ship: foam particle update
        │   ├── Aircraft: banking oscillation
        │   └── Aircraft: apply camera Z from ref
        └── Renderer renders scene → EffectComposer passes → screen
```

---

## Phase 1 — Initialization

### Execution Order

```
1. LenisProvider mounts → Lenis instance created
2. gsap.ticker.add((t) => lenis.raf(t × 1000))
3. gsap.ticker.lagSmoothing(0)
4. lenis.on('scroll', ScrollTrigger.update)
5. useGLTF.preload() calls fire (4 models, parallel)
6. React tree renders sections
7. Canvases mount with frameloop="demand"
8. ScrollTrigger instances created (all, in layout effect)
9. ScrollTrigger.refresh() called (once, after layout)
```

### Critical Sequence Rules

- Lenis MUST initialize before `ScrollTrigger.refresh()`
- `ScrollTrigger.refresh()` MUST call after DOM layout is stable
- GLB preloads fire at module level — before any React code runs
- `gsap.ticker.lagSmoothing(0)` MUST set before any animation plays

---

## Phase 2 — Loading

### Loading State Tracking

```
LoadingProvider tracks:
  ✓ document.fonts.ready Promise
  ✓ 4 × useGLTF.preload Promises
  ✓ Earth textures (TextureLoader Promises)

When ALL resolve:
  isLoaded = true → LoadingScreen fades out → load animations fire
```

### Loading Screen Duration

No arbitrary timeout. Loading screen exits ONLY when all assets are ready.  
Fallback: 10s maximum — if assets take longer, show partial experience.

---

## Phase 3 — Ready State

### On isLoaded = true

```
1. LoadingScreen: opacity 0→1 (fade out)
2. gsap.delayedCall(0.4, () => {
     startLoadTimeline()        ← H1 reveals, eyebrow, body, CTA
     globeCanvas.frameloop = "always"  ← Globe starts rendering
   })
3. ScrollTrigger.refresh()     ← Recalculate all pin positions
```

---

## Phase 4 — Per-Frame Render Loop

### GSAP Ticker Responsibilities

```
Fires ~60× per second via requestAnimationFrame

Responsibilities:
  1. lenis.raf(time × 1000)          → Advance smooth scroll
  2. ScrollTrigger automatic update   → Via lenis 'scroll' event
  3. Active GSAP tweens advance       → DOM animations
```

### R3F Render Responsibilities (Per Active Canvas)

```
Globe Canvas useFrame:
  1. globe.rotation.y += deltaTime × 0.001  (continuous rotation)
  2. camera.position.z = cameraZRef.current   (from GSAP ST progress)
  3. Update node color buffer (pulse animation)
  4. Renderer renders → Bloom pass → SMAA pass → screen

Crane Canvas useFrame:
  1. (no continuous animation — mixer driven by setTime())
  2. Renderer renders → SMAA pass → screen

Truck Canvas useFrame:
  1. (no continuous animation)
  2. Renderer renders → SMAA pass → screen

Ship Canvas useFrame:
  1. camera.position.y = cameraYRef.current   (from GSAP ST progress)
  2. Advance foam particle positions
  3. Update foam position buffer
  4. Renderer renders → Bloom pass → SMAA pass → screen

Aircraft Canvas useFrame:
  1. aircraft.rotation.z = sin(elapsed × 0.5) × 0.05  (banking)
  2. aircraft.position.y = sin(elapsed × 0.3) × 0.1   (altitude bob)
  3. camera.position.z = cameraZRef.current
  4. camera.position.y = cameraYRef.current
  5. Renderer renders → Bloom pass → SMAA pass → screen
```

### Ref-Based Camera Update Pattern

This pattern avoids GSAP directly touching Three.js camera objects (GSAP and R3F are in different execution contexts):

```
ST onUpdate: cameraRef.current = targetValue  (GSAP writes to ref)
useFrame:    camera.position.z = cameraRef.current  (R3F reads from ref)
```

This is the canonical pattern for GSAP ↔ R3F communication.

---

## Post-Processing Pipeline

### Globe Post-Processing Order

```
1. Main render → renderTarget (MSAA: false)
2. SelectiveBloomPass (threshold 0.85, strength 0.5, radius 0.6)
3. SMAAPass (medium preset)
4. ToneMapping pass (ACESFilmic, exposure 1.2)
5. Output → screen
```

### Ship Post-Processing Order

```
1. Main render → renderTarget
2. BloomPass (threshold 0.92, strength 0.2, radius 0.3)
3. SMAAPass
4. ToneMapping (ACESFilmic, exposure 1.1)
5. Output → screen
```

### Aircraft Post-Processing Order

```
1. Main render → renderTarget
2. BloomPass (threshold 0.88, strength 0.15, radius 0.3)
3. SMAAPass
4. ToneMapping (ACESFilmic, exposure 1.3)
5. Output → screen
```

---

## Cleanup Pipeline

### Scene Cleanup (on section unmount)

```
1. frameloop = "demand" (stop rendering immediately)
2. Cancel all useFrame subscriptions
3. Resource registry: dispose all geometries, materials, textures
4. EffectComposer: dispose() (if applicable)
5. AnimationMixer: stopAllAction(), uncacheRoot() (crane only)
6. GSAP context: ctx.revert() (kill all animations in this context)
7. ScrollTrigger: trigger.kill() (all ST instances in this scope)
```

### App Cleanup (on page unload)

```
1. lenis.destroy()
2. ScrollTrigger.killAll()
3. gsap.globalTimeline.clear()
```

---

## Render Performance Monitoring

### Development Only

```
Import: r3f-perf
Mount: <Perf position="top-left" />
Metrics: FPS, GPU time, CPU time, draw calls, triangles
Remove before production build
```

### Production Monitoring

```
Use: renderer.info
Check in useFrame (every 100 frames):
  renderer.info.render.calls    ← Should be ≤ 10 per canvas
  renderer.info.render.triangles ← Per performance budget
  renderer.info.memory.textures ← Watch for texture leaks
```
