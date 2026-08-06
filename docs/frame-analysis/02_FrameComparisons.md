# 02 — Frame Comparisons

**Project**: 3D Atlas  
**Purpose**: Delta analysis — what changed between consecutive keyframes, and what stayed the same  
**Format**: KF-[prev] → KF-[next]

---

## Comparison 01: KF-01 → KF-02

**Hero Static → Hero Scroll State**  
**Time delta**: 0.50s | **Scroll delta**: ~35–45vh

| Element               | KF-01 State                  | KF-02 State                       | Change                            |
| --------------------- | ---------------------------- | --------------------------------- | --------------------------------- |
| Globe size (apparent) | ~55% viewport width          | ~45% viewport width               | Decreased ~18% — camera pull-back |
| Globe Y rotation      | ~30° (Australia upper-right) | ~35° (Australia slightly rotated) | +5° Y rotation (continuous spin)  |
| Atmosphere glow       | Bright blue rim              | Same brightness                   | No change                         |
| Thermal glow          | Orange, upper hemisphere     | Same                              | No change                         |
| Route network         | Visible                      | Same                              | No change                         |
| H1 text               | Fully visible                | Fully visible                     | No change                         |
| CTA buttons           | Visible                      | Visible                           | No change                         |
| Background            | `#080808`                    | `#080808`                         | No change                         |

### Animation Direction

Camera moving backward (positive Z direction)  
Globe continuing Y-axis rotation

### Estimated Duration

~0.5s scroll (fast demo scroll)

### Ease

Linear (scroll-scrubbed, no ease)

### Implementation Note

`camera.position.z` animated via ScrollTrigger scrub. Globe `rotation.y` increments in `useFrame`.

---

## Comparison 02: KF-02 → KF-03

**Hero Scroll → Atmosphere Gradient**  
**Time delta**: 0.50s | **Change**: Complete scene transition

| Element           | KF-02 State     | KF-03 State            | Change                      |
| ----------------- | --------------- | ---------------------- | --------------------------- |
| Globe             | Visible, small  | GONE                   | Exited viewport             |
| Background        | `#080808` solid | Multi-band gradient    | DRAMATIC — color transition |
| 3D canvas         | Active (globe)  | None                   | Canvas deactivated          |
| H1 text           | Visible         | GONE                   | Scrolled off top            |
| CTA buttons       | Visible         | GONE                   | Scrolled off top            |
| Editorial content | Not visible     | Just entering (bottom) | Content entering viewport   |

### What Changed

- Everything visual has changed
- Single most dramatic visual shift in the experience

### Animation Direction

Background gradient sweeping: dark → blue → light, top-to-bottom sequence

### Estimated Duration

~0.5s video (~1s real scroll)

### Ease

Linear scrub

### Implementation Note

`document.body` or wrapper div background transitions through color stops. The hero WebGL canvas alpha fades OR the hero section simply exits the viewport and the atmosphere section's background color becomes dominant.

---

## Comparison 03: KF-03 → KF-04

**Atmosphere Gradient → Editorial Full**  
**Time delta**: 0.29s

| Element       | KF-03 State                 | KF-04 State                   | Change                     |
| ------------- | --------------------------- | ----------------------------- | -------------------------- |
| Background    | Blue gradient band dominant | `#F5F4F0` off-white           | Gradient resolved to white |
| H2 text       | Not visible                 | Visible (entering from below) | Text entered viewport      |
| Stats         | Not visible                 | Partially visible             | Entering                   |
| Highway photo | Tiny, bottom-left           | Visible                       | In frame                   |
| 3D canvas     | None                        | None                          | No change                  |

### What Changed

Background color completed its transition to off-white. Editorial DOM content scrolled into the viewport.

### Ease

The background color completion appears to be linear with the scroll. The text animations (H2 reveal) are one-shot on entry.

---

## Comparison 04: KF-04 → KF-05

**Editorial Entry → Stats Visible**  
**Time delta**: 0.33s

