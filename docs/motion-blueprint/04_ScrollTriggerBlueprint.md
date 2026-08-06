# 04 — ScrollTrigger Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Every ScrollTrigger instance — trigger, start, end, pin, scrub, snap, and configuration

---

## ScrollTrigger Global Setup

| Setting                            | Value                          | Reason                                 |
| ---------------------------------- | ------------------------------ | -------------------------------------- |
| `ScrollTrigger.defaults.scroller`  | `window` or Lenis-synced       | Depends on Lenis integration strategy  |
| `ScrollTrigger.normalizeScroll`    | `true`                         | Prevents mobile jitter                 |
| `ScrollTrigger.ignoreMobileResize` | `true`                         | Prevents unnecessary refresh on mobile |
| Refresh trigger                    | After DOM paint + canvas ready | Ensures accurate measurements          |
| `ScrollTrigger.refresh()`          | Call once, after setup         | Recalculates all trigger positions     |

---

## Lenis + ScrollTrigger Sync

```
Strategy: Lenis RAF drives ScrollTrigger update tick

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
```

This ensures ScrollTrigger reads Lenis's virtual scroll position, not native scroll.

---

## ScrollTrigger Instance 01 — Hero Camera Pull-Back

| Property             | Value                                  |
| -------------------- | -------------------------------------- |
| **ID**               | `"hero-cam"`                           |
| **Trigger element**  | `.hero-wrapper`                        |
| **Start**            | `"top top"`                            |
| **End**              | `"bottom bottom"`                      |
| **Pin**              | `.hero-canvas-container`               |
| **Pin spacing**      | `true`                                 |
| **Scrub**            | `0.5`                                  |
| **Snap**             | None                                   |
| **Markers**          | Dev mode only                          |
| **Refresh priority** | `10` (high — other STs depend on this) |
| **Scroll distance**  | `150vh`                                |
| **onUpdate**         | Camera Z interpolation                 |
| **onEnter**          | Globe canvas activates                 |
| **onLeave**          | Globe canvas deactivates (opacity 0)   |

---

## ScrollTrigger Instance 02 — Atmosphere Background

| Property             | Value                                                            |
| -------------------- | ---------------------------------------------------------------- |
| **ID**               | `"atmosphere-bg"`                                                |
| **Trigger element**  | `.atmosphere-section`                                            |
| **Start**            | `"top bottom"`                                                   |
| **End**              | `"bottom top"`                                                   |
| **Pin**              | None                                                             |
| **Scrub**            | `1`                                                              |
| **Snap**             | None                                                             |
| **Scroll distance**  | `60vh`                                                           |
| **Animation target** | `document.body` background OR overlay div                        |
| **Note**             | Fires during hero section exit; no separate DOM section required |

---

## ScrollTrigger Instance 03 — Editorial H2 Reveal

| Property            | Value                          |
| ------------------- | ------------------------------ |
| **ID**              | `"editorial-h2"`               |
| **Trigger element** | `.editorial-h2`                |
| **Start**           | `"top 80%"`                    |
| **End**             | `"top 20%"`                    |
| **Pin**             | None                           |
| **Scrub**           | None (one-shot)                |
| **Toggle actions**  | `"play none none reset"`       |
| **Once**            | `false` (reset on scroll back) |
| **Scroll distance** | N/A (one-shot)                 |

---

## ScrollTrigger Instance 04 — Editorial Stats Counter

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **ID**              | `"editorial-stats"`                                |
| **Trigger element** | `.editorial-stats`                                 |
| **Start**           | `"top 70%"`                                        |
| **Pin**             | None                                               |
| **Once**            | `true` — counters should not re-run on scroll back |
| **onEnter**         | Fire all 3 count-up animations                     |

---

## ScrollTrigger Instance 05 — Crane Pin + Scrub

| Property             | Value                                         |
| -------------------- | --------------------------------------------- |
| **ID**               | `"crane-pin"`                                 |
| **Trigger element**  | `.crane-wrapper`                              |
| **Start**            | `"top top"`                                   |
| **End**              | `"bottom bottom"`                             |
| **Pin**              | `.crane-canvas-container`                     |
| **Pin spacing**      | `true`                                        |
| **Scrub**            | `1`                                           |
| **Snap**             | None (smooth scrub)                           |
| **Markers**          | Dev mode only                                 |
| **Refresh priority** | `9`                                           |
| **Scroll distance**  | `350vh`                                       |
| **onUpdate**         | `mixer.setTime(self.progress × clipDuration)` |
| **onEnter**          | Activate crane canvas renderer                |
| **onLeaveBack**      | Deactivate crane canvas                       |

---

## ScrollTrigger Instance 06 — Truck Section Enter

| Property            | Value                                                |
| ------------------- | ---------------------------------------------------- |
| **ID**              | `"truck-enter"`                                      |
| **Trigger element** | `.truck-section`                                     |
| **Start**           | `"top 80%"`                                          |
| **Pin**             | None (or brief pin)                                  |
| **onEnter**         | Activate truck canvas, trigger truck entry animation |
| **onLeave**         | Deactivate truck canvas                              |

---

## ScrollTrigger Instance 07 — Services Grid Reveal

| Property            | Value                                         |
| ------------------- | --------------------------------------------- |
| **ID**              | `"services-reveal"`                           |
| **Trigger element** | `.services-grid`                              |
| **Start**           | `"top 75%"`                                   |
| **Pin**             | None                                          |
| **Once**            | `false`                                       |
| **Toggle actions**  | `"play none none reset"`                      |
| **onEnter**         | Fire word shuffle + column stagger animations |

---

