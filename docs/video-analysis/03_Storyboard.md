# 03 — Storyboard

**Project**: 3D Atlas  
**Format**: Frame-by-frame visual description for each scene  
**Basis**: 97 frames at 8fps + 48 frames at 4fps

---

> Each storyboard panel describes what a developer needs to see to reconstruct the frame precisely. Think like a VFX supervisor writing a shot breakdown.

---

## PANEL 01 — Globe Hero (Opening State)

**Video Time**: `00:01.0` — `00:02.2`  
**Representative Frame**: F0012 (t=1.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Pure black (#080808)                                        │
│                                                                         │
│ LAYER 0 (WebGL Canvas):                                                 │
│   Earth sphere — right 55% of screen                                    │
│   • Dark matte surface, barely visible continent outlines               │
│   • Vivid electric blue atmosphere rim (Fresnel glow)                   │
│   • Orange/red thermal cloud glow — top of globe                        │
│   • White dot+arc route network on globe surface                        │
│   • Red location pin — Australia area                                   │
│   • Globe slowly rotating counter-clockwise (west→east)                 │
│   • Globe cropped by right viewport edge (~20-30% clipped)              │
│                                                                         │
│ LAYER 1 (DOM — left column, ~45% width):                                │
│   • "ONE OPERATOR" — small caps, wide tracking, white, ~13px            │
│   • 3px vertical gap                                                    │
│   • "EVERY" — 900 weight, ~96px, white, all-caps                        │
│   • "LEG OF THE" — same                                                 │
│   • "JOURNEY" — same                                                    │
│   • ~32px gap                                                           │
│   • Body copy — 3 lines, ~16px, rgba(255,255,255,0.65)                  │
│   • ~40px gap                                                           │
│   • [WHITE PILL BUTTON] [TEXT LINK]                                     │
│                                                                         │
│ LAYER 2 (Navbar — fixed top):                                           │
│   • Logo top-left                                                       │
│   • 6 nav links — vertical stack, left column                           │
│   • CTA pill button — top right                                         │
│                                                                         │
│ LAYER 3 (Cursor — fixed):                                               │
│   • Ring cursor, ~40px, 2px white outline                               │
└────────────────────────────────────────────────────────────────────────┘
```

**Opening Frame** (t=1.0s): Globe visible, all hero text rendered, static.  
**Ending Frame** (t=2.2s): Globe still visible but viewport has scrolled — content beginning to exit top of screen. Camera Z slightly increased.  
**Key Visual**: Globe occupying the right half, ocean/atmosphere glow dominant visual element.

---

## PANEL 02 — Atmospheric Descent

**Video Time**: `00:02.2` — `00:02.7`  
**Representative Frame**: F0020 (t=2.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND GRADIENT (top to bottom):                                    │
│   • Top 25%: Near black (#080808)                                       │
│   • Middle 40%: Electric blue (#1a5ec8 → #2a7ef0)                      │
│   • Bottom 35%: Sky blue → off white (#a0c8f0 → #f5f4f0)              │
│                                                                         │
│ Custom cursor ring visible (white on left side)                         │
│                                                                         │
│ No text visible                                                         │
│ No 3D objects visible (globe has scrolled off)                          │
└────────────────────────────────────────────────────────────────────────┘
```

**Opening Frame**: Gradient begins — globe exiting top.  
**Ending Frame**: Full gradient visible, off-white bottom 50%.  
**Key Visual**: The atmospheric blue band — this is the visual metaphor of "coming down from orbit."

---

## PANEL 03 — Editorial Brand Statement

**Video Time**: `00:02.7` — `00:03.5`  
**Representative Frame**: F0024 (t=2.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Off-white (#F5F4F0)                                         │
│                                                                         │
│ LEFT COLUMN (~55% width):                                               │
│   • [tiny aerial highway photo] — ~80px square, top-left               │
│   • "WE MOVE" — 900 weight, ~72px, black, all-caps                      │
│   • "FREIGHT." — same                                                   │
│   • "WE OWN" — same                                                     │
│   • "THE OUTCOME." — same                                               │
│   Text is partially cut off at left edge in video (camera angle)        │
│                                                                         │
│ RIGHT COLUMN (~40% width):                                              │
│   • Body copy — 2 paragraphs, ~15px, dark grey                          │
│   • Thin horizontal rule (line separator)                               │
│   • Stat row: label above                                               │
│   • "2 500+" — 900 weight, ~96px, black                                 │
│   • Stat label below — small, grey, ~12px                               │
│                                                                         │
│ Custom cursor ring (circle) visible left side                           │
└────────────────────────────────────────────────────────────────────────┘
```

**Opening Frame**: Section just entered viewport — text may be mid-animation.  
**Ending Frame**: Crane arm beginning to appear at bottom — overlap with S04.  
**Key Visual**: The massive "2 500+" stat number competing with the bold H2.

---

## PANEL 04A — Reach Stacker (Container Pick Phase)

**Video Time**: `00:03.9` — `00:04.5`  
**Representative Frame**: F0032 (t=3.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Pure white (#FFFFFF)                                         │
│                                                                         │
│ 3D SCENE (WebGL Canvas — full viewport, alpha transparent):             │
│                                                                         │
│   REACH STACKER MODEL (left-center):                                    │
│   • Teal/mid-blue body (#2A90C5)                                        │
│   • 4 large rubber tires (black)                                        │
│   • Cab visible right side of vehicle body                              │
│   • Boom arm: extended upward to ~50° angle, reaching right             │
│   • Spreader at top of boom: horizontal bar with yellow safety stripes  │
│   • White container attached to spreader: ~40ft ISO container           │
│     (this is the container being HELD at the apex of the lift)          │
│                                                                         │
│   CONTAINER STACK (right side):                                         │
│   • Stack is 3 high, 2 wide arrangement                                 │
│   • Top container: white/grey (the one being lifted)                    │
│   • Middle-right: dark navy blue container                              │
│   • Bottom-right×2: red/burgundy containers side by side               │
│                                                                         │
│ No text visible in this frame                                           │
│ No navbar visible (obscured by white background blend)                  │
│ Custom cursor visible (small ring, left background area)                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 04B — Reach Stacker (Horizontal Carry Phase)

**Video Time**: `00:05.0` — `00:05.4`  
**Representative Frame**: F0040 (t=4.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Pure white                                                  │
│                                                                         │
│ 3D SCENE:                                                               │
│   REACH STACKER (moved significantly left):                             │
│   • Crane body now at far left (~15% from left edge)                    │
│   • Boom arm now nearly HORIZONTAL, extending right                     │
│   • 40ft container suspended horizontally beneath boom                  │
│     (THIS is the visual connection to the truck scene)                  │
│   • Container is white/light grey — full-width ISO proportions          │
│                                                                         │
│   CONTAINER STACK (moved to right edge):                                │
│   • Only 2 containers remain (blue + red), far right                    │
│   • Stack has decreased in height — 1 was taken                        │
│                                                                         │
│ The horizontal container beneath the crane IS the truck's container     │
│ — this is the visual transition mechanism                               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 05 — Semi-Truck (Road Freight)

**Video Time**: `00:05.4` — `00:05.9`  
**Representative Frame**: F0044 (t=5.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Off-white → near-white                                      │
│                                                                         │
│ 3D SCENE (WebGL Canvas):                                                │
│   SEMI-TRUCK (center-right, side profile):                              │
│   • Dark charcoal/black cab — right side (engine unit)                  │
│   • Silver/white 40ft ISO container trailer — left side (body)          │
│   • 6-axle undercarriage visible                                        │
│   • Standard rigid-coupling                                             │
│   • Container: ribbed silver texture, visible seams                     │
│   • Cab: visible air intakes, mirrors, windshield                       │
│   • A small device/camera mounted atop cab visible                      │
│   • Truck positioned center-screen, slight left bias                    │
│   • Viewing angle: direct side-on, eye-level or slightly below          │
│                                                                         │
│ At very top of frame:                                                   │
│   • Crane boom still partially visible (overlap moment)                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 06A — Services Grid (Transition In)

**Video Time**: `00:05.9` — `00:06.4`  
**Representative Frame**: F0048 (t=5.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ SPLIT VIEWPORT:                                                         │
│                                                                         │
│ TOP HALF (white bg):                                                    │
│   • Truck visible (slightly above center)                               │
│   • Off-white background                                                │
│                                                                         │
│ BOTTOM HALF (dark bg, #111111):                                         │
│   • Shuffling/cycling text — right side:                                │
│     "EVERYTHING YOUR FREIGHT NEEDS UNDER ONE GROUP"                     │
│     Words appear to be animating/cycling rapidly                        │
│     Multiple words stacked and shuffling                                │
│   • Pill-shaped CTA button center: "OR RESET" (dark/black pill)        │
│                                                                         │
│ TRANSITION LINE: Hard horizontal cut between white/dark                 │
│   Truck model straddles this line                                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 06B — Services Grid (Full State)

**Video Time**: `00:06.4` — `00:07.0`  
**Representative Frame**: F0052 (t=6.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: #111111 (near-black)                                        │
│                                                                         │
│ TOP: Truck barely visible at very top edge (scrolling off)              │
│                                                                         │
│ FEATURE GRID (5 columns, left to right):                                │
│   Col 1: [✈ airplane icon] / "AIR" / "FREIGHT"  / body copy            │
│   Col 2: [✈ airplane icon] / "INT" / "FREIGHT"  / body copy            │
│   Col 3: [🚢 ship icon]   / "OCEAN"/"FREIGHT"  / body copy            │
│   Col 4: [🚢 ship icon]   / "DEBOX"/"FREIGHT"  / body copy            │
│   Col 5: [📦 box icon]    / "3PL/CUSTOMS"      / body copy            │
│                                                                         │
│   Each column: icon ~24px + title + ~2 lines body copy                 │
│   Icon style: outline/minimal, white on dark                           │
│                                                                         │
│ BOTTOM CENTER:                                                          │
│   [OR GRANT] — pill-shaped CTA button, dark outline or filled           │
│   Label appears to be "OUR GRANT" or "OR GRANT" (unclear)              │
└────────────────────────────────────────────────────────────────────────┘
```

**CORRECTION to Phase 2 doc**: Features are **5 columns** (not 4), representing: Air Freight, International Air Freight, Ocean Freight, Deboxing/FCL Freight, Customs.

---

## PANEL 07 — Wipe Transition Panel

**Video Time**: `00:07.3` — `00:07.9`  
**Representative Frame**: F0060 (t=7.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: White (#FFFFFF)                                             │
│                                                                         │
│ LEFT SECTION (~35% width, white bg):                                   │
│   Word shuffle text — 4 stacked lines, cycling:                        │
│   • "RELIABILITY"                                                       │
│   • "AT EVERY"                                                          │
│   • "MILESTONE"                                                         │
│   • "MILESTONE" (appears twice — still mid-cycle)                      │
│   Each line: bold/black, ~18-24px, cycling through values               │
│   Lines appear to shuffle independently                                 │
│                                                                         │
│ CENTER (~30% width):                                                    │
│   BLACK VERTICAL PANEL — solid #111111                                  │
│   Panel width: ~25-30% of viewport                                     │
│   Panel height: full viewport height                                    │
│   Appears to grow outward from center                                   │
│   Contains no text inside                                               │
│                                                                         │
│ RIGHT SECTION (~35% width, white bg):                                  │
│   • Small circle icon                                                   │
│   • "REAL-TIME FREIGHT TRACKING" — label                               │
│   • 2-3 lines of small body copy below label                           │
│                                                                         │
│ BELOW: Blue ocean beginning to appear (S08 peeking through)             │
│   In F0064: bottom ~40% shows blue bg + colorful containers starting   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 08A — Container Ship (Zoom In Phase)

**Video Time**: `00:07.9` — `00:09.0`  
**Representative Frame**: F0068 (t=8.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Deep ocean blue (#133D77 approx)                            │
│                                                                         │
│ 3D SCENE (full viewport canvas):                                        │
│   CONTAINER SHIP — aerial top-down view:                                │
│   Position: CENTER of screen                                            │
│   Scale: Medium — ship occupies ~40% viewport height                    │
│                                                                         │
│   Ship orientation: VERTICAL (bow at top, stern at bottom)              │
│   • 3 rows of containers visible from above                             │
│   • Row 1 (top/bow): 6-8 containers across, colors:                    │
│     Green | Red | Red | Blue | Red (reading left to right)              │
│   • Row 2 (mid): 6-8 containers, colors:                               │
│     Pink/Magenta | White | Red | Pink | Orange                          │
│   • Row 3 (stern): 6-8 containers, colors:                             │
│     Blue | White | Red | Pink | ... (narrower)                         │
│                                                                         │
│   WATER EFFECT around hull:                                             │
│   • White foam/bubble particles along sides                             │
│   • Brighter foam at bow (ship "moving" upward)                        │
│   • Darker water trails behind stern                                    │
│                                                                         │
│ CURSOR: Ring cursor visible left side (~20% from left)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 08B — Container Ship + Text Overlay

**Video Time**: `00:09.3` — `00:09.6`  
**Representative Frame**: F0076 (t=9.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Deep blue (same)                                            │
│                                                                         │
│ 3D SCENE:                                                               │
│   Ship ZOOMED IN — now fills ~55-60% viewport height                   │
│   Container details more legible                                        │
│   Water foam more prominent                                             │
│                                                                         │
│ TEXT OVERLAY (centered below ship):                                     │
│   "LOGISTICS" — white, bold, ~32-40px                                   │
│   "THAT WORKS" — same                                                   │
│   "AS HARD AS" — same                                                   │
│   "YOU DO." — same                                                      │
│   Text is centered horizontally                                         │
│   Text overlaps ship bottom area                                        │
│                                                                         │
│ This text appears to REVEAL as camera zooms in                          │
│ (text was always there, camera movement reveals it)                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 08C — Container Ship Feature Labels

**Video Time**: `00:09.8` — `00:10.4`  
**Representative Frame**: F0080 (t=9.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Deep blue                                                   │
│                                                                         │
│ 3D SCENE: Ship PULLED BACK — smaller, ~30% viewport                    │
│                                                                         │
│ FEATURE LABELS (positioned around ship):                                │
│   TOP-LEFT area: [circle icon] "COMPANIES YOU CAN TRUST" / sub-text    │
│   TOP-RIGHT area: [circle icon] "COMPETITIVE TRANSPARENT PRICING"      │
│   BOTTOM-CENTER: "AFTER-HOURS RESOLUTION" / sub-text                   │
│   (Top labels: "CONTROLLED" and "RELIABILITY" seen in other frames)    │
│                                                                         │
│ Each label: icon + all-caps title + 2-3 lines body copy                 │
│ Icon style: thin white outline circle with symbol inside                │
│                                                                         │
│ Custom cursor visible left side                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 09 — Aircraft in Clouds

**Video Time**: `00:10.5` — `00:10.9`  
**Representative Frame**: F0084 (t=10.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Sky — deep blue-purple upper → white clouds lower           │
│                                                                         │
│ 3D SCENE:                                                               │
│   AIRCRAFT: Small in center frame, emerging from clouds                 │
│   • White/light grey fuselage                                           │
│   • Red tail — vertical stabilizer with red livery                      │
│   • Banking slightly left                                               │
│   • Cloud formations surrounding aircraft: below and sides              │
│   • Sky blue-purple above clouds                                        │
│   Camera: slightly above-left, looking down-right at aircraft           │
│                                                                         │
│ Custom cursor ring visible (left side, near top)                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 10A — Testimonials (Entry)

**Video Time**: `00:10.9` — `00:11.4`  
**Representative Frame**: F0088 (t=10.875s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Off-white (#F5F4F0) with aircraft still partially visible   │
│                                                                         │
│ LEFT COLUMN:                                                            │
│   "TRUSTED" — black, 900 weight, ~72px, all-caps                        │
│   "BY BUSINESSES" — same                                                │
│   "ACROSS APAC" — grey/lighter weight (same family, reduced opacity)    │
│   • Custom cursor ring visible below heading                            │
│                                                                         │
│ BELOW HEADING:                                                          │
│   • Red horizontal accent line (~60px long) — separator                 │
│                                                                         │
│ RIGHT AREA (60% width):                                                 │
│   Aircraft: white fuselage + blue engine + red tail visible top-right   │
│   Aircraft appears to be fading or zooming out                          │
│   Small text labels visible (testimonial content beginning)             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## PANEL 10B — Testimonials (Full)

**Video Time**: `00:11.4` — `00:12.0`  
**Representative Frame**: F0092 (t=11.375s)

```
┌────────────────────────────────────────────────────────────────────────┐
│ BACKGROUND: Off-white                                                   │
│                                                                         │
│ LEFT COLUMN:                                                            │
│   "TRUSTED BY BUSINESSES ACROSS APAC" (heading — already visible)      │
│   Custom cursor ring (~left 15%)                                        │
│                                                                         │
│ CENTER-LEFT (~30% from left):                                           │
│   CLIENT CARD 1:                                                        │
│   • Square photo thumbnail (~100px) — female client                     │
│   • Name below photo (2 lines — name + title/company)                  │
│                                                                         │
│ CENTER-RIGHT to RIGHT:                                                  │
│   CLIENT 1 QUOTE:                                                       │
│   • Long paragraph text, ~15px, dark grey                               │
│   • 8–10 lines of text visible                                          │
│   Red accent line at top                                                │
│                                                                         │
│ BOTTOM (scrolling into view):                                           │
│   CLIENT CARD 2:                                                        │
│   • Male client photo thumbnail                                         │
│   • Beginning of second testimonial                                     │
└────────────────────────────────────────────────────────────────────────┘
```
