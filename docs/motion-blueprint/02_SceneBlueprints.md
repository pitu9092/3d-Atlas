# 02 — Scene Blueprints

**Project**: 3D Atlas  
**Document Type**: Blueprint  
**Purpose**: Complete per-scene specification — layout, animation, camera, assets, build order

---

## SCENE 01 — Globe Hero

### Purpose

Cinematic opening impression. Establishes brand (global reach, logistics network). Creates first scroll momentum.

### Layout Spec

| Element             | Position                     | Size                                                                           |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| Section container   | Full viewport                | `100vw × 100vh`, `position: sticky`                                            |
| WebGL canvas        | Full viewport (right-biased) | `100vw × 100vh`, `position: absolute`, `z-index: 0`                            |
| DOM content overlay | Left column                  | `position: absolute`, `left: 120px`, `top: 50%`, `transform: translateY(-50%)` |
| Eyebrow label       | Above H1                     | `display: block`, `margin-bottom: 12px`                                        |
| H1                  | Left column                  | 3 lines, each in `overflow: hidden` parent                                     |
| Body copy           | Below H1                     | `margin-top: 32px`, `max-width: 380px`                                         |
| CTA row             | Below body                   | `margin-top: 40px`, `display: flex`, `gap: 16px`                               |
| Navbar              | Fixed, all sections          | `position: fixed`, `z-index: 100`                                              |

### Canvas Setup

| Property              | Spec                                                   |
| --------------------- | ------------------------------------------------------ |
| Renderer alpha        | `true`                                                 |
| Clear color           | `(0, 0)` — transparent                                 |
| Canvas CSS            | `background: transparent`                              |
| Canvas z-index        | `0` (below DOM content)                                |
| Canvas pointer events | `none` (DOM handles clicks)                            |
| Size                  | Full window — `window.innerWidth × window.innerHeight` |

### Animation Spec

| Animation                   | Trigger                 | Duration      | Ease         |
| --------------------------- | ----------------------- | ------------- | ------------ |
| Globe canvas fade-in        | Page load               | `0.8s`        | `power2.out` |
| Eyebrow fade+slideY         | `delay: 0.3s` from load | `0.5s`        | `power2.out` |
| H1 line 1 clip reveal       | `delay: 0.4s`           | `0.9s`        | `power4.out` |
| H1 line 2 clip reveal       | `delay: 0.52s`          | `0.9s`        | `power4.out` |
| H1 line 3 clip reveal       | `delay: 0.64s`          | `0.9s`        | `power4.out` |
| Body copy fade+slideY       | `delay: 0.75s`          | `0.6s`        | `power2.out` |
| Button 1 fade+slideY        | `delay: 0.9s`           | `0.5s`        | `power2.out` |
| Button 2 fade+slideY        | `delay: 1.0s`           | `0.5s`        | `power2.out` |
| Globe continuous Y-rotation | `useFrame`              | Continuous    | None         |
| Camera Z pull-back          | Scroll scrub `0→150vh`  | Scroll-driven | Linear       |

### Camera

| Property | Value                                             |
| -------- | ------------------------------------------------- |
| Position | `[0, 0.5, 3.5]` → `[0, 0.5, 7.0]` (scroll-driven) |
| Target   | `[0, 0, 0]`                                       |
| FOV      | `50°`                                             |
| Movement | Z+ (pull-back)                                    |
| Driver   | ScrollTrigger scrub                               |

### Lighting

| Light              | Color     | Intensity            |
| ------------------ | --------- | -------------------- |
| Ambient            | `#04040a` | `0.05`               |
| Directional (sun)  | `#fff4e0` | `2.0`                |
| Atmosphere Fresnel | `#0080FF` | Custom shader        |
| Thermal glow       | `#ff6020` | Custom additive mesh |

### Three.js Objects

| Object           | Type                                            | Notes                        |
| ---------------- | ----------------------------------------------- | ---------------------------- |
| Earth sphere     | `SphereGeometry(1, 64, 64)` + ShaderMaterial    | Custom PBR + atmosphere      |
| Atmosphere shell | `SphereGeometry(1.02, 64, 64)` + ShaderMaterial | Fresnel, AdditiveBlending    |
| Thermal glow     | Additive mesh/plane                             | Upper hemisphere orange glow |
| Route network    | `Points` + `Line` geometries                    | On globe surface, r=1.005    |
| Red location pin | `ConeGeometry` or `Sprite`                      | Australia position           |

### DOM Elements

