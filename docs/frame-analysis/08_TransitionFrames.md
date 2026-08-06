# 08 — Transition Frames

**Project**: 3D Atlas  
**Purpose**: Document every visual transition — frame-by-frame entry, mid, and exit states

---

## Transition Index

| ID    | Name                    | Type                           | Start KF | End KF | Duration (video) |
| ----- | ----------------------- | ------------------------------ | -------- | ------ | ---------------- |
| TR-01 | Hero → Atmosphere       | Camera Z + BG color            | KF-02    | KF-03  | ~0.5s            |
| TR-02 | Atmosphere → Editorial  | BG completion + scroll         | KF-03    | KF-04  | ~0.3s            |
| TR-03 | Editorial → Crane       | Section enter (white-on-white) | KF-05    | KF-06  | ~0.5s            |
| TR-04 | Crane → Truck           | Object narrative continuity    | KF-08    | KF-09  | ~0.5s            |
| TR-05 | Truck → Services        | Horizontal split rise          | KF-09    | KF-10  | ~0.6s            |
| TR-06 | Services → Wipe         | BG flip (dark→white)           | KF-11    | KF-12  | ~1.0s            |
| TR-07 | Wipe → Ship             | Flood fill (blue from below)   | KF-12    | KF-13  | ~0.9s            |
| TR-08 | Ship → Aircraft         | BG color shift (blue→sky)      | KF-15    | KF-16  | ~0.5s            |
| TR-09 | Aircraft → Testimonials | 3D overlap + content slide     | KF-16    | KF-17  | ~0.5s            |

---

## TR-01 — Hero → Atmosphere

**Type**: Camera Z pull-back + Background gradient animation  
**Video time**: `~2.0s → 2.5s`

### Frame States

**Entry Frame** (KF-02, t=1.96s):

```
• Globe visible, smaller than initial
• Background: #080808 solid
• Hero text still visible
• Scroll: ~40% of hero pin
```

**Mid-Frame** (t=~2.2s):

```
• Globe partially exiting top of viewport
• Background BEGINS gradient shift: #080808 → #0a1040
• Blue band starting to appear top area
• Hero text at top edge of viewport
```

**Peak Frame** (KF-03, t=2.46s):

```
• Globe: GONE (exited viewport)
• Background: Full gradient (#080808 → #1a5ec8 → #8ac0e8 → #f0ecec)
• Electric blue band occupies middle 40% of viewport
• Off-white bottom 15% showing editorial beginning
• Editorial body copy just visible (bottom-right)
```

**Exit Frame** (t=~2.7s):

```
• Gradient resolving to mostly off-white
• Editorial content clearly entering
• Blue atmospheric band now only top 20%
• Transition completing
```

### Frame-by-Frame Gradient Analysis (Top→Bottom)

| Time  | Top 30%   | Mid 40%   | Lower 15% | Bottom 15% |
| ----- | --------- | --------- | --------- | ---------- |
| 2.0s  | `#080808` | `#080808` | `#080808` | `#0a0a20`  |
| 2.2s  | `#080808` | `#0a1040` | `#1a3060` | `#3060a0`  |
| 2.46s | `#080808` | `#1a5ec8` | `#8ac0e8` | `#f0ecec`  |
| 2.75s | `#0a1040` | `#6ab0e0` | `#e0eef8` | `#F5F4F0`  |
| 2.9s  | `#4080c0` | `#d0e8f8` | `#F5F4F0` | `#F5F4F0`  |
| 3.0s  | `#F5F4F0` | `#F5F4F0` | `#F5F4F0` | `#F5F4F0`  |

### Implementation

The gradient bands sweep from bottom to top as user scrolls. This is achieved via:

1. A full-viewport absolutely-positioned div
2. `background: linear-gradient(...)` applied to this div
3. The gradient's stops animate via GSAP with scroll scrub

OR alternatively: multiple layered divs each fading from opacity 0→1 in sequence.

---

## TR-02 — Atmosphere → Editorial

**Type**: Background color resolution + content scroll  
**Video time**: `~2.7s → 2.9s`

### Frame States

**Entry** (t=2.7s):

```
• Background: still partially blue at top
• Editorial H2: just entering from bottom
• Highway photo thumbnail: bottom-left
• Stats: not yet visible
```

**Exit** (KF-04, t=2.75s):

```
• Background: #F5F4F0 (complete)
• H2 text: in viewport, clip-path animation beginning
• Photo: visible
```

### Notes

This is the smoothest, most imperceptible transition in the experience. The color resolves naturally with the scroll, and the editorial content simply enters from below.

---

## TR-03 — Editorial → Crane

