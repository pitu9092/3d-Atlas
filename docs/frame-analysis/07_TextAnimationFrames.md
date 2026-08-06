# 07 — Text Animation Frames

**Project**: 3D Atlas  
**Purpose**: Frame-by-frame breakdown of every text animation — enter, hold, exit, masking, character/word/line behavior

---

## Text Animation System Overview

| Pattern                     | Used                | Example                    |
| --------------------------- | ------------------- | -------------------------- |
| Clip-path line reveal       | H1, H2 headings     | "EVERY LEG OF THE JOURNEY" |
| Opacity fade-up             | Body copy, labels   | Hero body copy             |
| Count-up                    | Stats               | "2 500+", "98.2%", "8+"    |
| Word shuffle / slot machine | Section transitions | Services entry, wipe panel |
| Scroll-triggered fade       | Ship overlay text   | "LOGISTICS THAT WORKS..."  |
| Fade-in (opacity only)      | Feature labels      | Ship feature labels        |

---

## TEXT ANIMATION 01 — "ONE OPERATOR" (Eyebrow Label)

### Frames

| Frame State | Time     | Visual                |
| ----------- | -------- | --------------------- |
| Before      | `< 0.3s` | Invisible (opacity 0) |
| Start       | `~0.3s`  | Begins fading in      |
| End         | `~0.8s`  | Fully visible         |

### Properties

| Property       | Value                                        |
| -------------- | -------------------------------------------- |
| Font           | Custom / Brand font, Medium weight (400–500) |
| Size           | ~12–14px                                     |
| Case           | All-caps                                     |
| Color          | `rgba(255, 255, 255, 0.65)`                  |
| Letter spacing | `0.15em`                                     |
| Enter type     | Opacity fade + slight Y translate            |
| Y translate    | `8px → 0`                                    |
| Duration       | `0.5s`                                       |
| Delay          | `0.3s` from page load                        |
| Ease           | `power2.out`                                 |
| Exit           | Scrolls with hero section                    |

---

## TEXT ANIMATION 02 — "EVERY LEG OF THE JOURNEY" (H1)

### Frames

| Frame State   | Time     | Line 1        | Line 2       | Line 3     |
| ------------- | -------- | ------------- | ------------ | ---------- |
| Before        | `< 0.4s` | Hidden        | Hidden       | Hidden     |
| Line 1 starts | `~0.4s`  | Sliding up    | Hidden       | Hidden     |
| Line 2 starts | `~0.52s` | ~50% visible  | Sliding up   | Hidden     |
| Line 3 starts | `~0.64s` | Fully visible | ~50% visible | Sliding up |
| All visible   | `~1.3s`  | Done          | Done         | Done       |

### Properties

| Property          | Value                                              |
| ----------------- | -------------------------------------------------- |
| Font              | Brand headline, Black (900)                        |
| Size              | ~88–104px                                          |
| Line height       | ~0.95 (tight)                                      |
| Case              | All-caps                                           |
| Color             | `#FFFFFF`                                          |
| Enter type        | **Clip-path line reveal** — `translateY(100% → 0)` |
| Mechanism         | Each line wrapped in `overflow: hidden` parent     |
| Duration per line | `0.9s`                                             |
| Stagger           | `0.12s` per line                                   |
| Delay             | `0.4s` from load                                   |
| Ease              | `power4.out`                                       |
| Exit              | Scrolls off viewport                               |

### Clip-Path Mechanism Detail

```
Parent div: { overflow: hidden; height: 1.2em; }
Child span: { display: block; translateY: 100% → 0 }
```

This is the "mask reveal" technique — text slides up from below the visible area.

---

## TEXT ANIMATION 03 — Hero Body Copy

### Frames

| Frame State | Time           | Visual        |
| ----------- | -------------- | ------------- |
| Before      | `< 0.6s`       | Invisible     |
| Enter       | `~0.6s → 1.2s` | Fading up     |
| Visible     | `~1.2s`        | Fully visible |

### Properties

