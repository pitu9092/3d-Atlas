# 05 — Performance Guide

## Targets

| Metric           | Target                  | Tool                        |
| ---------------- | ----------------------- | --------------------------- |
| Frame Rate       | 60 FPS sustained        | Chrome DevTools Performance |
| Lighthouse Score | 95+ (desktop)           | Lighthouse CI               |
| CLS              | < 0.05                  | Core Web Vitals             |
| LCP              | < 2.5s                  | Core Web Vitals             |
| INP              | < 200ms                 | Core Web Vitals             |
| Bundle Size (JS) | < 200kB gzipped initial | next build output           |

---

## JavaScript / React

### Rule 1: No React state for animations

```typescript
// ❌ NEVER — triggers React re-renders at 60fps
const [rotation, setRotation] = useState(0)
useEffect(() => {
  const id = requestAnimationFrame(() => setRotation((r) => r + 0.01))
}, [rotation])

// ✅ ALWAYS — mutate ref directly (no re-render)
const meshRef = useRef<THREE.Mesh>(null)
useFrame(() => {
  if (meshRef.current) meshRef.current.rotation.y += 0.01
})
```

### Rule 2: Memoize expensive computations

```typescript
// Only memoize when the computation is actually expensive
const geometry = useMemo(() => createComplexGeometry(params), [params])
```

### Rule 3: Dynamic imports for heavy scenes

```typescript
// Lazy load Three.js scenes
const HeroScene = dynamic(() => import('@/scenes/hero/Scene'), {
  ssr: false,
  loading: () => <SceneSkeleton />,
})
```

---

## Three.js / WebGL

### Pixel Ratio Cap

```typescript
// Never use the raw devicePixelRatio — cap at 2
<Canvas dpr={[1, 2]} />
```

### Dispose Everything

```typescript
// Always dispose geometries, materials, textures when unmounting
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

### Use `useFrame` not `setInterval`

```typescript
// ✅ R3F synchronized with the render loop
useFrame((state, delta) => {
  mesh.current.rotation.y += delta * 0.5
})
```

### Texture Optimization

- Use `.ktx2` (Basis Universal) for compressed textures
- Use `useTexture` from Drei (caches by URL)
- Mipmap generation is automatic — but set `anisotropy`

### Draw Call Budget

| Scene Type             | Max Draw Calls |
| ---------------------- | -------------- |
| Simple hero scene      | < 50           |
| Complex featured scene | < 150          |
| Full world scene       | < 300          |

### GPU-Composited Properties Only

Animate only:

- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (sparingly)

Never animate:

- `width`, `height`, `top`, `left` (triggers layout)
- `background-color` on large elements (triggers paint)

---

## GSAP / Scroll

### Use `will-change` sparingly

```css
/* Only apply to elements actively animating */
.hero-text {
  will-change: transform, opacity;
}
/* Remove after animation ends */
```

### Kill ScrollTriggers on route change

```typescript
// Always clean up to prevent memory leaks
return () => {
  killAllScrollTriggers()
}
```

### Batch DOM reads/writes

```typescript
// Use gsap.set() for initial states (batched)
gsap.set([el1, el2, el3], { opacity: 0, y: 40 })
```

---

## Next.js

### Image Optimization

```tsx
// Always use next/image — never <img> for content images
import Image from 'next/image'
;<Image src="/images/hero.jpg" width={1920} height={1080} priority alt="Hero" />
```

### Font Optimization

- Fonts loaded via `next/font/google` (zero layout shift)
- `display: swap` for all fonts
- Only load the weights you use

### Route Prefetching

- Use `next/link` — automatic prefetching in viewport
- Use `router.prefetch()` for programmatic prefetching

---

## Bundle Analysis

```bash
# Analyze bundle (requires @next/bundle-analyzer)
ANALYZE=true npm run build
```

### Target allocations (gzipped)

| Chunk                  | Budget |
| ---------------------- | ------ |
| Framework (React/Next) | ~50kB  |
| Three.js               | ~150kB |
| GSAP                   | ~30kB  |
| Framer Motion          | ~25kB  |
| App code               | ~50kB  |
