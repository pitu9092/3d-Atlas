# 05 — Key Moment Index

**Project**: 3D Atlas  
**Purpose**: Every moment where something visually significant changes — these become implementation checkpoints and unit-test targets.

---

> Format: `[Video Time] — [Frame] — [Category] — [Description]`  
> Categories: `SCENE` | `TEXT` | `CAMERA` | `OBJECT` | `BACKGROUND` | `LIGHTING` | `TRANSITION` | `PARTICLE` | `UI`

---

## CHECKPOINT 01

**Time**: `00:01.0` | **Frame**: F0008 | **Category**: `SCENE`  
**Moment**: Hero fully visible for the first time  
**What changes**: Magic Mouse moves out of frame. Full hero layout exposed — globe, headline, nav, buttons all visible simultaneously.  
**Implementation test**: Assert all hero DOM elements are visible and globe canvas is rendering at 60fps.

---

## CHECKPOINT 02

**Time**: `00:01.2` | **Frame**: F0010 | **Category**: `OBJECT`  
**Moment**: Globe route network visible  
**What changes**: At this zoom level, the white dot network (shipping routes) on the globe surface is clearly visible. Points pulse independently.  
**Implementation test**: Verify Points material is rendering, route arcs are drawn as curved lines.

---

## CHECKPOINT 03

**Time**: `00:01.5` | **Frame**: F0012 | **Category**: `LIGHTING`  
**Moment**: Globe atmosphere Fresnel at full expression  
**What changes**: The electric blue rim glow + orange thermal glow are both clearly visible and at maximum visual impact.  
**Implementation test**: Atmosphere shader renders with Fresnel rim glow. Thermal shader active at north pole area.

---

## CHECKPOINT 04

**Time**: `00:02.0` | **Frame**: F0016 | **Category**: `UI`  
**Moment**: Custom cursor ring first clearly visible  
**What changes**: Mouse cursor is visibly a ring (circle outline) moving across the dark background.  
**Implementation test**: Cursor ring follows mouse with lerp delay. Ring visible on dark background. Ring adapts on light background.

---

## CHECKPOINT 05

**Time**: `00:02.0` | **Frame**: F0016 | **Category**: `CAMERA`  
**Moment**: Globe pull-back begins  
**What changes**: Scroll begins. Globe appears slightly smaller — camera Z is increasing. Globe is beginning to "zoom out."  
**Implementation test**: ScrollTrigger scrub is driving camera Z position. Globe appears smaller as scroll progress increases.

---

## CHECKPOINT 06

**Time**: `00:02.2` | **Frame**: F0018 | **Category**: `TRANSITION`  
**Moment**: T01 transition begins — Globe exit / Atmosphere enter  
**What changes**: Background color begins shifting from near-black toward atmospheric blue gradient.  
**Implementation test**: Background color animation is scroll-driven, transitions through defined color stages.

---

## CHECKPOINT 07

**Time**: `00:02.5` | **Frame**: F0020 | **Category**: `BACKGROUND`  
**Moment**: Atmospheric gradient at peak expression  
**What changes**: Full gradient visible: near-black top → electric blue band → off-white bottom.  
**Implementation test**: Gradient renders correctly at this scroll position. No flash/jump in colors.

---

## CHECKPOINT 08

**Time**: `00:02.7` | **Frame**: F0022 | **Category**: `SCENE`  
**Moment**: Atmospheric section exits — Editorial section enters  
**What changes**: Off-white background completes. Editorial section DOM begins entering viewport from bottom.  
**Implementation test**: Editorial section background is off-white. Text animations are queued for viewport entry.

---

## CHECKPOINT 09

**Time**: `00:03.0` | **Frame**: F0024 | **Category**: `TEXT`  
**Moment**: "WE MOVE FREIGHT. WE OWN THE OUTCOME." fully visible  
**What changes**: H2 text is rendered, presumably after its clip-path reveal animation has completed.  
**Implementation test**: H2 lines are all visible. No clip-path clipping remaining. Text in correct left-column position.

---

## CHECKPOINT 10

**Time**: `00:03.0` | **Frame**: F0024 | **Category**: `TEXT`  
**Moment**: "2 500+" stat counter completed  
**What changes**: Stat counter has counted up to "2 500+" and is now static at final value.  
**Implementation test**: Counter animation fires on viewport entry. Reaches final value "2500+". Space separator (European format) is correct.

---

## CHECKPOINT 11

**Time**: `00:03.5` | **Frame**: F0028 | **Category**: `OBJECT`  
**Moment**: Reach stacker crane first appears  
**What changes**: Crane boom arm enters viewport at bottom of screen while editorial still visible in upper portion.  
**Implementation test**: Crane GLB model is loaded and rendering. Crane appears at correct scroll trigger position.

