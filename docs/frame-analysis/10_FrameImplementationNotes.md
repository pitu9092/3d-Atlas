# 10 — Frame Implementation Notes

**Project**: 3D Atlas  
**Purpose**: For every keyframe — exactly how it should be built, what technology, what approach

---

> This document translates visual observations into technical build instructions.  
> No code is written here — only specifications.

---

## SCENE 01 — Globe Hero

### How to Build This Frame (KF-01)

#### Technology Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| 3D Engine | Three.js via React-Three-Fiber      |
| Canvas    | `<Canvas>` component, `alpha: true` |
| Scroll    | Lenis + GSAP ScrollTrigger          |
| DOM       | Next.js / React                     |
| Font      | Custom brand font (weight 900)      |

#### Globe Implementation

| Step          | Spec                                                                   |
| ------------- | ---------------------------------------------------------------------- |
| Geometry      | `SphereGeometry(1, 64, 64)` — 64 segments for smooth silhouette        |
| Material      | Custom `ShaderMaterial` — combines PBR surface + Fresnel glow          |
| Texture       | Earth texture map (albedo) + normal map                                |
| Atmosphere    | Separate larger sphere with custom Fresnel shader, `AdditiveBlending`  |
| Thermal glow  | Additive plane or sphere mesh at upper hemisphere, orange-red gradient |
| Route network | `Points` geometry for nodes, `Line` or `TubeGeometry` for arcs         |
| Red pin       | `ConeGeometry` or `Sprite` at lat/lon position on surface              |
| Rotation      | `globe.rotation.y += delta * rotationSpeed` in `useFrame`              |

#### Camera Setup for Globe

| Property  | Spec                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| Initial Z | `3.5`                                                                                              |
| Final Z   | `7.0`                                                                                              |
| FOV       | `50°`                                                                                              |
| Driver    | `ScrollTrigger({ scrub: 1, onUpdate: self => camera.position.z = lerp(3.5, 7.0, self.progress) })` |

#### Globe Canvas Positioning

The globe sits at center of canvas, but the canvas itself is positioned to the RIGHT half of the viewport. This is achieved either by:

- Camera X offset (`camera.position.x = 1.5`)
- Globe mesh X offset (`globe.position.x = 1.5`)
- Canvas `position: absolute` with `right: -10%` style

#### DOM Layer (Left Column)

| Element   | Spec                                                                                         |
| --------- | -------------------------------------------------------------------------------------------- |
| Eyebrow   | `<p>ONE OPERATOR</p>` — 12px, letter-spacing 0.15em, white 65%                               |
| H1        | `<h1>` with 3 `<span>` wrappers (one per line)                                               |
| Each span | Parent: `overflow: hidden`. Child: animated `translateY`                                     |
| Body copy | `<p>` — 16px, regular, white 65%                                                             |
| Buttons   | Primary pill: `<button>` with border-radius 999px, white bg, dark text. Secondary: text link |

#### Post-Processing (Globe)

| Effect      | Spec                                          |
| ----------- | --------------------------------------------- |
| Bloom       | `UnrealBloomPass(resolution, 0.5, 0.6, 0.85)` |
| Anti-alias  | SMAA or FXAA pass                             |
| ToneMapping | `ACESFilmicToneMapping`, exposure `1.2`       |

---

## SCENE 02 — Atmospheric Descent

### How to Build This Frame (KF-03)

#### Technology

DOM/CSS animation only. No Three.js.

#### Background Gradient Animation

| Property       | Spec                                                                 |
| -------------- | -------------------------------------------------------------------- |
| Trigger        | ScrollTrigger scrub on hero section's last 30%                       |
| Method         | Animate CSS `background` from solid `#080808` to the 8-stop gradient |
| Target element | `body` or `main` wrapper div                                         |
| GSAP target    | CSS custom properties or direct `backgroundColor` with interpolation |

#### Gradient Stops (as CSS)

```
#080808 → #0a1040 → #0f2a80 → #1a5ec8 → #4a9ae0 → #8ac8f0 → #c8e8f8 → #F5F4F0
```

#### Alternative Approach

Use a `position: fixed; z-index: -1; width: 100%; height: 100%` overlay div. Apply the gradient as a static background. Control `opacity` of this div via scroll. Simple and performant.

---

## SCENE 03 — Editorial Brand Statement

### How to Build This Frame (KF-05)

#### Technology

DOM/CSS + GSAP ScrollTrigger

#### Layout

| Property     | Spec                                                      |
| ------------ | --------------------------------------------------------- |
| Container    | `max-width: 1440px`, `margin: 0 auto`, `padding: 0 120px` |
| Grid         | CSS Grid `grid-template-columns: 55fr 40fr`, gap `5fr`    |
| Left column  | H2 + aerial photo thumbnail                               |
| Right column | Body copy (2 paragraphs) + 3 stats                        |

#### Stat Layout (Right column, confirmed from KF-05)

