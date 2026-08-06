# 09 — Background Evolution

**Project**: 3D Atlas  
**Purpose**: Document every background state — color, gradient, canvas, image, shader — across the full experience

---

## Background System Architecture

The page uses a **layered background system**:

- Layer 0 (lowest): CSS `body` or wrapper `background-color`
- Layer 1: Section-specific WebGL canvas (transparent)
- Layer 2: DOM section backgrounds (solid or transparent)
- Layer 3: Overlay divs (transition panels, wipe elements)

Sections can have `background: transparent` to let the lower layer show through.

---

## Background State Timeline

| State | Time         | Color                       | Type       | Active Layer                   |
| ----- | ------------ | --------------------------- | ---------- | ------------------------------ |
| BG-01 | `0.0–2.2s`   | `#080808`                   | Solid      | Body CSS                       |
| BG-02 | `2.2–3.0s`   | Gradient                    | Multi-stop | Overlay div / body             |
| BG-03 | `2.75–3.5s`  | `#F5F4F0`                   | Solid      | Section div                    |
| BG-04 | `3.5–5.5s`   | `#FFFFFF`                   | Solid      | Canvas transparent + white DOM |
| BG-05 | `5.5–7.0s`   | `#111111`                   | Solid      | Services section               |
| BG-06 | `7.0–7.9s`   | `#FFFFFF` + `#111111` panel | Composite  | Wipe section                   |
| BG-07 | `7.9–10.4s`  | `#133D77`                   | Solid      | Ship section                   |
| BG-08 | `10.4–11.0s` | Sky gradient                | Procedural | Aircraft canvas                |
| BG-09 | `10.9–12.0s` | `#F5F4F0`                   | Solid      | Testimonials section           |

---

## BG-01 — Space Black (Hero)

**Active**: `0.0s → 2.2s`

| Property       | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Color          | `#080808`                                                |
| Type           | Solid flat color                                         |
| Implementation | `body { background-color: #080808; }` or hero section    |
| Transparency   | None                                                     |
| WebGL on top   | YES — globe canvas is transparent, shows this background |

### Notes

Near-black with a VERY slight blue tint. Not pure `#000000`. The blue tint comes from the WebGL scene ambient (`#04040a`) showing through the transparent canvas — the canvas background is transparent, so the DOM background is what shows as "space."

---

## BG-02 — Atmospheric Gradient (Transition)

**Active**: `~2.2s → 3.0s`

### Gradient Stop Analysis (from KF-03 frame)

```css
background: linear-gradient(
  to bottom,
  #080808 0%,
  /* Space black */ #0a1040 15%,
  /* Deep space-blue */ #0f2a80 30%,
  /* Upper atmosphere (deep blue) */ #1a5ec8 45%,
  /* Mid atmosphere (electric blue) */ #4a9ae0 58%,
  /* Lower atmosphere (sky blue) */ #8ac8f0 70%,
  /* Upper troposphere (light sky) */ #c8e8f8 80%,
  /* Near surface (very light blue) */ #f5f4f0 100% /* Ground level (off-white) */
);
```

### Evolution

The gradient is NOT static — it evolves as scroll progresses:

- At scroll 0% of this section: gradient is fully dark (only top 2 stops visible at top)
- At scroll 100%: gradient is fully resolved to `#F5F4F0`

This creates the "descending through atmosphere" sensation.

### Implementation Approach

```
Option A: Animate background-position of a tall gradient
  - Create gradient 200vh tall
  - Scroll moves it upward (backgroundPositionY: 0 → -100vh)

Option B: Animate individual gradient stop colors via CSS custom properties
  - Use GSAP to update CSS variables
  - background: linear-gradient(--stop1, --stop2, ...) in CSS

Option C: Use GSAP to lerp between two distinct solid colors
  - Simpler but loses the multi-band atmosphere effect

Option A is most likely — provides the layered atmosphere effect naturally.
```

---

## BG-03 — Editorial Off-White

**Active**: `~2.75s → 3.5s`

