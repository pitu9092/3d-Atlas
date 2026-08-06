# 01 — Key Frames

**Project**: 3D Atlas  
**Source**: `public/ref.mp4` — 12.095s, analyzed at 24fps (290 frames)  
**Method**: Change-detection analysis — frames captured only when a meaningful visual event occurs  
**Frame ID format**: `KF-[nn]` — sequential keyframe identifier

---

## Key Frame Detection Criteria

A keyframe was captured when ANY of the following changed:

- Scene or background
- Camera position / zoom / target
- Object position / scale / rotation / morph
- Text appearing / exiting / animating
- Lighting or shader state change
- Transition beginning or ending
- New overlay or particle state
- Scroll direction or pin state change

---

## KF-01 — Hero Static State (Canonical)

| Property            | Value                                     |
| ------------------- | ----------------------------------------- |
| **Frame ID**        | KF-01                                     |
| **HD Frame**        | F0036                                     |
| **Timestamp**       | `00:01.46s`                               |
| **Scene**           | S01 — Globe Hero                          |
| **Change detected** | First fully-clear, unobstructed hero view |

### Visible Layers

| Layer              | Content                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| **Background**     | `#080808` near-black, fills entire canvas                                   |
| **WebGL Canvas**   | Earth globe, right half viewport, partially cropped                         |
| **Globe surface**  | Very dark navy-brown, landmasses barely visible                             |
| **Atmosphere**     | Vivid electric blue Fresnel rim glow                                        |
| **Thermal glow**   | Orange-red circular glow, upper hemisphere                                  |
| **Route network**  | White dots + arc lines on globe surface                                     |
| **DOM — Left col** | "ONE OPERATOR" eyebrow, "EVERY LEG OF THE JOURNEY" H1, body copy, 2 buttons |
| **DOM — Navbar**   | Logo (top-left), 6 nav links (vertical left col), pill CTA (top-right)      |
| **Cursor**         | Ring cursor, ~40px, white outline, mid-screen left                          |

### State Notes

- Globe shows Australia/Pacific region — slightly rotated from 0° Y
- Orange thermal glow at approximately 30–60°N latitude band
- Route network: dense cluster visible over Asia-Pacific
- Red location pin: visible at approximately Australia SW coast
- Two CTA buttons: pill-shaped primary (white), text-link secondary

---

## KF-02 — Globe Pulled Back (Scroll State)

| Property            | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| **Frame ID**        | KF-02                                                     |
| **HD Frame**        | F0048                                                     |
| **Timestamp**       | `00:01.96s`                                               |
| **Scene**           | S01 — Globe Hero (scroll in progress)                     |
| **Change detected** | Globe appears smaller — camera Z has increased via scroll |

### What Changed from KF-01

- Globe is measurably smaller (~15% reduction in apparent size)
- Globe has rotated slightly (Y-rotation from continuous spin)
- Route network appears slightly smaller
- DOM text content identical — still hero text

### Camera State

- `position.z`: increased from `~3.5` to `~4.5` (estimated)
- Scroll progress: approximately 35–45% of hero pin range

---

## KF-03 — Atmosphere Gradient (Mid-Transition)

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| **Frame ID**        | KF-03                                               |
| **HD Frame**        | F0060                                               |
| **Timestamp**       | `00:02.46s`                                         |
| **Scene**           | S02 — Atmospheric Descent                           |
| **Change detected** | Background is now a multi-band gradient — hero gone |

### Visible Layers

| Layer            | Content                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| **Background**   | Multi-band gradient (top to bottom):                                    |
| — Top 30%        | Near-black `#080808` → dark navy `#0a1040`                              |
| — Mid 40%        | Deep blue `#1a5ec8` → electric blue `#2a7ef0`                           |
| — Lower 15%      | Sky blue `#8ac0e8`                                                      |
| — Bottom 15%     | Off-white / pale pink `#f0ecec`                                         |
| **WebGL Canvas** | None — no 3D scene                                                      |
| **DOM**          | Bottom-right: faint body copy text beginning to appear                  |
| **Image**        | Bottom-left: small square aerial highway photo thumbnail entering frame |

