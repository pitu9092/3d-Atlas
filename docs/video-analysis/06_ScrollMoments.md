# 06 — Scroll Moments

**Project**: 3D Atlas  
**Focus**: Every observable scroll-related behavior — pins, scrubs, triggers, speed, direction

---

## Global Scroll Configuration

| Property         | Value             | Evidence                                           |
| ---------------- | ----------------- | -------------------------------------------------- |
| **Engine**       | Lenis             | Premium damped scroll inertia visible              |
| **Direction**    | Vertical only     | No horizontal scroll observed                      |
| **Damping**      | ~0.1              | Heavy inertia — scroll settles slowly              |
| **Duration**     | ~1.2s             | Time for scroll to come to rest                    |
| **Easing**       | Exponential decay | `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` |
| **Snap**         | None              | No snap points detected                            |
| **Overscroll**   | None              | No overscroll behavior visible                     |
| **Mobile Touch** | Unknown           | Desktop-only demo                                  |

### Lenis + GSAP Integration (Standard Pattern)

```javascript
// Lenis ticker setup (required)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value, { immediate: true }) : lenis.scroll
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
  },
})
lenis.on('scroll', ScrollTrigger.update)
```

---

## Total Scroll Height (Estimated)

| Section                          | Estimated Height |
| -------------------------------- | ---------------- |
| S01 Globe Hero (pinned)          | 150vh            |
| S02 Atmosphere                   | 60vh             |
| S03 Editorial                    | 100vh            |
| S04 Reach Stacker (pinned, long) | 350vh            |
| S05 Truck                        | 100vh            |
| S06 Services Grid                | 100vh            |
| S07 Wipe Transition (pinned)     | 80vh             |
| S08 Container Ship (pinned)      | 200vh            |
| S09 Aircraft (pinned)            | 120vh            |
| S10 Testimonials                 | 200vh            |
| **TOTAL**                        | **~1460vh**      |

> Real user scrolling through entire experience would take approximately 5–8 minutes at a comfortable pace.

---

## Scroll Moment 01 — Hero Pin (Begin)

| Property                 | Value                                                         |
| ------------------------ | ------------------------------------------------------------- |
| **Section**              | Globe Hero                                                    |
| **Pin Type**             | Sticky — canvas stays, text may scroll away                   |
| **Pin Start**            | `scrollY = 0` (page top)                                      |
| **Pin End**              | `scrollY ≈ 150vh`                                             |
| **Scrub**                | YES — camera Z tied to scroll progress                        |
| **What Animates**        | `camera.position.z: 3.5 → 7.0`                                |
| **Scroll Direction**     | Down only                                                     |
| **Parallax**             | Yes — globe may have mild mouse-position parallax             |
| **Video Frame Evidence** | Globe appears smaller in F0016 vs F0012 → camera pulling back |
| **ScrollTrigger Config** |                                                               |

```javascript
ScrollTrigger.create({
  trigger: '.hero-section',
  start: 'top top',
  end: '+=150%',
  pin: true,
  scrub: 1.5,
  onUpdate: (self) => {
    camera.position.z = gsap.utils.mapRange(0, 1, 3.5, 7.0, self.progress)
  },
})
```

---

## Scroll Moment 02 — Hero Pin (End) / Atmosphere

| Property            | Value                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| **Section**         | Atmospheric Transition                                                  |
| **Trigger**         | After hero pin range completes                                          |
| **Scroll Position** | `scrollY ≈ 150–210vh`                                                   |
| **Animation**       | Background color: `#080808 → [gradient] → #F5F4F0`                      |
| **Scrub**           | YES — color is scroll-synced                                            |
| **Duration**        | ~60vh scroll                                                            |
| **Video Evidence**  | Frame 0020: mid-gradient. Frame 0022: nearly complete. Fast transition. |

---

## Scroll Moment 03 — Editorial Section Enter

| Property             | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| **Section**          | Editorial Brand Statement                                  |
| **Trigger**          | `start: "top 80%"` (element 80% down from top of viewport) |
| **Type**             | One-shot (not scrubbed)                                    |
| **Animations Fired** |                                                            |
| — H2 text            | clip-path mask reveal, line by line, stagger 100ms         |
| — Body copy          | opacity fade-up                                            |
| — Stat counter       | count from 0 to 2500                                       |
| — Image              | opacity fade                                               |
| **Scroll Speed**     | Standard (no pin)                                          |
| **Snap**             | None                                                       |

---

## Scroll Moment 04 — Reach Stacker Pin (Begin)

| Property                 | Value                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| **Section**              | Reach Stacker                                                                                    |
| **Pin Type**             | Hard pin — entire canvas sticks                                                                  |
| **Pin Start**            | `scrollY ≈ 310vh` (after editorial)                                                              |
| **Pin End**              | `scrollY ≈ 660vh`                                                                                |
| **Pin Duration**         | ~350vh of scroll                                                                                 |
| **Scrub**                | YES — crane animation progress tied 1:1                                                          |
| **What Animates**        | Crane arm positions, spreader Y, container positions                                             |
| **Scrub Factor**         | 1 (linear 1:1 scrub)                                                                             |
| **Video Evidence**       | F0032–F0040 shows crane moving progressively across multiple frames while background stays white |
| **ScrollTrigger Config** |                                                                                                  |

```javascript
ScrollTrigger.create({
  trigger: '.crane-section',
  start: 'top top',
  end: '+=350%',
  pin: true,
  scrub: 1,
  onUpdate: (self) => {
    // Drive crane animation mixer time
    craneMixer.setTime(self.progress * craneAnimationDuration)
  },
})
```