| Element       | KF-04 State                  | KF-05 State   | Change               |
| ------------- | ---------------------------- | ------------- | -------------------- |
| H2 text       | Entering (partially visible) | Fully visible | Completed reveal     |
| Stat "2 500+" | Not visible                  | Fully visible | Counter completed    |
| Stat "98.2%"  | Not visible                  | Visible       | Second stat entering |
| Highway photo | Partially visible            | Fully visible | In frame             |
| Background    | Off-white                    | Off-white     | No change            |

### KEY DISCOVERY

**Three stats confirmed**: `2 500+` and `98.2%` visible simultaneously. Layout suggests stats are stacked vertically in the right column. As user scrolls, the first stat moves up and the second enters. This means there are at minimum **2–3 stacked stat pairs** in the right column.

### Stat Layout Estimate

```
Right column (top to bottom):
  [body copy paragraph 1]
  [body copy paragraph 2]
  [divider line]
  2 500+ [label: "DELIVERIES PER YEAR" or similar]
  [divider line]
  98.2% [label: "ON-TIME DELIVERY RATE"]
  [divider line]
  8+ [label: "YEARS OF OPERATION" — from 8fps F0028]
```

### Animation Direction

Stats count up when entering viewport. Scroll moves content upward.

---

## Comparison 05: KF-05 → KF-06

**Editorial → Crane Scene**  
**Time delta**: 0.55s

| Element        | KF-05 State         | KF-06 State             | Change                   |
| -------------- | ------------------- | ----------------------- | ------------------------ |
| Background     | Off-white `#F5F4F0` | Pure white `#FFFFFF`    | Slight warm → pure white |
| Editorial text | Visible             | GONE                    | Exited viewport          |
| Stats          | Visible             | GONE                    | Exited viewport          |
| 3D canvas      | None                | Crane + containers      | WebGL canvas appeared    |
| Crane          | Not visible         | Fully visible           | New 3D object            |
| Boom angle     | N/A                 | ~40° (initial position) | Starting position        |

### What Changed

Complete scene swap. The off-white editorial background transitions to the pure white crane canvas background. The continuity between them is almost seamless — both sections use a near-white background.

### Implementation Note

Editorial section exits. Crane section enters (sticky). Canvas begins rendering when section enters viewport.

---

## Comparison 06: KF-06 → KF-07

**Crane Initial → Container Apex**  
**Time delta**: 0.50s | **Scroll equivalent**: ~25–30% of crane pin section

| Element             | KF-06 State             | KF-07 State                  | Change              |
| ------------------- | ----------------------- | ---------------------------- | ------------------- |
| Boom angle          | ~40°                    | ~50°                         | +10° rotation       |
| Container (held)    | Not picked up yet       | At apex of lift              | Container raised    |
| Container stack top | White container present | White container GONE         | Removed from stack  |
| Stack height        | 3 high                  | 2 high                       | Reduced by 1        |
| Spreader            | Not attached            | Attached + holding container | Latch state changed |
| Crane body position | Center-left             | Slightly more left           | Small lateral shift |

### Animation Direction

- Boom: rotating counterclockwise (upward, viewed from right)
- Container: moving upward (Y+)
- Spreader: extended upward with boom

### Estimated Ease

Linear (scrub-driven, 1:1 with scroll)

---

## Comparison 07: KF-07 → KF-08

**Container Apex → Horizontal Carry**  
**Time delta**: 0.58s | **Scroll equivalent**: ~30–40% of crane section

| Element              | KF-07 State            | KF-08 State                    | Change                                     |
| -------------------- | ---------------------- | ------------------------------ | ------------------------------------------ |
| Crane position X     | Center                 | Far left (~15% from left edge) | ~35% viewport shift left                   |
| Boom angle           | ~50°                   | ~10° (nearly horizontal)       | -40° rotation                              |
| Container height     | At apex (top of frame) | Lower (below boom, horizontal) | Y-position decreased                       |
| Container Z rotation | Vertical               | Horizontal                     | Rotated ~80° around boom pivot             |
| Container stack      | Right side             | Far right edge                 | Moved with scroll or stayed in world space |

