# 03 — GSAP Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Complete GSAP animation system design — timelines, nesting, labels, easing, and dependencies

---

## GSAP Version & Plugins Required

| Package               | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `gsap`                | Core engine                                               |
| `gsap/ScrollTrigger`  | Scroll-driven animation                                   |
| `gsap/ScrollToPlugin` | Smooth scroll-to targets (if needed)                      |
| `gsap/SplitText`      | Premium — split H1/H2 into lines (alternative: custom JS) |
| `gsap/CustomEase`     | Custom easing curves                                      |
| `gsap/TextPlugin`     | NOT needed — word shuffle is custom                       |

> Note: If `SplitText` is unavailable (requires Club membership), implement manual line-wrapping via DOM manipulation.

---

## GSAP Global Configuration

| Setting                      | Value          | Reason                                          |
| ---------------------------- | -------------- | ----------------------------------------------- |
| `gsap.ticker.lagSmoothing`   | `false`        | Prevent frame skip on tab focus                 |
| `gsap.defaults.ease`         | `"power2.out"` | Project-wide default ease                       |
| `gsap.defaults.duration`     | `0.8`          | Project-wide default duration                   |
| `gsap.config.nullTargetWarn` | `false`        | Prevent console noise from unmounted components |
| Ticker FPS                   | Native RAF     | No `gsap.ticker.fps()` override                 |

---

## Timeline Architecture

The animation system uses a **two-tier timeline hierarchy**:

```
[Master Timeline] — gsap.globalTimeline
  ├── [Load Timeline] — page-load entry animations
  │   ├── Eyebrow fade
  │   ├── H1 line 1
  │   ├── H1 line 2
  │   ├── H1 line 3
  │   ├── Body copy
  │   ├── Button 1
  │   └── Button 2
  │
  ├── [Scroll Timelines] — each ScrollTrigger drives one
  │   ├── Hero camera pull-back (scroll scrub)
  │   ├── Atmosphere gradient (scroll scrub)
  │   ├── Editorial H2 reveal (one-shot)
  │   ├── Editorial stats (one-shot)
  │   ├── Crane animation (scroll scrub → mixer)
  │   ├── Services word shuffle (one-shot on enter)
  │   ├── Wipe panel (scroll scrub)
  │   ├── Ship camera (scroll scrub)
  │   ├── Ship text overlay (progress-driven)
  │   ├── Ship feature labels (one-shot)
  │   ├── Aircraft camera (scroll scrub)
  │   └── Testimonials reveal (one-shot)
  │
  └── [Continuous Timelines] — useFrame-driven (not GSAP)
      ├── Globe Y-rotation
      └── Aircraft banking
```

---

## Load Timeline (page-load)

### Structure

```
[loadTimeline] — gsap.timeline({ delay: 0.2 })
  t=0.0: Globe canvas opacity 0→1, duration 0.8
  t=0.3: Eyebrow opacity 0→1, y 8→0, duration 0.5
  t=0.4: H1 line 1 yPercent 100→0, duration 0.9
  t=0.52: H1 line 2 yPercent 100→0, duration 0.9
  t=0.64: H1 line 3 yPercent 100→0, duration 0.9
  t=0.75: Body copy opacity 0→1, y 16→0, duration 0.6
  t=0.9: Button 1 opacity 0→1, y 12→0, duration 0.5
  t=1.0: Button 2 opacity 0→1, y 12→0, duration 0.5
```

### Labels

```
loadTimeline.addLabel("eyebrow", 0.3)
loadTimeline.addLabel("headline", 0.4)
loadTimeline.addLabel("body", 0.75)
loadTimeline.addLabel("cta", 0.9)
```

### Dependencies

Must fire AFTER: DOM mounted, fonts loaded, Three.js canvas first render

---

## Hero Camera Scroll Timeline

### Structure

```
[ScrollTrigger onUpdate handler]
  trigger: ".hero-wrapper"
  start: "top top"
  end: "bottom bottom"
  scrub: 1
  onUpdate: (self) =>
    camera.position.z = gsap.utils.interpolate(3.5, 7.0, self.progress)
```

### Note on scrub value

`scrub: 1` means 1 second of smoothing lag. This gives the camera a slight inertia feel, but it's driven by Lenis anyway so this smoothing compounds.

Use `scrub: true` (no lag) for 1:1 direct mapping, OR `scrub: 0.5` for a subtle lag.

**Recommended**: `scrub: 0.5` — slight organic feel without being sluggish.

---

## Atmosphere Gradient Timeline

### Structure

```
[gsap.timeline with ScrollTrigger]
  trigger: ".atmosphere-section"
  start: "top bottom"
  end: "bottom top"
  scrub: 1
  animation: gsap.to(document.body, {
    background: gradientFinalValue,
    ease: "none"
  })
```

### Implementation Note

GSAP cannot animate multi-stop CSS gradients natively. Use one of:

1. Animate CSS custom properties (`--atmo-color-1`, `--atmo-color-2`, etc.)
2. Use a fixed-position overlay div, animate its `background` as a solid color + `opacity`
3. Use multiple layered divs with scroll-driven opacity

**Recommended approach**: Single overlay div, white → transparent (as hero exits), background of next section reveals naturally.

---

## Editorial Text Timeline

### H2 Reveal Timeline

```
[gsap.timeline with ScrollTrigger]
  trigger: ".editorial-h2"
  start: "top 80%"
  toggleActions: "play none none reset"

  Lines stagger:
    each line .editorial-h2 .line
    from: { yPercent: 100 }
    to:   { yPercent: 0 }
    ease: "power4.out"
    duration: 0.8
    stagger: 0.1
```