### State Notes

- Globe has completely exited viewport
- Editorial section content is just barely entering from below
- Bottom 15% shows the top of the editorial section already

---

## KF-04 — Editorial Full State

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| **Frame ID**        | KF-04                                               |
| **HD Frame**        | F0067                                               |
| **Timestamp**       | `00:02.75s`                                         |
| **Scene**           | S03 — Editorial Brand Statement                     |
| **Change detected** | Full off-white background, editorial layout visible |

### Visible Layers

| Layer                       | Content                                                           |
| --------------------------- | ----------------------------------------------------------------- |
| **Background**              | Off-white `#F5F4F0` — complete                                    |
| **DOM — Left col (bottom)** | "WE MOVE / FREIGHT. / WE OWN / THE OUTCOME." (partially in frame) |
| **DOM — Right col**         | Body copy paragraphs (2 visible), stat area                       |
| **Image**                   | Aerial highway photo thumbnail (lower-left)                       |
| **Navbar**                  | Adapting to light background — text appears dark now              |

### Key Discovery

Body copy is clearly visible on right column. The editorial section has TWO columns of body text plus the stat area to the right.

---

## KF-05 — Editorial with Stats (2 500+)

| Property            | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| **Frame ID**        | KF-05                                                    |
| **HD Frame**        | F0075                                                    |
| **Timestamp**       | `00:03.08s`                                              |
| **Scene**           | S03 — Editorial                                          |
| **Change detected** | "2 500+" stat fully visible, "98.2%" second stat appears |

### Visible Layers

| Layer                  | Content                                          |
| ---------------------- | ------------------------------------------------ |
| **Background**         | Off-white                                        |
| **Left col**           | "WE MOVE FREIGHT. WE OWN THE OUTCOME." — full H2 |
| **Image**              | Aerial highway photo (upper-left corner)         |
| **Right col — top**    | `2 500+` — large black number, ~96px             |
| **Right col — label**  | Small grey label below "2 500+"                  |
| **Right col — bottom** | `98.2%` — large black number, ~80px              |
| **Right col — label**  | "On-Time Delivery rate" (visible below 98.2%)    |

### KEY DISCOVERY

**Third stat confirmed**: `98.2%` with label "On-Time Delivery rate" (or similar). This is a NEW data point not previously identified. Stats stack vertically in the right column.

---

## KF-06 — Crane Scene Entry (Phase 0)

| Property            | Value                                          |
| ------------------- | ---------------------------------------------- |
| **Frame ID**        | KF-06                                          |
| **HD Frame**        | F0088                                          |
| **Timestamp**       | `00:03.63s`                                    |
| **Scene**           | S04 — Reach Stacker                            |
| **Change detected** | First clear view of crane on pure white canvas |

### Visible Layers

| Layer                  | Content                                                         |
| ---------------------- | --------------------------------------------------------------- |
| **Background**         | Pure white `#FFFFFF`                                            |
| **WebGL Canvas**       | Reach stacker + container stack                                 |
| **Crane — body**       | Teal `#2A90C5`, 4-wheel base, visible cab                       |
| **Crane — boom**       | Dark graphite arm at ~40° angle, not yet fully extended         |
| **Crane — spreader**   | Horizontal bar at boom apex                                     |
| **Containers — stack** | 2 columns visible: grey-white top, navy blue mid, 2× red bottom |
| **DOM**                | Browser chrome (tab bar visible at top)                         |

### Object State

- Crane body: center-left of frame
- Boom: ~40° upward angle, pointing right toward container stack
- Container stack: right-center (~55% from left edge)
- Spreader not yet touching containers

---

## KF-07 — Crane Container Lift (Phase 2 — Apex)

| Property            | Value                                               |
| ------------------- | --------------------------------------------------- |
| **Frame ID**        | KF-07                                               |
| **HD Frame**        | F0100                                               |
| **Timestamp**       | `00:04.13s`                                         |
| **Scene**           | S04 — Reach Stacker                                 |
| **Change detected** | Container is now attached and raised — apex of lift |

