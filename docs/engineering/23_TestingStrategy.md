# 23 — Testing Strategy

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Unit, visual regression, performance, cross-browser, animation, and responsive testing

---

## Testing Philosophy

3D Atlas has limited unit-testable logic and extensive visual/animation content. Testing strategy prioritizes:

1. **Performance regression** — FPS and frame time must not degrade
2. **Visual regression** — Key frames must not change unexpectedly
3. **Cross-browser** — Experience must work on all target browsers
4. **Animation** — Scroll timelines must hit expected values
5. **Unit tests** — Pure utilities (math, format) only

---

## Test Pyramid

```
                    [Manual QA]               ← Top: highest value, lowest frequency
                  [Visual Regression]
               [Performance Benchmarks]
             [Cross-Browser Integration]
           [Animation Integration Tests]
         [Unit Tests: utilities only]          ← Bottom: lowest value, highest frequency
```

---

## Unit Testing

### Scope

Only pure functions in `src/lib/` — no React, no Three.js, no GSAP.

### Framework

```
Vitest (preferred for Next.js projects)
  OR Jest + ts-jest
```

### What to Unit Test

| Module                   | Functions                          | Tests                        |
| ------------------------ | ---------------------------------- | ---------------------------- |
| `lib/math/lerp.ts`       | `lerp()`, `clamp()`, `easeInOut()` | Input/output correctness     |
| `lib/math/latLon.ts`     | `latLonToVec3()`                   | Known coordinates validation |
| `lib/format/number.ts`   | `formatStat()`                     | `2500 → "2 500+"`            |
| `lib/scroll/progress.ts` | `progressToPhase()`                | Phase calculation            |
| `lib/device/tier.ts`     | `detectGPUTier()`                  | Memory/DPR → tier mapping    |

### Example Unit Test Spec

```typescript
describe('lerp()', () => {
  it('returns start value at t=0', () => {
    expect(lerp(0, 10, 0)).toBe(0)
  })
  it('returns end value at t=1', () => {
    expect(lerp(0, 10, 1)).toBe(10)
  })
  it('returns midpoint at t=0.5', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})
```

### What NOT to Unit Test

- Three.js scene setup (requires WebGL)
- GSAP timelines (requires DOM)
- ScrollTrigger behavior (requires DOM + Lenis)
- R3F components (integration test instead)

---

## Visual Regression Testing

### Purpose

Prevent unintentional visual changes — especially to 3D scene appearance and transition colors.

### Framework

```
Playwright + @playwright/test-image-snapshot
  OR
Chromatic (Storybook-based, if using Storybook)
```

### Snapshot Points

| Snapshot             | Scroll Position | Purpose                             |
| -------------------- | --------------- | ----------------------------------- |
| `hero-initial`       | 0vh             | Globe + H1 visible                  |
| `hero-camera-pulled` | 150vh           | Globe small, background changing    |
| `editorial`          | 320vh           | Stats + H2 visible                  |
| `crane-0`            | 500vh           | Crane at start of animation         |
| `crane-50`           | 675vh           | Crane mid-animation                 |
| `services`           | 1100vh          | Dark section, word shuffle settled  |
| `wipe-open`          | 1280vh          | Black panel 50% width               |
| `ship-zoom`          | 1430vh          | Ship at closest zoom                |
| `aircraft-entry`     | 1750vh          | Aircraft tiny, distant              |
| `aircraft-close`     | 1860vh          | Aircraft large                      |
| `testimonials`       | 1960vh          | Light section, testimonials visible |

### Snapshot Baseline

1. Generate baselines on reference hardware (MacBook with stable GPU)
2. Store in `tests/snapshots/`
3. Any diff > 1% pixel threshold = test failure

---

## Performance Testing

### Framework

```
Lighthouse CI (automated)
Playwright (manual FPS measurement via CDP)
```

### Lighthouse Targets

| Metric                         | Target  | Minimum Pass |
| ------------------------------ | ------- | ------------ |
| Performance score              | ≥ 85    | 75           |
| LCP (Largest Contentful Paint) | ≤ 2.5s  | 3.0s         |
| FID / INP                      | ≤ 100ms | 200ms        |
| CLS                            | ≤ 0.1   | 0.25         |
| TTI (Time to Interactive)      | ≤ 3.5s  | 5.0s         |

