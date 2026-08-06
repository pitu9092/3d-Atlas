# 10 — Transition Blueprint

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Every scene transition — technique, timing, implementation, and dependencies

---

## Transition Index

| ID    | Name                    | Type                        | From       | To                 |
| ----- | ----------------------- | --------------------------- | ---------- | ------------------ |
| TR-01 | Hero → Atmosphere       | Background gradient scrub   | Globe Hero | Atmosphere Descent |
| TR-02 | Atmosphere → Editorial  | Background resolution       | Atmosphere | Editorial          |
| TR-03 | Editorial → Crane       | White-on-white scroll       | Editorial  | Crane              |
| TR-04 | Crane → Truck           | Match-cut object continuity | Crane      | Truck              |
| TR-05 | Truck → Services        | Dark section DOM rise       | Truck      | Services Grid      |
| TR-06 | Services → Wipe         | Background inversion        | Services   | Wipe Panel         |
| TR-07 | Wipe → Ship             | Blue flood fill from below  | Wipe       | Container Ship     |
| TR-08 | Ship → Aircraft         | Background color shift      | Ship       | Aircraft           |
| TR-09 | Aircraft → Testimonials | 3D canvas z-index overlap   | Aircraft   | Testimonials       |

---

## TR-01 — Hero → Atmosphere

### Type

Background gradient animation driven by scroll scrub

### Duration

Scroll: `150vh → 210vh` (60vh of scroll = ~0.5s at normal speed)

### Start State (at 150vh scroll)

```
Background: #080808 solid
Globe: at max pull-back position (Z=7.0), fading
Hero DOM text: scrolled above viewport
```

### End State (at 210vh scroll)

```
Background: #F5F4F0 solid
Globe: GONE
Editorial content: beginning to enter viewport
```

### Implementation

```
Method A (recommended): Fixed overlay div
  <div class="atmosphere-overlay" style="
    position: fixed;
    inset: 0;
    z-index: -1;
    background: [gradient];
    pointer-events: none;
  ">

  ScrollTrigger animates:
    opacity: 0 → 1 (as hero exits)
    Then the editorial section's #F5F4F0 background reveals below

Method B: Animate document.body background
  GSAP ScrollTrigger changes body background from:
    "#080808" → multi-stop gradient → "#F5F4F0"
```

### Gradient Stop Colors (in order, top to bottom)

```
Stop 1: #080808 (0%)
Stop 2: #0a1040 (15%)
Stop 3: #0f2a80 (30%)
Stop 4: #1a5ec8 (45%)
Stop 5: #4a9ae0 (58%)
Stop 6: #8ac8f0 (70%)
Stop 7: #c8e8f8 (80%)
Stop 8: #F5F4F0 (100%)
```

### Dependencies

- Globe camera must complete its Z pull-back before this fires
- Hero text must be fully out of viewport

---

## TR-02 — Atmosphere → Editorial

### Type

Seamless scroll (no explicit transition — BG resolves naturally)

### Duration

~30vh of scroll

### Implementation

```
The atmosphere gradient resolves to #F5F4F0.
The editorial section (background: #F5F4F0) is directly below.
As the gradient completes its animation, the editorial section's
background takes over — perfectly matched color.

No explicit GSAP animation needed — layout handles this.
```

### Risk

If font rendering causes the atmosphere gradient section to have the wrong height, the editorial section may not align. Ensure the atmosphere section height is explicitly set or calculate via JavaScript.

---

## TR-03 — Editorial → Crane

### Type

White-on-white scroll (near-invisible transition)

### Duration

Instantaneous (frame-exact)

### Implementation

```
Editorial background: #F5F4F0 (warm off-white)
Crane canvas background: transparent (shows white DOM behind it)
Section below editorial: white, crane canvas visible

The color difference (#F5F4F0 vs #FFFFFF) is ~4% brightness.
To make fully seamless: set editorial bottom section to #FFFFFF
  or transition editorial's background to #FFFFFF over its last 20vh.
```

### Crane Canvas Activation Trigger

```
ScrollTrigger:
  trigger: .crane-section
  start: "top 80%"
  onEnter: () => cranCanvas.classList.add('active')

.crane-canvas { display: none; }
.crane-canvas.active { display: block; }
```

---

## TR-04 — Crane → Truck (Match-Cut)

### Type

Object narrative continuity — visual match-cut

### Duration

The cut happens as crane section exits and truck section enters — approximately 1 scroll tick.

### Crane Final State (Must Match Truck Initial State)

```
Container size: 40ft ISO, ~40% viewport width
Container color: light grey-silver
Container orientation: horizontal
Container viewport position: left-center, ~40% from top, ~20% from left

Truck initial state:
Container (trailer): same proportions, same horizontal position
```

### Implementation

```
There is no animation between crane and truck.
The crane section simply exits the viewport.
The truck section enters from below.

To maximize the match-cut:
  1. Ensure truck section starts at the TOP of the viewport (no padding above truck)
  2. Ensure truck's container is positioned at the same viewport coordinates as crane's
  3. Ensure identical container proportions between the two models
```

