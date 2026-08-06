# 10 — Animation Inventory

Every animation identified in the reference, documented with all observable properties.

---

## 001 — Globe Continuous Rotation

| Property      | Value                                                   |
| ------------- | ------------------------------------------------------- |
| **Name**      | Globe Auto-Rotation                                     |
| **Trigger**   | Page load (autoplay, continuous)                        |
| **Purpose**   | Indicate Earth is a living, active globe                |
| **Object**    | Earth sphere mesh (Three.js)                            |
| **Axis**      | Y-axis (vertical)                                       |
| **Direction** | West to East (counter-clockwise when viewed from above) |
| **Speed**     | Very slow — ~0.05–0.1 radians/second                    |
| **Ease**      | Linear (continuous, no ease)                            |
| **Duration**  | Infinite loop                                           |
| **Method**    | `useFrame` delta accumulation                           |

---

## 002 — Globe Atmosphere Fresnel Pulse

| Property    | Value                                   |
| ----------- | --------------------------------------- |
| **Name**    | Atmosphere Rim Pulse                    |
| **Trigger** | Continuous (autoplay)                   |
| **Purpose** | Make atmosphere feel alive and luminous |
| **Object**  | Atmosphere mesh surrounding Earth       |
| **Effect**  | Subtle opacity oscillation (0.8 ↔ 1.0)  |
| **Speed**   | ~2–4 second cycle                       |
| **Ease**    | `Math.sin()` based smooth oscillation   |
| **Method**  | Shader uniform `uTime` sin function     |

---

## 003 — Route Network Pulse

| Property     | Value                                                  |
| ------------ | ------------------------------------------------------ |
| **Name**     | Shipping Route Node Pulse                              |
| **Trigger**  | Continuous (autoplay)                                  |
| **Purpose**  | Show active global network                             |
| **Object**   | Points / sprites at route nodes on globe               |
| **Effect**   | Scale oscillation OR opacity ping                      |
| **Pattern**  | Staggered — each node pulses independently with offset |
| **Duration** | ~1–2 second cycle per node                             |
| **Method**   | Shader or Three.js Points material with uTime          |

---

## 004 — Hero Text Reveal (H1)

| Property      | Value                                              |
| ------------- | -------------------------------------------------- |
| **Name**      | Hero Headline Reveal                               |
| **Trigger**   | Page load / section enter                          |
| **Purpose**   | Cinematic entrance for primary message             |
| **Object**    | H1 text — 3 separate line wrappers                 |
| **Effect**    | translateY(100% → 0) with clip-path mask on parent |
| **Direction** | Bottom to top                                      |
| **Stagger**   | ~100–150ms between lines                           |
| **Ease**      | `power4.out` or `expo.out`                         |
| **Duration**  | ~0.8–1.0s per line                                 |
| **Opacity**   | No opacity — uses clip-path masking only           |
| **Delay**     | ~300–500ms after page load                         |

---

## 005 — Hero Body Copy Fade

| Property     | Value                                |
| ------------ | ------------------------------------ |
| **Name**     | Hero Body Fade In                    |
| **Trigger**  | After H1 reveal completes            |
| **Purpose**  | Secondary content entrance           |
| **Effect**   | Opacity 0 → 1 + translateY(20px → 0) |
| **Duration** | ~0.6s                                |
| **Ease**     | `power2.out`                         |
| **Delay**    | ~400–600ms after H1 starts           |

---

## 006 — CTA Buttons Entrance

| Property     | Value                                |
| ------------ | ------------------------------------ |
| **Name**     | CTA Button Fade Up                   |
| **Trigger**  | After body copy                      |
| **Effect**   | Opacity 0 → 1 + translateY(20px → 0) |
| **Duration** | ~0.5s                                |
| **Ease**     | `power2.out`                         |
| **Stagger**  | ~80ms between the two buttons        |

---

## 007 — Globe Scroll Parallax

| Property    | Value                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| **Name**    | Globe Scroll Camera Pull-Back                                          |
| **Trigger** | Scroll (ScrollTrigger)                                                 |
| **Purpose** | Transition from "zoomed in on Earth" to "seeing full globe from space" |
| **Scrub**   | Yes — tied 1:1 to scroll progress                                      |
| **Effect**  | Camera Z position: 3 → 8 (or similar pull-back)                        |
| **Ease**    | Linear with scrub smoothing (scrub: 1.5)                               |
| **Range**   | Hero section scroll range (0 → 100vh)                                  |