| Element          | HTML Tag    | CSS Class            |
| ---------------- | ----------- | -------------------- |
| Section wrapper  | `<section>` | `.hero-section`      |
| Canvas container | `<div>`     | `.hero-canvas`       |
| Content overlay  | `<div>`     | `.hero-content`      |
| Eyebrow          | `<p>`       | `.hero-eyebrow`      |
| H1 wrapper       | `<h1>`      | `.hero-headline`     |
| Line wrapper     | `<span>`    | `.hero-line-wrapper` |
| Line text        | `<span>`    | `.hero-line`         |
| Body copy        | `<p>`       | `.hero-body`         |
| CTA row          | `<div>`     | `.hero-cta`          |
| Primary button   | `<button>`  | `.btn-primary`       |
| Secondary link   | `<a>`       | `.btn-secondary`     |

### Build Order

1. Canvas renderer setup (alpha: true)
2. Scene + camera
3. Lighting rig
4. Globe geometry + material (custom shader)
5. Atmosphere shell
6. Thermal glow layer
7. Route network (Points + arcs)
8. Red pin marker
9. Render loop (`useFrame`)
10. ScrollTrigger (camera Z scrub)
11. DOM: HTML structure
12. DOM: Load animations (GSAP timeline)
13. Custom cursor component

### Dependencies

- Three.js canvas must render before `ScrollTrigger.refresh()`
- Lenis must initialize before any ScrollTrigger setup
- Globe GLB or procedural setup must complete before `useFrame` starts
- Font must be loaded before H1 animation plays

---

## SCENE 02 — Atmospheric Descent

### Purpose

Bridge between cosmic (globe) and terrestrial (editorial). Visual metaphor of camera descending from orbit.

### Layout Spec

| Element        | Position                                |
| -------------- | --------------------------------------- |
| Section        | Full viewport, no pin                   |
| Background     | `body` or wrapper `background` animates |
| No DOM content | —                                       |
| No 3D canvas   | —                                       |

### Animation Spec

| Animation                                         | Driver       | Range                    |
| ------------------------------------------------- | ------------ | ------------------------ |
| BG gradient: `#080808` → intermediate → `#F5F4F0` | Scroll scrub | `scrollY: 150vh → 210vh` |

### Gradient Keyframes

| Scroll  | Background                       |
| ------- | -------------------------------- |
| `150vh` | `#080808` solid                  |
| `165vh` | Slight blue tint appearing top   |
| `180vh` | Full blue band visible           |
| `195vh` | Blue receding, off-white growing |
| `210vh` | `#F5F4F0` solid complete         |

### Build Order

1. ScrollTrigger on body background
2. GSAP gradient animation with scrub

---

## SCENE 03 — Editorial Brand Statement

### Purpose

Authoritative brand voice. Logistics credibility. Stats showcase.

### Layout Spec

| Property           | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| Container          | `max-width: 1440px`, `margin: 0 auto`, `padding: 0 var(--space-xl)` |
| Grid               | CSS Grid `55fr 40fr`, `gap: 5fr`                                    |
| Section min-height | `100vh`                                                             |
| BG                 | `#F5F4F0`                                                           |

### Left Column

| Element      | Spec                                        |
| ------------ | ------------------------------------------- |
| Aerial photo | `~80×80px`, `position: absolute` or flow    |
| H2           | 4 lines, each in `overflow: hidden` wrapper |
| H2 size      | `~68px`, 900 weight, all-caps               |

### Right Column

| Element        | Order | Spec             |
| -------------- | ----- | ---------------- |
| Body copy 1    | 1     | 15px, regular    |
| Body copy 2    | 2     | 15px, regular    |
| Divider        | 3     | `1px solid #ccc` |
| Stat: `2 500+` | 4     | 96px, 900 weight |
| Stat label     | 5     | 12px, grey       |
| Divider        | 6     | —                |
| Stat: `98.2%`  | 7     | 80px, 900 weight |
| Stat label     | 8     | 12px, grey       |
| Divider        | 9     | —                |
| Stat: `8+`     | 10    | 80px, 900 weight |
| Stat label     | 11    | 12px, grey       |

### Animation Spec

| Element       | Trigger            | Animation                     |
| ------------- | ------------------ | ----------------------------- |
| H2 lines (×4) | `top 80%` viewport | Clip reveal, stagger 0.1s     |
| Aerial photo  | `top 80%`          | Opacity + translateY          |
| Body copy     | `top 75%`          | Opacity + translateY          |
| Stats (×3)    | `top 70%`          | Count-up from 0, `once: true` |

### Build Order

1. HTML structure + CSS Grid
2. H2 split text setup (wrap each line in parent)
3. ScrollTrigger for H2 reveal
4. ScrollTrigger for stats count-up
5. Photo reveal trigger

---

## SCENE 04 — Reach Stacker Crane

### Purpose

Industrial confidence. Demonstrates operational scale. Most unique animation in experience.

### Layout Spec

