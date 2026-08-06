# 03 — Motion Analysis

**Project**: 3D Atlas  
**Purpose**: Classify every motion event — type, speed, direction, easing, and engineering approach

---

## Motion Classification System

| Class             | Code  | Description                             |
| ----------------- | ----- | --------------------------------------- |
| Camera            | CAM   | Camera position, rotation, zoom, FOV    |
| Object Linear     | OBJ-L | Object translates linearly (X/Y/Z)      |
| Object Rotational | OBJ-R | Object rotates around an axis           |
| Object Scale      | OBJ-S | Object scales up or down                |
| DOM Translation   | DOM-T | HTML element moves (translateX/Y)       |
| DOM Opacity       | DOM-O | HTML element fades in/out               |
| DOM Clip          | DOM-C | HTML element is revealed via clip-path  |
| Background Color  | BG-C  | Background interpolates between colors  |
| Particle          | PAR   | Particle system continuous or triggered |
| Text              | TXT   | Text character/word/line animation      |
| Split/Wipe        | WIP   | Geometric split or wipe reveal          |

---

## MOTION EVENT 01 — Globe Y Rotation (Continuous)

| Property           | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Class**          | OBJ-R                                                         |
| **Object**         | Earth globe sphere                                            |
| **Axis**           | Y (world space)                                               |
| **Direction**      | Positive Y (counter-clockwise when viewed from top)           |
| **Speed**          | ~0.5–1° per second                                            |
| **Duration**       | Continuous (entire hero section)                              |
| **Ease**           | None — constant angular velocity                              |
| **Trigger**        | `useFrame` — runs every render tick                           |
| **Evidence**       | Australia position changes measurably from F0036→F0048 (0.5s) |
| **Implementation** |                                                               |

```
useFrame((_, delta) => {
  globeRef.current.rotation.y += 0.001 * delta * 60
})
```

---

## MOTION EVENT 02 — Globe Camera Z Pull-Back (Scroll)

| Property        | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| **Class**       | CAM                                                          |
| **Target**      | `camera.position.z`                                          |
| **Start value** | `3.5`                                                        |
| **End value**   | `7.0`                                                        |
| **Range**       | Hero scroll section: `0% → 100%` of pin duration             |
| **Direction**   | Positive Z (away from globe)                                 |
| **Speed**       | Proportional to scroll velocity                              |
| **Ease**        | Linear (scrub, no easing)                                    |
| **Trigger**     | ScrollTrigger scrub                                          |
| **Effect**      | Globe appears to shrink as camera retreats                   |
| **Evidence**    | Globe size decreased ~18% between KF-01 and KF-02 over ~0.5s |

---

## MOTION EVENT 03 — Atmosphere Gradient (Scroll-Driven BG)

| Property                | Value                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| **Class**               | BG-C                                                                       |
| **Target**              | Page/wrapper `background` CSS property                                     |
| **Start color**         | `#080808`                                                                  |
| **Intermediate colors** | `#0a1040`, `#1a5ec8`, `#8ac0e8`                                            |
| **End color**           | `#F5F4F0`                                                                  |
| **Duration (video)**    | ~0.5s                                                                      |
| **Ease**                | Linear (scroll-scrubbed)                                                   |
| **Direction**           | Colors advance through spectrum as scroll increases                        |
| **Implementation**      | GSAP `to()` with `scrollTrigger: { scrub: 1 }` OR CSS custom property lerp |

---

## MOTION EVENT 04 — H1 Text Reveal (Clip-Path Slide)

| Property              | Value                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Class**             | DOM-C                                                                               |
| **Target**            | `<span>` wrappers for each H1 line                                                  |
| **Animation**         | `translateY: 100% → 0` (slides up from below clip boundary)                         |
| **Lines**             | 3 — staggered                                                                       |
| **Duration per line** | ~0.9s                                                                               |
| **Stagger**           | 0.12s per line                                                                      |
| **Ease**              | `power4.out`                                                                        |
| **Trigger**           | Page load, delay 0.3s                                                               |
| **Total duration**    | ~1.1s (line 1 starts + 2 stagger delays + 0.9s)                                     |
| **Evidence**          | H1 is fully revealed in KF-01 (t=1.46s). If load was at t=0, reveal started ~t=0.3s |