### FPS Test (via Chrome DevTools Protocol)

```
Playwright script:
  1. Navigate to page
  2. Wait for loading screen to exit
  3. Scroll through full experience (simulate scroll events)
  4. Record FPS via CDP
  5. Assert: average FPS ≥ 55, minimum FPS ≥ 45
```

### Canvas GPU Time Test

```
In development build:
  1. Attach r3f-perf
  2. Scroll through each pinned section
  3. Record GPU time per canvas
  4. Assert: peak GPU time ≤ 8ms
```

---

## Cross-Browser Testing

### Test Matrix

| Browser          | Version | Desktop | Mobile       |
| ---------------- | ------- | ------- | ------------ |
| Chrome           | Latest  | ✓ Full  | ✓ Full       |
| Safari           | 16+     | ✓ Full  | ✓ Full (iOS) |
| Firefox          | Latest  | ✓ Full  | ✓            |
| Edge             | Latest  | ✓ Full  | —            |
| Chrome Android   | Latest  | —       | ✓            |
| Samsung Internet | Latest  | —       | ✓            |

### Safari-Specific Checks

Safari has known differences in:

- WebGL behavior (check `WEBGL_depth_texture` extension)
- CSS `backdrop-filter` support
- `requestAnimationFrame` timing
- `will-change` handling

### Test Procedure

```
For each browser:
  1. Open production build URL
  2. Verify: Globe renders and animates
  3. Scroll to each section
  4. Verify: Crane animation matches expected appearance
  5. Verify: Ship zoom works correctly
  6. Verify: All text animations complete correctly
  7. Verify: Navbar theme switches correctly
  8. Verify: No console errors
```

---

## Responsive Testing

### Breakpoints to Test

| Width    | Device Representation |
| -------- | --------------------- |
| `1920px` | Full HD desktop       |
| `1440px` | MacBook 14"           |
| `1280px` | Laptop                |
| `1024px` | iPad Pro landscape    |
| `768px`  | iPad portrait         |
| `428px`  | iPhone 14 Pro Max     |
| `375px`  | iPhone SE / standard  |
| `320px`  | Minimum supported     |

### Key Checks Per Breakpoint

```
✓ Globe not cropped at edges
✓ H1 text wraps correctly (correct line count for clip animation)
✓ Navbar items not overflowing
✓ Service columns readable
✓ Feature labels not off-screen (ship section)
✓ Crane in frame throughout animation
```

---

## Animation Testing

### GSAP Timeline Tests

Manual verification via browser console:

```javascript
// Verify timeline progress:
gsap.globalTimeline.progress(0.5) // Jump to 50% of all animations
// Visually verify expected state

// Verify ScrollTrigger at specific scroll:
window.scrollTo(0, 5000) // Jump to 5000px
ScrollTrigger.update()
// Visually verify crane animation at expected progress
```

### Animation Timing Verification

```
For each section:
  1. Record start scroll position
  2. Record end scroll position
  3. Verify: scrub animation at 0% matches expected start state
  4. Verify: scrub animation at 50% matches expected mid state
  5. Verify: scrub animation at 100% matches expected end state
```

---

## Test Infrastructure

### Test Commands

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:visual": "playwright test --project=visual",
  "test:perf": "playwright test --project=performance",
  "test:lighthouse": "lhci autorun"
}
```

### CI Pipeline Test Stages

```
1. Unit tests (vitest) — runs on every PR
2. Lighthouse CI — runs on every PR
3. Visual regression — runs on merge to main
4. Cross-browser — runs on release
```

---

## Known Testing Limitations

| Limitation                  | Reason                     | Workaround                     |
| --------------------------- | -------------------------- | ------------------------------ |
| No true 3D unit tests       | WebGL requires GPU context | Visual regression snapshots    |
| GSAP tests need DOM         | GSAP requires browser      | Playwright integration tests   |
| Mobile FPS hard to automate | No device lab              | Manual testing on real devices |
| Shader compilation varies   | GPU driver differences     | Visual inspection per browser  |
