# 05 — Lenis Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Smooth scroll engine configuration, RAF strategy, GSAP sync, and performance

---

## Why Lenis

| Reason                                 | Detail                                                             |
| -------------------------------------- | ------------------------------------------------------------------ |
| Native scroll is jerky                 | Browser scroll has no easing — momentum ends abruptly              |
| GSAP ScrollTrigger needs smooth values | Lenis provides smooth progress values                              |
| Cross-browser consistency              | Normalizes scroll behavior across Chrome/Safari/Firefox            |
| 3D canvas sync                         | Canvas animations must respond to smooth scroll, not native scroll |
| Pinned sections                        | Lenis handles pinned sections more reliably than native            |

---

## Lenis Configuration

### Initialization Parameters

| Parameter            | Value                                            | Reason                                               |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| `duration`           | `1.2`                                            | How long scroll inertia lasts (in seconds)           |
| `easing`             | `t => Math.min(1, 1.001 - Math.pow(2, -10 * t))` | Expo ease-out — buttery deceleration                 |
| `orientation`        | `"vertical"`                                     | Vertical scroll only                                 |
| `gestureOrientation` | `"vertical"`                                     | Match orientation                                    |
| `smoothWheel`        | `true`                                           | Smooth mouse wheel                                   |
| `smoothTouch`        | `false`                                          | Disable on touch — native scroll is better on mobile |
| `wheelMultiplier`    | `1.0`                                            | Default — adjust if scroll feels too fast/slow       |
| `touchMultiplier`    | `2.0`                                            | Touch scroll sensitivity                             |
| `lerp`               | NOT used (use `duration` instead)                | `duration` + `easing` is preferred over `lerp`       |

### Alternative (simpler) Config

```
duration: 1.2
easing: (t) => 1 - Math.pow(1 - t, 4)  // quartOut
smoothWheel: true
```

---

## RAF Strategy

### Approach: GSAP Ticker Drives Lenis

```
Pattern:
  1. GSAP ticker fires at rAF cadence
  2. GSAP ticker calls lenis.raf(time)
  3. Lenis processes scroll and emits 'scroll' event
  4. 'scroll' event updates ScrollTrigger
  5. ScrollTrigger updates all animations
```

This ensures GSAP and Lenis share the same RAF loop — no double-frame callbacks.

### Ticker Setup

```
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)  // convert GSAP seconds to milliseconds
})

gsap.ticker.lagSmoothing(0)  // prevents lag compensation

lenis.on('scroll', ScrollTrigger.update)
```

### Why `lagSmoothing(0)`

Without this, GSAP's lag smoothing can cause scroll position to "jump" after tab switch or focus loss. Setting to 0 makes scroll position always current.

---

## Lenis + ScrollTrigger Integration

### Scroll Position Source

ScrollTrigger must read from Lenis's virtual scroll position, not `window.scrollY`.

```
Method: lenis.on('scroll', ScrollTrigger.update)
  This fires ScrollTrigger.update() on every Lenis scroll event
  ScrollTrigger reads Lenis's virtual position via the update
```

### Alternative: Custom Scroller

```
ScrollTrigger.defaults({
  scroller: document.body  // OR lenis-specific scroller
})
```

---

## Scroll-to Implementation

For any "Scroll to section" buttons or nav links:

```
lenis.scrollTo(targetElement, {
  offset: 0,
  duration: 1.5,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  lock: false  // don't lock user scroll during animation
})
```

---

## Reduced Motion Strategy

### Detection

```
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

### Lenis Behavior on Reduced Motion

```
If prefersReducedMotion:
  duration: 0 (instant — no smooth scroll)
  smoothWheel: false

GSAP behavior:
  gsap.globalTimeline.timeScale(1000)  // skip all animations
  OR: gsap.defaults.duration = 0

ScrollTrigger:
  scrub: false  // immediate position changes
```

### Fallback States

All CSS animations should have `@media (prefers-reduced-motion: reduce)` overrides that remove transitions and animations completely.

---

## Mobile Considerations

| Feature         | Mobile Strategy                                      |
| --------------- | ---------------------------------------------------- |
| Smooth scroll   | Disabled (`smoothTouch: false`)                      |
| 3D canvases     | UNKNOWN — may need fallback images on low-end mobile |
| Crane animation | May reduce to static image on mobile                 |
| Ship section    | May reduce detail level on mobile                    |
| Performance     | `devicePixelRatio` cap at 2.0 for all canvases       |

---

## Lenis Scroll Events

| Event              | Payload                                     | When to use                                    |
| ------------------ | ------------------------------------------- | ---------------------------------------------- |
| `scroll`           | `{ scroll, progress, velocity, direction }` | Feed to ScrollTrigger                          |
| `scroll.velocity`  | Float                                       | Could drive blur effects or parallax intensity |
| `scroll.direction` | `1` or `-1`                                 | Could drive directional entrance animations    |

### Velocity Usage (Optional Enhancement)

```
lenis.on('scroll', ({ velocity }) => {
  const blur = Math.abs(velocity) × 0.5  // max ~4px blur
  canvas.style.filter = `blur(${Math.min(blur, 4)}px)`
})
```

Only implement this if performance headroom exists.

---

## Lenis Performance Considerations

| Consideration      | Strategy                                                                          |
| ------------------ | --------------------------------------------------------------------------------- |
| RAF overlap        | Use GSAP ticker as single RAF source — never add separate `requestAnimationFrame` |
| Event listeners    | `lenis.on('scroll', fn)` — unbind in cleanup                                      |
| React unmount      | `lenis.destroy()` in effect cleanup                                               |
| Multiple instances | One global Lenis instance only                                                    |
| Context            | Provide lenis instance via React context for `scrollTo` access anywhere           |

---

## Lenis Context Provider (Architecture)

```
LenisContext (React Context)
  ├── Provides: lenis instance
  ├── Provides: scrollTo(target, options) function
  └── Consumers: NavBar (anchor links), Hero CTA button, any ScrollTo element
```

---

## Testing Scroll Feel

After implementation, verify:

| Test                        | Expected                                          |
| --------------------------- | ------------------------------------------------- |
| Mouse wheel — fast spin     | Scroll completes quickly with smooth deceleration |
| Mouse wheel — slow          | Scrolls proportionally, no over-scroll            |
| Trackpad — two-finger swipe | Smooth, matches trackpad feel                     |
| Click and drag scrollbar    | Works normally (native scrollbar behavior)        |
| Tab focus                   | No scroll position jump                           |
| ScrollTrigger markers       | Pin positions are correct after Lenis sync        |
