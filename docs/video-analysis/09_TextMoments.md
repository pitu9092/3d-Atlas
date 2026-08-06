# 09 — Text Moments

**Project**: 3D Atlas  
**Focus**: Every text element — entrance, exit, animation type, timing, and visual properties

---

## TEXT ELEMENT INDEX

| ID  | Text                                            | Section      | Type          | Animation              |
| --- | ----------------------------------------------- | ------------ | ------------- | ---------------------- |
| T01 | "ONE OPERATOR"                                  | Hero         | Eyebrow label | Fade + slide           |
| T02 | "EVERY LEG OF THE JOURNEY"                      | Hero         | H1 headline   | Clip-path reveal       |
| T03 | Hero body copy (3 lines)                        | Hero         | Body text     | Fade-up                |
| T04 | CTA Buttons (2)                                 | Hero         | Buttons       | Fade-up stagger        |
| T05 | "WE MOVE FREIGHT. WE OWN THE OUTCOME."          | Editorial    | H2            | Clip-path reveal       |
| T06 | Editorial body copy                             | Editorial    | Body text     | Fade-up                |
| T07 | "2 500+" stat                                   | Editorial    | Counter       | Count-up               |
| T08 | "8+" stat                                       | Editorial    | Counter       | Count-up (second stat) |
| T09 | Stat labels                                     | Editorial    | Caption       | Fade                   |
| T10 | "EVERYTHING YOUR FREIGHT NEEDS UNDER ONE GROUP" | Services     | Word shuffle  | Slot machine cycle     |
| T11 | Service titles (×5)                             | Services     | Grid labels   | Stagger fade-up        |
| T12 | Service body copy (×5)                          | Services     | Grid body     | Stagger fade-up        |
| T13 | "RELIABILITY / AT EVERY / MILESTONE"            | Wipe         | Word shuffle  | Slot machine cycle     |
| T14 | "REAL-TIME FREIGHT TRACKING"                    | Wipe         | Feature label | Fade                   |
| T15 | "LOGISTICS THAT WORKS AS HARD AS YOU DO."       | Ship         | Overlay text  | Fade-in scroll         |
| T16 | "COMPANIES YOU CAN TRUST"                       | Ship         | Feature label | Radial fade-in         |
| T17 | "COMPETITIVE TRANSPARENT PRICING"               | Ship         | Feature label | Radial fade-in         |
| T18 | "AFTER-HOURS RESOLUTION"                        | Ship         | Feature label | Radial fade-in         |
| T19 | "TRUSTED BY BUSINESSES ACROSS APAC"             | Testimonials | H2            | Clip-path reveal       |
| T20 | Client name + company (×2+)                     | Testimonials | Credit        | Fade                   |
| T21 | Testimonial quote body (×2+)                    | Testimonials | Long-form     | Fade                   |

---

## TEXT 01 — "ONE OPERATOR" (Eyebrow)

**Section**: Hero  
**Video Evidence**: Visible in F0012  
**Position**: Above H1, left column, top-center of text area

| Property            | Value                                              |
| ------------------- | -------------------------------------------------- |
| **Font weight**     | Medium/Regular (~400–500)                          |
| **Size**            | ~12–14px                                           |
| **Case**            | All-caps                                           |
| **Color**           | `rgba(255,255,255,0.7)`                            |
| **Letter spacing**  | Wide tracking (~0.15–0.2em)                        |
| **Enter animation** | Fade-in (opacity 0→1) + slight translateY (10px→0) |
| **Enter trigger**   | Page load, ~200ms delay                            |
| **Duration**        | ~0.5s                                              |
| **Exit animation**  | Scrolls off with hero section                      |

---

## TEXT 02 — "EVERY LEG OF THE JOURNEY" (H1)

**Section**: Hero  
**Video Evidence**: Visible in F0008 (partially) and F0012 (fully)  
**Position**: Below eyebrow, left column, 3 lines