```
Right column structure:
  [body paragraph 1]
  [body paragraph 2]
  ─────────────────── (1px line divider)
  2 500+
  [stat label]
  ───────────────────
  98.2%
  [stat label]
  ───────────────────
  8+
  [stat label]
```

#### Animation Triggers

| Element   | ScrollTrigger Start | Animation                                     |
| --------- | ------------------- | --------------------------------------------- |
| H2 lines  | `top 80%`           | `translateY(100% → 0)` per line, stagger 0.1s |
| Photo     | `top 80%`           | `opacity: 0→1`, `translateY: 20px→0`          |
| Body copy | `top 70%`           | Same fade-up                                  |
| Stats     | `top 70%`           | Count-up, triggered once                      |

---

## SCENE 04 — Reach Stacker Crane

### How to Build This Frame (KF-06 → KF-08)

#### Technology

Three.js + GSAP ScrollTrigger scrub

#### 3D Setup

| Property               | Spec                                                 |
| ---------------------- | ---------------------------------------------------- |
| Canvas                 | `alpha: true` — transparent background               |
| Section                | `position: sticky; top: 0; height: 100vh`            |
| Section height wrapper | `height: 400vh` (400% of viewport = scroll distance) |

#### Animation Driver

```
Scroll progress 0 → 1 maps to crane animation time 0 → end
animationMixer.setTime(progress * clip.duration)
```

#### Camera Position (Confirmed static)

```
Camera: [3, 2.5, 8]
Target: [0.5, 1.5, 0]
FOV: 60°
No movement.
```

#### Why Static Camera Works

The crane's lateral movement (35% of viewport) AND the boom's rotation create sufficient visual dynamism without camera movement. Adding camera movement would make the viewer dizzy and would lose the industrial "observation" feel.

#### Post-Processing

None recommended. Studio white background doesn't benefit from bloom.

---

## SCENE 05 — Semi-Truck

### How to Build This Frame (KF-09)

#### 3D Setup

| Property | Spec                                           |
| -------- | ---------------------------------------------- |
| Canvas   | `alpha: true`                                  |
| Section  | Standard scroll (brief, possibly pinned)       |
| Camera   | `[0, 0.3, 8]`, target `[0, 0.5, 0]`, FOV `65°` |

#### Truck Entry Animation

UNKNOWN — two options:

1. Truck model starts at `position.x = 12`, animates to `position.x = 0` with `power2.out`
2. Truck section simply enters viewport via normal scroll

Option 1 is more premium — the truck "drives in."

#### Narrative Transition Note

The container on the truck should visually match the container held by the crane. Ensure the truck's trailer container:

- Same color (light grey/silver)
- Same proportions (40ft ISO container)
- Same horizontal orientation

---

## SCENE 06 — Services Grid

### How to Build This Frame (KF-10 → KF-11)

#### Technology

DOM/CSS + GSAP

#### Section Structure

```html
<section class="services">
  <!-- Truck canvas "floats" from above -->
  <!-- or truck is positioned at top of this section -->

  <div class="word-shuffle">EVERYTHING YOUR FREIGHT NEEDS. UNDER ONE GROUP.</div>

  <div class="services-grid">
    <!-- 5 columns -->
  </div>

  <button class="cta">...</button>
</section>
```

#### Word Shuffle Implementation Approach

1. Define array of words/characters for each text slot
2. On trigger, rapidly cycle through random characters
3. Settle on final characters in sequence
4. Can use a character scramble library (e.g., `scramble-text` GSAP plugin) or custom implementation

#### Services Grid Layout

| Property    | Spec                                     |
| ----------- | ---------------------------------------- |
| Columns     | 5 equal-width columns                    |
| Each column | Icon (SVG) + Title + Body copy           |
| Icon size   | 24px                                     |
| Title size  | 12px, all-caps, letter-spacing 0.1em     |
| Body size   | 13px                                     |
| Animation   | Stagger fade-up per column, 0.1s stagger |

---

## SCENE 07 — Wipe Transition Panel

### How to Build This Frame (KF-12)

#### Technology

DOM/CSS + GSAP ScrollTrigger

#### Section Setup

```
Section height: 180vh (scroll distance for full animation)
Section: position: sticky; top: 0; height: 100vh
Background: #FFFFFF
```

#### Panel Element

```css
.wipe-panel {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0; /* animates via scroll scrub */
  height: 100vh;
  background: #111111;
  z-index: 10;
}
```

ScrollTrigger drives `width: 0 → 50%`.

#### Word Shuffle Trigger

Word shuffle fires when scroll progress > 10%. Words cycle continuously until section exits.

---

## SCENE 08 — Container Ship

### How to Build This Frame (KF-13 → KF-15)

#### Technology

Three.js + GSAP ScrollTrigger scrub

#### 3D Setup