### Visible Layers

| Layer                 | Content                                                             |
| --------------------- | ------------------------------------------------------------------- |
| **Background**        | Pure white                                                          |
| **Crane — boom**      | Extended to ~50°, pointing right, yellow hazard stripes on spreader |
| **Container (held)**  | White/grey ISO container — hanging from spreader, top of frame      |
| **Container — stack** | Navy blue (top, 2 high) + 2× red (bottom), right side               |

### Object State Changes from KF-06

- Boom angle: `40°` → `50°` (extended higher)
- Spreader: descended and locked onto container top
- Container: raised ~30% from original position
- Stack: top container now missing — gap at top of remaining stack

---

## KF-08 — Crane Horizontal Carry (Phase 4)

| Property            | Value                                                |
| ------------------- | ---------------------------------------------------- |
| **Frame ID**        | KF-08                                                |
| **HD Frame**        | F0115                                                |
| **Timestamp**       | `00:04.71s`                                          |
| **Scene**           | S04 — Reach Stacker                                  |
| **Change detected** | Crane has moved fully left, container now horizontal |

### Visible Layers

| Layer                 | Content                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| **Background**        | Pure white                                                                          |
| **Crane**             | Moved far left (~15% from left edge)                                                |
| **Boom**              | Now nearly HORIZONTAL — extended right at ~10° angle                                |
| **Container (held)**  | 40ft container hanging horizontally below boom — massive, fills ~40% viewport width |
| **Container — stack** | Only 2 remaining (navy + red), at far right edge                                    |

### Object State Changes from KF-07

- Crane body: moved ~30% left across viewport
- Boom: descended from 50° to ~10° (nearly horizontal)
- Container: now in carry/transport position — horizontal below boom
- This IS the transition state — connects crane to truck scene

---

## KF-09 — Truck Full State

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **Frame ID**        | KF-09                                              |
| **HD Frame**        | F0130                                              |
| **Timestamp**       | `00:05.33s`                                        |
| **Scene**           | S05 — Road Freight                                 |
| **Change detected** | Full truck visible, side profile, white background |

### Visible Layers

| Layer               | Content                                                          |
| ------------------- | ---------------------------------------------------------------- |
| **Background**      | Off-white (slightly warmer than pure white)                      |
| **WebGL Canvas**    | Semi-truck, full side profile                                    |
| **Truck — trailer** | Silver/white 40ft ISO container, corrugated sides, left portion  |
| **Truck — cab**     | Dark charcoal/black, right side — visible cab structure, mirrors |
| **Truck — chassis** | Visible undercarriage, 5-axle configuration                      |
| **Top of cab**      | Mounted device (GoPro / camera rig) visible on cab roof          |
| **Cursor**          | Ring cursor visible (left side, ~15% from edge)                  |

### Object State

- Truck positioned: center to slight left bias
- Orientation: left-to-right (cab at right, container at left)
- Viewing angle: direct side-on, very slightly below eye level
- Scale: nearly fills viewport width

---

## KF-10 — Services Grid Split (Transition)

| Property            | Value                                                                    |
| ------------------- | ------------------------------------------------------------------------ |
| **Frame ID**        | KF-10                                                                    |
| **HD Frame**        | F0145                                                                    |
| **Timestamp**       | `00:05.96s`                                                              |
| **Scene**           | S05→S06 Transition                                                       |
| **Change detected** | Viewport split: white top (truck), dark bottom (services + word shuffle) |

### Visible Layers

| Layer              | Content                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| **Top 35%**        | White background, truck at top                                            |
| **Split line**     | Hard horizontal divide at ~35% from top                                   |
| **Bottom 65%**     | `#111111` dark background                                                 |
| **Shuffling text** | "EVERYTHING YOUR / FREIGHT NEEDS. / UNDER ONE GROUP." — 3 lines mid-cycle |
| **CTA button**     | Small pill button centered in dark area: "OR RESET" / "FOR RESET"         |

