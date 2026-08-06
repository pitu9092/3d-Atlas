# 19 — Responsive Observations

> Note: The reference video is shot on a desktop iMac (estimated ~27" display, ~2560px wide Retina display). All observations are from this desktop perspective. Mobile/tablet behavior is inferred, not directly observed.

---

## Desktop (1440px–2560px)

### Observed Directly

- **Viewport**: Full iMac screen (~1440–1920px effective viewport)
- **Layout**: Two-column layouts (hero text + globe, editorial content), features grid (4-column)
- **Globe**: Right-side positioned, ~50% viewport width, partially cropped
- **3D Models**: Full size, high quality
- **Typography**: Very large (H1 ~96–128px, H2 ~64–96px)
- **Navbar**: Full navigation links visible

### Inferred at 1440px

- Container max-width kicks in — content centered within max-width bounds
- Globe may be more fully visible at 1440px vs. 2560px

---

## Laptop (1024px–1440px)

### Inferred (not observed)

| Element      | Expected Change                                           |
| ------------ | --------------------------------------------------------- |
| Typography   | Scale down — fluid type scale handles this                |
| Globe        | Remains right-positioned, may shrink slightly             |
| Feature grid | Remains 4 columns at 1280px, possibly 2 columns at 1024px |
| Side padding | Reduces from ~120px to ~60–80px                           |
| Navbar       | Probably all links still visible                          |

---

## Tablet (768px–1024px)

### Inferred

| Element         | Expected Change                                        |
| --------------- | ------------------------------------------------------ |
| Layout          | Two-column → single column                             |
| Globe           | May move below text OR stay as background              |
| Typography      | Further scale down                                     |
| Feature grid    | 2 columns                                              |
| Navbar          | Possible hamburger menu                                |
| 3D scenes       | Lower DPR (1 instead of 2), potentially simpler models |
| Pinned sections | May have reduced scroll heights                        |

### Critical Uncertainty

The globe scene is fundamentally designed for wide-screen. On tablet portrait (~768px), the globe-right + text-left layout would need to either:

- A: Stack vertically (globe below text, or globe as background)
- B: Reduce globe size significantly
- C: Remove 3D globe and use a static image fallback

**UNKNOWN** — Cannot determine from reference.

---

## Mobile (< 768px)

### Highly Uncertain — UNKNOWN

Given the complexity of the 3D scenes, mobile likely has one of:

**Option A: Simplified 3D** (more common)

- All 3D scenes remain but are simplified
- Lower polygon count models
- No post-processing (bloom disabled)
- DPR capped at 1 (never 2)
- Slower scroll animations

**Option B: Video fallback** (simpler)

- 3D scenes replaced with pre-rendered video loops
- Much better performance guarantee
- Used by some premium sites (Stripe, Linear)

**Option C: Static image fallback** (least effort)

- 3D scenes replaced with static screenshots/renders
- Not appropriate for this level of quality site

### UNKNOWN Mobile Behaviors

- Does the reach stacker animate on mobile? (scroll-pinned sections may be disabled)
- Does the custom cursor appear on mobile? (likely removed — no mouse on touch)
- Are font sizes appropriate? (fluid type may need manual breakpoint overrides)
- Is horizontal layout broken on any section?

---

## Critical Responsive Risks

### Risk 1: Globe on Mobile

The hero globe is designed as a full right-side element. On mobile portrait (375px), there is not enough horizontal space for side-by-side layout.

**Expected**: Globe becomes background element or moves below text.

### Risk 2: Pinned section scroll on Mobile

The extremely long pinned sections (reach stacker = ~400vh) may create issues on mobile:

- iOS momentum scroll does not work well with `position: sticky` in some cases
- Lenis may have mobile-specific behaviors
- Very long sections mean a lot of scrolling on a small device

**Expected**: Pinned section heights should be reduced on mobile (200vh instead of 400vh).

### Risk 3: WebGL Performance on Mobile

Running multiple Three.js scenes with bloom post-processing is taxing on mobile GPUs.

**Expected**: Bloom disabled on mobile. Model complexity reduced. DPR = 1.

### Risk 4: Feature Grid at Mobile

The 4-column feature grid collapses to 1 column on mobile.

**Expected**: Stack cards vertically on mobile.

---

## Responsive Strategy Recommendation

Based on visual analysis:

```
Desktop (1280px+): Full experience — all 3D, all animations, 4-col grids
Tablet (768–1280px): Reduced 3D quality, layout adaptations, 2-col grids
Mobile (<768px): Simplified 3D or video fallback, 1-col layouts, cursor removed
```

### CSS Breakpoint Usage

All responsive behavior should use min-width (mobile-first) media queries:

```css
/* Mobile base */
.feature-grid {
  grid-template-columns: 1fr;
}

/* Tablet */
@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Desktop */
@media (min-width: 1280px) {
  .feature-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```
