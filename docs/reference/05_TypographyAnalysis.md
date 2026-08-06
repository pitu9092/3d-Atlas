# 05 — Typography Analysis

> Note: Exact font identification requires browser DevTools on the live site. All identifications below are based on visual analysis of reference frames.

---

## Font Identification

### Primary Display Font (Headlines)

- **Usage**: H1, H2, major section headlines
- **Style**: Ultra-bold / Black weight, All-Caps / Uppercase
- **Characteristics**:
  - Very tight letter-spacing (tracking: -0.02em to -0.04em)
  - Condensed proportions (medium-width characters, not ultra-condensed)
  - Strong geometric terminals
  - Very slight optical condensing
- **Candidate fonts**:
  - **Most likely**: `Neue Haas Grotesk Display` or `Aktiv Grotesk Extended`
  - **Alternative**: `Monument Extended`, `Suisse Int'l`, `Graphik`
  - **UNKNOWN** — Requires DevTools verification

### Secondary Font (Body / UI)

- **Usage**: Body copy, nav links, feature labels, eyebrow text, button labels
- **Style**: Regular to Medium weight, mixed case
- **Characteristics**:
  - Clean, geometric sans-serif
  - Standard tracking
  - Highly legible at small sizes
- **Candidate fonts**:
  - **Most likely**: Same family as display (lighter weight variant)
  - **Alternative**: `Inter`, `DM Sans`, `Söhne`
  - **UNKNOWN** — Requires DevTools verification

---

## Typography Scale

### H1 — Hero Headline

| Property       | Value                                       |
| -------------- | ------------------------------------------- |
| Content        | "EVERY LEG OF THE JOURNEY"                  |
| Case           | ALL CAPS                                    |
| Weight         | Black / 900                                 |
| Size (desktop) | ~96–128px estimated                         |
| Line height    | ~0.9–1.0 (very tight)                       |
| Letter spacing | -0.02em to -0.04em (tight)                  |
| Color          | White (#FFFFFF) on dark background          |
| Alignment      | Left                                        |
| Line breaks    | 3 lines: "EVERY" / "LEG OF THE" / "JOURNEY" |

### H2 — Section Headlines

| Property       | Value                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Examples       | "WE MOVE FREIGHT. WE OWN THE OUTCOME.", "TRUSTED BY BUSINESSES ACROSS APAC", "UNDER ONE GROUP." |
| Case           | ALL CAPS                                                                                        |
| Weight         | Black / 900                                                                                     |
| Size (desktop) | ~64–96px estimated                                                                              |
| Line height    | ~0.95–1.05 (very tight)                                                                         |
| Letter spacing | -0.02em to -0.03em                                                                              |
| Color          | Black (#111) on white / White on dark                                                           |
| Alignment      | Left                                                                                            |

### Eyebrow / Label

| Property       | Value                                           |
| -------------- | ----------------------------------------------- |
| Examples       | "ONE OPERATOR"                                  |
| Case           | ALL CAPS                                        |
| Weight         | Regular / 400 or Medium / 500                   |
| Size           | ~12–14px                                        |
| Letter spacing | +0.1em to +0.15em (wide tracking — distinctive) |
| Color          | White (on dark) / Red (possible accent)         |
| Alignment      | Left, above H1                                  |

### Feature Titles

| Property       | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Examples       | "DANGEROUS GOODS ACCREDITATION", "FAST ISSUE RESOLUTION" |
| Case           | ALL CAPS                                                 |
| Weight         | Bold / 700                                               |
| Size           | ~14–18px                                                 |
| Letter spacing | +0.05em to +0.1em                                        |
| Color          | White on dark                                            |

### Feature Labels (Around Ship)

| Property | Value                                                      |
| -------- | ---------------------------------------------------------- |
| Examples | "RELIABILITY", "CONTROLLED", "COMPLIANCE REAL-TIME VESSEL" |
| Case     | ALL CAPS                                                   |
| Weight   | Regular to Bold                                            |
| Size     | ~12–16px                                                   |
| Color    | White on blue                                              |

### Body Copy

| Property       | Value                                                   |
| -------------- | ------------------------------------------------------- |
| Weight         | Regular / 400                                           |
| Size           | ~16–18px                                                |
| Line height    | ~1.6–1.7                                                |
| Letter spacing | 0 (normal)                                              |
| Color          | Light grey (~70–80% white) on dark / Dark grey on light |

### Stat Counter

| Property | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Example  | "2 500+"                                                           |
| Case     | Mixed (number with suffix)                                         |
| Weight   | Black / 900                                                        |
| Size     | ~80–120px                                                          |
| Format   | Space as thousands separator (European style: "2 500" not "2,500") |

### Navigation Links

| Property | Value                      |
| -------- | -------------------------- |
| Weight   | Regular or Light / 300–400 |
| Size     | ~12–14px                   |
| Case     | Mixed case or small caps   |
| Spacing  | Normal or slightly wide    |

### Button Labels

| Property       | Value             |
| -------------- | ----------------- |
| Weight         | Medium / 500      |
| Size           | ~14–16px          |
| Case           | Mixed or All-caps |
| Letter spacing | +0.05em           |

---

## Text Animation Patterns

### Line-by-line reveal (H1, H2)

- Each line of headline text is wrapped in a clip-path container
- Text translates upward from `translateY(100%)` to `translateY(0)` while clip-path masks it
- Stagger: ~80–120ms between lines
- Ease: `power4.out` or `expo.out`
- Duration: ~0.8–1.2s per line

### Fade-in (body copy, eyebrow)

- Opacity 0 → 1
- Duration: ~0.5–0.8s
- Trigger: After headline animation

### Shuffling/Slot Machine Text (Wipe Transition)

- Multiple text values cycle through one position
- Effect: Text appears to "scroll" through a list of words vertically
- Speed: Rapid, ~100–200ms per word
- Effect achieved with: CSS `overflow: hidden` clip + GSAP stagger timeline

### Counter Animation

- Number counts up from 0 to final value
- Duration: ~1.5–2s
- Ease: `power2.out`

### Wipe text reveal

- Text enters with horizontal clip-path wipe (left to right)
- `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0% 0 0)`
