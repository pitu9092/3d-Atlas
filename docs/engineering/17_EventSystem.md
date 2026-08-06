# 17 — Event System

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: All browser events — registration, handling, cleanup, and performance

---

## Event System Overview

```
Browser Events
├── Resize        → ScrollTrigger.refresh() + lenis.resize()
├── Scroll        → Lenis → ScrollTrigger.update() (managed internally)
├── Pointer       → Cursor ring position (GSAP)
├── Touch         → Lenis native (smoothTouch: false)
├── Keyboard      → Accessibility focus management
├── Visibility    → Canvas frameloop management
└── Route Change  → ScrollTrigger cleanup (N/A — single page)
```

---

## Resize Event

### Handler

```
Owner: LenisProvider (or PageWrapper)
Event: window 'resize'
Debounce: 200ms
```

### Actions on Resize

```
1. ScrollTrigger.refresh()   ← Recalculate all trigger positions
2. lenis.resize()            ← Recalculate scroll dimensions
3. Camera aspect update      ← Handled by R3F internally (ResizeObserver)
4. Canvas resize             ← Handled by R3F internally
```

### Debounce Strategy

```
let resizeTimer: ReturnType<typeof setTimeout>

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh()
    lenis.resize()
  }, 200)
})
```

### Cleanup

```
window.removeEventListener('resize', resizeHandler)
clearTimeout(resizeTimer)
```

---

## Scroll Event

### Native Browser Scroll

Lenis intercepts and replaces native scroll.

### Lenis Scroll Event

```
lenis.on('scroll', ScrollTrigger.update)
  → Fires on every Lenis scroll tick
  → ScrollTrigger evaluates all trigger positions
  → Fires appropriate callbacks
```

### Custom Scroll Consumers

| Consumer      | What It Reads  | Purpose                           |
| ------------- | -------------- | --------------------------------- |
| ScrollTrigger | Position       | All animations                    |
| Navbar        | Lenis velocity | Optional: blur/dim on fast scroll |
| None others   | —              | —                                 |

---

## Pointer Event

### Custom Cursor Ring

```
Owner: CursorRing component
Events: window 'mousemove'
Handler: GSAP to() update on cursor element
```

### Implementation

```
window.addEventListener('mousemove', (e) => {
  gsap.to(cursorRef.current, {
    x: e.clientX - 20,
    y: e.clientY - 20,
    duration: 0.15,
    ease: 'power2.out',
    overwrite: true  // Cancel previous tween if cursor moves fast
  })
})
```

### Cursor Visibility

```
Show cursor ring on: window.addEventListener('mousemove') first event
Hide on mobile:      CSS media query pointer: coarse
```

### Cleanup

```
window.removeEventListener('mousemove', mouseMoveHandler)
```

---

## Touch Event

### Strategy

Lenis is initialized with `smoothTouch: false`. Native browser touch scroll is used on touch devices.

ScrollTrigger still fires — it reads from native scroll events when Lenis does not intercept them.

### Touch-Specific Behavior

| Feature           | Touch Behavior               |
| ----------------- | ---------------------------- |
| Smooth scroll     | Disabled (native momentum)   |
| Scroll animations | Still fire (via native ST)   |
| Cursor ring       | Hidden (no pointer on touch) |
| Pin sections      | Work with native scroll      |

### Mobile Scrollbar

On touch devices, native scrollbar (if visible) allows scroll. This is acceptable.

---

## Keyboard Event

### Current Usage

1. `Tab` navigation — standard browser behavior (no override)
2. `Escape` — for any modal/overlay (if implemented)
3. Arrow keys — NOT overridden (scroll stays native)

### ScrollTrigger + Keyboard

ScrollTrigger does NOT conflict with keyboard navigation. Keyboard scroll fires native scroll events which Lenis processes.

### Focus Management (Accessibility)

```
When loading screen exits:
  Focus moves to first focusable element in hero section

Implementation: heroSection.querySelector('a, button').focus()
  Called after loading animation completes
```

---

## Visibility Event (Tab Focus)

### Problem

When user switches tabs, browser may pause RAF. On return, GSAP's `lagSmoothing` would normally "catch up" causing a scroll jump.

### Solution

```
gsap.ticker.lagSmoothing(0)
```

With lag smoothing at 0, GSAP does NOT attempt to catch up. Scroll position stays where it was when the user left.

### Page Visibility API (Optional)

```
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lenis.stop()    // Pause smooth scroll
  } else {
    lenis.start()   // Resume
  }
})
```

Prevents scroll drift when tab is backgrounded.

---

## WebGL Context Events

### Context Loss

```
canvasElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault()  // Prevent default — allows context restoration
  // Log error, show user message
})

canvasElement.addEventListener('webglcontextrestored', () => {
  // Reinitialize renderer (R3F handles this internally)
})
```

### Context Loss Causes

- GPU memory pressure (too many canvases, textures)
- Driver crash
- Device sleep/wake on mobile

### Recovery Strategy

R3F handles context restoration internally in some cases. If not recoverable, show a "Please refresh" message.

---

## Event Cleanup Registry

All event listeners registered in the application must be tracked and removed:

```typescript
interface EventRegistry {
  window: { [event: string]: EventListener }
  lenis: { [event: string]: EventListener }
  document: { [event: string]: EventListener }
}
```

### Per-Component Cleanup

```
useEffect(() => {
  window.addEventListener('mousemove', handler)
  return () => window.removeEventListener('mousemove', handler)
}, [])
```

### Global Cleanup (On Page Unload)

```
window.addEventListener('beforeunload', () => {
  lenis.destroy()           ← Removes all Lenis event listeners
  ScrollTrigger.killAll()   ← Removes all ST event listeners
})
```

---

## Event Priority Summary

| Event              | Priority | Debounce              | Where               |
| ------------------ | -------- | --------------------- | ------------------- |
| Scroll (Lenis)     | Highest  | None                  | Lenis → GSAP ticker |
| Resize             | High     | 200ms                 | LenisProvider       |
| mousemove (cursor) | Medium   | None (GSAP overwrite) | CursorRing          |
| visibilitychange   | Medium   | None                  | LenisProvider       |
| contextlost        | Low      | None                  | BaseCanvas          |
| Keyboard           | Low      | None                  | Browser native      |

---

## Route Change (Next.js App Router)

3D Atlas is a single-page experience — no client-side navigation.

If navigation is added in the future:

```
On route change:
  1. ScrollTrigger.killAll()
  2. gsap.globalTimeline.clear()
  3. lenis.scrollTo(0, { immediate: true })
  4. After new page mounts: ScrollTrigger.refresh()
```

Currently: NOT APPLICABLE.
