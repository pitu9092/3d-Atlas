# 11 — Scroll Behavior

---

## Scroll Engine

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Engine**       | Lenis (confirmed by visual quality of scroll)                |
| **Type**         | Smooth scroll with inertia                                   |
| **Orientation**  | Vertical only                                                |
| **Snap**         | None observed                                                |
| **Overall feel** | Heavy, premium, deliberate — slow inertia with ~1.2s damping |

---

## Total Scroll Length

| Estimate                      | Value                                                             |
| ----------------------------- | ----------------------------------------------------------------- |
| **Approximate total scroll**  | 600–900vh                                                         |
| **Number of pinned sections** | ~5–6                                                              |
| **Reference video duration**  | ~12 seconds                                                       |
| **Scroll speed in video**     | Fast scroll for demo purposes — real user would take 5–10 minutes |

---

## Section-by-Section Scroll Behavior

### Section 1 — Globe Hero (Pinned)

- **Type**: Pinned section with sticky canvas
- **Height**: ~150vh (section is taller than viewport)
- **Scroll range**: 0 → 150vh
- **Behavior**: Content sticks while scroll drives camera pull-back and globe animation
- **Pin method**: `position: sticky; top: 0` on inner canvas container, OR GSAP ScrollTrigger `pin: true`
- **Scrub**: Yes — camera movement tied to scroll progress

### Section 2 — Atmosphere Transition

- **Type**: Scrubbed transition
- **Height**: ~50vh
- **Scroll range**: 150vh → 200vh
- **Behavior**: Background color interpolates from space-black to sky-blue to off-white
- **Scrub**: Yes

### Section 3 — Editorial Statement

- **Type**: Standard scroll with ScrollTrigger reveals
- **Height**: ~100vh (auto, content-height based)
- **Behavior**: Text animates in when element enters viewport
- **Trigger**: "top 80%" of viewport
- **Scrub**: No (one-shot animation, not scrubbed)

### Section 4 — Reach Stacker (Pinned, Long)

- **Type**: Very long pinned section
- **Height**: ~350–400vh (long to allow full crane animation sequence)
- **Scroll range**: ~250vh → ~600vh
- **Behavior**: Canvas sticks. Scroll progress drives crane animation frames
- **Scrub**: 1:1 with scroll, no damping on 3D animation
- **Pin method**: GSAP `pin: true` OR CSS `position: sticky`

### Section 5 — Truck

- **Type**: Pinned or scrubbed
- **Height**: ~100–150vh
- **Scroll range**: ~600vh → ~700vh
- **Behavior**: Truck slides/appears. Scene transitions into services grid.
- **Scrub**: Partial

### Section 6 — Services Grid

- **Type**: Standard scroll
- **Height**: ~80–100vh
- **Behavior**: Feature cards stagger in on scroll
- **Trigger**: "top 75%"

### Section 7 — Container Ship (Pinned)

- **Type**: Pinned section
- **Height**: ~150–200vh
- **Scroll range**: ~700vh → ~850vh
- **Behavior**: Ship section sticks. Labels appear sequentially. Camera may zoom.
- **Scrub**: Yes

### Section 8 — Wipe Transition (Pinned briefly)

- **Type**: Pinned, scrubbed
- **Height**: ~80–100vh
- **Scroll range**: ~850vh → ~920vh
- **Behavior**: Wipe panel animates in and out
- **Scrub**: Yes — wipe progress tied to scroll

### Section 9 — Aircraft (Pinned)

- **Type**: Pinned
- **Height**: ~150vh
- **Scroll range**: ~920vh → ~1050vh
- **Behavior**: Aircraft scene revealed. Camera moves.
- **Scrub**: Yes

### Section 10 — Testimonials

- **Type**: Standard scroll
- **Height**: ~80–100vh (content-height)
- **Behavior**: Headline and testimonial reveal on scroll
- **Scrub**: No

---

## ScrollTrigger Configuration Patterns

### Pattern A: One-shot entrance animation

```javascript
gsap.from(element, {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power4.out',
  scrollTrigger: {
    trigger: element,
    start: 'top 80%',
    once: true, // trigger only once
  },
})
```

### Pattern B: Pinned section with scrub

```javascript
gsap.to(craneAnimation, {
  progress: 1,
  ease: 'none',
  scrollTrigger: {
    trigger: craneSection,
    start: 'top top',
    end: '+=400%', // 4× viewport height scroll
    pin: true,
    scrub: 1,
  },
})
```

### Pattern C: Background color transition

```javascript
gsap.to(body, {
  backgroundColor: '#f8f7f4',
  scrollTrigger: {
    trigger: atmosphereSection,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
})
```

---

## Horizontal Scroll

**None observed.** The experience is fully vertical. No horizontal scroll panels detected.

---

## Nested Scroll

**None observed.** No scrollable containers within sections.

---

## Scroll Speed Modifiers

- **Lenis duration**: ~1.2s (standard premium setting)
- **Lenis easing**: Exponential `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
- No deliberate speed reduction on specific sections

---

## Scroll Progress Indicators

**None visible** — No scrollbar, progress bar, or section indicators observed in reference.