### Word Shuffle State

Lines visible mid-cycle:

```
Line 1: EVERYTHING COUR (letters cycling — mid-animation)
Line 2: FREIGHT NEEDS.
Line 3: UNDER ONE GROUP.
```

Final settled text: "EVERYTHING YOUR FREIGHT NEEDS. UNDER ONE GROUP."

---

## KF-11 — Services Grid Full State

| Property            | Value                               |
| ------------------- | ----------------------------------- |
| **Frame ID**        | KF-11                               |
| **HD Frame**        | F0155 (8fps F0052)                  |
| **Timestamp**       | `00:06.38s`                         |
| **Scene**           | S06 — Services Grid                 |
| **Change detected** | Full 5-column services grid visible |

### Visible Layers

| Layer             | Content                                 |
| ----------------- | --------------------------------------- |
| **Background**    | `#111111` near-black                    |
| **Truck**         | Just visible at very top edge (exiting) |
| **Service col 1** | ✈ icon + "AIR / FREIGHT" + body         |
| **Service col 2** | ✈ icon + "INT / FREIGHT" + body         |
| **Service col 3** | 🚢 icon + "OCEAN / FREIGHT" + body      |
| **Service col 4** | 🚢 icon + "DEBOX / FREIGHT" + body      |
| **Service col 5** | 📦 icon + "3PL/CUSTOMS" + body          |
| **CTA**           | Pill button centered bottom             |

---

## KF-12 — Wipe Panel at Peak

| Property            | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| **Frame ID**        | KF-12                                                    |
| **HD Frame**        | F0180 (8fps F0060)                                       |
| **Timestamp**       | `00:07.38s`                                              |
| **Scene**           | S07 — Wipe Transition                                    |
| **Change detected** | Black vertical panel at ~30% width, word shuffle visible |

### Visible Layers

| Layer            | Content                                                              |
| ---------------- | -------------------------------------------------------------------- |
| **Background**   | White `#FFFFFF`                                                      |
| **Left text**    | "RELIABILITY / AT EVERY / MILESTONE / MILESTONE" — 4 lines shuffling |
| **Center panel** | Black `#111111`, ~30% viewport width, full height                    |
| **Right text**   | Circle icon + "REAL-TIME FREIGHT TRACKING" + body                    |
| **Below**        | Blue ocean beginning to bleed from bottom                            |

---

## KF-13 — Container Ship Full View (Aerial)

| Property            | Value                                          |
| ------------------- | ---------------------------------------------- |
| **Frame ID**        | KF-13                                          |
| **HD Frame**        | F0200 (8fps F0068)                             |
| **Timestamp**       | `00:08.29s`                                    |
| **Scene**           | S08 — Container Ship                           |
| **Change detected** | Full deep blue, aerial ship, water foam active |

### Visible Layers

| Layer          | Content                                                |
| -------------- | ------------------------------------------------------ |
| **Background** | Deep ocean blue `#133D77` approx                       |
| **Ship**       | Aerial top-down, centered, ~40% viewport height        |
| **Containers** | 3 rows, multi-color — green/red/blue/pink/orange/white |
| **Water foam** | White particles around hull                            |
| **Cursor**     | Ring cursor visible left                               |

---

## KF-14 — Ship Zoomed with Text

| Property            | Value                                      |
| ------------------- | ------------------------------------------ |
| **Frame ID**        | KF-14                                      |
| **HD Frame**        | F0226 (8fps F0076)                         |
| **Timestamp**       | `00:09.38s`                                |
| **Scene**           | S08 — Container Ship                       |
| **Change detected** | Camera has zoomed in, text overlay appears |

### Visible Layers

| Layer            | Content                                                                    |
| ---------------- | -------------------------------------------------------------------------- |
| **Background**   | Deep blue                                                                  |
| **Ship**         | Larger — ~60% viewport height (camera moved closer)                        |
| **Text overlay** | "LOGISTICS / THAT WORKS / AS HARD AS / YOU DO." — white, centered, 4 lines |

