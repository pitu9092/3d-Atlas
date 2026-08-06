# 07 — Responsive Strategy

## Breakpoint System

Breakpoints are defined as CSS custom property references and TypeScript constants.

| Name  | px     | Use Case                               |
| ----- | ------ | -------------------------------------- |
| `sm`  | 640px  | Large phones, small tablets (portrait) |
| `md`  | 768px  | Tablets (portrait), small laptops      |
| `lg`  | 1024px | Tablets (landscape), laptops           |
| `xl`  | 1280px | Desktops                               |
| `2xl` | 1536px | Large desktops, 4K                     |

### Mobile-First Approach

All styles are written **mobile-first** (min-width media queries).

```css
/* ✅ Mobile-first */
.hero-title {
  font-size: var(--text-4xl);
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: var(--text-7xl);
  }
}
```

---

## Fluid Typography

All text sizes use `clamp()` to scale fluidly between breakpoints.  
**Never use fixed `px` values for font sizes.**

```css
/* Defined in globals.css — use these variables, not raw values */
--text-base: clamp(0.875rem, 0.8vw + 0.7rem, 1rem);
--text-6xl: clamp(3rem, 5vw + 1rem, 4rem);
--text-8xl: clamp(5rem, 8vw + 1rem, 6.5rem);
```

---

## Fluid Spacing

```css
/* Content padding scales with viewport */
--content-padding-x: clamp(1rem, 5vw, 5rem);
```

---

## Responsive 3D

### Canvas Resizing

R3F `Canvas` resizes automatically. Use `useThree` for camera adjustments:

```typescript
import { useThree } from '@react-three/fiber'

export function ResponsiveCamera() {
  const { viewport } = useThree()

  useEffect(() => {
    // Adjust camera position based on viewport aspect ratio
    if (viewport.aspect < 1) {
      // portrait mode — pull camera back
    }
  }, [viewport])
}
```

### LOD (Level of Detail) for Mobile

```typescript
import { useThree } from '@react-three/fiber'
import { isMobile } from 'react-use'

export function AdaptiveScene() {
  const { size } = useThree()
  const isMobileViewport = size.width < 768

  // Reduce geometry complexity on mobile
  const segments = isMobileViewport ? 32 : 128

  return <sphereGeometry args={[1, segments, segments]} />
}
```

### Pixel Ratio

```typescript
// Cap DPR at 2 for performance
<Canvas dpr={[1, Math.min(window.devicePixelRatio, 2)]} />
```

---

## Responsive Animations

### Reduced Motion

Always respect `prefers-reduced-motion`:

```typescript
// hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion'

export function useAnimationConfig() {
  const shouldReduceMotion = useReducedMotion()

  return {
    duration: shouldReduceMotion ? 0 : ANIMATION.DURATION.SLOWER,
    y: shouldReduceMotion ? 0 : 40,
  }
}
```

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Touch vs Mouse

```typescript
// Disable complex hover effects on touch devices
const isTouchDevice = 'ontouchstart' in window

if (!isTouchDevice) {
  // Register mouse-based parallax
}
```

---

## Container Strategy

```typescript
// components/layout/Container.tsx
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx('container', className)}>
      {children}
    </div>
  )
}
```

```css
/* globals.css */
.container {
  width: 100%;
  max-width: var(--content-max-width); /* 1440px */
  margin-inline: auto;
  padding-inline: var(--content-padding-x); /* clamp(1rem, 5vw, 5rem) */
}
```

---

## Grid System

Use CSS Grid with named areas for complex layouts:

```css
.hero-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 1024px) {
  .hero-layout {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
  }
}
```

---

## Testing Breakpoints

| Viewport | Test Device          |
| -------- | -------------------- |
| 375px    | iPhone SE            |
| 390px    | iPhone 14            |
| 768px    | iPad                 |
| 1024px   | iPad Pro (landscape) |
| 1440px   | MacBook Pro          |
| 1920px   | Desktop              |
| 2560px   | 4K / UltraWide       |