---

## MOTION EVENT 05 — Stat Counter Count-Up

| Property          | Value                                                                       |
| ----------------- | --------------------------------------------------------------------------- |
| **Class**         | TXT                                                                         |
| **Target**        | Stat number DOM elements                                                    |
| **Values**        | `0 → 2500` (for "2 500+"), `0 → 98.2` (for "98.2%"), `0 → 8` (for "8+")     |
| **Duration**      | ~1.5–2.0s each                                                              |
| **Ease**          | `power2.out` (eases into final value)                                       |
| **Trigger**       | ScrollTrigger `once: true`, `start: "top 70%"`                              |
| **Evidence**      | "2 500+" and "98.2%" both visible in KF-05 (t=3.08s) with counter completed |
| **Number format** | Space as thousand separator (European: "2 500")                             |

---

## MOTION EVENT 06 — Crane Boom Rotation (Scroll Phase 1)

| Property         | Value                                             |
| ---------------- | ------------------------------------------------- |
| **Class**        | OBJ-R                                             |
| **Object**       | Crane boom arm                                    |
| **Pivot**        | Base joint of boom on crane body                  |
| **Start angle**  | ~40° from horizontal                              |
| **End angle**    | ~50° from horizontal                              |
| **Scroll range** | 0–45% of crane pin section                        |
| **Direction**    | Counterclockwise (viewed from right) — boom rises |
| **Ease**         | Linear (scrub)                                    |
| **Evidence**     | F0088→F0100: boom angle measurably increased      |

---

## MOTION EVENT 07 — Container Lift (Scroll Phase 2)

| Property             | Value                                      |
| -------------------- | ------------------------------------------ |
| **Class**            | OBJ-L                                      |
| **Object**           | White ISO container (top of stack)         |
| **Axis**             | Y (world space)                            |
| **Direction**        | Positive Y (upward)                        |
| **Start position Y** | Top of container stack                     |
| **End position Y**   | Apex — top of frame (~80% of crane height) |
| **Scroll range**     | 45–65% of crane pin section                |
| **Ease**             | Linear (scrub)                             |
| **Evidence**         | KF-07: container clearly at apex position  |

---

## MOTION EVENT 08 — Crane Body Lateral (Scroll Phase 3)

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| **Class**        | OBJ-L                                              |
| **Object**       | Entire crane (body + boom + spreader + container)  |
| **Axis**         | X (world space)                                    |
| **Direction**    | Negative X (leftward)                              |
| **Start X**      | Center-left (~30% from left edge)                  |
| **End X**        | Far left (~15% from left edge)                     |
| **Scroll range** | 65–100% of crane pin section                       |
| **Ease**         | Linear (scrub)                                     |
| **Evidence**     | KF-07→KF-08: crane body moved ~35% across viewport |

---

## MOTION EVENT 09 — Crane Boom Descend (Scroll Phase 3, simultaneous)

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Class**        | OBJ-R                                                        |
| **Object**       | Crane boom                                                   |
| **Direction**    | Clockwise (viewed from right) — boom drops                   |
| **Start angle**  | ~50°                                                         |
| **End angle**    | ~10° (nearly horizontal)                                     |
| **Scroll range** | 65–100% (simultaneous with M08)                              |
| **Ease**         | Linear (scrub)                                               |
| **Note**         | Boom drops at same time as crane moves left — "carry" motion |

---

## MOTION EVENT 10 — Truck Entry

| Property           | Value                                                               |
| ------------------ | ------------------------------------------------------------------- |
| **Class**          | OBJ-L                                                               |
| **Object**         | Semi-truck (full model)                                             |
| **Axis**           | X or Z                                                              |
| **Direction**      | Into frame (from right or from below)                               |
| **Ease**           | `power2.out`                                                        |
| **Duration**       | ~0.5–0.8s (estimated)                                               |
| **Trigger**        | Crane section exits, truck section enters viewport                  |
| **Implementation** | UNKNOWN — either the truck slides in OR it fades in on a new canvas |