---

## Scroll Moment 05 — Reach Stacker Animation Phases

Scroll progress within the crane pin section (`0.0 → 1.0`):

| Progress | Action                                                                 |
| -------- | ---------------------------------------------------------------------- |
| 0.00     | Scene enters — crane in starting position                              |
| 0.10     | Boom begins extending upward                                           |
| 0.25     | Boom at ~45° angle, heading toward container stack                     |
| 0.45     | Spreader descends to container top (F0032 equivalent)                  |
| 0.55     | Container begins lifting                                               |
| 0.65     | Container at apex of lift (topmost position)                           |
| 0.75     | Crane body begins lateral movement (left)                              |
| 0.90     | Crane fully left, container horizontal beneath boom (F0040 equivalent) |
| 1.00     | Transition to truck scene                                              |

---

## Scroll Moment 06 — Truck Section Enter

| Property            | Value                                             |
| ------------------- | ------------------------------------------------- |
| **Section**         | Road Freight                                      |
| **Type**            | Brief scroll (or brief pin)                       |
| **Scroll Position** | `scrollY ≈ 660–760vh`                             |
| **Duration**        | ~100vh                                            |
| **Animation**       | Truck enters from right OR appears as crane exits |
| **Scrub**           | Possible — truck position may be scroll-driven    |

---

## Scroll Moment 07 — Services Section / Split Reveal

| Property           | Value                                                    |
| ------------------ | -------------------------------------------------------- |
| **Section**        | Services Grid                                            |
| **Type**           | Scroll-driven horizontal split                           |
| **Trigger**        | Truck section bottom reaches top of services section     |
| **Animation**      | Dark background rises from viewport bottom               |
| **Scrub**          | YES — split ratio tied to scroll                         |
| **Video Evidence** | F0048: hard 50/50 split visible — top white, bottom dark |

---

## Scroll Moment 08 — Wipe Transition Pin

| Property            | Value                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| **Section**         | Cinematic Wipe                                                            |
| **Pin Type**        | Brief pin                                                                 |
| **Pin Start**       | `scrollY ≈ 860vh`                                                         |
| **Pin End**         | `scrollY ≈ 940vh`                                                         |
| **Scrub**           | YES — panel width tied to scroll                                          |
| **Panel Direction** | Grows from center outward (not from left edge)                            |
| **Video Evidence**  | F0060: panel at ~25% width. F0064: panel completing, ocean revealed below |

---

## Scroll Moment 09 — Container Ship Pin

| Property          | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| **Section**       | Sea Freight                                                   |
| **Pin Type**      | Hard pin                                                      |
| **Pin Start**     | `scrollY ≈ 940vh`                                             |
| **Pin End**       | `scrollY ≈ 1140vh`                                            |
| **Pin Duration**  | ~200vh                                                        |
| **Scrub**         | YES — camera zoom + label reveals                             |
| **What Animates** | Camera Y (aerial zoom), text reveal, feature label appearance |
| **Phases**        |                                                               |
| — 0–40%           | Camera zooms in on ship                                       |
| — 40–60%          | "LOGISTICS THAT WORKS..." text fades in                       |
| — 60–100%         | Camera pulls back, feature labels appear around ship          |

---

## Scroll Moment 10 — Aircraft Pin

| Property          | Value                                        |
| ----------------- | -------------------------------------------- |
| **Section**       | Air Freight                                  |
| **Pin Type**      | Pinned                                       |
| **Pin Start**     | `scrollY ≈ 1140vh`                           |
| **Pin End**       | `scrollY ≈ 1260vh`                           |
| **Scrub**         | YES — camera movement, aircraft zoom         |
| **What Animates** | Camera zoom toward aircraft, clouds parallax |

---

## Scroll Moment 11 — Testimonials (Standard Scroll)

| Property            | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| **Section**         | Social Proof                                               |
| **Type**            | Standard scroll (no pin)                                   |
| **Scroll Position** | `scrollY ≈ 1260–1460vh`                                    |
| **Animation**       | Heading reveal, client card fade-in, long-form text        |
| **Snap**            | None                                                       |
| **Behavior**        | Each testimonial enters viewport and animates individually |

---

## Parallax Summary

| Element             | Parallax Type              | Intensity              |
| ------------------- | -------------------------- | ---------------------- |
| Globe (mouse)       | Mouse X/Y → camera offset  | Very subtle (~2–3%)    |
| Globe (scroll)      | Scroll Y → camera Z        | Strong (3.5→7.0 units) |
| Ship (scroll)       | Scroll Y → camera Y        | Strong (aerial zoom)   |
| Aircraft (scroll)   | Scroll Y → camera position | Medium                 |
| Clouds (continuous) | Time-based drift           | Very subtle            |

---

## Estimated ScrollTrigger Count

| Scene        | ScrollTriggers | Types                                 |
| ------------ | -------------- | ------------------------------------- |
| Hero         | 1              | pin + scrub                           |
| Atmosphere   | 1              | scrub (background color)              |
| Editorial    | 3–5            | one-shot (heading, body, stat, image) |
| Crane        | 1              | pin + scrub (long)                    |
| Truck        | 1–2            | pin/enter + position                  |
| Services     | 2–3            | enter + stagger                       |
| Wipe         | 1              | pin + scrub                           |
| Ship         | 1              | pin + scrub                           |
| Aircraft     | 1              | pin + scrub                           |
| Testimonials | 2–4            | enter (per testimonial)               |
| **TOTAL**    | **~14–22**     | —                                     |