---

## 008 — Atmosphere Blue Reveal

| Property              | Value                                                                         |
| --------------------- | ----------------------------------------------------------------------------- |
| **Name**              | Atmosphere Transition                                                         |
| **Trigger**           | Scroll (as globe section exits)                                               |
| **Effect**            | Blue atmospheric band sweeps across viewport, then fades to white             |
| **Type**              | Color fill / gradient animation or camera descending through atmosphere layer |
| **Scrub**             | Yes                                                                           |
| **Duration (scroll)** | ~50vh scroll range                                                            |

---

## 009 — Editorial Text Reveal (Scene 3)

| Property     | Value                                                     |
| ------------ | --------------------------------------------------------- |
| **Name**     | Brand Statement Reveal                                    |
| **Trigger**  | ScrollTrigger: element enters viewport (start: "top 80%") |
| **Object**   | H2 "WE MOVE FREIGHT. WE OWN THE OUTCOME."                 |
| **Effect**   | Word/line by line reveal — same clip-path technique as H1 |
| **Stagger**  | Line by line or word by word                              |
| **Duration** | ~0.7s per line                                            |
| **Ease**     | `power4.out`                                              |

---

## 010 — Stat Counter Animation

| Property     | Value                                  |
| ------------ | -------------------------------------- |
| **Name**     | Number Count-Up                        |
| **Trigger**  | ScrollTrigger: element enters viewport |
| **Object**   | "2 500+" number display                |
| **Effect**   | Number counts from 0 to 2500           |
| **Duration** | ~1.5–2.0s                              |
| **Ease**     | `power2.out` (fast start, slow finish) |
| **Format**   | Adds space separator during count      |

---

## 011 — Reach Stacker Scroll Animation

| Property                     | Value                                                          |
| ---------------------------- | -------------------------------------------------------------- |
| **Name**                     | Crane Mechanical Animation                                     |
| **Trigger**                  | Scroll (pinned section, scrubbed)                              |
| **Purpose**                  | Show crane picking up and moving a container                   |
| **Type**                     | 3D model bone/animation scrubbing OR manual property animation |
| **Scrub**                    | 1:1 with scroll — precise control                              |
| **Sequence**                 |                                                                |
| **Phase 1** (0–30% scroll)   | Crane boom extends upward/outward                              |
| **Phase 2** (30–50% scroll)  | Spreader descends toward container                             |
| **Phase 3** (50–70% scroll)  | Container attaches and lifts                                   |
| **Phase 4** (70–100% scroll) | Crane moves laterally with container                           |
| **Camera**                   | Static OR slowly orbiting                                      |
| **Ease**                     | Linear or custom curve per phase                               |

---

## 012 — Truck Slide In

| Property     | Value                                      |
| ------------ | ------------------------------------------ |
| **Name**     | Truck Enter Animation                      |
| **Trigger**  | ScrollTrigger: pinned section begins       |
| **Effect**   | Truck slides into frame from left OR right |
| **3D**       | Yes — model position X animation           |
| **Scrub**    | Possible                                   |
| **Duration** | ~0.5–1.0s equivalent scroll distance       |

---

## 013 — Section Wipe Transition (Dark → Services)

| Property    | Value                                                   |
| ----------- | ------------------------------------------------------- |
| **Name**    | Horizontal Split Wipe                                   |
| **Trigger** | Scroll through truck section                            |
| **Effect**  | Bottom half of screen transitions from white to dark    |
| **Method**  | Clip-path or background-color change on overlapping div |
| **Type**    | Reveal wipe from bottom edge                            |
| **Scrub**   | Yes                                                     |

---

## 014 — Feature Cards Stagger Reveal

| Property     | Value                                       |
| ------------ | ------------------------------------------- |
| **Name**     | Service Cards Entrance                      |
| **Trigger**  | ScrollTrigger: section enters viewport      |
| **Object**   | 4 feature cards                             |
| **Effect**   | Each card: opacity 0→1 + translateY(30px→0) |
| **Stagger**  | ~100ms left to right                        |
| **Duration** | ~0.5s each                                  |
| **Ease**     | `power3.out`                                |