| Property              | Value                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Font weight**       | Black/900                                                                                                                                                 |
| **Size**              | ~88–104px (estimated from monitor display)                                                                                                                |
| **Case**              | All-caps                                                                                                                                                  |
| **Color**             | `#FFFFFF`                                                                                                                                                 |
| **Lines**             | Line 1: "EVERY" / Line 2: "LEG OF THE" / Line 3: "JOURNEY"                                                                                                |
| **Enter animation**   | **Clip-path mask reveal**: Each line has a parent wrapper with `overflow: hidden`. The text slides from bottom to top. `translateY(100%) → translateY(0)` |
| **Enter trigger**     | Page load, after eyebrow (~300ms from load)                                                                                                               |
| **Stagger**           | 120ms between each line                                                                                                                                   |
| **Duration per line** | ~0.9s                                                                                                                                                     |
| **Ease**              | `power4.out` or `expo.out`                                                                                                                                |
| **Exit animation**    | Scrolls off viewport with hero section                                                                                                                    |

### Clip-Path Implementation

```css
/* Parent wrapper per line */
.hero-line-wrapper {
  overflow: hidden;
  display: block;
}
/* Text element */
.hero-line {
  display: block;
  /* GSAP animates this */
}
```

```javascript
gsap.from('.hero-line', {
  yPercent: 100,
  duration: 0.9,
  ease: 'power4.out',
  stagger: 0.12,
  delay: 0.3,
})
```

---

## TEXT 03 — Hero Body Copy

**Section**: Hero  
**Position**: Below H1, ~32px gap

| Property            | Value                                        |
| ------------------- | -------------------------------------------- |
| **Font weight**     | Regular (400)                                |
| **Size**            | ~15–17px                                     |
| **Color**           | `rgba(255,255,255,0.65)`                     |
| **Width**           | ~300–380px (left column constraint)          |
| **Lines**           | 3 lines visible                              |
| **Enter animation** | `opacity: 0→1` + `translateY: 20px→0`        |
| **Enter trigger**   | After H1 animation begins (~450ms from load) |
| **Duration**        | ~0.6s                                        |
| **Ease**            | `power2.out`                                 |

---

## TEXT 04 — CTA Buttons (×2)

**Section**: Hero  
**Position**: Below body copy, horizontal row

| Button    | Style                   | Text                                                         |
| --------- | ----------------------- | ------------------------------------------------------------ |
| Primary   | White pill/rounded rect | [Primary CTA]                                                |
| Secondary | Text link or outlined   | [Secondary CTA] — seen in F0016 as two side-by-side elements |

| Property            | Value                                 |
| ------------------- | ------------------------------------- |
| **Enter animation** | `opacity: 0→1` + `translateY: 20px→0` |
| **Enter trigger**   | After body copy (~600ms from load)    |
| **Stagger**         | 80ms between buttons                  |
| **Duration**        | ~0.5s                                 |

---

## TEXT 05 — "WE MOVE FREIGHT. WE OWN THE OUTCOME." (H2)

**Section**: Editorial  
**Video Evidence**: F0024  
**Position**: Left column, ~55% width

| Property            | Value                                                       |
| ------------------- | ----------------------------------------------------------- |
| **Font weight**     | Black/900                                                   |
| **Size**            | ~64–80px                                                    |
| **Case**            | All-caps                                                    |
| **Color**           | `#111111` (near-black)                                      |
| **Lines**           | 4 lines: "WE MOVE" / "FREIGHT." / "WE OWN" / "THE OUTCOME." |
| **Enter animation** | Clip-path reveal — same pattern as H1                       |
| **Enter trigger**   | `start: "top 80%"` ScrollTrigger                            |
| **Stagger**         | 100ms per line                                              |
| **Duration**        | ~0.8s per line                                              |
| **Ease**            | `power4.out`                                                |

---

## TEXT 07 — "2 500+" (Stat Counter)

**Section**: Editorial  
**Video Evidence**: F0024