---

## MOTION EVENT 11 — Services Dark Split (DOM Wipe)

| Property           | Value                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **Class**          | WIP                                                                                                  |
| **Object**         | Dark `#111111` services section background                                                           |
| **Direction**      | Rising from bottom                                                                                   |
| **Start**          | 0% of viewport                                                                                       |
| **End**            | 100% of viewport (full reveal)                                                                       |
| **Scroll range**   | Services section entry                                                                               |
| **Ease**           | Linear (scroll-driven)                                                                               |
| **Evidence**       | KF-10: 65% of viewport covered by dark, 35% still white                                              |
| **Implementation** | CSS `clip-path: inset(X% 0 0 0)` shrinking to 0%, OR services section sticky with `overflow: hidden` |

---

## MOTION EVENT 12 — Word Shuffle (Services Entry)

| Property           | Value                                                             |
| ------------------ | ----------------------------------------------------------------- |
| **Class**          | TXT                                                               |
| **Target**         | 3 lines of shuffling text in services entry area                  |
| **Lines**          | "EVERYTHING YOUR", "FREIGHT NEEDS.", "UNDER ONE GROUP."           |
| **Animation**      | Each word cycles through random characters/words before settling  |
| **Speed**          | ~100–150ms per swap                                               |
| **Total duration** | ~0.8–1.2s                                                         |
| **Trigger**        | Section enter viewport                                            |
| **Evidence**       | KF-10: letters partially through cycle ("COUR" instead of "YOUR") |
| **Pattern**        | Slot-machine: characters or words cycle from random to final      |

---

## MOTION EVENT 13 — Word Shuffle (Wipe Panel)

| Property          | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| **Class**         | TXT                                                                 |
| **Target**        | 4 lines of text left of black panel                                 |
| **Lines**         | "RELIABILITY", "AT EVERY", "MILESTONE", "MILESTONE" (then resolves) |
| **Animation**     | Same slot-machine pattern                                           |
| **Trigger**       | Wipe section pin                                                    |
| **Scroll-driven** | Possibly scrubbed — word changes at certain scroll positions        |
| **Evidence**      | KF-12: "MILESTONE" appears twice — text mid-cycle                   |

---

## MOTION EVENT 14 — Wipe Panel Grow

| Property           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| **Class**          | WIP                                                    |
| **Object**         | Black `#111111` vertical center panel                  |
| **Direction**      | Expanding horizontally outward from center             |
| **Start width**    | 0%                                                     |
| **Peak width**     | ~30–35% of viewport                                    |
| **End width**      | Shrinks away OR panel exits as ship scene reveals      |
| **Ease**           | Scrub-driven (linear)                                  |
| **Implementation** | `clip-path: inset(0 X% 0 X%)` where X shrinks toward 0 |

---

## MOTION EVENT 15 — Ship Camera Zoom-In (Aerial)

| Property         | Value                                             |
| ---------------- | ------------------------------------------------- |
| **Class**        | CAM                                               |
| **Target**       | `camera.position.y` (aerial top-down camera)      |
| **Start**        | `Y = 20` (far above)                              |
| **End**          | `Y = 10` (half distance)                          |
| **Direction**    | Negative Y (descending toward ship)               |
| **Scroll range** | 0–40% of ship pin section                         |
| **Ease**         | `power2.inOut`                                    |
| **Effect**       | Ship appears to double in size                    |
| **Evidence**     | KF-13→KF-14: ship grew from ~40% to ~60% viewport |

---

## MOTION EVENT 16 — Ship Camera Pull-Back

