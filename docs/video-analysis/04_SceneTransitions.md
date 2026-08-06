# 04 — Scene Transitions

**Project**: 3D Atlas  
**Focus**: Every transition between scenes — type, mechanism, duration, and implementation approach

---

## Transition Index

| ID  | From            | To              | Type                                   | Video Time | Mechanism                                                      |
| --- | --------------- | --------------- | -------------------------------------- | ---------- | -------------------------------------------------------------- |
| T01 | Hero            | Atmosphere      | Camera Pull-Back + BG Gradient         | `00:02.2`  | Scroll-driven camera Z + CSS background lerp                   |
| T02 | Atmosphere      | Editorial       | BG Color Dissolve                      | `00:02.5`  | CSS background interpolation                                   |
| T03 | Editorial       | Reach Stacker   | Scroll Reveal / Content Overlap        | `00:03.3`  | Crane appears from bottom of editorial section                 |
| T04 | Reach Stacker   | Truck           | 3D Object Morph / Container Continuity | `00:05.3`  | Container held by crane transforms into truck trailer          |
| T05 | Truck           | Services Grid   | Horizontal Split (DOM Wipe)            | `00:05.8`  | Hard horizontal cut — white top / dark bottom expanding upward |
| T06 | Services Grid   | Wipe Transition | Scroll-based reveal                    | `00:07.0`  | Black panel grows from center                                  |
| T07 | Wipe Transition | Container Ship  | Vertical Reveal + Color Flood          | `00:07.7`  | Blue ocean floods from bottom as wipe completes                |
| T08 | Container Ship  | Aircraft        | Blue → Sky Color Shift                 | `00:10.4`  | Background color interpolation + camera angle change           |
| T09 | Aircraft        | Testimonials    | 3D Overlap + Content Reveal            | `00:10.9`  | Aircraft persists while editorial content slides in from left  |

---

## T01 — Hero → Atmosphere

**Type**: Camera Pull-Back + Background Gradient Animation  
**Start**: `00:02.2` | **End**: `00:02.7`  
**Duration**: ~0.5s video / ~1s real scroll

### Visual Description

The Earth globe exits the top of the viewport as if the camera is ascending away from it. Simultaneously, the background color transitions from near-black to a gradient showing the Earth's atmospheric layers — deep navy at top, electric blue band in middle, off-white at bottom.

### Mechanism

```
Camera Z: 5 → 8 (moving backward from globe)
Background: interpolates across gradient stages
  Stage 1: #080808 (space)
  Stage 2: #0a1a50 (exosphere)
  Stage 3: #1a5ec8 (atmosphere)
  Stage 4: #60a0e0 (stratosphere)
  Stage 5: #f5f4f0 (surface)
```

### Scroll Driver

- ScrollTrigger pinned section, `scrub: 1`
- Globe canvas alpha fades simultaneously (optional)
- Background color animation uses GSAP `to()` with scrub

### Transition Feel

Cinematic descent — inspired by films like Gravity or Interstellar establishing shots.

---

## T02 — Atmosphere → Editorial

**Type**: Background Color Dissolve / Gradient Completion  
**Start**: `00:02.5` | **End**: `00:02.7`  
**Duration**: ~0.2s video

### Visual Description

The atmospheric blue gradient fully resolves to off-white. No 3D objects. The editorial section content begins to enter from the bottom of the viewport as user continues scrolling.

### Mechanism

```
Background completes: → #F5F4F0 (off-white)
Editorial section DOM: position: relative, scrolls normally into view
Text animations: triggered on element entering viewport
```

### Notes

This is the smoothest, most seamless transition — it appears to be simply the background color completing its animation and the standard-scroll editorial section beginning to enter frame.

---

## T03 — Editorial → Reach Stacker

**Type**: Content Overlap Scroll / Pinned Section Entry  
**Start**: `00:03.3` | **End**: `00:03.9`  
**Duration**: ~0.6s video