### Stats Count-Up Timeline

```
For each stat element:
  [gsap.to counter, ScrollTrigger once: true]
  trigger: statElement
  start: "top 70%"
  once: true

  counter.value: 0 → targetValue
  duration: 1.8
  ease: "power2.out"
  onUpdate: format and display
```

---

## Crane Animation Timeline

### Structure

```
[ScrollTrigger with scrub]
  trigger: ".crane-wrapper"
  start: "top top"
  end: "bottom bottom"
  scrub: 1
  pin: ".crane-canvas-container"

  onUpdate: (self) =>
    mixer.setTime(self.progress * clipDuration)
```

### Phase Breakdown (for custom implementation without GLB clips)

```
Timeline with scrub, total "duration" = 1 (unitless)

Phase 1 (0.0–0.45): Boom pitch: 40°→50°
Phase 2 (0.45–0.65): Spreader Y: down, Container pickup, Container Y: up
Phase 3 (0.65–0.85): Crane X: center→left (−2 units), Boom pitch: 50°→10°
Phase 4 (0.85–1.00): Container Y: settle to carry height, Crane X: finalize
```

---

## Services Word Shuffle Timeline

### Structure

```
[Custom animation, triggered by ScrollTrigger once]
  trigger: ".services-shuffle"
  start: "top 80%"
  once: true

  For each character:
    cycle through 4–6 random characters
    at 100ms intervals
    settle on final character
    total duration: ~800ms
```

### GSAP Integration

```
gsap.set('.shuffle-char', { opacity: 0 })

On trigger:
  1. Set all chars to visible
  2. For each char, run shuffle cycle (custom setInterval or GSAP stagger to steps)
  3. gsap.to(char, { textContent: finalChar, delay: i × 0.05 })
```

---

## Wipe Panel Timeline

### Structure

```
[ScrollTrigger with scrub + pin]
  trigger: ".wipe-wrapper"
  start: "top top"
  end: "+=1800" (180vh)
  scrub: 1
  pin: ".wipe-section"

  Panel width: 0% → 50% (0–60% progress)
  Panel width: 50% (60–80% progress, hold)
  Word shuffle: fires at 15% progress
  Feature labels: fire at 20% progress
```

---

## Ship Animation Timeline

### Structure

```
[ScrollTrigger with scrub + pin]
  trigger: ".ship-wrapper"
  start: "top top"
  end: "+=3000" (300vh)
  scrub: 1
  pin: ".ship-canvas-container"

  onUpdate: (self) =>
    if (self.progress < 0.4):
      camera.position.y = gsap.utils.interpolate(20, 10, self.progress / 0.4)
    elif (self.progress >= 0.55):
      camera.position.y = gsap.utils.interpolate(10, 20, (self.progress - 0.55) / 0.45)

    textOverlay.style.opacity = self.progress > 0.4 && self.progress < 0.55 ? 1 : 0
    labels.style.opacity = self.progress > 0.65 ? 1 : 0
```

---

## Aircraft Animation Timeline

### Structure

```
[ScrollTrigger with scrub + pin]
  trigger: ".aircraft-wrapper"
  start: "top top"
  end: "+=2200" (220vh)
  scrub: 1
  pin: ".aircraft-canvas-container"

  onUpdate: (self) =>
    camera.position.z = gsap.utils.interpolate(30, 5, self.progress)
    camera.position.y = gsap.utils.interpolate(5, 3, self.progress)
```

---

## Easing Reference

| Ease Name            | GSAP Syntax      | Usage               |
| -------------------- | ---------------- | ------------------- |
| Hero headline reveal | `"power4.out"`   | H1, H2 clip reveals |
| Body copy fade       | `"power2.out"`   | Body text, buttons  |
| Stat count-up        | `"power2.out"`   | Number counting     |
| Scroll scrub         | `"none"`         | All scroll-driven   |
| Ship camera          | LERP in onUpdate | Smooth continuous   |
| Word shuffle settle  | `"none"`         | Step/instant        |
| Feature labels       | `"power3.out"`   | Ship, wipe labels   |

---

## GSAP Performance Guidelines

| Rule                                                  | Reason                                |
| ----------------------------------------------------- | ------------------------------------- |
| Use `gsap.set()` for initial states, not CSS          | Ensures GSAP controls the property    |
| Avoid animating `width/height` — use `scaleX/scaleY`  | GPU-composited transform              |
| Use `will-change: transform` on animated elements     | Browser promotion hint                |
| Batch `ScrollTrigger.refresh()` calls                 | Expensive — call once after all setup |
| Use `onComplete` callbacks to kill finished timelines | Memory management                     |
| `gsap.ticker.remove(fn)` in cleanup                   | Prevent memory leaks in React         |
| Prefer `opacity` + `transform` only                   | Never animate `left/top/width`        |

---

## GSAP + React Integration

| Challenge              | Solution                                                             |
| ---------------------- | -------------------------------------------------------------------- |
| Context cleanup        | `gsap.context(() => { ... })` → `ctx.revert()` in `useEffect` return |
| ScrollTrigger in React | `ScrollTrigger.refresh()` after layout effect                        |
| Refs                   | Use `useRef()` for all GSAP targets                                  |
| Global timeline        | Store in `useRef` or module scope                                    |
| Animation on unmount   | Kill timelines in cleanup                                            |
