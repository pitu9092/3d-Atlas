# 08 — Layer Hierarchy

## z-index Stack (estimated, lowest to highest)

```
z-index: -1     → WebGL Canvas / R3F background scenes
z-index: 0      → Page sections (standard document flow)
z-index: 1      → Section content (text, images within sections)
z-index: 10     → Transition overlay panels (wipe panels)
z-index: 20     → Section overlays (atmospheric gradients)
z-index: 50     → Fixed navbar
z-index: 100    → Fixed custom cursor
```

---

## Scene-by-Scene Layer Structure

### Scene 1 — Globe Hero

```
Layer 0 (z: -1): THREE.js Canvas — full-viewport, position: fixed OR absolute
  └─ Scene: Globe Mesh
     ├─ Earth sphere (dark material)
     ├─ Atmosphere mesh (additive blending, Fresnel shader)
     ├─ Thermal glow mesh (orange, additive)
     ├─ Route network (LineSegments or Points)
     └─ Location pin (Sprite or Mesh)

Layer 1 (z: 0): Section background (pure black div)

Layer 2 (z: 1): Hero content overlay
  ├─ Eyebrow text
  ├─ H1 (3 line-reveal wrappers)
  ├─ Body copy
  └─ CTA buttons (2)

Layer 50 (z: 50): Navbar (fixed)
  ├─ Logo
  ├─ Nav links
  └─ CTA button

Layer 100 (z: 100): Custom cursor div
```

### Scene 4 — Reach Stacker

```
Layer 0 (z: -1 or 0): THREE.js Canvas — full-viewport
  └─ Scene:
     ├─ Reach stacker model (GLB)
     ├─ Container stack models (GLB or children)
     └─ Environment (minimal — no HDR, just directional light)

Layer 1 (z: 1): White background div
  └─ (no text overlay in this scene)

Layer 50: Navbar
Layer 100: Cursor
```

### Scene 7 — Container Ship

```
Layer 0: THREE.js Canvas OR CSS background
  └─ Ocean blue background (color fill)

Layer 1: THREE.js Canvas — ship model
  └─ Container ship GLB (top-down view)

Layer 2: Water effect overlay
  └─ Either: particle system rendered in Three.js,
     OR: CSS/canvas water ripple overlay

Layer 3: Feature label divs (positioned absolutely around ship)
  ├─ Top-left label (HTML div)
  ├─ Top-right label (HTML div)
  ├─ Center-left label (HTML div)
  ├─ Center-right label (HTML div)
  └─ Bottom-center label (HTML div)

Layer 50: Navbar
Layer 100: Cursor
```

### Scene 8 — Wipe Transition

```
Layer 0: Previous section (white/light sections above)
Layer 1: Next section (blue ocean / aircraft below)
Layer 10: Wipe panel (black vertical panel, clip-path animated)
  └─ Text content inside panel (word shuffle)
Layer 50: Navbar
Layer 100: Cursor
```

### Scene 9 — Aircraft

```
Layer 0: Sky background (gradient blue OR 3D environment)
Layer 1: Cloud layer (either: Three.js volumetric clouds, OR video texture, OR CSS)
Layer 2: Aircraft GLB model (Three.js Canvas)
Layer 3: UI text overlays if any
Layer 50: Navbar
Layer 100: Cursor
```

---

## Canvas Architecture Decision

### Option A: Single persistent Canvas (Recommended)

- One `<canvas>` fixed at `position: fixed`, full viewport
- Scene content switches as user scrolls (show/hide scene groups)
- Most performant — no canvas recreation on section change
- Used by: Lusion, Active Theory, many award-winning studios

### Option B: Multiple Canvases per section

- Each scroll section has its own `<Canvas>`
- R3F default approach
- Simpler to implement per-section but more GPU memory

**The reference appears to use multiple canvases** (white background appears as DOM, 3D models sit on top) — but this cannot be confirmed without DevTools inspection.

---

## DOM Structure (Estimated)

```html
<body>
  <!-- Custom cursor -->
  <div id="cursor" style="position: fixed; z-index: 100">
    <div class="cursor-ring" />
  </div>

  <!-- Navbar -->
  <nav id="navbar" style="position: fixed; z-index: 50">...</nav>

  <!-- Lenis scroll container -->
  <div id="scroll-container">
    <!-- Scene 1: Hero -->
    <section id="hero" style="height: 150vh; position: relative">
      <canvas id="globe-canvas" style="position: sticky; top: 0" />
      <div class="hero-content">...</div>
    </section>

    <!-- Scene 2: Atmosphere transition -->
    <section id="atmosphere" style="height: 50vh">...</section>

    <!-- Scene 3: Editorial -->
    <section id="editorial" style="height: auto">...</section>

    <!-- Scene 4: Reach stacker (pinned) -->
    <section id="reach-stacker" style="height: 400vh">
      <div style="position: sticky; top: 0">
        <canvas id="crane-canvas" />
      </div>
    </section>

    <!-- ... more sections ... -->
  </div>
</body>
```

---

## Layering Notes

1. **Text over 3D**: All HTML text overlays sit on top of WebGL canvas using CSS `z-index`. The canvas is transparent (alpha: true) in sections where the DOM background color shows through.

2. **Canvas transparency**: In white-background sections (crane, truck), the R3F canvas has `gl={{ alpha: true }}` — white DOM background shows, models render on top.

3. **Canvas opacity transitions**: Between dark and light sections, the canvas background transitions — either via `backgroundColor` in the R3F scene or a DOM overlay.