### Visual Description

As the user scrolls through the editorial section, the bottom of the viewport begins to reveal the crane canvas — the white background of the crane section appears below the editorial content. The crane model comes into view from the bottom of the screen as the editorial section scrolls upward off the top.

In frame 0028, the boom arm of the crane is already partially visible at the bottom of the frame while the editorial section content is still in the upper half. This suggests the crane section begins before the editorial fully exits.

### Mechanism

```
Editorial section: standard scroll, exits top
Reach stacker section: position: sticky; top: 0
  → appears immediately below editorial, then "pins" once it reaches viewport top
Canvas background: white (matches editorial transition — seamless)
```

### Transition Feel

Invisible / seamless. White-on-white transition. The crane just appears as if the editorial reveals it below.

---

## T04 — Reach Stacker → Truck

**Type**: 3D Object Narrative Continuity (Container Transform)  
**Start**: `00:05.3` | **End**: `00:05.5`  
**Duration**: ~0.2s video (instantaneous transition)

### Visual Description

**This is the most cinematically clever transition in the entire experience.**

The reach stacker crane ends its animation with the boom arm horizontal, holding a 40ft ISO container suspended in the air (frame 0040). On the next section, the semi-truck appears with that exact same 40ft container now mounted on its trailer.

The visual implication: "The crane placed the container ON the truck."

This creates a narrative continuity — it's not a transition at all, it's a story beat. The same container that the crane was holding is now the cargo on the truck.

### Mechanism

```
Crane canvas: exits viewport (section scroll completes)
Truck canvas: enters viewport from below
OR
Crane canvas: crane lowers container off-screen bottom
Truck canvas: truck enters frame from bottom-right with container
```

