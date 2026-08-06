# 06 — Color Palette

> All color values are estimated from reference video frames. Exact hex values require browser DevTools or design file access. Video compression may slightly affect color accuracy.

---

## Color System Overview

The site uses a **dual-mode color system**: dark cinematic hero + light editorial body. This is not a dark mode / light mode toggle — it is a deliberate scroll-based narrative design where the color scheme shifts as you descend through the page.

| Zone                 | Background          | Text                          | Accent                     |
| -------------------- | ------------------- | ----------------------------- | -------------------------- |
| Hero (dark)          | Near-black          | White                         | Electric blue + orange/red |
| Transition           | Gradient black→blue | White                         | Blue                       |
| Editorial (light)    | Off-white           | Near-black                    | Red                        |
| Features (dark)      | Dark charcoal       | White                         | None                       |
| Sea freight (blue)   | Deep ocean blue     | White                         | None                       |
| Air freight          | Sky blue + white    | White on blue / Dark on white | Red (livery)               |
| Testimonials (light) | Off-white           | Near-black                    | Red (accent line)          |

---

## Dark Theme Colors

### Background

| Name        | Estimated Value        | Usage                       |
| ----------- | ---------------------- | --------------------------- |
| `bg-hero`   | `#080808` to `#0a0b10` | Hero section background     |
| `bg-dark-1` | `#0f0f0f` to `#111111` | Features / services section |
| `bg-dark-2` | `#151515`              | Card backgrounds on dark    |

### Globe / 3D Atmosphere Colors

| Name                    | Estimated Value                  | Usage                        |
| ----------------------- | -------------------------------- | ---------------------------- |
| `globe-base`            | `#1a1a2a` (dark navy)            | Earth surface base color     |
| `globe-landmass`        | `#1f2040` to `#2a2a50`           | Continent areas              |
| `atmosphere-blue`       | `hsl(215, 100%, 60%)` ~`#1a7fff` | Atmospheric rim glow         |
| `atmosphere-blue-outer` | `hsl(210, 100%, 45%)` ~`#006de6` | Outer atmosphere             |
| `fire-glow-orange`      | `hsl(25, 90%, 55%)` ~`#e8681a`   | Northern atmospheric thermal |
| `fire-glow-red`         | `hsl(10, 85%, 50%)` ~`#e3321a`   | Deep glow                    |
| `route-dots`            | `#ffffff` with opacity           | Shipping route network nodes |
| `route-lines`           | `rgba(255,255,255,0.3)`          | Shipping route arc lines     |
| `location-pin`          | `#ff2020` or `#e63030`           | Red marker dot               |

### Text (Dark Theme)

| Name                  | Estimated Value          | Usage                  |
| --------------------- | ------------------------ | ---------------------- |
| `text-primary-dark`   | `#ffffff`                | H1, H2, feature titles |
| `text-secondary-dark` | `rgba(255,255,255,0.65)` | Body copy on dark      |
| `text-tertiary-dark`  | `rgba(255,255,255,0.4)`  | Nav links, captions    |

### Buttons (Dark Theme)

| Name               | Estimated Value                | Usage               |
| ------------------ | ------------------------------ | ------------------- |
| `btn-primary-bg`   | `#ffffff`                      | Primary button fill |
| `btn-primary-text` | `#0a0a0a`                      | Primary button text |
| `btn-secondary`    | `rgba(255,255,255,0)` + border | Ghost button        |

---

## Light Theme Colors

### Background

| Name         | Estimated Value        | Usage                            |
| ------------ | ---------------------- | -------------------------------- |
| `bg-light-1` | `#F4F3EF` to `#F8F7F4` | Editorial / testimonial sections |
| `bg-white`   | `#FFFFFF`              | Reach stacker / truck canvas     |

### Text (Light Theme)

| Name                   | Estimated Value        | Usage              |
| ---------------------- | ---------------------- | ------------------ |
| `text-primary-light`   | `#111111` to `#0f0f0f` | H2, large headings |
| `text-secondary-light` | `#444444` to `#555555` | Body copy          |
| `text-tertiary-light`  | `#888888`              | Captions, labels   |

### Accent (Light Theme)

| Name         | Estimated Value        | Usage                                           |
| ------------ | ---------------------- | ----------------------------------------------- |
| `accent-red` | `#cc0000` to `#e63030` | Horizontal rule / divider, aircraft tail livery |

---

## Blue / Ocean Theme Colors

### Container Ship Section

| Name            | Estimated Value                 | Usage                 |
| --------------- | ------------------------------- | --------------------- |
| `ocean-deep`    | `hsl(215, 75%, 28%)` ~`#133D77` | Deep ocean background |
| `ocean-mid`     | `hsl(210, 70%, 40%)` ~`#1E5FA3` | Mid-water             |
| `ocean-bright`  | `hsl(205, 80%, 55%)` ~`#2787D4` | Lighter water areas   |
| `foam-white`    | `rgba(255,255,255,0.8)`         | Ship wake / foam      |
| `particle-blue` | `rgba(100,180,255,0.4)`         | Water particles       |

---

## Container Colors

| Container   | Color          | Notes                           |
| ----------- | -------------- | ------------------------------- |
| Container 1 | White / Silver | Standard ISO                    |
| Container 2 | Navy Blue      | ~`#1A3A6E`                      |
| Container 3 | Red / Burgundy | ~`#C22020`                      |
| Container 4 | Green          | ~`#2E8B3E` (ship top view only) |
| Container 5 | Pink/Magenta   | ~`#D43080` (ship top view only) |
| Container 6 | Orange         | ~`#E87820` (ship top view only) |
| Container 7 | Teal           | ~`#20A87A` (ship top view only) |

---

## Gradient Definitions

### Hero to Atmosphere gradient

```
background: linear-gradient(
  to bottom,
  #080808 0%,
  #0a1220 40%,
  #1a3a7a 70%,
  #2a5ac8 90%,
  #f8f7f4 100%
)
```

(Approximate — used as full-page background or scroll-driven background color lerp)

### Globe Atmosphere Shader (Approximate)

```
Edge glow color: hsl(210, 100%, 65%)   /* electric blue */
Glow falloff: Fresnel-based           /* stronger at edges */
Thermal glow: hsl(20, 90%, 55%)       /* orange-red at pole */
```

---

## Opacity Usage

| Element               | Opacity    | Method                        |
| --------------------- | ---------- | ----------------------------- |
| Nav background (dark) | ~0.85–0.95 | `backdrop-filter: blur(12px)` |
| Route lines on globe  | ~0.3–0.4   | Material opacity              |
| Route nodes           | ~0.6–0.8   | Material opacity              |
| Body copy on dark     | ~0.65      | `rgba(255,255,255,0.65)`      |
| Ocean foam particles  | ~0.5–0.8   | Particle system opacity       |

---

## Glass / Frosted Effects

**UNKNOWN** — Navigation may use glass morphism (backdrop-filter blur) on dark sections. Requires DevTools to confirm.
