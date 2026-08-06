# 07 — Spacing System

> All values are estimated from visual analysis. Exact values require browser DevTools on the live site.

---

## Grid System

### Base Unit

- **Estimated**: 8px base unit (standard 8pt grid)
- **Evidence**: All visible spacing appears to be multiples of 8px

### Layout Grid

- **Columns**: 12-column grid (standard)
- **Gutter**: Estimated 24–32px
- **Container max-width**: ~1280–1440px
- **Container side padding**: ~80–120px (very generous on desktop)

---

## Section Spacing

| Section             | Top Padding           | Bottom Padding   | Notes            |
| ------------------- | --------------------- | ---------------- | ---------------- |
| Hero                | 0 (full bleed)        | 0                | Viewport height  |
| Editorial (Scene 3) | ~80–120px             | ~80–120px        | Standard section |
| Reach Stacker       | 0 (full bleed canvas) | 0                |                  |
| Truck + Services    | ~48px (truck area)    | ~80px (services) | Split section    |
| Container Ship      | 0 (full bleed)        | 0                |                  |
| Wipe Transition     | 0                     | 0                |                  |
| Aircraft            | 0 (full bleed)        | 0                |                  |
| Testimonials        | ~80–120px             | ~80–120px        |                  |

---

## Component Spacing

### Headline Spacing

| Property                | Value    |
| ----------------------- | -------- |
| Eyebrow → H1 gap        | ~16–24px |
| H1 → Body copy gap      | ~24–32px |
| Body copy → Buttons gap | ~32–48px |
| Between CTA buttons     | ~16px    |

### Feature Card Spacing (Services Grid)

| Property         | Value                     |
| ---------------- | ------------------------- |
| Card width       | ~25% viewport (4 columns) |
| Card gap         | ~24–32px                  |
| Icon → Title gap | ~12–16px                  |
| Title → Body gap | ~8–12px                   |
| Section padding  | ~80px top/bottom          |

### Ship Feature Labels

| Property                    | Value    |
| --------------------------- | -------- |
| Label offset from ship edge | ~40–60px |
| Label → sub-text gap        | ~8px     |

### Testimonial Spacing

| Property                   | Value            |
| -------------------------- | ---------------- |
| Photo size                 | ~80–100px square |
| Photo → name gap           | ~12px            |
| Name → quote gap           | ~24–32px         |
| Heading ↔ quote column gap | ~80px            |

---

## Navbar Dimensions

| Property                 | Value                            |
| ------------------------ | -------------------------------- |
| Height                   | ~48–64px                         |
| Logo area                | ~160–200px wide                  |
| Nav link vertical gap    | ~8–12px                          |
| Right CTA button padding | ~16px vertical, ~24px horizontal |
| Button border-radius     | ~9999px (full pill)              |

---

## Cursor Dimensions

| Property            | Value                        |
| ------------------- | ---------------------------- |
| Circle diameter     | ~32–48px                     |
| Border width        | ~1–2px                       |
| Follow speed (lerp) | ~0.08–0.12 (slow, heavy lag) |

---

## Spacing Scale (Inferred)

Based on 8pt grid:

```
--space-1:  8px
--space-2:  16px
--space-3:  24px
--space-4:  32px
--space-5:  40px
--space-6:  48px
--space-8:  64px
--space-10: 80px
--space-12: 96px
--space-15: 120px
```

---

## Overflow Handling

| Section         | Overflow                                                                 |
| --------------- | ------------------------------------------------------------------------ |
| Hero canvas     | Globe extends beyond right viewport edge — `overflow: hidden` on section |
| Wipe transition | Panel clips content — `overflow: hidden` on wrapper                      |
| Most sections   | `overflow: hidden` to support clip-path animations                       |
| Body            | Lenis-managed scroll — `overflow: hidden` on `<body>` in Lenis mode      |