| Property             | Value                                     |
| -------------------- | ----------------------------------------- |
| Color                | `#F5F4F0`                                 |
| Hex components       | R=245, G=244, B=240                       |
| Warmth               | Warm off-white — slight yellow/beige tint |
| Luminance            | ~96%                                      |
| Type                 | Solid flat color                          |
| Implementation       | Section `background-color: #F5F4F0`       |
| Same as testimonials | YES — identical background color          |

### Contrast Ratio

- Black text `#111111` on `#F5F4F0` = ~15:1 — excellent readability

---

## BG-04 — White (Crane & Truck Scenes)

**Active**: `~3.5s → 5.5s`

| Property         | Value                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| Crane section BG | `#FFFFFF`                                                                              |
| Truck section BG | `#FAFAF8` (very slightly warm, or same as `#FFFFFF`)                                   |
| Type             | Solid white                                                                            |
| 3D Canvas        | Transparent (THREE.js `renderer.setClearColor(0, 0)` or CSS `background: transparent`) |
| Effect           | 3D models appear to float on white paper                                               |

### Canvas Transparency Setup

```
The canvas element must have:
  canvas { background: transparent; }

THREE.js renderer:
  renderer.setClearAlpha(0)
  renderer.setClearColor(0x000000, 0)
  renderer.alpha = true (in constructor)
```

This allows the white DOM background to show through the transparent canvas.

---

## BG-05 — Dark Services Grid

**Active**: `~5.5s → 7.0s`

| Property       | Value                               |
| -------------- | ----------------------------------- |
| Color          | `#111111`                           |
| Hex components | R=17, G=17, B=17                    |
| Type           | Near-black solid                    |
| Luminance      | ~4.4%                               |
| Implementation | Section `background-color: #111111` |

### KF-10 Frame Analysis

The dark background has a hard horizontal edge where it meets the white truck section above. No blur, no fade — hard cut. This is achieved by the DOM layout — the dark section simply scrolls up from below.

---

## BG-06 — Wipe Panel Composite

**Active**: `~7.0s → 7.9s`

### Layers (bottom to top)

| Layer | Content                                   | Z-index |
| ----- | ----------------------------------------- | ------- |
| 0     | White `#FFFFFF` — full viewport           | 0       |
| 1     | Ship section beginning (deep blue, below) | 0       |
| 2     | Black vertical center panel               | 10      |

### White Areas (Left and Right of Panel)

| Area                         | Color     | Content           |
| ---------------------------- | --------- | ----------------- |
| Left (~35% viewport)         | `#FFFFFF` | Word shuffle text |
| Right (~35% viewport)        | `#FFFFFF` | Feature label     |
| Center panel (~30% viewport) | `#111111` | None (empty)      |

### Panel Proportions at KF-12

- Panel left edge: ~35% from left
- Panel right edge: ~65% from left
- Panel width: ~30% of viewport
- Panel height: 100vh

---

## BG-07 — Ocean Blue (Container Ship)

**Active**: `~7.9s → 10.4s`

| Property       | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Color          | `#133D77` (estimated from KF-13)                           |
| Hue            | 215°                                                       |
| Saturation     | 70%                                                        |
| Lightness      | 27%                                                        |
| Type           | Solid flat color (THREE.js scene background)               |
| Implementation | `scene.background = new THREE.Color('#133D77')`            |
| WebGL          | THREE.js canvas fills viewport — no DOM background visible |

### Color Verification (F0068 pixel analysis)

The background in F0068 is:

- Blue, saturated, dark — deep ocean blue
- Consistent across the entire frame
- No gradient — flat solid color

### Color Evolution Within Scene

The background color remains constant throughout the ship section — camera movement (zoom in/out) does not change the background color.

---

## BG-08 — Sky Gradient (Aircraft)

**Active**: `~10.4s → 11.0s`

### Sky Composition

| Band        | Color                                   | Portion |
| ----------- | --------------------------------------- | ------- |
| Upper sky   | `hsl(215, 50%, 35%)` — deep blue-purple | Top 30% |
| Mid sky     | `hsl(205, 40%, 55%)` — medium blue      | 30–50%  |
| Near clouds | `hsl(195, 20%, 80%)` — pale blue-white  | 50–70%  |
| Clouds      | `#FFFFFF` with slight transparency      | 60–100% |