---

## KF-15 — Ship Feature Labels State

| Property            | Value                                                   |
| ------------------- | ------------------------------------------------------- |
| **Frame ID**        | KF-15                                                   |
| **HD Frame**        | F0240 (8fps F0080)                                      |
| **Timestamp**       | `00:09.88s`                                             |
| **Scene**           | S08 — Container Ship                                    |
| **Change detected** | Camera pulled back, 3 feature labels appear around ship |

---

## KF-16 — Aircraft Far State

| Property            | Value                                   |
| ------------------- | --------------------------------------- |
| **Frame ID**        | KF-16                                   |
| **HD Frame**        | F0250 (8fps F0084)                      |
| **Timestamp**       | `00:10.38s`                             |
| **Scene**           | S09 — Aircraft                          |
| **Change detected** | Sky background, aircraft tiny in center |

### Visible Layers

| Layer          | Content                                                         |
| -------------- | --------------------------------------------------------------- |
| **Background** | Blue-purple sky gradient, white volumetric clouds lower portion |
| **Aircraft**   | Tiny center frame (~3% size) — white fuselage, red tail visible |
| **Clouds**     | Large formation, right and lower portions of frame              |

---

## KF-17 — Aircraft Close + Testimonials Entry

| Property            | Value                                                       |
| ------------------- | ----------------------------------------------------------- |
| **Frame ID**        | KF-17                                                       |
| **HD Frame**        | F0262 (8fps F0088)                                          |
| **Timestamp**       | `00:10.88s`                                                 |
| **Scene**           | S09 + S10 overlap                                           |
| **Change detected** | Aircraft clearly visible, testimonials heading appears left |

### Visible Layers

| Layer          | Content                                             |
| -------------- | --------------------------------------------------- |
| **Background** | Off-white (testimonials) overlapping sky (aircraft) |
| **Aircraft**   | White fuselage, red tail, right side of viewport    |
| **Text left**  | "TRUSTED / BY BUSINESSES / ACROSS APAC" (H2)        |

---

## KF-18 — Testimonials Full State

| Property            | Value                                         |
| ------------------- | --------------------------------------------- |
| **Frame ID**        | KF-18                                         |
| **HD Frame**        | F0278 (8fps F0092)                            |
| **Timestamp**       | `00:11.38s`                                   |
| **Scene**           | S10 — Testimonials                            |
| **Change detected** | Full testimonials layout, two clients visible |

---

## Key Frame Summary Table

| KF    | Time   | Scene         | Primary Change                  |
| ----- | ------ | ------------- | ------------------------------- |
| KF-01 | 1.46s  | Globe Hero    | Hero canonical state            |
| KF-02 | 1.96s  | Globe Hero    | Globe smaller (scroll)          |
| KF-03 | 2.46s  | Atmosphere    | Gradient mid-point              |
| KF-04 | 2.75s  | Editorial     | White BG editorial              |
| KF-05 | 3.08s  | Editorial     | Stats "2 500+" + "98.2%"        |
| KF-06 | 3.63s  | Crane         | Crane scene entry               |
| KF-07 | 4.13s  | Crane         | Container at apex               |
| KF-08 | 4.71s  | Crane         | Horizontal carry state          |
| KF-09 | 5.33s  | Truck         | Truck full view                 |
| KF-10 | 5.96s  | Split         | Services split + word shuffle   |
| KF-11 | 6.38s  | Services      | Full services grid              |
| KF-12 | 7.38s  | Wipe          | Panel + word shuffle            |
| KF-13 | 8.29s  | Ship          | Ship full aerial view           |
| KF-14 | 9.38s  | Ship          | Zoomed + text overlay           |
| KF-15 | 9.88s  | Ship          | Feature labels                  |
| KF-16 | 10.38s | Aircraft      | Aircraft tiny (far)             |
| KF-17 | 10.88s | Aircraft+Test | Aircraft + testimonials heading |
| KF-18 | 11.38s | Testimonials  | Full testimonials layout        |