| Property         | Value                                            |
| ---------------- | ------------------------------------------------ |
| Wrapper          | `height: 450vh` (scroll distance)                |
| Canvas container | `position: sticky; top: 0; height: 100vh`        |
| BG               | `#FFFFFF` (DOM shows through transparent canvas) |
| Canvas           | Full viewport, `alpha: true`                     |

### Animation Spec

| Scroll Progress | Action                                                  |
| --------------- | ------------------------------------------------------- |
| `0%`            | Crane visible, starting pose                            |
| `0–45%`         | Boom extends from 40° to 50°                            |
| `45–65%`        | Spreader descends and attaches; container lifts to apex |
| `65–85%`        | Crane moves left; boom drops from 50° to 10°            |
| `85–100%`       | Container in horizontal carry position                  |

### Camera (Static)

| Property | Value           |
| -------- | --------------- |
| Position | `[3, 2.5, 8]`   |
| Target   | `[0.5, 1.5, 0]` |
| FOV      | `60°`           |
| Movement | NONE            |

### GLB Animation Strategy

The crane GLB contains embedded animation clips. GSAP ScrollTrigger scrub drives `animationMixer.setTime()`.

### Build Order

1. Canvas + renderer (alpha: true)
2. Scene + static camera
3. Studio lighting rig
4. GLB loader (crane model)
5. AnimationMixer setup
6. ScrollTrigger scrub → mixer time
7. Wrapper div (450vh height)

---

## SCENE 05 — Semi-Truck

### Purpose

Narrative continuity from crane. Road logistics showcase.

### Layout Spec

| Property | Value                        |
| -------- | ---------------------------- |
| Wrapper  | `height: 100vh`              |
| Canvas   | Full viewport, `alpha: true` |
| BG       | Off-white (warm white)       |

### Animation Spec

| Animation   | Spec                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| Truck entry | Slides from `position.x = 12` to `position.x = 0`, `power2.out`, ~0.8s |
| OR entry    | Canvas fades in when section enters viewport                           |
| Static hold | Truck centered, no further animation                                   |

### Camera (Static)

| Property | Value         |
| -------- | ------------- |
| Position | `[0, 0.3, 8]` |
| Target   | `[0, 0.5, 0]` |
| FOV      | `65°`         |

### Build Order

1. Canvas + renderer
2. Scene + camera
3. Studio lighting rig (same as crane, slightly brighter ambient)
4. Add rim light (to separate dark cab from white background)
5. GLB loader (truck model)
6. Entry animation trigger

---

## SCENE 06 — Services Grid

### Purpose

Comprehensive service listing. Dark contrast reversal after white scenes.

### Layout Spec

| Property     | Value                         |
| ------------ | ----------------------------- |
| BG           | `#111111`                     |
| Container    | Max-width, horizontal padding |
| Word shuffle | Centered top, ~40–48px        |
| Grid         | 5 equal columns               |
| CTA          | Centered bottom               |

### Animation Spec

| Element           | Trigger       | Animation                         |
| ----------------- | ------------- | --------------------------------- |
| Word shuffle text | Section enter | 3-line slot machine, ~0.8s        |
| Column icons      | `top 75%`     | Stagger fade+up, 0.1s delay each  |
| Column titles     | `top 75%`     | Stagger fade+up, 0.1s delay each  |
| Column bodies     | `top 70%`     | Stagger fade+up, 0.15s delay each |
| CTA button        | `top 65%`     | Fade+up                           |

### Build Order

1. HTML structure + CSS Grid
2. Word shuffle JS implementation
3. ScrollTrigger animations

---

## SCENE 07 — Wipe Transition Panel

### Purpose

Cinematic division between ground logistics and maritime. Visual punctuation mark.

### Layout Spec

| Property   | Value                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------ |
| Wrapper    | `height: 180vh`                                                                                  |
| Section    | `position: sticky; top: 0; height: 100vh`                                                        |
| BG         | `#FFFFFF`                                                                                        |
| Panel      | `position: absolute; left: 50%; transform: translateX(-50%); background: #111111; height: 100vh` |
| Left text  | `position: absolute; left: var(--space-xl); top: 50%`                                            |
| Right text | `position: absolute; right: var(--space-xl); top: 50%`                                           |

### Animation Spec

| Scroll Progress | Action                                      |
| --------------- | ------------------------------------------- |
| `0–20%`         | Panel grows from `width: 0` to `width: 50%` |
| `20–60%`        | Word shuffle text cycles left + right       |
| `60–80%`        | Panel at peak width                         |
| `80–100%`       | Ship section begins revealing below         |

### Build Order

1. HTML structure
2. Panel element (centered, zero width)
3. ScrollTrigger scrub → panel width
4. Word shuffle implementation (both sides)
5. ScrollTrigger markers for label states