### Implementation Options

| Option | Description                                                                             |
| ------ | --------------------------------------------------------------------------------------- |
| A      | `<Sky>` component from `@react-three/drei` with custom turbidity, rayleigh, inclination |
| B      | Custom gradient skybox mesh                                                             |
| C      | Background gradient CSS (unlikely — 3D canvas is opaque)                                |

**Most likely**: Option A (Drei `<Sky>`) — commonly used in React-Three-Fiber applications for exactly this type of atmospheric sky.

### Drei `<Sky>` Parameters (Estimated)

```
turbidity: 8
rayleigh: 0.5
mieCoefficient: 0.005
mieDirectionalG: 0.8
inclination: 0.4 (sun below horizon — overcast/cloudy feel)
azimuth: 0.25
```

---

## BG-09 — Testimonials Off-White

**Active**: `~10.9s → 12.0s` (end)

| Property        | Value                                                    |
| --------------- | -------------------------------------------------------- |
| Color           | `#F5F4F0`                                                |
| Type            | Solid (same as editorial BG-03)                          |
| Aircraft canvas | Overlaps from above, but DOM div covers most of viewport |
| Implementation  | Section `background-color: #F5F4F0`                      |

### Red Accent Element

In KF-17/KF-18, a small red accent bar is visible near the testimonials heading area (top-right area or below heading). This is a DOM element:

- Color: `#CC0000` or similar red
- Width: ~50–80px
- Height: ~3–4px (thin horizontal line)
- Position: Adjacent to heading

---

## Background Color Palette (Complete)

| Code  | Color              | Hex                      | Section                 |
| ----- | ------------------ | ------------------------ | ----------------------- |
| BG-01 | Space Black        | `#080808`                | Hero                    |
| BG-03 | Warm Off-White     | `#F5F4F0`                | Editorial, Testimonials |
| BG-04 | Pure White         | `#FFFFFF`                | Crane, Truck            |
| BG-05 | Near Black         | `#111111`                | Services                |
| BG-06 | Wipe White + Panel | `#FFFFFF` / `#111111`    | Wipe                    |
| BG-07 | Ocean Blue         | `#133D77`                | Ship                    |
| BG-08 | Sky (procedural)   | `hsl(215,50%,35%)→white` | Aircraft                |

---

## Background Transition Methods

| Transition    | Method                                      | Duration     |
| ------------- | ------------------------------------------- | ------------ |
| BG-01 → BG-02 | GSAP scroll-scrubbed gradient animation     | ~0.5s scroll |
| BG-02 → BG-03 | Gradient resolves to solid (same animation) | ~0.3s scroll |
| BG-03 → BG-04 | Section change — barely perceptible         | Instant      |
| BG-04 → BG-05 | Dark section rises from below (DOM scroll)  | ~0.6s scroll |
| BG-05 → BG-06 | Section change — white appears immediately  | ~0.3s scroll |
| BG-06 → BG-07 | Ship section revealed below wipe            | ~0.2s scroll |
| BG-07 → BG-08 | THREE.js scene background interpolation     | ~0.3s scroll |
| BG-08 → BG-09 | DOM testimonials section covers canvas      | ~0.4s scroll |

---

## Visual Contrast Map

```
BG-01 #080808 (near-black) ←→ White text — MAXIMUM contrast
BG-02 Gradient             ←→ No text
BG-03 #F5F4F0 (off-white)  ←→ Black text — near-maximum contrast
BG-04 #FFFFFF (white)      ←→ 3D models (no text)
BG-05 #111111 (near-black) ←→ White text — MAXIMUM contrast
BG-06 #FFFFFF (wipe)       ←→ Black text (left + right)
BG-07 #133D77 (ocean blue) ←→ White text/labels
BG-08 Sky (mid-blue)       ←→ No text (pure 3D)
BG-09 #F5F4F0 (off-white)  ←→ Black text — testimonials
```