---

## CHECKPOINT 12

**Time**: `00:03.5` | **Frame**: F0028 | **Category**: `TEXT`  
**Moment**: Second stat value ("8+") begins appearing  
**What changes**: The stat area shows "8+" — a different value from "2 500+" — suggesting either (a) there are multiple stacked stats OR (b) the stat counter was showing a different stat (Years of Operation?) as the view scrolled.  
**Implementation test**: Multiple stats exist. Either scroll-driven swap or separate stacked elements.

---

## CHECKPOINT 13

**Time**: `00:03.9` | **Frame**: F0032 | **Category**: `SCENE`  
**Moment**: Reach stacker scene fully visible  
**What changes**: Full white canvas. Crane + container stack both fully visible. This is the "opening frame" of the crane pin sequence.  
**Implementation test**: Scene renders correctly. Crane model loaded via useGLTF. Canvas background transparent (white DOM shows through).

---

## CHECKPOINT 14

**Time**: `00:03.9` | **Frame**: F0032 | **Category**: `OBJECT`  
**Moment**: Crane holds container at top of lift  
**What changes**: Crane boom arm at ~50° angle. White container attached to spreader at apex. Container stack (blue, red) visible right.  
**Implementation test**: Scroll progress ~50% of crane section. Animation frame shows container at top position.

---

## CHECKPOINT 15

**Time**: `00:05.0` | **Frame**: F0040 | **Category**: `OBJECT`  
**Moment**: Crane carries container horizontally  
**What changes**: Crane has moved significantly left. Boom now nearly horizontal. White 40ft container suspended below. Remaining stack at right edge.  
**Implementation test**: Scroll progress ~85% of crane section. Container position matches this frame.

---

## CHECKPOINT 16

**Time**: `00:05.4` | **Frame**: F0044 | **Category**: `SCENE`  
**Moment**: Truck scene first fully visible  
**What changes**: Semi-truck with 40ft container trailer visible, side profile, on white background.  
**Implementation test**: Truck GLB model loaded and rendering. Canvas alpha transparent (white DOM shows through).

---

## CHECKPOINT 17

**Time**: `00:05.8` | **Frame**: F0048 | **Category**: `TRANSITION`  
**Moment**: T05 — Horizontal split begins (Truck → Services)  
**What changes**: Viewport splits — white top (truck), dark bottom (services emerging). Word shuffle animation begins.  
**Implementation test**: Services section dark background rising. Truck model still visible in upper viewport. Word shuffle text animating.

---

## CHECKPOINT 18

**Time**: `00:05.9` | **Frame**: F0048 | **Category**: `TEXT`  
**Moment**: "EVERYTHING YOUR FREIGHT NEEDS UNDER ONE GROUP" word shuffle  
**What changes**: Words cycling rapidly in services section entry area. This is a slot-machine word reveal.  
**Implementation test**: Word shuffle animation fires on section enter. Words cycle at ~100–150ms each. Text is white on dark.

---

## CHECKPOINT 19

**Time**: `00:06.4` | **Frame**: F0052 | **Category**: `SCENE`  
**Moment**: Full services grid visible  
**What changes**: All 5 service columns visible with icons, titles, body copy. CTA button centered at bottom.  
**Implementation test**: 5 feature columns render correctly. Icons visible. All text legible on dark background.

---

## CHECKPOINT 20

**Time**: `00:07.3` | **Frame**: F0059 | **Category**: `TRANSITION`  
**Moment**: T06 — Wipe panel begins to appear  
**What changes**: Black vertical panel begins growing from center of white viewport.  
**Implementation test**: Panel animation is scroll-scrubbed. Panel starts at 0px width, centered.

---

## CHECKPOINT 21

**Time**: `00:07.4` | **Frame**: F0060 | **Category**: `TEXT`  
**Moment**: Word shuffle text on left of wipe panel  
**What changes**: "RELIABILITY / AT EVERY / MILESTONE / MILESTONE" — 4 lines of shuffling text visible on white area left of panel.  
**Implementation test**: Word shuffle cycling through defined word list. Each line independent.

---

## CHECKPOINT 22

**Time**: `00:07.7` | **Frame**: F0062 | **Category**: `TRANSITION`  
**Moment**: T07 — Blue ocean reveals from below  
**What changes**: Blue background + colorful ship containers begin appearing below the wipe section.  
**Implementation test**: Ship section entering viewport. Blue background color active. Ship canvas beginning to render.

---

## CHECKPOINT 23

**Time**: `00:08.0` | **Frame**: F0064 | **Category**: `SCENE`  
**Moment**: Split view — wipe top, ship containers bottom  
**What changes**: Both sections simultaneously visible — wipe panel still partially occupying upper viewport, ship containers in lower viewport.  
**Implementation test**: No z-fighting between sections. Smooth scroll reveals ship below wipe.