### Animation Direction

Crane body: X- (leftward)  
Boom: rotating clockwise (dropping down to horizontal)  
Container: following boom arc, settling into horizontal carry position

### This is the Transition Keyframe

At the end of this state, the container held horizontally by the crane matches the container on the truck that appears next.

---

## Comparison 08: KF-08 → KF-09

**Crane Carry → Truck Scene**  
**Time delta**: 0.62s

| Element             | KF-08 State           | KF-09 State                      | Change                  |
| ------------------- | --------------------- | -------------------------------- | ----------------------- |
| Background          | Pure white            | Off-white                        | Slight color shift      |
| Crane               | Visible, far left     | GONE                             | Canvas transition       |
| Container (hanging) | Horizontal below boom | Same shape, now on truck trailer | Narrative continuity    |
| Truck               | Not visible           | Fully visible                    | New 3D object           |
| Truck cab           | N/A                   | Dark charcoal, right             | Appeared                |
| Boom                | Horizontal            | N/A (gone)                       | Replaced by truck frame |

### Visual Match-Cut Analysis

The horizontal container in KF-08 (held by crane) has approximately the same:

- Width: both fill ~40% of viewport
- Position: both center-left of frame
- Height: both positioned at ~40% from top

This is a **deliberate visual match-cut** — same container, new context.

---

## Comparison 09: KF-09 → KF-10

**Truck Full → Services Split**  
**Time delta**: 0.63s

| Element           | KF-09 State     | KF-10 State                        | Change                          |
| ----------------- | --------------- | ---------------------------------- | ------------------------------- |
| Background top    | Off-white       | Off-white                          | No change                       |
| Background bottom | Off-white       | `#111111` dark                     | Dark section rising             |
| Truck             | Center viewport | Top 35%                            | Moved upward                    |
| Services text     | Not visible     | Shuffling text visible             | "EVERYTHING YOUR FREIGHT NEEDS" |
| Split line        | None            | Hard horizontal line ~35% from top | New boundary                    |

### Animation Direction

Dark background rising from bottom. Truck content moves toward top of viewport.

### Implementation Note

The dark `#111111` section background is revealed as the services section scrolls up from below. The truck 3D canvas straddles the split line — it appears above the split but the canvas itself may extend below, masked by the dark DOM element.

---

## Comparison 10: KF-10 → KF-11

**Services Split → Full Services Grid**  
**Time delta**: 0.42s

| Element         | KF-10 State | KF-11 State           | Change                |
| --------------- | ----------- | --------------------- | --------------------- |
| Dark section    | Bottom 65%  | Full viewport         | Dark expanded to fill |
| Word shuffle    | Mid-cycle   | Settled               | Animation completing  |
| Service columns | Not visible | All 5 columns visible | Grid entered viewport |
| Truck           | Top 35%     | Just exiting at top   | Moving off screen     |

---

## Comparison 11: KF-11 → KF-12

**Services Grid → Wipe Panel**  
**Time delta**: 1.00s

| Element               | KF-11 State    | KF-12 State                      | Change               |
| --------------------- | -------------- | -------------------------------- | -------------------- |
| Background            | Dark `#111111` | White `#FFFFFF`                  | Complete inversion   |
| Service grid          | Visible        | GONE                             | Section exited       |
| Black panel           | None           | Center vertical strip ~30% wide  | New element appeared |
| Word shuffle (left)   | None           | "RELIABILITY/AT EVERY/MILESTONE" | New text             |
| Feature label (right) | None           | "REAL-TIME FREIGHT TRACKING"     | New text             |
| Blue ocean            | Not visible    | Beginning to peek at bottom      | Ship section below   |

### What Changed

Complete background inversion (dark → light) AND a new vertical black panel animating in center.

---

## Comparison 12: KF-12 → KF-13

**Wipe Panel → Ship Full View**  
**Time delta**: 0.91s

