# 04 — Layout Analysis

> Note: All measurements are estimated from video frames viewed at 346×446px (video native resolution recorded at desktop scale). Precise values require access to design files or browser DevTools on the live site.

---

## Global Layout System

### Container

- **Max-width**: Estimated 1440px (standard for Awwwards-quality sites)
- **Content padding**: Estimated 80–120px on each side (generous margins)
- **Grid**: 12-column grid underlying most sections — UNKNOWN exact gutter width
- **Horizontal padding (mobile)**: UNKNOWN

### Viewport Strategy

- **Full-bleed sections**: Most sections are full-viewport-width
- **Content within sections**: Constrained to ~1200–1440px wide
- **Overflow**: `overflow: hidden` on most sections (to enable clip-path wipes)

---

## Scene 1 — Globe Hero Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, full-width, ~56px height)                               │
│  ┌─────────┐                                               ┌───────────┐│
│  │  LOGO   │ ← left aligned                                │  CTA BTN  ││
│  └─────────┘                                               └───────────┘│
│  ┌──────────┐   ← vertical nav links, left-column, top-anchored        │
│  │ Home     │                                                            │
│  │ Services │                                                            │
│  │ Prods    │                                                            │
│  │ Partners │                                                            │
│  │ Contact  │                                                            │
│  └──────────┘                                                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────┐     ┌──────────────────────────────────┐  │
│  │                          │     │                                  │  │
│  │  [EYEBROW LABEL]         │     │                                  │  │
│  │                          │     │       3D GLOBE                   │  │
│  │  EVERY LEG OF THE        │     │       (overflows right edge)     │  │
│  │  JOURNEY                 │     │                                  │  │
│  │                          │     │                                  │  │
│  │  [body copy 2-3 lines]   │     │                                  │  │
│  │                          │     │                                  │  │
│  │  [BTN1] [BTN2]           │     │                                  │  │
│  │                          │     │                                  │  │
│  └──────────────────────────┘     └──────────────────────────────────┘  │
│    ~45% viewport width                  ~60% viewport width              │
│    (overlap with globe possible)                                         │
└──────────────────────────────────────────────────────────────────────────┘
```

**Key measurements (estimated)**:

- Left text column: ~45% viewport width
- Globe canvas: ~60% viewport width, right-anchored (slight overlap)
- Globe appears to be cropped by the right viewport edge (~15–25% overflow)
- Vertical centering: text block centered in remaining viewport height below navbar

---

## Scene 3 — Editorial (Brand Statement)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  ┌──────────────────────────────┐│
│  │                                    │  │                              ││
│  │  [EYEBROW]                         │  │  [body copy paragraph]       ││
│  │                                    │  │                              ││
│  │  WE MOVE FREIGHT.                  │  │  [second body copy]          ││
│  │  WE OWN                            │  │                              ││
│  │  THE OUTCOME.                      │  │                              ││
│  │                                    │  │  [stat label]                ││
│  │  ┌─────────┐                       │  │  2 500+                      ││
│  │  │ [photo] │                       │  │  [stat label text]           ││
│  │  └─────────┘                       │  │                              ││
│  └────────────────────────────────────┘  └──────────────────────────────┘│
│    ~55% viewport width (left col)           ~40% viewport width (right)   │
│    Left-column: stacked layout                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

**Key measurements**:

- Two-column asymmetric layout: ~55% left / ~40% right with gap
- H2 text is massive — estimated 64–96px at desktop
- "2 500+" stat counter: estimated 80–120px size
- Small thumbnail photo: estimated 80–100px square

---

## Scene 4 — Reach Stacker (Full-Screen Canvas)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│           ┌──────────────────────────────────────────┐                   │
│           │                                          │                   │
│           │   REACH STACKER MODEL       [CONTAINERS] │                   │
│           │                                          │                   │
│           │   Centered horizontally                  │                   │
│           │   ~70% viewport height                   │                   │
│           └──────────────────────────────────────────┘                   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

- Full-viewport canvas
- 3D model fills ~70% of viewport height, centered
- Containers positioned right-of-center relative to crane
- No visible text overlay in this scene (canvas only)

---

## Scene 5 — Truck (Split Layout)

```
┌──────────────────────────────────────────────────────────────────────────┐
│   BACKGROUND: white/off-white                                            │
│                                                                           │
│           ┌──────────────────────────────────────────┐                   │
│           │   TRUCK + CONTAINER (3D model)            │                   │
│           │   Centered, side-profile                  │                   │
│           │   ~50% viewport height                    │                   │
│           └──────────────────────────────────────────┘                   │
├──────────────────────────────────────────────────────────────────────────┤
│   BACKGROUND: dark (#111)                                                │
│                                                                           │
│   [feature icons] [feature icons] [feature icons] [feature icons]       │
│   [title]          [title]          [title]          [title]             │
│   [body copy]      [body copy]      [body copy]      [body copy]         │
│                                                                           │
│                        [ CTA BUTTON ]                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

- Horizontal split: top half white (truck), bottom half dark (services)
- The truck model overlaps the split line
- Services grid: 4 columns with equal widths

---

## Scene 7 — Container Ship (Full-Screen)

```
┌──────────────────────────────────────────────────────────────────────────┐
│   BACKGROUND: deep blue                                                  │
│                                                                           │
│   [top-left label]                          [top-right label]           │
│   [sub text]                                [sub text]                  │
│                                                                           │
│   [center-left]      ┌──────────────────┐     [center-right]           │
│   [sub text]         │                  │     [sub text]                │
│                       │   CONTAINER SHIP │                               │
│                       │   (aerial view)  │                               │
│                       │                  │                               │
│                       └──────────────────┘                               │
│                                                                           │
│                    [bottom-center label]                                 │
│                    [sub text]                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

- Ship occupies center ~40% of screen
- Labels at 5 cardinal positions around ship
- Blue ocean fills entire background

---

## Scene 10 — Testimonials

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   TRUSTED BY BUSINESSES        [photo] [name]                            │
│   ACROSS APAC                  [title]                                   │
│                                                                           │
│                                [long quote paragraph...]                 │
│                                [... continued text...]                   │
│                                                                           │
│   ← ~40% width →                ← ~55% width →                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Spacing Observations

| Token                        | Estimated Value         |
| ---------------------------- | ----------------------- |
| Base unit                    | 8px (standard 8pt grid) |
| Section padding (top/bottom) | 80–120px                |
| Container side padding       | 80–100px                |
| Heading to body gap          | 24–40px                 |
| Button gap                   | 16–24px                 |
| Grid column gap              | 40–60px                 |
| Navbar height                | 48–64px                 |