## ScrollTrigger Instance 08 — Wipe Panel Pin + Scrub

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| **ID**              | `"wipe-pin"`                                        |
| **Trigger element** | `.wipe-wrapper`                                     |
| **Start**           | `"top top"`                                         |
| **End**             | `"+=1800"`                                          |
| **Pin**             | `.wipe-section`                                     |
| **Pin spacing**     | `true`                                              |
| **Scrub**           | `1`                                                 |
| **Snap**            | None                                                |
| **Scroll distance** | `180vh`                                             |
| **onUpdate**        | Panel width = `progress × 50%`, word shuffle states |
| **onEnter**         | Activate wipe section                               |
| **onLeave**         | Ship section begins                                 |

---

## ScrollTrigger Instance 09 — Container Ship Pin + Scrub

| Property            | Value                                                          |
| ------------------- | -------------------------------------------------------------- |
| **ID**              | `"ship-pin"`                                                   |
| **Trigger element** | `.ship-wrapper`                                                |
| **Start**           | `"top top"`                                                    |
| **End**             | `"bottom bottom"`                                              |
| **Pin**             | `.ship-canvas-container`                                       |
| **Pin spacing**     | `true`                                                         |
| **Scrub**           | `0.5`                                                          |
| **Snap**            | None                                                           |
| **Scroll distance** | `200vh`                                                        |
| **onUpdate**        | Camera Y interpolation (3 phases), text opacity, label opacity |
| **onEnter**         | Activate ship canvas, start water particles                    |
| **onLeave**         | Deactivate ship canvas                                         |

---

## ScrollTrigger Instance 10 — Ship Text Overlay

| Property              | Value                                     |
| --------------------- | ----------------------------------------- |
| **ID**                | `"ship-text"`                             |
| **Driver**            | Derived from ship-pin onUpdate progress   |
| **Show when**         | `progress > 0.38 && progress < 0.57`      |
| **Implementation**    | Direct opacity set in ship-pin `onUpdate` |
| **Not a separate ST** | Inline in ship-pin callback               |

---

## ScrollTrigger Instance 11 — Ship Feature Labels

| Property           | Value                                                |
| ------------------ | ---------------------------------------------------- |
| **ID**             | `"ship-labels"`                                      |
| **Driver**         | Derived from ship-pin onUpdate progress              |
| **Show when**      | `progress > 0.62`                                    |
| **Stagger**        | 150ms between each label                             |
| **Implementation** | GSAP `.to()` called once when threshold crossed      |
| **Guard**          | Boolean flag to prevent re-triggering on every frame |

---

## ScrollTrigger Instance 12 — Aircraft Pin + Scrub

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **ID**              | `"aircraft-pin"`                                   |
| **Trigger element** | `.aircraft-wrapper`                                |
| **Start**           | `"top top"`                                        |
| **End**             | `"bottom bottom"`                                  |
| **Pin**             | `.aircraft-canvas-container`                       |
| **Pin spacing**     | `true`                                             |
| **Scrub**           | `0.5`                                              |
| **Scroll distance** | `120vh`                                            |
| **onUpdate**        | Camera Z interpolation `30 → 5`                    |
| **onEnter**         | Activate aircraft canvas                           |
| **onLeave**         | Deactivate aircraft canvas, fade into testimonials |

---

## ScrollTrigger Instance 13 — Testimonials H2

| Property            | Value                            |
| ------------------- | -------------------------------- |
| **ID**              | `"testimonials-h2"`              |
| **Trigger element** | `.testimonials-h2`               |
| **Start**           | `"top 80%"`                      |
| **Toggle actions**  | `"play none none reset"`         |
| **Animation**       | 3-line clip reveal, stagger 0.1s |

---

## ScrollTrigger Instance 14 — Testimonials Cards

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| **ID**              | `"testimonials-cards"`                              |
| **Trigger element** | Each `.testimonial-card`                            |
| **Start**           | `"top 75%"`                                         |
| **Toggle actions**  | `"play none none reset"`                            |
| **Stagger**         | Applied at ScrollTrigger level, not animation level |

---

## ScrollTrigger Refresh Strategy

### When to Refresh

```
1. After initial DOM render (useLayoutEffect)
2. After all 3D canvases have rendered their first frame
3. After window resize (debounced, 200ms delay)
4. After any dynamically loaded content (GLB models loaded)
```

### Resize Handling

```
window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh()
}, 200))
```

### React Strict Mode Consideration

In React Strict Mode, effects run twice. Kill and re-create all ScrollTrigger instances in cleanup to prevent doubles.

---

## Pin Spacing Impact on Total Page Height

| Section  | Scroll Distance | With Pin Spacing   |
| -------- | --------------- | ------------------ |
| Hero     | 150vh           | Adds 150vh padding |
| Crane    | 350vh           | Adds 350vh padding |
| Wipe     | 180vh           | Adds 180vh padding |
| Ship     | 200vh           | Adds 200vh padding |
| Aircraft | 120vh           | Adds 120vh padding |

Without pin sections, the natural scroll height would be ~100–150vh total.
With all pins, total becomes ~1,100–1,460vh as documented.

---

## ScrollTrigger Debugging Checklist

| Issue                             | Likely Cause               | Solution                                          |
| --------------------------------- | -------------------------- | ------------------------------------------------- |
| Animation fires at wrong position | Refresh not called         | Call `ScrollTrigger.refresh()`                    |
| Pinned element jumping            | `pin-spacer` div conflicts | Check CSS margin/padding on trigger               |
| Scrub feels laggy                 | `scrub` value too high     | Reduce to `0.3`                                   |
| ST not working with Lenis         | RAF not connected          | Ensure `lenis.on('scroll', ScrollTrigger.update)` |
| Animations running on mount       | Missing `paused: true`     | Add `paused: true` for one-shot animations        |