**Type**: White-on-white seamless entry  
**Video time**: `~3.5s → 3.7s`

### Frame States

**Entry**:

```
• Editorial text at upper portion, scrolling off
• Bottom of viewport: beginning to show white crane canvas
```

**Exit** (KF-06, t=3.63s):

```
• Editorial: completely gone
• Crane canvas: full viewport, pure white
• Crane model: visible with initial pose
```

### Why It's Seamless

Editorial section background = `#F5F4F0` (very light off-white)  
Crane canvas background = `#FFFFFF` (pure white)  
The difference is minimal (~4% brightness difference). User doesn't perceive a scene change — just content scrolling away and the crane appearing.

---

## TR-04 — Crane → Truck

**Type**: Narrative match-cut (object continuity)  
**Video time**: `~5.1s → 5.3s`

### Frame States

**Crane final state** (KF-08, t=4.71s):

```
• Background: pure white
• Crane at far left, holding container horizontally
• Container: ~40ft, white, horizontal below boom, center-left
• Container apparent dimensions: fills ~40% viewport width
```

**Transition gap** (t=5.1s → 5.3s):

```
UNKNOWN — how the switch happens mechanically
Options:
  A: Crane canvas fades out, truck canvas fades in (cross-fade)
  B: Crane section exits viewport, truck section enters immediately below
  C: The crane LOWERS the container which morphs into a truck
Most likely: OPTION B — two separate sticky sections
```

**Truck entry state** (KF-09, t=5.33s):

```
• Background: off-white (slightly warmer than crane's pure white)
• Truck: fully visible, side profile
• Container: now truck's cargo trailer
```

### Visual Match-Cut Analysis

| Dimension            | Crane Container  | Truck Container |
| -------------------- | ---------------- | --------------- |
| Width (viewport %)   | ~40%             | ~45%            |
| Color                | Light grey-white | Silver-white    |
| Position (from left) | ~15%             | ~5%             |
| Position (from top)  | ~40%             | ~35%            |
| Orientation          | Horizontal       | Horizontal      |

Close enough for the eye to read as "same container."

---

## TR-05 — Truck → Services Grid

**Type**: Horizontal DOM split — dark section rising  
**Video time**: `~5.7s → 6.2s`

### Frame States

**Pre-transition** (KF-09, t=5.33s):

```
• Full viewport white
• Truck centered
```

**Entry of transition** (t=5.7s):

```
• Dark section begins appearing from BOTTOM of viewport
• White section (truck) still occupies top 80%
• Dark section only 20% height — just entering
```

**KF-10** (t=5.96s):

```
• Split 35% white (top) / 65% dark (bottom)
• Truck in upper white area
• Word shuffle "EVERYTHING COUR / FREIGHT NEEDS..." in dark area
• Pill button visible in dark area
```

**Exit of transition** (KF-11, t=6.38s):

```
• Dark section: ~95% of viewport
• Truck: barely visible at very top
• Services grid: fully revealed
• Word shuffle: settled on final text
```

### Split Line Position

```
t=5.7s: 80% from top (dark section is 20% tall)
t=5.96s: 35% from top (dark section is 65% tall)
t=6.38s: 5% from top (dark section is 95% tall)
```

Movement rate: ~53% of viewport per 0.68s video time = fast transition.

### Implementation Options

**Option A (Clip-path)**:

```css
.services-section {
  clip-path: inset(100% 0 0 0);
  /* animates to inset(0 0 0 0) */
}
```

**Option B (Position sticky)**:

```
Services section scrolls normally from below.
Truck section exits top.
Their natural scroll positions create the split effect.
```

Option B is more likely — it's the simpler approach and produces identical visual results.

---

## TR-06 — Services Grid → Wipe Panel

**Type**: Background inversion (dark → white) + panel grow  
**Video time**: `~7.0s → 7.4s`

### Frame States

**Services exit**:

```
• Dark #111111 background scrolling off
• Services grid content exiting top of viewport
```

**Wipe entry** (t=7.0s):

```
• White #FFFFFF background appearing
• Black panel at 0% width (not yet visible)
```

**KF-12** (t=7.38s):

```
• Full white background
• Black panel: ~30% viewport width, full height, centered
• Left text: "RELIABILITY / AT EVERY / MILESTONE..." — shuffling
• Right text: "REAL-TIME FREIGHT TRACKING" — visible
• Bottom: blue ocean just beginning to peek
```

### Wipe Panel Grow Animation (from observation)

The panel grows from center outward — not from left edge.

```
t=7.0s: panel width = 0%
t=7.38s: panel width = ~30%
t=7.7s: panel width = ~50% (peak, estimated)
t=7.9s: panel begins to exit as ship reveals
```