---

## CHECKPOINT 24

**Time**: `00:08.3` | **Frame**: F0068 | **Category**: `SCENE`  
**Moment**: Container ship fully visible (first full frame)  
**What changes**: Full deep blue background. Container ship aerial view center frame. 3 rows of colorful containers. Water foam effect active.  
**Implementation test**: Ship canvas fully covering viewport. Water/foam particle system active. Background solid ocean blue.

---

## CHECKPOINT 25

**Time**: `00:08.3` | **Frame**: F0068 | **Category**: `PARTICLE`  
**Moment**: Ocean foam/wake particles clearly visible  
**What changes**: White foam texture around ship hull is clearly visible — brightest at bow (top), trails at sides.  
**Implementation test**: Water foam particles rendering. Bow-forward direction matches foam distribution.

---

## CHECKPOINT 26

**Time**: `00:08.9` | **Frame**: F0072 | **Category**: `CAMERA`  
**Moment**: Ship camera zoom in (scroll-driven)  
**What changes**: Ship appears significantly larger than in F0068. Camera has moved closer (Y position decreased in aerial view).  
**Implementation test**: Camera zoom animation is scroll-driven. Ship scale increases as scroll progresses.

---

## CHECKPOINT 27

**Time**: `00:09.4` | **Frame**: F0076 | **Category**: `TEXT`  
**Moment**: "LOGISTICS THAT WORKS AS HARD AS YOU DO." text overlay appears  
**What changes**: White text block appears below/over the ship model. 4-line centered phrase visible.  
**Implementation test**: Text overlay fades in at correct scroll position. Text is centered. White color on blue background.

---

## CHECKPOINT 28

**Time**: `00:10.0` | **Frame**: F0080 | **Category**: `OBJECT` + `TEXT`  
**Moment**: Ship feature labels appear (radial layout)  
**What changes**: Camera pulled back to show smaller ship. Feature labels appear at left/right/bottom positions around ship.  
**Implementation test**: 3+ feature labels visible. Each label: icon + title + body copy. Positioned correctly relative to ship.

---

## CHECKPOINT 29

**Time**: `00:10.5` | **Frame**: F0084 | **Category**: `SCENE`  
**Moment**: Aircraft first appears  
**What changes**: Sky background (blue-purple). Small aircraft in center frame, emerging from clouds. Background has shifted from ocean blue to sky blue.  
**Implementation test**: Background color transition complete. Aircraft canvas active. Clouds rendering.

---

## CHECKPOINT 30

**Time**: `00:10.9` | **Frame**: F0088 | **Category**: `TEXT`  
**Moment**: "TRUSTED BY BUSINESSES ACROSS APAC" heading appears  
**What changes**: Testimonials heading visible left column. Off-white background beginning. Aircraft still visible right side.  
**Implementation test**: H2 heading animation fires. "ACROSS APAC" line renders in lighter grey/reduced opacity.

---

## CHECKPOINT 31

**Time**: `00:11.4` | **Frame**: F0092 | **Category**: `SCENE`  
**Moment**: Testimonials fully visible (first complete state)  
**What changes**: Off-white background complete. Two-column testimonial layout. First client card (photo + name + quote). Custom cursor visible.  
**Implementation test**: Testimonials section renders correctly. Photo, name, quote all visible. Client card layout correct.

---

## CHECKPOINT 32

**Time**: `00:12.0` | **Frame**: F0097 | **Category**: `SCENE`  
**Moment**: Multiple testimonials visible (end of video)  
**What changes**: Two complete client testimonials visible (one at top, one partially below). Long quote text for both.  
**Implementation test**: Multiple testimonials stacked vertically. Scroll reveals additional testimonials below fold.

---

## Summary by Category

| Category     | Count | Key Checkpoints                                      |
| ------------ | ----- | ---------------------------------------------------- |
| `SCENE`      | 9     | CP01, CP08, CP13, CP16, CP19, CP24, CP29, CP31, CP32 |
| `TEXT`       | 7     | CP09, CP10, CP12, CP18, CP21, CP27, CP30             |
| `CAMERA`     | 2     | CP05, CP26                                           |
| `OBJECT`     | 5     | CP02, CP11, CP14, CP15, CP28                         |
| `BACKGROUND` | 1     | CP07                                                 |
| `LIGHTING`   | 1     | CP03                                                 |
| `TRANSITION` | 5     | CP06, CP17, CP20, CP22, CP23                         |
| `PARTICLE`   | 1     | CP25                                                 |
| `UI`         | 1     | CP04                                                 |
