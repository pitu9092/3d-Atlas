# 22 — Accessibility Strategy

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: WCAG 2.1 AA compliance, reduced motion, keyboard navigation, ARIA, and fallbacks

---

## Accessibility Targets

| Standard            | Level                            | Scope                          |
| ------------------- | -------------------------------- | ------------------------------ |
| WCAG 2.1            | AA                               | All DOM content                |
| WCAG 2.1            | A                                | 3D canvas scenes (best effort) |
| Reduced Motion      | Full support                     | All animations                 |
| Keyboard Navigation | Full                             | All interactive elements       |
| Screen Reader       | Informational content accessible | Text + alt text                |

---

## Semantic HTML

### Document Structure

```html
<html lang="en">
  <head>
    <title>3D Atlas — Global Logistics Solutions</title>
    <meta name="description" content="..." />
  </head>
  <body>
    <header role="banner">
      <nav aria-label="Main navigation">...</nav>
    </header>

    <main>
      <section aria-label="Hero — Global Logistics">
        <h1>EVERY SHIPMENT.<br />EVERY ROUTE.<br />TRACKED.</h1>
      </section>

      <section aria-label="Editorial — Brand Statement">
        <h2>...</h2>
      </section>

      <!-- etc. -->
    </main>

    <footer>...</footer>
  </body>
</html>
```

### Heading Hierarchy

```
h1: Hero section (ONE per page)
  h2: Editorial section
  h2: Services section
  h2: Testimonials section
    h3: Individual testimonial quotes
```

---

## Canvas Accessibility

### 3D Canvas Elements

WebGL canvases are not inherently accessible. Strategy:

```html
<canvas role="img" aria-label="Animated 3D globe showing global logistics routes">
  <!-- Fallback content for non-WebGL browsers -->
  <img src="/static/globe-fallback.png" alt="Globe showing global logistics routes" />
</canvas>
```

### Canvas Must NOT Receive Focus

```
canvas.tabIndex = -1  ← Prevent tab focusing on canvas
```

All meaningful content is in the DOM overlay — not in the canvas.

---

## Reduced Motion

### CSS (System-Level)

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove transitions */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Stop globe rotation */
  .globe-canvas {
    animation: none !important;
  }

  /* Remove scroll parallax */
  .parallax-element {
    transform: none !important;
  }
}
```

### JavaScript (Application-Level)

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  // Skip all GSAP animations — show final state immediately
  gsap.set('.hero-h1 .line', { yPercent: 0, opacity: 1 })
  gsap.set('.eyebrow', { opacity: 1 })

  // Stop Lenis smooth scroll
  lenis.destroy()

  // Stop globe rotation in useFrame
  globeRotationEnabled.current = false
}
```

### Progressive Disclosure

Even with reduced motion, the site should remain fully usable and all content visible.

---

## Keyboard Navigation

### Tab Order

```
1. Skip to main content link (hidden until focused)
2. Navbar links (logo, nav items, CTA)
3. Hero CTA button ("Learn More", "Contact Us")
4. Editorial stats (informational — tabIndex=-1, no focus)
5. Services grid items (tabIndex=0 if interactive)
6. Testimonials (informational — tabIndex=-1)
7. Footer links
```

### Focus Styles

Never remove outline without replacement:

```css
/* Default browser outline removed — custom provided */
*:focus {
  outline: 2px solid #1a7fff;
  outline-offset: 2px;
}

/* For elements that should not show focus on mouse click */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Only show for keyboard users */
*:focus-visible {
  outline: 2px solid #1a7fff;
  outline-offset: 2px;
}
```

### Skip Link

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 8px 16px;
  background: #1a7fff;
  color: white;
  z-index: 10000;
}
.skip-link:focus {
  top: 0;
}
```

---

## ARIA Labels

### Navigation

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="#hero">Home</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
```

### Stat Counters

```html
<div role="group" aria-label="Company statistics">
  <div>
    <span aria-label="2,500+ shipments delivered">
      <span aria-hidden="true" class="stat-value">2 500+</span>
    </span>
    <span>Shipments</span>
  </div>
</div>
```

### Loading Screen

```html
<div role="status" aria-label="Loading experience" aria-live="polite">Loading...</div>
```

### Canvas Regions

```html
<div role="region" aria-label="3D crane animation — reach stacker loading a shipping container">
  <canvas aria-hidden="true" /> ← Canvas hidden from screen reader
  <!-- Screen reader sees the region label, not canvas content -->
</div>
```

---

## Color Contrast

### Text Contrast Requirements (WCAG AA)

| Text Type                        | Min Contrast Ratio |
| -------------------------------- | ------------------ |
| Normal text (< 18px)             | 4.5:1              |
| Large text (≥ 18px bold, ≥ 24px) | 3:1                |
| UI components                    | 3:1                |

### Color Pairs Used

| Foreground               | Background | Ratio  | Pass       |
| ------------------------ | ---------- | ------ | ---------- |
| `#111111`                | `#F5F4F0`  | ~18:1  | ✓ AA + AAA |
| `#FFFFFF`                | `#080808`  | ~21:1  | ✓ AA + AAA |
| `#FFFFFF`                | `#133D77`  | ~6.8:1 | ✓ AA       |
| `#111111`                | `#FFFFFF`  | ~21:1  | ✓ AA + AAA |
| `rgba(255,255,255,0.65)` | `#080808`  | ~7.5:1 | ✓ AA       |

UNKNOWN — Eyebrow text `rgba(255,255,255,0.65)` on dark gradient — verify actual contrast ratio.

---

## Focus Management

### Loading Screen to Hero

When the loading screen exits:

```
document.querySelector('#hero h1')?.focus()
  OR
document.querySelector('.hero-cta')?.focus()
```

Ensures keyboard users have a logical starting point after loading completes.

### Modal/Overlay Focus Trap

If any modal-style overlay exists:

```
Focus trap: Tab cycles within overlay
Escape key: Closes overlay, returns focus to trigger element
```

Currently: No modals confirmed. NOT APPLICABLE.

---

## Screen Reader Behavior

### Scroll Animations

Clip-path text reveals (`yPercent: 100 → 0`) should have:

```html
<span class="line-wrapper" aria-hidden="true">
  <span class="line-text">EVERY SHIPMENT.</span>
</span>
```

With a duplicate accessible version:

```html
<span class="sr-only">EVERY SHIPMENT. EVERY ROUTE. TRACKED.</span>
```

This prevents screen readers from reading text character-by-character during the animation.

### `sr-only` CSS Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Accessibility Audit Plan

### Tools

| Tool                      | Purpose                     |
| ------------------------- | --------------------------- |
| axe DevTools (Chrome)     | WCAG automated audit        |
| WAVE (WebAIM)             | Visual accessibility report |
| Chrome Accessibility tree | Verify ARIA structure       |
| VoiceOver (macOS)         | Screen reader manual test   |
| NVDA + Firefox (Windows)  | Screen reader manual test   |
| Keyboard-only navigation  | Full tab + enter test       |

### Checklist

```
✓ Page has single <h1>
✓ All images have alt text
✓ All canvases have aria-label or aria-hidden
✓ All interactive elements are keyboard accessible
✓ Focus styles visible for all interactive elements
✓ Color contrast ≥ 4.5:1 for normal text
✓ Reduced motion mode fully functional
✓ Loading screen has aria-live
✓ Skip link present and working
✓ Language attribute on <html>
```