---

## 015 — Container Ship Water Animation

| Property       | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| **Name**       | Ocean Foam / Wake Loop                                       |
| **Trigger**    | Continuous (section is visible)                              |
| **Purpose**    | Make ship appear to be sailing                               |
| **Effect**     | Water foam/bubble particles emanate from bow and sides       |
| **Type**       | Particle system OR shader animation OR looping video texture |
| **Speed**      | Constant                                                     |
| **Continuity** | Looping                                                      |

---

## 016 — Ship Aerial Zoom (Scroll)

| Property    | Value                                                        |
| ----------- | ------------------------------------------------------------ |
| **Name**    | Ship Camera Zoom                                             |
| **Trigger** | Scroll through pinned ship section                           |
| **Effect**  | Camera slowly zooms toward or away from the aerial ship view |
| **Scrub**   | Yes                                                          |
| **Range**   | ~100vh scroll                                                |

---

## 017 — Ship Feature Labels Appear

| Property        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Name**        | Label Radial Reveal                                                |
| **Trigger**     | ScrollTrigger: ship section progresses                             |
| **Effect**      | Each label fades in and slightly moves inward (centripetal motion) |
| **Stagger**     | ~150ms per label, clockwise or random                              |
| **Opacity**     | 0 → 1                                                              |
| **Translation** | ~20px toward center → 0                                            |

---

## 018 — Wipe Panel Transition

| Property        | Value                                                       |
| --------------- | ----------------------------------------------------------- |
| **Name**        | Cinematic Wipe Panel                                        |
| **Trigger**     | Scroll (pinned/scrubbed)                                    |
| **Object**      | Black vertical center panel                                 |
| **Phase 1**     | Panel enters from center, grows outward (width: 0→50%→100%) |
| **Phase 2**     | Panel holds full width briefly                              |
| **Phase 3**     | Panel retracts to reveal next section                       |
| **Text inside** | Word shuffle animation cycles through keywords              |
| **Method**      | `clip-path: inset(0 X% 0 X%)` where X animated 50→0         |
| **Duration**    | ~0.5–1.0s per phase                                         |

---

## 019 — Word Shuffle / Slot Machine

| Property     | Value                                                               |
| ------------ | ------------------------------------------------------------------- |
| **Name**     | Word Cycling Animation                                              |
| **Location** | Inside wipe panel (Scene 8)                                         |
| **Effect**   | Multiple text values cycle through same DOM position                |
| **Words**    | "RELIABILITY", "EVERY", "MILESTONE", "TRUST" (estimated)            |
| **Speed**    | ~100–150ms per word                                                 |
| **Method**   | GSAP timeline with `display: none/block` toggle or translateY shift |

---

## 020 — Aircraft Banking Animation

| Property       | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| **Name**       | Aircraft Flight Animation                                          |
| **Trigger**    | Scroll + continuous                                                |
| **Effect**     | Aircraft subtly banks (Z-rotation ±3°) as if in turbulence or turn |
| **Continuous** | Gentle sine-wave oscillation                                       |
| **Scroll**     | Camera angle shifts as scroll progresses                           |
| **Duration**   | ~3–4s continuous sine cycle                                        |

---

## 021 — Cloud Movement

| Property    | Value                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| **Name**    | Cloud Parallax                                                          |
| **Trigger** | Continuous (section visible)                                            |
| **Effect**  | Clouds drift slowly across background                                   |
| **Type**    | 3D cloud shader with uTime OR multiple cloud layers on different tracks |
| **Speed**   | Very slow — ~0.01 world units/second                                    |

---

## 022 — Testimonial Content Reveal

| Property     | Value                                                     |
| ------------ | --------------------------------------------------------- |
| **Name**     | Testimonial Entrance                                      |
| **Trigger**  | ScrollTrigger: section enters                             |
| **Effect**   | Heading reveals left-to-right, card slides in from bottom |
| **Duration** | ~0.6–0.8s                                                 |
| **Ease**     | `power3.out`                                              |