| Property            | Value                                                  |
| ------------------- | ------------------------------------------------------ |
| **Font weight**     | Black/900                                              |
| **Size**            | ~80–96px                                               |
| **Color**           | `#111111`                                              |
| **Format**          | European thousand separator (space: "2 500")           |
| **Enter animation** | Count-up from 0 to 2500                                |
| **Duration**        | ~1.5–2.0s                                              |
| **Ease**            | `power2.out` (fast start, eases to final value)        |
| **Trigger**         | ScrollTrigger `start: "top 70%"`                       |
| **Suffix**          | "+" appended immediately (does not animate separately) |

### GSAP Counter Implementation

```javascript
const counter = { value: 0 }
gsap.to(counter, {
  value: 2500,
  duration: 1.8,
  ease: 'power2.out',
  scrollTrigger: { trigger: statElement, start: 'top 70%', once: true },
  onUpdate: () => {
    statElement.textContent = new Intl.NumberFormat('fr-FR').format(Math.round(counter.value)) + '+'
    // Note: fr-FR locale uses space as thousand separator
  },
})
```

---

## TEXT 08 — "8+" (Second Stat)

**Section**: Editorial  
**Video Evidence**: F0028 (second stat visible as page scrolls)

| Property            | Value                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Size**            | ~80–96px                                                                                                                                                           |
| **Color**           | `#111111`                                                                                                                                                          |
| **Label**           | "Years of operation" or similar                                                                                                                                    |
| **Enter animation** | Same count-up as T07                                                                                                                                               |
| **Position**        | Below "2 500+" OR same position (indicating two stats are stacked, scroll-revealed)                                                                                |
| **Note**            | Both stats appear in the same right column, with the second stat below the first. As user scrolls, the first stat moves off-screen and the second comes into view. |

---

## TEXT 10 — "EVERYTHING YOUR FREIGHT NEEDS UNDER ONE GROUP" (Word Shuffle)

**Section**: Services Grid entry  
**Video Evidence**: F0048

| Property        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| **Font weight** | Black/900                                                          |
| **Size**        | ~32–48px                                                           |
| **Color**       | `#FFFFFF` (on dark background)                                     |
| **Position**    | Upper area of dark services section, right-center                  |
| **Animation**   | Slot-machine style: words cycle rapidly through a defined list     |
| **Behavior**    | Multiple lines of text, each line cycling through different values |
| **Speed**       | ~100–150ms per word swap                                           |
| **Duration**    | ~0.5–1.0s total cycling before settling on final phrase            |
| **Final state** | Settles on the complete phrase once animation completes            |

### Implementation Pattern

```javascript
// Slot machine word cycle
const words = ['EVERYTHING', 'YOUR', 'FREIGHT', 'NEEDS', 'UNDER', 'ONE', 'GROUP']
const finalWords = same words
// Each word cycles through random alternatives before settling on final
```

---

## TEXT 13 — "RELIABILITY / AT EVERY / MILESTONE" (Word Shuffle — Wipe)

**Section**: Wipe Transition  
**Video Evidence**: F0060

| Property        | Value                                                                           |
| --------------- | ------------------------------------------------------------------------------- |
| **Font weight** | Bold/700                                                                        |
| **Size**        | ~18–24px                                                                        |
| **Color**       | `#111111` (on white background)                                                 |
| **Position**    | Left side of viewport, next to black vertical panel                             |
| **Lines**       | 4 separate lines: "RELIABILITY", "AT EVERY", "MILESTONE", "MILESTONE" (cycling) |
| **Animation**   | Each line independently cycles through related words                            |
| **Speed**       | Fast — visible that "MILESTONE" appears twice (mid-cycle)                       |
| **Behavior**    | Lines settle on final values once scroll completes                              |

### Observed Cycling Values (F0060)

```
Line 1: RELIABILITY → [cycles]
Line 2: AT EVERY → [cycles]
Line 3: MILESTONE → [cycles]
Line 4: MILESTONE → TRUST (or other value)
```

---

## TEXT 15 — "LOGISTICS THAT WORKS AS HARD AS YOU DO."

**Section**: Container Ship overlay  
**Video Evidence**: F0076