The exact mechanism (whether the crane canvas literally hands off to the truck canvas, or whether it's simply a visual match-cut) is:

- **UNKNOWN** — requires live site inspection
- Most likely: Two separate canvases with visual match-cut (white bg continuity)

### Transition Feel

Narrative / storytelling. Feels like a single continuous operation.

---

## T05 — Truck → Services Grid

**Type**: Horizontal Split Wipe (DOM)  
**Start**: `00:05.8` | **End**: `00:06.4`  
**Duration**: ~0.6s video

### Visual Description

As the user scrolls, the viewport splits horizontally:

- **Top half**: The truck (on white background) remains visible, appears to move upward
- **Bottom half**: Dark background (#111111) rises from the bottom of the screen, containing the services grid

The transition line is a hard horizontal cut — no blur or fade. The truck model straddles this line during the transition moment.

Simultaneously, a word-shuffle animation plays in the bottom dark section:
`"EVERYTHING" / "YOUR" / "FREIGHT" / "NEEDS" / "UNDER" / "ONE" / "GROUP"` — words cycling rapidly in the top area of the dark section.

### Mechanism

```
Truck section: white bg, truck canvas top
Services section: dark bg, scrolls up from below
Truck 3D canvas: continues rendering as truck exits viewport top
OR
Truck is positioned at top of services section wrapper (straddling the line)
Word shuffle: GSAP stagger timeline triggered on section enter
```

### CSS Approach

```css
.services-section {
  background: #111111;
  /* The truck canvas overlaps from above via negative margin or absolute positioning */
}
.truck-canvas-wrapper {
  position: sticky;
  /* Exits viewport top as services section scrolls into view */
}
```

### Transition Feel

Dramatic. Industrial. Like a factory floor split-screen reveal.

---

## T06 — Services Grid → Wipe Transition

**Type**: Scroll Entry / Content Overlap  
**Start**: `00:07.0` | **End**: `00:07.3`  
**Duration**: ~0.3s video

### Visual Description

The services grid section exits and the wipe transition panel begins to appear. The black vertical center panel starts growing from the center of a white background.

The white background of the wipe section appears as if the page has scrolled back to a white section — stark contrast to the dark services grid above.

### Mechanism

```
Services section: exits viewport top (standard scroll)
Wipe section: enters viewport, white background
Black panel: begins at 0% width and grows outward using clip-path or width animation
```

---

## T07 — Wipe Panel → Container Ship

**Type**: Vertical Reveal + Flood Fill (Color Transition)  
**Start**: `00:07.7` | **End**: `00:08.0`  
**Duration**: ~0.3s video

### Visual Description

As the wipe panel animation completes, the blue ocean section begins to flood up from the bottom of the viewport. The deep blue color appears below the white wipe section, then expands to fill the full viewport.

In frame 0064, the transition is mid-way: the top ~55% is still the wipe panel (white + black panel), and the bottom ~45% shows the blue background with colorful ship containers beginning to appear.

### Mechanism

```
Wipe section: scroll-pinned, exits top (or panel animation completes)
Ship section: enters from below with #133D77 background
The wipe panel collapses or sections scroll to reveal ship below
```

### Transition Feel

A dramatic "reveal" — like a curtain being pulled up to reveal the ocean below.

---

## T08 — Container Ship → Aircraft

**Type**: Background Color Shift + Scene Crossfade  
**Start**: `00:10.4` | **End**: `00:10.7`  
**Duration**: ~0.3s video

### Visual Description

The deep blue ocean background transitions to a lighter blue-purple sky color. The ship model fades/exits and is replaced by clouds and sky. The aircraft appears in the center of frame as the clouds resolve.

### Mechanism

```
Ship canvas: fades out / exits
Sky background: interpolates from #133D77 (ocean blue) → #4a6080 (sky) → cloud volume
Aircraft canvas: fades in with clouds
Background: The transition appears to be scroll-driven background color animation
```

### Key Observation

In frame 0084, the aircraft is tiny and centered — it appears to be VERY far from the camera. This suggests the scene begins with the camera very far from the aircraft and scrolling drives a camera zoom-in toward it.

### Transition Feel

Atmospheric. The ocean blue evolves into sky blue — same blue spectrum, different elevation.

---

## T09 — Aircraft → Testimonials

**Type**: 3D Overlay / Content Slide-In  
**Start**: `00:10.9` | **End**: `00:11.2`  
**Duration**: ~0.3s video

### Visual Description

The aircraft persists in the background while the testimonials content slides in from the left. The off-white background of the testimonials section begins to overlay the sky/cloud background.

In frame 0088: Aircraft visible top-right, testimonials heading "TRUSTED BY BUSINESSES ACROSS APAC" visible left side.

This creates a beautiful overlap: the aircraft appears to fly into the testimonials section, then gradually exit frame right as the user scrolls deeper into the testimonials.

### Mechanism

```
Aircraft canvas: persists as background (z-index lower than testimonials DOM)
Testimonials section: off-white background overlays from bottom
Aircraft 3D model: continues moving (banking) while testimonials content covers it
Eventually: aircraft exits viewport as testimonials section fully covers the area
```

### Transition Feel

Poetic. The aircraft "arrives" and the trust/testimonials content appears behind it — as if the aircraft has delivered the clients.

---

## Transition Design Patterns Summary

| Pattern                     | Used In       | GSAP Method                                        |
| --------------------------- | ------------- | -------------------------------------------------- |
| Camera Z pull-back (scroll) | T01           | ScrollTrigger scrub → `camera.position.z`          |
| CSS background color lerp   | T01, T02, T08 | GSAP `to(section, { backgroundColor })` with scrub |
| Clip-path horizontal split  | T05           | `clip-path: inset(0 0 X% 0)` expanding             |
| Vertical center panel grow  | T06           | Width animation or `clip-path: inset(0 X% 0 X%)`   |
| 3D canvas alpha fade        | T08, T09      | GSAP `to(canvas, { opacity })`                     |
| Narrative match-cut         | T04           | No animation — visual design only                  |
| Sticky section reveal       | T03, T07      | CSS `position: sticky` + scroll                    |
