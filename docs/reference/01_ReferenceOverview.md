# 01 — Reference Overview

## Identity

| Property            | Value                                                                           |
| ------------------- | ------------------------------------------------------------------------------- |
| **Brand**           | UNKNOWN — appears to be a logistics/freight operator (tag line: "ONE OPERATOR") |
| **Site Type**       | Immersive scroll-driven marketing/brand website                                 |
| **Industry**        | Global logistics, freight forwarding, supply chain                              |
| **Target Audience** | Enterprise clients, freight buyers, B2B logistics decision-makers               |

---

## Overall Style

**Dark → Light transition narrative.** The site begins with a dark, cinematic, space-inspired hero (black background, glowing 3D Earth globe) and progressively transitions to lighter sections (off-white/near-white) as the user scrolls. This dark-to-light pattern is used as a visual metaphor for the brand's journey — from complexity (dark, global, interconnected) to clarity (light, simple, trustworthy).

### Design Language

- **Dark Hero**: Premium tech / aerospace aesthetic — black backgrounds, glowing blue/red Earth, white bold typography
- **Light Sections**: Editorial / print-inspired — near-white backgrounds, heavy black serif/sans typography, red accent line details
- **Transition Sections**: Gradient color washes — deep blue ocean/water hues (hsl 210-240 range) for the container ship and cargo sections
- **Overall Aesthetic**: Cinematic realism meets editorial minimalism

---

## Mood

| Dimension         | Description                                 |
| ----------------- | ------------------------------------------- |
| **Tone**          | Authoritative, confident, global, trusted   |
| **Energy**        | Measured, deliberate — not fast or playful  |
| **Emotion**       | Scale, reliability, precision, global reach |
| **Premium Level** | Very high — Awwwards-calibre execution      |

---

## Storytelling Arc

The site tells a **visual journey** through the lifecycle of a freight shipment:

1. **Globe / World Map** → The global reach and network (dark hero)
2. **Scroll-triggered orbit/horizon** → Moving away from orbit, descending through atmosphere
3. **White editorial section** → Brand services introduction ("WE MOVE FREIGHT. WE OWN THE OUTCOME.")
4. **Reach Handler / Stacker crane** → Port/land logistics — 3D animated reach stacker crane picking up containers
5. **Truck on highway** → Road freight — 3D animated truck carrying a container
6. **Services grid section** → Features and differentiators (dark background)
7. **Container ship (aerial/top-down)** → Sea freight — animated ship sailing through blue water with features surrounding it
8. **Wipe / horizontal split transition** → Section separator with animated wipe effect
9. **Aircraft in clouds** → Air freight — 3D animated aircraft flying through sky
10. **Testimonials** → Social proof section ("TRUSTED BY BUSINESSES ACROSS APAC")
11. **UNKNOWN** — Final sections not visible in reference

---

## Navigation Style

- **Horizontal top navbar** — fixed position, extremely minimal
- **Left side**: Small logo/wordmark (UNKNOWN — text is too small to read clearly)
- **Center/Left**: Vertical list of nav links stacked (appears to be: Home, Services, [3-4 more items]) — **non-standard** left-aligned vertical list layout, NOT horizontal pills
- **Right side**: A single CTA button (pill shape, white fill or outlined)
- **Custom cursor**: Circular cursor indicator visible (rotating/spinning circle animation)

---

## Interaction Style

- **Scroll-driven everything**: Nearly all animations and transitions are driven by scroll position
- **Custom cursor**: Non-standard cursor element — appears as a circular outline/ring that follows mouse
- **Minimal hover states**: Content is primarily scroll-driven, not hover-driven
- **No visible modals or drawers** in the reference window

---

## Animation Style

| Dimension               | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| **Philosophy**          | Scroll is the timeline. No autoplay animations                    |
| **3D integration**      | 3D models scroll into position and transform with scroll progress |
| **Text reveals**        | Bold headline text animates in with upward slide + fade           |
| **Section transitions** | Full-screen wipe/split transitions between major scenes           |
| **Vehicle animations**  | Reach stacker crane lifts container in real-time via scroll       |
| **Camera behavior**     | Camera appears to move with scroll — parallax camera              |

---

## Technical Difficulty

| Dimension                | Rating | Notes                                                |
| ------------------------ | ------ | ---------------------------------------------------- |
| **Overall**              | 9.5/10 | Near-maximum complexity                              |
| **3D Integration**       | 10/10  | Multiple fully animated 3D models driven by scroll   |
| **Section transitions**  | 9/10   | Full-screen wipe and panel transitions               |
| **Typography animation** | 7/10   | Bold reveals, clip-path masking                      |
| **Scroll architecture**  | 9/10   | Multiple pinned sections, scrubbed animations        |
| **Performance**          | 9/10   | Multiple GLB models + post-processing + 60fps scroll |

---

## Complexity Score

**9.2 / 10** — One of the most technically demanding types of marketing websites. Comparable to sites on Awwwards that win SOTD/SOTY.

---

## Estimated Development Time

| Team                          | Duration   |
| ----------------------------- | ---------- |
| 1 Senior Engineer (solo)      | 8–12 weeks |
| 2 Engineers (FE + 3D)         | 5–7 weeks  |
| Full team (3–4) with designer | 3–5 weeks  |