### Implementation

```css
/* Panel centered, grows outward */
.wipe-panel {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 0%; /* animates to ~50% */
  height: 100vh;
  background: #111111;
}
```

Width animation driven by GSAP ScrollTrigger scrub.

---

## TR-07 — Wipe Panel → Container Ship

**Type**: Blue flood fill from below  
**Video time**: `~7.7s → 8.1s`

### Frame States

**Pre-reveal** (t=7.7s):

```
• Wipe panel at peak (~50% width)
• White background visible on sides
• Ship section NOT YET visible
```

**Mid-reveal** (t=7.85s, approx 8fps F0064):

```
• Split: top 55% white+black panel, bottom 45% deep blue + containers
• Ship top portion visible at bottom of frame
• Blue ocean color visible
```

**Ship entry** (KF-13, t=8.29s):

```
• Full deep blue background
• Ship fully visible
• Wipe panel: GONE (scrolled off or faded)
```

### Blue Flood Mechanics

As the wipe section scrolls off, the ship section (with its deep blue background) is revealed from below. This is a standard CSS scroll reveal — the ship section simply appears below the wipe section.

The dramatic appearance of blue is because:

1. Ship background is a strong, saturated color (`#133D77`)
2. It contrasts maximally with the white wipe background
3. The reveal happens relatively quickly

---

## TR-08 — Container Ship → Aircraft

**Type**: Background color shift (ocean blue → sky blue/purple)  
**Video time**: `~10.2s → 10.5s`

### Frame States

**Ship exit**:

```
• Deep blue #133D77 background
• Ship visible, feature labels
```

**Transition** (t=10.3s):

```
• Background: blue interpolating from ocean blue toward sky blue-purple
• Ship: fading out OR simply scrolled off
• Clouds: beginning to appear
```

**Aircraft entry** (KF-16, t=10.38s):

```
• Background: blue-purple sky gradient (#2a3a6e → #6080b0 → white clouds)
• Ship: GONE
• Aircraft: tiny in center, emerging from clouds
• Clouds: large formations visible
```

### Color Interpolation

```
Ocean blue: #133D77 → #1A4A8A → #2D5898 → #4A6080 → sky-purple #2a3a6e
```

The blue changes in hue (from saturated navy → purple-grey sky) AND lightens.

---

## TR-09 — Aircraft → Testimonials

**Type**: 3D canvas overlap + DOM content reveal  
**Video time**: `~10.7s → 11.2s`

### Frame States

**Aircraft only** (KF-16, t=10.38s):

```
• Sky background full
• Aircraft tiny in center
• No testimonials content
```

**Overlap state** (KF-17, t=10.88s):

```
• Off-white DOM background entering from bottom/left
• Aircraft still visible (right side, now larger)
• "TRUSTED BY BUSINESSES ACROSS APAC" heading appearing left
• Aircraft and testimonials coexist in same frame
```

**Testimonials dominant** (KF-18, t=11.38s):

```
• Off-white background: full viewport or dominant
• Aircraft: fading/gone (right edge)
• Testimonials: fully loaded, client cards, quotes
```

### Overlap Mechanism (Confirmed from frame analysis)

The aircraft 3D canvas has a LOWER z-index than the testimonials DOM content. As the testimonials section scrolls into view:

1. The off-white background of the testimonials section covers the sky
2. The aircraft canvas may persist BEHIND the testimonials text
3. The aircraft appears visible only where the testimonials background is NOT yet covering it

This creates the beautiful "aircraft delivering the client" narrative overlap.

---

## Transition Comparison Table

| Transition           | Visual Drama           | Mechanism        | Smoothness        |
| -------------------- | ---------------------- | ---------------- | ----------------- |
| TR-01 Hero→Atmo      | HIGH (color change)    | Gradient scrub   | Smooth            |
| TR-02 Atmo→Edit      | LOW (invisible)        | Color completes  | Very smooth       |
| TR-03 Edit→Crane     | LOW (white→white)      | Sticky section   | Seamless          |
| TR-04 Crane→Truck    | MEDIUM (match-cut)     | Section swap     | Visual continuity |
| TR-05 Truck→Services | HIGH (split wipe)      | Dark rising      | Dramatic          |
| TR-06 Services→Wipe  | HIGH (inversion)       | BG flip + panel  | Cinematic         |
| TR-07 Wipe→Ship      | VERY HIGH (blue flood) | Color reveal     | Dramatic          |
| TR-08 Ship→Aircraft  | MEDIUM (color shift)   | BG interpolation | Smooth            |
| TR-09 Aircraft→Test  | HIGH (3D overlap)      | Canvas z-index   | Poetic            |