| Property    | Value                       |
| ----------- | --------------------------- |
| Font        | Brand body, Regular (400)   |
| Size        | `~15–17px`                  |
| Color       | `rgba(255, 255, 255, 0.65)` |
| Enter type  | Opacity fade + translateY   |
| Y translate | `16px → 0`                  |
| Duration    | `0.6s`                      |
| Delay       | `~0.6s` from load           |
| Ease        | `power2.out`                |

---

## TEXT ANIMATION 04 — CTA Buttons

### Frames

| Button                | Delay   | Duration |
| --------------------- | ------- | -------- |
| Primary (white pill)  | `0.75s` | `0.5s`   |
| Secondary (text link) | `0.85s` | `0.5s`   |

### Properties

| Property    | Value                                         |
| ----------- | --------------------------------------------- |
| Enter type  | Opacity fade + translateY (same as body copy) |
| Y translate | `12px → 0`                                    |
| Ease        | `power2.out`                                  |

---

## TEXT ANIMATION 05 — "WE MOVE FREIGHT. WE OWN THE OUTCOME." (H2)

### Frames

| Frame State | Time  | Visual                    |
| ----------- | ----- | ------------------------- |
| KF-04 entry | 2.75s | Lines beginning to reveal |
| KF-04 mid   | 2.9s  | ~50% of lines revealed    |
| KF-05       | 3.08s | All 4 lines fully visible |

### Properties

| Property          | Value                                              |
| ----------------- | -------------------------------------------------- |
| Font              | Brand headline, Black (900)                        |
| Size              | `~64–72px`                                         |
| Case              | All-caps                                           |
| Color             | `#111111`                                          |
| Lines             | "WE MOVE" / "FREIGHT." / "WE OWN" / "THE OUTCOME." |
| Enter type        | Clip-path line reveal (same as H1)                 |
| Duration per line | `0.8s`                                             |
| Stagger           | `0.1s` per line                                    |
| Trigger           | ScrollTrigger `start: "top 80%"`                   |
| Ease              | `power4.out`                                       |
| Exit              | Scrolls off viewport                               |

---

## TEXT ANIMATION 06 — "2 500+" (Stat Counter 1)

### Frames

| Frame State | Time                       | Value Displayed                           |
| ----------- | -------------------------- | ----------------------------------------- |
| Before      | Before scroll reach        | `0`                                       |
| Counting    | `~2.8s → 4.3s` (real time) | `0 → 2500`                                |
| Complete    | `~4.3s`                    | `2 500+`                                  |
| KF-05       | 3.08s                      | `2 500+` — already complete in this video |

### Properties

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| Start value    | `0`                                      |
| End value      | `2500`                                   |
| Display format | `Intl.NumberFormat('fr-FR')` → `"2 500"` |
| Suffix         | `+` (appended immediately, not animated) |
| Duration       | `1.5–2.0s`                               |
| Ease           | `power2.out`                             |
| Trigger        | Viewport entry `once: true`              |
| Font           | Brand headline, Black (900), ~96px       |

---

## TEXT ANIMATION 07 — "98.2%" (Stat Counter 2)

### KEY DISCOVERY (from HD frame F0075)

A SECOND visible stat: "98.2%" — not previously confirmed in Phase 2/3A docs.

### Properties

| Property | Value                               |
| -------- | ----------------------------------- |
| Value    | `98.2%`                             |
| Label    | "On-Time Delivery rate" (estimated) |
| Start    | `0%`                                |
| Decimal  | `98.2` — requires decimal counting  |
| Duration | `1.5s`                              |
| Ease     | `power2.out`                        |
| Position | Below "2 500+" in right column      |

### Frame State in KF-05

Both "2 500+" and "98.2%" were visible simultaneously at `t=3.08s`. This means:

- Both counters are in the same viewport portion
- They are stacked vertically in the right column
- Both were already complete at this point

---

## TEXT ANIMATION 08 — "8+" (Stat Counter 3)

From Phase 3A analysis (F0028 at 8fps):

### Properties

| Property | Value                                  |
| -------- | -------------------------------------- |
| Value    | `8+`                                   |
| Label    | "Years" or "Years of Operation"        |
| Position | Below "98.2%" in right column          |
| Duration | `0.8s` (simple number — fast to count) |

