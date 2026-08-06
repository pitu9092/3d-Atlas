# 07 — GSAP Architecture

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: GSAP timeline hierarchy, ownership, registration, cleanup, and refresh strategy

---

## GSAP Architecture Principles

| Principle                       | Rule                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| **Single ticker**               | One `gsap.ticker` drives both Lenis and all GSAP animations     |
| **Scoped contexts**             | Every component that creates animations uses `gsap.context()`   |
| **Ownership**                   | Each section component owns its own timelines                   |
| **No global timeline mutation** | Never add to `gsap.globalTimeline` directly                     |
| **Cleanup mandatory**           | Every `useLayoutEffect` that creates animations returns cleanup |

---

## Timeline Hierarchy

```
[GSAP SYSTEM]
├── [LoadTimeline]           ← Owned by HeroSection
│   ├── Canvas fade-in
│   ├── Eyebrow reveal
│   ├── H1 line 1 reveal
│   ├── H1 line 2 reveal
│   ├── H1 line 3 reveal
│   ├── Body copy fade
│   ├── Button 1 fade
│   └── Button 2 fade
│
├── [ScrollTimelines]        ← One per ScrollTrigger instance
│   ├── hero-cam             ← Owned by HeroSection
│   ├── atmosphere-bg        ← Owned by AtmosphereSection
│   ├── editorial-h2         ← Owned by EditorialSection
│   ├── editorial-stats      ← Owned by EditorialSection
│   ├── crane-pin            ← Owned by CraneSection
│   ├── truck-enter          ← Owned by TruckSection
│   ├── services-reveal      ← Owned by ServicesSection
│   ├── wipe-pin             ← Owned by WipeSection
│   ├── ship-pin             ← Owned by ShipSection
│   ├── aircraft-pin         ← Owned by AircraftSection
│   ├── testimonials-h2      ← Owned by TestimonialsSection
│   └── testimonials-cards   ← Owned by TestimonialsSection
│
└── [ContinuousAnimations]   ← useFrame (not GSAP)
    ├── Globe Y rotation
    └── Aircraft banking
```

---

## Timeline Ownership

| Timeline             | Owner Component            | Effect                        |
| -------------------- | -------------------------- | ----------------------------- |
| `loadTimeline`       | `HeroSection`              | Page entry animations         |
| `hero-cam`           | `HeroSection` (ST)         | Globe camera Z                |
| `atmosphere-bg`      | `AtmosphereSection` (ST)   | Background gradient           |
| `editorial-h2`       | `EditorialSection` (ST)    | H2 clip reveal                |
| `editorial-stats`    | `EditorialSection` (ST)    | 3 counter animations          |
| `crane-pin`          | `CraneSection` (ST)        | AnimationMixer time           |
| `truck-enter`        | `TruckSection` (ST)        | Canvas activate + truck slide |
| `services-reveal`    | `ServicesSection` (ST)     | Word shuffle + column stagger |
| `wipe-pin`           | `WipeSection` (ST)         | Panel width                   |
| `ship-pin`           | `ShipSection` (ST)         | Camera Y phases               |
| `aircraft-pin`       | `AircraftSection` (ST)     | Camera Z                      |
| `testimonials-h2`    | `TestimonialsSection` (ST) | H2 clip reveal                |
| `testimonials-cards` | `TestimonialsSection` (ST) | Card stagger                  |

---

## Context Strategy

### Per-Component Context

```
const sectionRef = useRef(null)

useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations scoped to sectionRef.current
    gsap.from('.line', { yPercent: 100, ... })
    ScrollTrigger.create({ ... })
  }, sectionRef)

  return () => ctx.revert()  // Cleanup: kills all animations + STs in context
}, [])
```

### Why gsap.context

- Automatically cleans up all animations and ScrollTriggers created inside it
- Scoped to a DOM element — prevents targeting wrong elements on re-render
- Works correctly with React Strict Mode double-invocation

---

## Timeline Registration

### Load Timeline Registration

```
Flow:
  1. LoadingProvider: isLoaded becomes true
  2. HeroSection useEffect: detects isLoaded change
  3. Creates loadTimeline inside gsap.context
  4. Plays immediately (no scroll trigger)
```

### ScrollTrigger Registration

```
Flow:
  1. Component mounts (useLayoutEffect)
  2. gsap.context created, scoped to section DOM element
  3. ScrollTrigger.create() called with trigger, start, end, etc.
  4. ST registered globally in GSAP's internal registry
  5. Returns context for cleanup
```

### Registration Order

All ScrollTriggers must be registered in DOM order (top-to-bottom sections). This prevents Z-order conflicts and ensures correct `refreshPriority`:

```
HeroSection (priority: 10)
AtmosphereSection (priority: 9)
EditorialSection (priority: 8)
CraneSection (priority: 7)
TruckSection (priority: 6)
ServicesSection (priority: 5)
WipeSection (priority: 4)
ShipSection (priority: 3)
AircraftSection (priority: 2)
TestimonialsSection (priority: 1)
```

---

## Timeline Cleanup

### Component Unmount Cleanup

```
ctx.revert()
```

This single call:

- Kills all GSAP tweens created in context
- Kills all ScrollTrigger instances created in context
- Removes all GSAP-applied inline styles
- Removes all event listeners added by GSAP

### Manual Cleanup (Edge Cases)

```
For tweens created outside gsap.context:
  tween.kill()

For timelines:
  timeline.kill()
  timeline.clear()
```

---

## Timeline Refresh

### When to Refresh

```
1. After isLoaded = true (assets loaded, DOM stable)
2. After window resize (debounced 200ms)
3. After dynamic content changes (e.g., font swap)
4. After React Strict Mode double-mount completes
```

### Refresh Strategy

```
Single global refresh:
  ScrollTrigger.refresh()

Called from: LenisProvider or PageWrapper useLayoutEffect
Called: ONCE on initial load
Called: On resize (debounced)
```

### Refresh Performance

`ScrollTrigger.refresh()` forces layout reflow — expensive.  
NEVER call inside animation loop.  
NEVER call inside scroll handler.

---

## ScrollTrigger Configuration Defaults

```
ScrollTrigger.defaults({
  scroller: window,           // Use window scroll (Lenis syncs this)
  normalizeScroll: true,      // Mobile jitter prevention
  ignoreMobileResize: true    // Ignore keyboard-caused resize events
})
```

---

## GSAP Plugin Registration

Must happen once, at module level (not inside components):

```
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(ScrollToPlugin)  // Only if scroll-to feature used
```

---

## GSAP Defaults

```
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8,
  overwrite: 'auto'   // Prevents conflicts when same property animated twice
})

gsap.config({
  nullTargetWarn: false   // Prevent noise from unmounted element refs
})
```

---

## Custom Ease Definitions

| Name         | Curve        | Usage                       |
| ------------ | ------------ | --------------------------- |
| `"headline"` | `power4.out` | H1, H2 clip reveals         |
| `"none"`     | Linear       | All scroll scrub animations |
| `"stat"`     | `power2.out` | Count-up easing             |
| `"feature"`  | `power3.out` | Feature label reveals       |

Custom eases (via `CustomEase.create()`) should be registered at app init.