| Element        | KF-12 State         | KF-13 State               | Change                  |
| -------------- | ------------------- | ------------------------- | ----------------------- |
| Background     | White + black panel | Deep ocean blue `#133D77` | Complete color change   |
| Black panel    | Present             | GONE                      | Wipe completed          |
| Word shuffle   | Active              | GONE                      | Section exited          |
| Container ship | Not visible         | Fully visible, aerial     | Appeared                |
| Water foam     | Not visible         | Active around hull        | Particle system running |
| Cursor         | Not clear           | Ring cursor visible left  | Active                  |

---

## Comparison 13: KF-13 → KF-14

**Ship Initial → Ship Zoomed + Text**  
**Time delta**: 1.09s | **Scroll equivalent**: ~40–50% of ship pin

| Element      | KF-13 State          | KF-14 State               | Change             |
| ------------ | -------------------- | ------------------------- | ------------------ |
| Ship size    | ~40% viewport height | ~60% viewport height      | +50% apparent size |
| Camera Y     | `~20 units`          | `~10 units`               | Moved 50% closer   |
| Text overlay | None                 | "LOGISTICS THAT WORKS..." | Appeared           |
| Water foam   | Active               | Active                    | No change          |
| Background   | Deep blue            | Deep blue                 | No change          |

### Animation Direction

Camera: downward (Y-) in aerial top-down view = zoom-in toward ship

---

## Comparison 14: KF-14 → KF-15

**Ship Zoomed → Feature Labels**  
**Time delta**: 0.50s

| Element        | KF-14 State               | KF-15 State          | Change               |
| -------------- | ------------------------- | -------------------- | -------------------- |
| Ship size      | ~60% viewport height      | ~25% viewport height | Camera pulled back   |
| Text overlay   | "LOGISTICS THAT WORKS..." | GONE or fading       | Exited               |
| Feature labels | None                      | 3 labels around ship | Appeared             |
| Camera Y       | `~10 units`               | `~20 units`          | Pulled back to start |

---

## Comparison 15: KF-15 → KF-16

**Ship Features → Aircraft Emergence**  
**Time delta**: 0.50s

| Element    | KF-15 State     | KF-16 State             | Change                |
| ---------- | --------------- | ----------------------- | --------------------- |
| Background | Deep ocean blue | Blue-purple sky         | Complete color change |
| Ship       | Visible         | GONE                    | Scene transition      |
| Water foam | Active          | None                    | Deactivated           |
| Aircraft   | None            | Tiny (3% size)          | Appeared in center    |
| Clouds     | None            | Volumetric white clouds | Appeared              |

---

## Comparison 16: KF-16 → KF-17

**Aircraft Far → Aircraft Close + Testimonials**  
**Time delta**: 0.50s

| Element              | KF-16 State  | KF-17 State                                    | Change                    |
| -------------------- | ------------ | ---------------------------------------------- | ------------------------- |
| Aircraft size        | ~3% viewport | ~25% viewport                                  | 8× larger — dramatic zoom |
| Background           | Full sky     | Partially sky (top-right), partially off-white | Testimonials overlapping  |
| Testimonials heading | None         | "TRUSTED BY BUSINESSES ACROSS APAC"            | Appeared                  |
| Aircraft tail        | Not readable | Clear red livery                               | Closer                    |

### Camera Analysis

The aircraft went from 3% to 25% size in ~0.5s of video (which represents a longer scroll). This suggests the camera was very far away (large Z value) and moved significantly closer, or the aircraft was moving toward the camera.

---

## Comparison 17: KF-17 → KF-18

**Testimonials Entry → Full Testimonials**  
**Time delta**: 0.50s

| Element      | KF-17 State             | KF-18 State              | Change                |
| ------------ | ----------------------- | ------------------------ | --------------------- |
| Aircraft     | Partially visible right | Fading/mostly gone       | Exiting               |
| Background   | Mixed sky/off-white     | Pure off-white `#F5F4F0` | Testimonials dominant |
| H2 heading   | Appearing               | Fully visible            | Animation complete    |
| Client cards | Not visible             | 2 clients visible        | Content entered       |
| Quote text   | Not visible             | Long quotes visible      | Content in frame      |