| Property         | Spec                                                      |
| ---------------- | --------------------------------------------------------- |
| Camera           | Aerial top-down: `[0, 20, 0]`, rotation `[-PI/2, 0, 0]`   |
| FOV              | `45°`                                                     |
| Background       | `scene.background = new THREE.Color('#133D77')`           |
| Ship orientation | Bow at positive Z, stern at negative Z, viewed from above |

#### Camera Animation (Scroll-Driven)

```
Phase 1 (0–40% scroll): camera.y: 20 → 10
Phase 2 (40–55% scroll): camera.y: 10 (hold)
Phase 3 (55–100% scroll): camera.y: 10 → 20
```

#### Text Overlay ("LOGISTICS THAT WORKS...")

DOM element positioned BELOW the canvas in z-index OR as a Three.js TextGeometry/CSS3DObject. Most likely DOM:

```css
.ship-text-overlay {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  opacity: 0; /* GSAP animates this */
}
```

---

## SCENE 09 — Aircraft

### How to Build This Frame (KF-16 → KF-17)

#### Technology

Three.js + GSAP ScrollTrigger + `useFrame`

#### 3D Setup

| Property       | Spec                                               |
| -------------- | -------------------------------------------------- |
| Camera initial | `[0, 5, 30]` (far away — aircraft is tiny)         |
| Camera final   | `[0, 3, 5]` (close — aircraft fills ~30% viewport) |
| FOV            | `60°`                                              |
| Sky            | `<Sky>` component from `@react-three/drei`         |
| Clouds         | `<Cloud>` components or custom volumetric mesh     |

#### Camera Animation

ScrollTrigger scrub drives `camera.position.z: 30 → 5`.
Also possible: move camera slightly in XY for arc movement.

#### Aircraft Continuous Animation

In `useFrame`:

```
aircraft.rotation.z = Math.sin(time * 0.5) * 0.05 // gentle banking
aircraft.position.y = Math.sin(time * 0.3) * 0.1  // gentle altitude bob
```

---

## SCENE 10 — Testimonials

### How to Build This Frame (KF-17 → KF-18)

#### Technology

DOM/CSS + GSAP

#### Layout

```
Section: max-width 1440px, padding 120px
Left col (30%): Sticky H2 heading
Right col (70%): Scrollable testimonials list
```

#### Aircraft Overlap

The aircraft canvas from Scene 09 remains mounted with `z-index: 0`.
The testimonials section DOM has `background: #F5F4F0` with `z-index: 1`.
As the testimonials section scrolls up, its background covers the aircraft canvas.
Aircraft persists visually in the top-right area until the testimonials background fully covers it.

#### Testimonial Card Structure

```html
<div class="testimonial">
  <div class="client-photo">
    <img src="..." alt="Client name" width="100" height="100" />
  </div>
  <div class="client-info">
    <span class="name">Client Name</span>
    <span class="title">Title, Company</span>
  </div>
  <blockquote class="quote">Long quote text...</blockquote>
</div>
```

---

## Frame-Level Implementation Priority

| KF       | Scene           | Implementation Complexity     | Priority                   |
| -------- | --------------- | ----------------------------- | -------------------------- |
| KF-01    | Globe Hero      | HIGH (custom shaders)         | Critical — hero experience |
| KF-07/08 | Crane animation | HIGH (scrubbed GLB animation) | Critical — unique feature  |
| KF-12    | Wipe transition | MEDIUM (DOM + CSS)            | High — cinematic moment    |
| KF-13/14 | Ship aerial     | HIGH (aerial camera + water)  | High                       |
| KF-03    | Atmosphere      | MEDIUM (CSS gradient)         | Medium                     |
| KF-16/17 | Aircraft        | HIGH (sky + zoom)             | Medium                     |
| KF-10    | Services split  | LOW-MEDIUM (DOM split)        | Medium                     |
| KF-04/05 | Editorial       | LOW (DOM/GSAP)                | Lower                      |
| KF-17/18 | Testimonials    | LOW (DOM)                     | Lower                      |

---

## Common Implementation Patterns

### Clip-Path Text Reveal (All H1/H2 Sections)

```
Container: overflow: hidden, display: block
Content: translateY(100%) → translateY(0)
Ease: power4.out
Duration: 0.9s (heading), 0.7s (subheading)
```

### Scroll Pin + Scrub Pattern (All 3D Scenes)

```
Wrapper height: [pin_duration]vh (e.g., 400vh for crane)
Canvas container: position: sticky; top: 0; height: 100vh
ScrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: 1 }
```

### Canvas Transparency Pattern (Crane, Truck)

```
THREE.js WebGLRenderer: { alpha: true, antialias: true }
renderer.setClearColor(0x000000, 0)
Canvas element: background: transparent
DOM section: background: white (shows through canvas)
```

### Scene-to-Scene Background Transition

```
Each section has its own background-color set via CSS
Transitions happen naturally via scroll (sections cover/uncover each other)
Exceptions: Hero→Atmosphere uses GSAP scroll-scrubbed gradient overlay
```