| Property         | Value                                               |
| ---------------- | --------------------------------------------------- |
| **Class**        | CAM                                                 |
| **Target**       | `camera.position.y`                                 |
| **Start**        | `Y = 10`                                            |
| **End**          | `Y = 20`                                            |
| **Direction**    | Positive Y (ascending)                              |
| **Scroll range** | 60–100% of ship pin section                         |
| **Ease**         | `power2.inOut`                                      |
| **Effect**       | Ship shrinks, feature labels frame it               |
| **Evidence**     | KF-14→KF-15: ship shrank from ~60% to ~25% viewport |

---

## MOTION EVENT 17 — Ship Feature Labels Fade-In

| Property      | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| **Class**     | DOM-O + DOM-T                                                 |
| **Target**    | 3 feature label elements                                      |
| **Animation** | `opacity: 0→1` + slight centripetal `translate` toward center |
| **Stagger**   | ~150ms                                                        |
| **Duration**  | ~0.5s each                                                    |
| **Trigger**   | Ship scroll progress 60–80%                                   |

---

## MOTION EVENT 18 — Aircraft Zoom-In (Scroll-Driven)

| Property         | Value                                                            |
| ---------------- | ---------------------------------------------------------------- |
| **Class**        | CAM                                                              |
| **Target**       | Camera position moving toward aircraft                           |
| **Start**        | Aircraft ~3% viewport size                                       |
| **End**          | Aircraft ~25–30% viewport size                                   |
| **Scroll range** | 0–100% of aircraft pin section                                   |
| **Ease**         | `power2.inOut`                                                   |
| **Direction**    | Camera moving toward aircraft (negative Z, or aircraft-relative) |
| **Evidence**     | KF-16→KF-17: 8× apparent size increase                           |

---

## MOTION EVENT 19 — Testimonials H2 Reveal

| Property      | Value                                                |
| ------------- | ---------------------------------------------------- |
| **Class**     | DOM-C                                                |
| **Target**    | "TRUSTED BY BUSINESSES ACROSS APAC" — 3 lines        |
| **Animation** | `translateY: 100% → 0` behind overflow-hidden parent |
| **Stagger**   | 0.1s per line                                        |
| **Duration**  | ~0.7s per line                                       |
| **Ease**      | `power4.out`                                         |
| **Trigger**   | Section enters viewport                              |

---

## Motion Easing Map

| Motion                 | Easing         | Rationale                             |
| ---------------------- | -------------- | ------------------------------------- |
| Scroll-scrubbed camera | Linear         | Must match scroll 1:1                 |
| Text clip-path reveals | `power4.out`   | Cinematic, decelerates into place     |
| Stat counters          | `power2.out`   | Natural deceleration near final value |
| Word shuffle           | None / step    | Stochastic letter/word swap           |
| DOM fade-ups           | `power2.out`   | Gentle entry                          |
| Wipe panels            | Linear (scrub) | Proportional to scroll                |
| Ship camera zoom       | `power2.inOut` | Smooth in AND out for cinematic feel  |

---

## Speed Classification

| Speed      | Scroll Range | Description                            |
| ---------- | ------------ | -------------------------------------- |
| Ultra-fast | < 50vh       | Word shuffles, brief transitions       |
| Fast       | 50–100vh     | Atmospheric descent, split reveals     |
| Medium     | 100–150vh    | Hero pull-back, truck → services       |
| Slow       | 150–200vh    | Ship zoom phases                       |
| Very slow  | 200–350vh    | Crane full animation (longest section) |

---

## Motion Overlap Map

Multiple motions running simultaneously at key moments:

| Time           | Simultaneous Motions                                 |
| -------------- | ---------------------------------------------------- |
| Page load      | H1 lines stagger (3 sequential) + globe Y-rotation   |
| Hero scroll    | Globe pull-back (CAM) + Globe Y-rotation (OBJ-R)     |
| Crane 65–100%  | Boom descend + Crane lateral move + Container follow |
| Ship 40–60%    | Ship zoom holding + Text overlay fade-in             |
| Aircraft entry | Camera zoom + Continuous aircraft banking            |
| Testimonials   | Aircraft fade-out + H2 reveal + client card stagger  |