---

## TEXT ANIMATION 09 — "EVERYTHING YOUR FREIGHT NEEDS. UNDER ONE GROUP." (Word Shuffle)

### Frames

| Frame State | Time  | Line 1            | Line 2           | Line 3             |
| ----------- | ----- | ----------------- | ---------------- | ------------------ |
| KF-10 entry | 5.96s | "EVERYTHING COUR" | "FREIGHT NEEDS." | "UNDER ONE GROUP." |
| Mid-cycle   | +0.2s | Cycling           | Cycling          | Settled            |
| Settled     | +0.5s | "EVERYTHING YOUR" | "FREIGHT NEEDS." | "UNDER ONE GROUP." |

### Properties

| Property       | Value                                                                     |
| -------------- | ------------------------------------------------------------------------- |
| Lines          | 3                                                                         |
| Final text     | "EVERYTHING YOUR FREIGHT NEEDS. UNDER ONE GROUP."                         |
| Font           | Brand headline, Black (900)                                               |
| Size           | ~40–48px                                                                  |
| Color          | `#FFFFFF` on dark background                                              |
| Animation type | Slot machine — characters cycle through random characters before settling |
| Speed          | `80–120ms` per character cycle                                            |
| Total duration | `~0.6–0.8s`                                                               |
| Trigger        | Section viewport entry                                                    |

### Cycle Behavior (from KF-10 frame analysis)

Line 1 was mid-animation ("COUR" instead of "YOUR") while Lines 2 and 3 were already settled. This suggests lines do NOT stagger — they all start simultaneously but settle at slightly different rates.

---

## TEXT ANIMATION 10 — "RELIABILITY / AT EVERY / MILESTONE" (Word Shuffle — Wipe)

### Frames

| Frame State | Time  | Content Visible                                              |
| ----------- | ----- | ------------------------------------------------------------ |
| KF-12       | 7.38s | "RELIABILITY / AT EVERY / MILESTONE / MILESTONE" — mid-cycle |

### Properties

| Property       | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Lines          | 4                                                                  |
| Font           | Brand headline, Bold (700)                                         |
| Size           | ~20–28px                                                           |
| Color          | `#111111` on white                                                 |
| Location       | Left side of wipe panel                                            |
| Animation      | Same slot machine — words cycle through values                     |
| Final values   | "RELIABILITY / AT EVERY / MILESTONE / [resolved]"                  |
| Trigger        | Wipe section pin / scroll progress                                 |
| Possible scrub | YES — word changes may be tied to scroll position rather than time |

### Word List (Estimated)

The 4 lines may cycle through related logistics terms:

```
Line 1: RELIABILITY → ACCOUNTABILITY → VISIBILITY → RELIABILITY
Line 2: AT EVERY → THROUGHOUT → ON EVERY → AT EVERY
Line 3: MILESTONE → CHECKPOINT → SHIPMENT → MILESTONE
Line 4: [additional cycling word]
```

---

## TEXT ANIMATION 11 — "REAL-TIME FREIGHT TRACKING" (Feature Label)

**Location**: Right side of wipe panel  
**Time**: Visible in KF-12

### Properties

| Property | Value                                               |
| -------- | --------------------------------------------------- |
| Icon     | Circle with tracking icon (~20px)                   |
| Title    | "REAL-TIME FREIGHT TRACKING" — small-caps, ~12–14px |
| Body     | 2–3 lines, ~11–12px                                 |
| Enter    | Opacity fade-in `0 → 1`                             |
| Duration | `0.4s`                                              |
| Trigger  | Wipe scroll progress                                |

---

## TEXT ANIMATION 12 — "LOGISTICS THAT WORKS AS HARD AS YOU DO." (Ship Overlay)

### Frames

| Frame State | Time                                | Visual                          |
| ----------- | ----------------------------------- | ------------------------------- |
| Not visible | `< 9.38s` (camera still zooming in) | Hidden                          |
| Appearing   | `~9.3s → 9.6s`                      | Fading in                       |
| Full        | KF-14 (`9.38s`)                     | Fully visible                   |
| Exiting     | `~9.8s`                             | Fading out as camera pulls back |

