# 06 — Animation Strategy

## Stack Overview

| Tool                     | Role                                | When to Use                                           |
| ------------------------ | ----------------------------------- | ----------------------------------------------------- |
| **GSAP + ScrollTrigger** | Scroll-driven, timeline, DOM tweens | Hero reveals, scroll-linked motion, complex sequences |
| **Lenis**                | Smooth scroll inertia               | All pages — replaces native scroll                    |
| **Framer Motion**        | React component animations          | UI components, hover states, layout transitions       |
| **R3F `useFrame`**       | 3D scene animation                  | Three.js object transforms, material uniforms         |
| **CSS Transitions**      | Simple micro-interactions           | Button hovers, focus states, simple opacity           |

---

## GSAP

### Plugin Registration

Plugins are registered **once** in `lib/gsap.ts` at app boot.  
**Never** call `gsap.registerPlugin()` inside a component.

```typescript
// lib/gsap.ts — registered once
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
```

### Hook: `useGSAP` (from @gsap/react)

Always use `useGSAP` — never raw `useEffect` for GSAP timelines.
`useGSAP` automatically reverts animations on unmount (no memory leaks).

```typescript
import { useGSAP } from '@gsap/react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.hero-title', {
      y: 60,
      opacity: 0,
      duration: ANIMATION.DURATION.SLOWER,
      ease: ANIMATION.EASE.DEFAULT,
    })
  }, { scope: containerRef }) // scope keeps selectors within this component

  return <div ref={containerRef}>...</div>
}
```

### ScrollTrigger Pattern

```typescript
useGSAP(
  () => {
    gsap.to(element, {
      y: -100,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1.5, // smooth lag (1.5s behind scroll)
        // markers: true,        // debug only — remove in production
      },
    })
  },
  { scope: containerRef },
)
```

### Refresh Strategy

```typescript
// After content is loaded or layout changes
ScrollTrigger.refresh()

// On route change — clean up all triggers
ScrollTrigger.getAll().forEach((t) => t.kill())
```

### Easing Reference

```
power3.out     → Standard reveal (most common)
power4.inOut   → Cinematic transitions
expo.out       → Snappy, tech feel
back.out(1.7)  → Spring-like overshoot
elastic.out    → Bouncy (use sparingly)
```

---

## Lenis

### Setup

Lenis is initialized in `LenisProvider` (Phase 2) and connected to GSAP ScrollTrigger.

```typescript
// Pattern: connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)
```

### Preventing Smooth Scroll

```html
<!-- For modals, drawers, or scrollable panels inside the page -->
<div data-lenis-prevent>
  <!-- this element uses native scroll -->
</div>
```

---

## Framer Motion

### When to Use

Framer Motion is for **React-state-driven animations**:

- Conditional render transitions (`AnimatePresence`)
- Layout animations (`layout` prop)
- Hover / tap / focus states
- Component enter/exit

### Variant Pattern (centralized)

```typescript
// animations/motion/variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// Usage in component
import { fadeInUp } from '@/animations/motion/variants'

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
```

### AnimatePresence

```typescript
<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    />
  )}
</AnimatePresence>
```

---

## 3D Scene Animation

### `useFrame` Pattern

```typescript
import { useFrame } from '@react-three/fiber'

export function AtmosphereMesh() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    // delta = time since last frame (seconds) — frame-rate independent!
    meshRef.current.rotation.y += delta * 0.2
    meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <mesh ref={meshRef} />
}
```

### Shader Uniforms for Animation

```glsl
// In vertex shader
uniform float uTime;
uniform float uProgress; // driven by ScrollTrigger

void main() {
  vec3 pos = position;
  pos.y += sin(pos.x * 2.0 + uTime) * 0.1 * uProgress;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

---

## Scroll Architecture

```
User Scroll Input
    ↓
Lenis (smooth inertia)
    ↓
ScrollTrigger.update (via lenis.on('scroll'))
    ↓
GSAP Tweens (scrub-based) ← progress driven
    ↓
3D Uniform Updates (via refs, not React state)
```

---

## Stagger Patterns

```typescript
// Stagger reveal of list items
gsap.from('.feature-card', {
  y: 40,
  opacity: 0,
  duration: 0.6,
  ease: 'power3.out',
  stagger: 0.1,
  scrollTrigger: { trigger: '.features-grid', start: 'top 75%' },
})
```
