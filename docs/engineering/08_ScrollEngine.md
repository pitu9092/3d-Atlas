# 08 — Scroll Engine

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Lenis + ScrollTrigger architecture, sync, pin strategy, and refresh flow

---

## Scroll Engine Overview

```
[User input: wheel / trackpad / touch]
          │
          ▼
[Lenis smooth scroll engine]
  ├── Applies easing: expo-out (duration: 1.2s)
  ├── Emits: 'scroll' event with { scroll, progress, velocity, direction }
  └── RAF: driven by gsap.ticker
          │
          ▼
[ScrollTrigger.update()]         ← lenis.on('scroll', ScrollTrigger.update)
  ├── Reads: virtual scroll position from Lenis
  ├── Evaluates: all 14 trigger instances
  └── Fires: onUpdate, onEnter, onLeave callbacks
          │
          ▼
[Animation callbacks]
  ├── Camera refs updated
  ├── AnimationMixer time updated
  ├── DOM element styles updated
  └── Canvas frameloop toggled
```

---

## Lenis Configuration

### Instance (Singleton)

```
location: LenisProvider
created: once on mount
destroyed: lenis.destroy() on unmount
exposed via: React context
```

### Parameters

| Parameter         | Value                       | Rationale                                       |
| ----------------- | --------------------------- | ----------------------------------------------- |
| `duration`        | `1.2`                       | 1.2s inertia tail — smooth without sluggishness |
| `easing`          | `t => 1 - Math.pow(1-t, 4)` | Quart-out — comfortable deceleration            |
| `orientation`     | `"vertical"`                | Vertical-only experience                        |
| `smoothWheel`     | `true`                      | Mouse wheel gets smooth treatment               |
| `smoothTouch`     | `false`                     | Native touch is better on mobile                |
| `wheelMultiplier` | `1.0`                       | Default sensitivity                             |

---

## GSAP Ticker Integration

### Canonical Pattern

```
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
lenis.on('scroll', ScrollTrigger.update)
```

### Why This Pattern

- Single RAF loop (GSAP ticker) drives both Lenis and GSAP
- No double-RAF, no frame-lag between systems
- `lagSmoothing(0)` prevents "catch-up" jumps on tab focus

---

## ScrollTrigger Instances (14 Total)

### Pin-Type Instances (5)

These create `pin-spacer` divs and extend page height:

| ID             | Trigger             | Pin Target                   | Scroll Distance |
| -------------- | ------------------- | ---------------------------- | --------------- |
| `hero-cam`     | `.hero-wrapper`     | `.hero-canvas-container`     | 150vh           |
| `crane-pin`    | `.crane-wrapper`    | `.crane-canvas-container`    | 350vh           |
| `wipe-pin`     | `.wipe-wrapper`     | `.wipe-section`              | 180vh           |
| `ship-pin`     | `.ship-wrapper`     | `.ship-canvas-container`     | 200vh           |
| `aircraft-pin` | `.aircraft-wrapper` | `.aircraft-canvas-container` | 120vh           |

### One-Shot Instances (7)

Fire once, optionally reset on scroll-back:

| ID                   | Trigger Element          | Fire Condition | Once       |
| -------------------- | ------------------------ | -------------- | ---------- |
| `atmosphere-bg`      | `.atmosphere-section`    | Scrub          | No         |
| `editorial-h2`       | `.editorial-h2`          | `top 80%`      | No (reset) |
| `editorial-stats`    | `.editorial-stats`       | `top 70%`      | YES        |
| `truck-enter`        | `.truck-section`         | `top 80%`      | No         |
| `services-reveal`    | `.services-section`      | `top 80%`      | No (reset) |
| `testimonials-h2`    | `.testimonials-h2`       | `top 80%`      | No (reset) |
| `testimonials-cards` | each `.testimonial-card` | `top 75%`      | No (reset) |

### Progress-Driven Instances (2)

Report continuous progress, no discrete trigger:

| ID                      | Progress Used For          |
| ----------------------- | -------------------------- |
| `ship-pin` onUpdate     | Camera Y phase calculation |
| `aircraft-pin` onUpdate | Camera Z calculation       |

---

## Pin Strategy

### How Pins Work in This Project

```
Wrapper element height = pin duration (e.g., 350vh for crane)
Pin target = canvas container (sticky, 100vh)

DOM structure:
<div class="crane-wrapper" style="height: 450vh">    ← Scroll space
  <div class="crane-canvas-container" style="position: sticky; top: 0; height: 100vh">
    <CraneScene />
  </div>
</div>

ScrollTrigger pin:
  trigger: .crane-wrapper
  pin: .crane-canvas-container
  ← Actually: ST creates a pin-spacer, sets canvas container to fixed/sticky
```

### Pin Spacing

`pinSpacing: true` on all pins — ST adds padding to prevent content overlap.

### Pin Total Impact on Page Height

| Section      | Natural Height | Pin Scroll Distance | Total        |
| ------------ | -------------- | ------------------- | ------------ |
| Hero         | 100vh          | +150vh              | 250vh        |
| Atmosphere   | 60vh           | —                   | 60vh         |
| Editorial    | 100vh          | —                   | 100vh        |
| Crane        | 100vh          | +350vh              | 450vh        |
| Truck        | 100vh          | —                   | 100vh        |
| Services     | 100vh          | —                   | 100vh        |
| Wipe         | 100vh          | +180vh              | 280vh        |
| Ship         | 100vh          | +200vh              | 300vh        |
| Aircraft     | 100vh          | +120vh              | 220vh        |
| Testimonials | 200vh          | —                   | 200vh        |
| **TOTAL**    | —              | —                   | **~2,060vh** |

---

## Section Strategy

### Section Height Rules

| Section Type          | Natural Height            | Notes                           |
| --------------------- | ------------------------- | ------------------------------- |
| Pinned canvas section | `100vh` natural + wrapper | Wrapper defines scroll distance |
| CSS-only transition   | `60–80vh`                 | Atmosphere gradient             |
| DOM content           | `100–200vh`               | Enough to read content          |
| Testimonials          | `200vh`                   | Multiple client cards           |

---

## Progress Tracking

### Progress Values per Scene

| Scene    | Progress Range | Maps To                               |
| -------- | -------------- | ------------------------------------- |
| Globe    | `0→1`          | Camera Z: `3.5→7.0`                   |
| Crane    | `0→1`          | AnimationMixer time: `0→clipDuration` |
| Wipe     | `0→1`          | Panel width: `0→50vw`                 |
| Ship     | `0→1`          | Camera Y: 3-phase formula             |
| Aircraft | `0→1`          | Camera Z: `30→5`                      |

### Progress Access Pattern

```
ScrollTrigger.create({
  onUpdate: (self) => {
    const progress = self.progress  // 0 to 1, never outside
    // write to React ref:
    progressRef.current = progress
  }
})
```

---

## Refresh Flow

### Initial Load Refresh

```
1. All section DOM is mounted
2. Fonts are loaded (document.fonts.ready)
3. LenisProvider fires ScrollTrigger.refresh()
4. All pin-spacers calculated
5. Total page height established
6. All ST start/end positions recalculated
```

### Resize Refresh

```
window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh()
  lenis.resize()  // Lenis recalculates scroll dimensions
}, 200))
```

### React Strict Mode Double-Mount

In development, React Strict Mode runs effects twice. Strategy:

```
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // create ST instances
  }, triggerRef)

  return () => ctx.revert()  // First cleanup
}, [])

// Second mount creates fresh instances
// All existing STs have been killed by ctx.revert()
```

---

## Scroll State

The scroll engine exposes state through `useScrollProgress` hook:

```typescript
interface ScrollState {
  scrollY: number // Raw scroll position
  progress: number // 0–1 within current section
  velocity: number // Lenis scroll velocity
  direction: 1 | -1 // Scroll direction
}
```

Used by: Navbar (velocity for any visual effects), Canvas scenes (progress for camera)