| Property            | Value                                                         |
| ------------------- | ------------------------------------------------------------- |
| **Font weight**     | Bold/700                                                      |
| **Size**            | ~28–36px                                                      |
| **Color**           | `#FFFFFF`                                                     |
| **Position**        | Centered horizontally, vertically below ship center           |
| **Alignment**       | Center-aligned, 4 lines                                       |
| **Enter animation** | Fade-in (opacity 0→1) at specific scroll progress in ship pin |
| **Trigger**         | Ship scroll progress ~40–50%                                  |
| **Duration**        | ~0.7s                                                         |
| **Ease**            | `power3.out`                                                  |

---

## TEXT 16–18 — Ship Feature Labels

**Section**: Container Ship  
**Video Evidence**: F0080

| Label | Position             | Content                                              |
| ----- | -------------------- | ---------------------------------------------------- |
| T16   | Upper-left of ship   | "COMPANIES YOU CAN TRUST" + icon + body copy         |
| T17   | Upper-right of ship  | "COMPETITIVE TRANSPARENT PRICING" + icon + body copy |
| T18   | Lower-center of ship | "AFTER-HOURS RESOLUTION" + icon + body copy          |

| Property            | Value                                                                   |
| ------------------- | ----------------------------------------------------------------------- |
| **Font weight**     | Bold/600–700 for title, Regular for body                                |
| **Title size**      | ~12–14px, all-caps, wide tracking                                       |
| **Body size**       | ~11–13px                                                                |
| **Color**           | `#FFFFFF` (all text on blue background)                                 |
| **Icon**            | Thin circle with symbol, ~20px                                          |
| **Enter animation** | Fade-in + slight centripetal movement (from outside toward ship center) |
| **Trigger**         | Ship scroll progress ~60–80%                                            |
| **Stagger**         | ~150ms between labels                                                   |

---

## TEXT 19 — "TRUSTED BY BUSINESSES ACROSS APAC" (H2)

**Section**: Testimonials  
**Video Evidence**: F0088, F0092

| Property            | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **Font weight**     | Black/900 (first 2 words)                                                                    |
| **Size**            | ~64–80px                                                                                     |
| **Case**            | All-caps                                                                                     |
| **Line 1**          | "TRUSTED" — dark/black, full opacity                                                         |
| **Line 2**          | "BY BUSINESSES" — dark/black                                                                 |
| **Line 3**          | "ACROSS APAC" — lighter grey (~50% opacity or lighter weight)                                |
| **Enter animation** | Clip-path reveal — same pattern as H1/H2                                                     |
| **Trigger**         | `start: "top 80%"`                                                                           |
| **Duration**        | ~0.7s per line                                                                               |
| **Stagger**         | 100ms                                                                                        |
| **Special**         | "ACROSS APAC" line renders in lighter treatment — visual emphasis on "TRUSTED BY BUSINESSES" |

---

## Text Animation Patterns Summary

| Pattern             | Used For             | GSAP Technique                                  |
| ------------------- | -------------------- | ----------------------------------------------- |
| **Clip-path slide** | H1, H2 headings      | `yPercent: 100 → 0` with overflow:hidden parent |
| **Fade-up**         | Body copy, buttons   | `opacity: 0→1` + `y: 20→0`                      |
| **Count-up**        | Stat numbers         | `gsap.to(obj, { value: N })` + `onUpdate`       |
| **Word shuffle**    | Services entry, Wipe | GSAP timeline with word swap stagger            |
| **Fade-in**         | Overlay text, labels | `opacity: 0→1` only (no translate)              |
| **Radial reveal**   | Ship labels          | `opacity: 0→1` + centripetal translate          |

---

## Navbar Text

**Section**: Fixed across all sections  
**Video Evidence**: F0012 (clearly visible)

| Element        | Position                    | Style                                      |
| -------------- | --------------------------- | ------------------------------------------ |
| Logo/Wordmark  | Top-left                    | Small, bold, white                         |
| Nav links (×6) | Vertical stack, left column | ~13px, regular, white, wide tracking       |
| CTA pill       | Top-right                   | Small pill button, white outline or filled |

**Behavior**: Navbar adapts color to section — white text on dark sections, dark text on light sections. The transition appears to be a CSS class swap triggered by ScrollTrigger section markers.