---

## SCENE 08 — Container Ship

### Purpose

Sea freight showcase. Aerial perspective creates scale impression. Most immersive 3D section.

### Layout Spec

| Property         | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| Wrapper          | `height: 300vh`                                          |
| Canvas container | `position: sticky; top: 0; height: 100vh`                |
| BG (scene)       | `#133D77` (set in THREE.js scene.background)             |
| Text overlay     | DOM, `position: absolute`, centered                      |
| Feature labels   | DOM, `position: absolute`, positioned around ship center |

### Camera

| Phase          | Y           | Effect              |
| -------------- | ----------- | ------------------- |
| 0–40% scroll   | `20 → 10`   | Zoom in             |
| 40–55% scroll  | `10` (hold) | Text appears        |
| 55–100% scroll | `10 → 20`   | Zoom out for labels |

### Three.js Objects

| Object         | Spec                                              |
| -------------- | ------------------------------------------------- |
| Ship GLB       | Loaded via useGLTF, positioned at `[0, 0, 0]`     |
| Ocean water    | Plane geometry or Water material (Three.js Water) |
| Foam particles | Points system or particle texture along hull      |

### Animation Spec

| Progress | Action                                           |
| -------- | ------------------------------------------------ |
| `0%`     | Ship at medium size, no text                     |
| `40%`    | Ship at max size, text "LOGISTICS..." fades in   |
| `55%`    | Text fades out, camera begins pulling back       |
| `70%`    | Feature labels begin fading in (stagger)         |
| `90%`    | All labels visible, camera at pull-back position |

### Build Order

1. Canvas + renderer
2. Scene background color
3. Maritime lighting rig
4. Ship GLB loader
5. Water/foam particles
6. Aerial camera setup
7. ScrollTrigger scrub → camera Y
8. Text overlay DOM element + ScrollTrigger
9. Feature labels DOM + ScrollTrigger

---

## SCENE 09 — Aircraft

### Purpose

Air freight showcase. Creates aspirational, above-the-clouds sensation. Bridges maritime to testimonials.

### Layout Spec

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| Wrapper          | `height: 220vh`                           |
| Canvas container | `position: sticky; top: 0; height: 100vh` |
| Sky              | Procedural (Drei `<Sky>`)                 |
| Clouds           | Drei `<Cloud>` components                 |

### Camera

| Phase | Position     | Aircraft Size |
| ----- | ------------ | ------------- |
| Start | `[0, 5, 30]` | ~3% viewport  |
| End   | `[0, 3, 5]`  | ~25% viewport |

### Aircraft Continuous Animation

| Property | Behavior                                       |
| -------- | ---------------------------------------------- |
| Roll Z   | `±3°` oscillation, period `~5s`                |
| Y bob    | `±0.1 units`, period `~3s`                     |
| Driver   | `useFrame` with `Math.sin(elapsedTime × rate)` |

### Build Order

1. Canvas + renderer
2. Sky component
3. Cloud components (positioned)
4. Aircraft GLB loader
5. `useFrame` continuous animation
6. Scroll camera zoom (ScrollTrigger scrub)
7. Testimonials overlap z-index management

---

## SCENE 10 — Testimonials

### Purpose

Social proof. Trust establishment. Soft landing after dramatic 3D sequences.

### Layout Spec

| Property    | Value                                                  |
| ----------- | ------------------------------------------------------ |
| BG          | `#F5F4F0`                                              |
| Layout      | Two-column grid OR full-width with left sticky heading |
| Left (30%)  | H2 sticky heading                                      |
| Right (70%) | Scrollable testimonials list                           |

### Testimonial Card Spec

| Element       | Spec                                     |
| ------------- | ---------------------------------------- |
| Photo         | `100×100px` square, subtle border-radius |
| Name          | `14px`, medium, dark                     |
| Title/Company | `12px`, grey                             |
| Quote         | `15–16px`, regular, `line-height: 1.7`   |
| Divider       | `1px` line between testimonials          |

### Animation Spec

| Element         | Trigger   | Animation                    |
| --------------- | --------- | ---------------------------- |
| H2 (3 lines)    | `top 80%` | Clip reveal, stagger 0.1s    |
| Client photo 1  | `top 75%` | Opacity + translateY         |
| Quote 1         | `top 70%` | Opacity + translateY         |
| Client photo 2  | `top 75%` | Opacity + translateY, offset |
| Quote 2         | `top 70%` | Opacity + translateY         |
| Red accent line | With H2   | Scale from width 0           |

### Build Order

1. HTML structure
2. Aircraft overlap z-index management
3. H2 split text setup
4. ScrollTrigger per testimonial card (stagger)
