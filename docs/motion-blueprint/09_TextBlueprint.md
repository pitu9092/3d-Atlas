# 09 — Text Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Complete text animation system — mask reveal, word shuffle, counters, and stagger patterns

---

## Text Animation System Overview

| Pattern                     | Usage                        | Complexity |
| --------------------------- | ---------------------------- | ---------- |
| Clip-path line reveal       | H1, H2, Testimonials H2      | Medium     |
| Fade + translateY           | Body copy, buttons, labels   | Low        |
| Count-up                    | Stats (2 500+, 98.2%, 8+)    | Low-Medium |
| Word shuffle (slot machine) | Services entry, Wipe panel   | Medium     |
| Direct fade                 | Ship overlay, feature labels | Low        |
| Scale reveal                | Red accent bar               | Low        |

---

## PATTERN 01 — Clip-Path Line Reveal

Used for: H1 (Hero), H2 (Editorial), H2 (Testimonials)

### Mechanism

```
DOM Structure:
<span class="line-wrapper">     ← overflow: hidden, display: block
  <span class="line-text">      ← animation target
    EVERY                       ← content
  </span>
</span>
```

### CSS Requirements

```css
.line-wrapper {
  overflow: hidden;
  display: block;
  line-height: 1; /* match parent heading line-height */
}

.line-text {
  display: block;
  will-change: transform;
}
```

### GSAP Setup

```
Initial state: { yPercent: 100 }  — text below overflow boundary
Animated to:   { yPercent: 0 }   — text at natural position
Ease: "power4.out"
Duration: 0.9s (H1), 0.8s (H2), 0.7s (testimonials)
Stagger: 0.12s (H1), 0.1s (H2/testimonials)
```

### SplitText Alternative

If `gsap/SplitText` is available:

```
SplitText.create(".hero-headline", { type: "lines" })
SplitText automatically wraps each line in a <div>
Then animate the .line elements with yPercent: 100→0
```

If NOT available, manually identify line breaks based on viewport width and inject wrappers.

### Font-Loading Safety

Do NOT start clip-path animations until fonts are loaded:

```
document.fonts.ready.then(() => {
  startLoadTimeline()
})
```

Fonts affect line-breaking — wrong font = wrong line counts = broken animation.

---

## PATTERN 02 — Fade + TranslateY

Used for: Eyebrow, Body copy, Buttons, Feature labels, Photo thumbnails

### GSAP Setup

```
Initial state: { opacity: 0, y: 16 }
Animated to:   { opacity: 1, y: 0 }
Ease: "power2.out"
Duration: 0.6s (body), 0.5s (buttons), 0.4s (labels)
```

### CSS Requirements

```css
.fade-element {
  will-change: transform, opacity;
}
```

### Accessibility Note

Elements with `opacity: 0` are still accessible to screen readers. Consider `aria-hidden="true"` on the initial state if needed, removing it on animation complete.

---

## PATTERN 03 — Stat Count-Up

Used for: 2 500+, 98.2%, 8+

### Counter Object

```
Counter pattern:
  Animate a plain JS object: { value: 0 }
  In onUpdate callback: format and write to DOM

For "2 500+":
  End value: 2500
  Format: Intl.NumberFormat('fr-FR').format(Math.round(value)) + '+'
  Expected output: "2 500+"

For "98.2%":
  End value: 98.2
  Format: value.toFixed(1) + '%'
  Expected output: "98.2%"

For "8+":
  End value: 8
  Format: Math.round(value) + '+'
  Expected output: "8+"
```

### Settings

| Property      | Value                                     |
| ------------- | ----------------------------------------- |
| Duration      | `1.8s` (2500), `1.5s` (98.2%), `0.8s` (8) |
| Ease          | `"power2.out"`                            |
| ScrollTrigger | `once: true, start: "top 70%"`            |

### Performance

Run all 3 counters simultaneously (same trigger). No stagger needed.

---

## PATTERN 04 — Word Shuffle (Slot Machine)

Used for: Services section entry, Wipe panel text

### Mechanism Description

```
1. Target: final string, split into individual characters
2. On trigger: for each character, cycle through random chars for N frames
3. Settle: reveal final character at staggered timing

Visual result: text appears to "decrypt" into its final value
```

### Character Cycle Spec

```
Character pool: A-Z, 0-9 (uppercase only — matches brand aesthetic)
Frames per character: 4–6 cycles before settling
Cycle speed: 80ms per cycle
Settle stagger: i × 30ms (each character settles slightly later)
Total duration: ~6 cycles × 80ms + (charCount × 30ms) ≈ 0.5–0.9s depending on text length
```

### Services Entry Text (3 lines)

```
Line 1: "EVERYTHING YOUR"     — 14 characters
Line 2: "FREIGHT NEEDS."      — 14 characters
Line 3: "UNDER ONE GROUP."    — 16 characters

Spaces remain static (no cycling on spaces)
Periods remain static
Total animated chars: ~35–40
```

### Wipe Panel Text (4 lines, scrub-driven)