### Possible Enhancement (NOT in reference — do not implement unless confirmed)

```
A CSS "morph" transition where the crane container seamlessly becomes the truck container.
This is NOT visible in the reference — skip.
```

---

## TR-05 — Truck → Services Grid

### Type

DOM section rise — dark background floods up from below

### Duration

~100vh of scroll (the dark services section rises over 100vh)

### Implementation

```
CSS approach (recommended):
  Services section has background: #111111
  Services section scrolls up naturally from below the truck section

  As user scrolls:
    t=0: Truck section occupies full viewport
    t=50vh: Truck section at top 50%, services dark section visible bottom 50%
    t=100vh: Truck section fully above viewport, services full

  No explicit GSAP needed — natural CSS scroll behavior
```

### Word Shuffle Trigger

```
ScrollTrigger:
  trigger: .services-section
  start: "top 80%"
  once: true
  onEnter: () => fireWordShuffle()
```

### Truck Canvas Deactivation

```
ScrollTrigger:
  trigger: .truck-section
  start: "top top"
  onLeave: () => deactivateTruckCanvas()
  (canvas frameloop = "demand")
```

---

## TR-06 — Services → Wipe Panel

### Type

Background inversion (dark `#111111` → white `#FFFFFF`) + vertical panel grow

### Duration

~80vh of scroll

### Implementation

```
Wipe section:
  background: #FFFFFF
  position: sticky; top: 0; height: 100vh

Black panel:
  position: absolute
  left: 50%; transform: translateX(-50%)
  width: 0; height: 100%;
  background: #111111

ScrollTrigger:
  trigger: .wipe-wrapper
  scrub: 1
  onUpdate: (self) =>
    panelWidth = Math.min(self.progress × (100/0.6), 100) + '%'
    panel.style.width = panelWidth × 0.5  ← max 50% of viewport
```

### Text Positions

```
Left text (word shuffle):
  position: absolute
  left: var(--space-xl)  ← ~80px from left
  top: 50%; transform: translateY(-50%)
  z-index: 1 (above panel)
  color: #111111

Right text (feature label):
  position: absolute
  right: var(--space-xl)
  top: 50%; transform: translateY(-50%)
  z-index: 1
  color: #111111
```

---

## TR-07 — Wipe Panel → Container Ship

### Type

Ship section reveals from below as wipe panel exits

### Duration

The wipe panel's pin ends → ship section immediately visible

### Implementation

```
The wipe section occupies 180vh (pinned).
When the pin ends (scroll past 180vh of wipe),
the ship section (which is directly below in DOM) becomes visible.

Ship section has background: none (THREE.js sets scene.background to #133D77)

The reveal is dramatic because of the color contrast:
  White wipe → Deep ocean blue ship

To enhance: add a brief blue overflow from the bottom of the wipe section
  as the pin approaches its end:

  When wipe progress > 0.85:
    Show a blue gradient at the bottom of the wipe section
    Fade from transparent to #133D77 over the last 50px
```

---

## TR-08 — Container Ship → Aircraft

### Type

Background color shift + canvas swap

### Duration

~0.3s scroll (fast transition — both sections are large, so proportionally fast)

### Implementation

```
Ship section's THREE.js background is #133D77 (opaque solid fill).
When ship section exits, aircraft section's canvas reveals.

Aircraft canvas has a procedural sky (Drei <Sky>) — no explicit background color.
The sky transitions from:
  Ship section exiting (deep blue) → Sky color (blue-purple)

The sky's blue top matches the ship's blue background closely enough
for a seamless-feeling transition.

No explicit transition animation needed — natural scroll.
```

---

## TR-09 — Aircraft → Testimonials (3D Overlap)

### Type

3D canvas persists while DOM slides over it

### Duration

~0.5s (fast overlap)

### Implementation

```
Aircraft section canvas: z-index: 0, position: absolute
Testimonials section: z-index: 1, position: relative, background: #F5F4F0

As testimonials section scrolls up:
  1. Testimonials background covers aircraft canvas
  2. Aircraft canvas visible only where testimonials hasn't covered yet
  3. This creates the "aircraft above the content" overlap effect

Because testimonials section enters from the bottom:
  Aircraft appears top-right as testimonials text enters bottom-left

This requires:
  Aircraft canvas: { position: fixed; inset: 0; z-index: 0 }
  OR: aircraft section has overflow: visible
  AND: testimonials section has position: relative, z-index: 1
```

---

## Transition Quality Checklist

| Transition | Smoothness Target      | Frame Budget |
| ---------- | ---------------------- | ------------ |
| TR-01      | Zero perceptible steps | Linear scrub |
| TR-02      | Invisible              | Color match  |
| TR-03      | Seamless               | Color match  |
| TR-04      | Match-cut quality      | 1 frame      |
| TR-05      | Smooth rise            | 60fps scroll |
| TR-06      | Cinematic inversion    | 60fps scroll |
| TR-07      | Dramatic reveal        | 60fps scroll |
| TR-08      | Natural continuation   | 60fps scroll |
| TR-09      | Poetic overlap         | 60fps scroll |