### Properties

| Property   | Value                                       |
| ---------- | ------------------------------------------- |
| Font       | Brand headline, Bold (700)                  |
| Size       | `~28–36px`                                  |
| Color      | `#FFFFFF`                                   |
| Alignment  | Center (4 lines centered)                   |
| Background | None — transparent overlay over ship canvas |
| Enter type | Opacity fade-in                             |
| Duration   | `0.5–0.7s`                                  |
| Exit       | Opacity fade-out                            |
| Trigger    | Ship scroll progress 40–55%                 |

---

## TEXT ANIMATION 13 — Ship Feature Labels (×3)

### Properties

| Property   | Value                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| Labels     | "COMPANIES YOU CAN TRUST", "COMPETITIVE TRANSPARENT PRICING", "AFTER-HOURS RESOLUTION" |
| Each label | Icon + title + body copy                                                               |
| Enter type | Opacity `0→1` + slight outward translate toward ship center                            |
| Stagger    | `150ms`                                                                                |
| Duration   | `0.5s`                                                                                 |
| Trigger    | Ship scroll progress `65–80%`                                                          |
| Exit       | UNKNOWN                                                                                |

---

## TEXT ANIMATION 14 — "TRUSTED BY BUSINESSES ACROSS APAC" (H2 — Testimonials)

### Frames

| Frame State | Time       | Visual                                             |
| ----------- | ---------- | -------------------------------------------------- |
| Not visible | `< 10.88s` | Hidden                                             |
| KF-17       | 10.88s     | Revealing — lines 1–2 mostly done, line 3 starting |
| Full        | `~11.2s`   | All 3 lines visible                                |

### Properties

| Property               | Value                                                      |
| ---------------------- | ---------------------------------------------------------- |
| Lines                  | 3: "TRUSTED" / "BY BUSINESSES" / "ACROSS APAC"             |
| Line 1–2               | Black, 900 weight, ~64–72px                                |
| Line 3 ("ACROSS APAC") | Lighter grey or reduced opacity — differentiated treatment |
| Enter type             | Clip-path line reveal (same as H1, H2)                     |
| Duration per line      | `0.7s`                                                     |
| Stagger                | `0.1s`                                                     |
| Trigger                | ScrollTrigger `start: "top 80%"`                           |
| Ease                   | `power4.out`                                               |

---

## Text Animation Timeline (Consolidated)

```
00:00.4  → H1 eyebrow enters
00:04    → H1 lines stagger-reveal (3 lines × 0.9s)
00:06    → Hero body copy fades up
00:07.5  → CTA buttons fade up
02:75    → H2 editorial reveals (4 lines × 0.8s)
02:90    → Stats "2 500+", "98.2%" count up
03:50    → Stats "8+" count up
05:96    → Word shuffle (services entry) — settles in ~0.8s
07:38    → Word shuffle (wipe panel) — scrub-driven
09:38    → "LOGISTICS THAT WORKS..." fades in
09:80    → "LOGISTICS THAT WORKS..." fades out
09:88    → Ship feature labels stagger in
10:88    → Testimonials H2 reveals (3 lines)
11:20    → Client card names/titles appear
11:40    → Quote text fades up
```

---

## Navbar Text Behavior

| Section      | Navbar text color | Background        |
| ------------ | ----------------- | ----------------- |
| Globe Hero   | `#FFFFFF`         | Dark transparent  |
| Editorial    | `#111111`         | White/transparent |
| Crane/Truck  | `#111111`         | White/transparent |
| Services     | `#FFFFFF`         | Dark `#111111`    |
| Wipe         | `#111111`         | White             |
| Ship         | `#FFFFFF`         | Dark blue         |
| Aircraft     | `#FFFFFF`         | Sky (dark)        |
| Testimonials | `#111111`         | Off-white         |

### Implementation

ScrollTrigger markers add/remove CSS class on navbar at each section boundary:

```
.navbar.on-light { color: #111111; }
.navbar.on-dark { color: #FFFFFF; }
```