```
Line 1: "RELIABILITY"
Line 2: "AT EVERY"
Line 3: "MILESTONE"
Line 4: [secondary word that resolves]

Trigger: Wipe scroll progress > 0.15
Behavior: May cycle continuously between related words rather than settling
Word list per line:
  Line 1: RELIABILITY → ACCOUNTABILITY → VISIBILITY → (back)
  Line 2: AT EVERY → THROUGHOUT → ON EVERY
  Line 3: MILESTONE → CHECKPOINT → SHIPMENT
  Line 4: MILESTONE → DELIVERY → SHIPMENT
```

---

## PATTERN 05 — Direct Fade-In

Used for: "LOGISTICS THAT WORKS AS HARD AS YOU DO." (Ship overlay), Feature labels

### GSAP Setup

```
Initial state: { opacity: 0 }
Animated to:   { opacity: 1 }
Ease: "power3.out"
Duration: 0.5s
No translateY — pure opacity transition
```

### Ship Text Overlay Spec

| Property                | Value                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| Show at scroll progress | `> 0.38`                                                           |
| Hide at scroll progress | `> 0.57`                                                           |
| Show animation          | `opacity: 0→1`, duration `0.5s`                                    |
| Hide animation          | `opacity: 1→0`, duration `0.3s`                                    |
| Position                | `position: absolute; bottom: 20%; width: 100%; text-align: center` |

### Ship Feature Labels (×3)

| Property                | Value                              |
| ----------------------- | ---------------------------------- |
| Show at scroll progress | `> 0.62`                           |
| Animation               | `opacity: 0→1`, `duration: 0.5s`   |
| Stagger                 | `0.15s` between labels             |
| One-shot                | Use boolean flag to fire once only |

---

## Navbar Text Theme Switching

### Mechanism

CSS class swap triggered by ScrollTrigger markers.

### Class Definitions

```css
.navbar {
  transition: color 0.3s ease;
}

.navbar.theme-light {
  color: #111111;
  /* any logo/icon should also switch */
}

.navbar.theme-dark {
  color: #ffffff;
}
```

### Theme Per Section

| Section       | Theme Class          |
| ------------- | -------------------- |
| Globe Hero    | `theme-dark`         |
| Atmosphere    | `theme-dark` (brief) |
| Editorial     | `theme-light`        |
| Crane / Truck | `theme-light`        |
| Services      | `theme-dark`         |
| Wipe          | `theme-light`        |
| Ship          | `theme-dark`         |
| Aircraft      | `theme-dark`         |
| Testimonials  | `theme-light`        |

### ScrollTrigger Implementation

```
For each section boundary:
  ScrollTrigger({
    trigger: section,
    start: "top top",
    end: "bottom top",
    onEnter: () => navbar.className = "navbar theme-[X]",
    onLeaveBack: () => navbar.className = "navbar theme-[prev]"
  })
```

---

## Custom Cursor (Ring Cursor)

### Description (from video analysis)

- Thin white circle, ~40px diameter
- No fill
- Tracks mouse position
- Seen in KF-01 and other frames

### Implementation

```
DOM element: <div class="cursor-ring">
CSS: fixed, pointer-events: none, z-index: 9999
Animation: GSAP to() tracking mouse X/Y with slight lag

mousemove handler:
  gsap.to('.cursor-ring', {
    x: e.clientX - 20,
    y: e.clientY - 20,
    duration: 0.15,
    ease: "power2.out"
  })
```

---

## Typography Specifications

### Font Weights Used

| Weight          | Usage                                   |
| --------------- | --------------------------------------- |
| `900` (Black)   | H1, H2, Stats                           |
| `700` (Bold)    | Ship overlay text, service titles       |
| `500` (Medium)  | Eyebrow, nav links                      |
| `400` (Regular) | Body copy, testimonials, feature labels |

### Font Size Scale

| Element               | Size       | Weight  |
| --------------------- | ---------- | ------- |
| H1 hero               | `88–104px` | 900     |
| H2 editorial          | `64–72px`  | 900     |
| H2 testimonials       | `64–72px`  | 900     |
| Services word shuffle | `40–48px`  | 900     |
| Stats                 | `80–96px`  | 900     |
| Body copy             | `15–17px`  | 400     |
| Stat labels           | `12–13px`  | 500     |
| Feature labels        | `12–14px`  | 600–700 |
| Eyebrow               | `12–14px`  | 500     |
| Nav links             | `13px`     | 500     |

### Line Heights

| Type      | Line Height               |
| --------- | ------------------------- |
| Headlines | `0.95–1.0` (tight)        |
| Body copy | `1.65–1.75` (comfortable) |
| Labels    | `1.3`                     |
| Quotes    | `1.7`                     |

### Letter Spacing

| Type           | Tracking                                                  |
| -------------- | --------------------------------------------------------- |
| Eyebrow        | `0.15em`                                                  |
| Feature labels | `0.10em`                                                  |
| Service titles | `0.08em`                                                  |
| Body copy      | `0`                                                       |
| Headlines      | `-0.02em` (slight negative — common for large black type) |
