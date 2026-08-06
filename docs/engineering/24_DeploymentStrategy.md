# 24 — Deployment Strategy

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Build optimization, asset delivery, CDN, caching, and production deployment

---

## Target Deployment Platform

**Primary**: Vercel (Next.js native host)  
**Alternative**: Netlify, Cloudflare Pages, AWS Amplify

Vercel recommended because:

- Zero-config for Next.js App Router
- Automatic edge caching for static assets
- Image optimization built-in
- Preview deployments per PR

---

## Build Configuration

### `next.config.js` Production Settings

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output: static when possible
  output: 'standalone',

  // Image optimization domains (if using external images)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  // Custom headers for static assets
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/textures/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/draco/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  // GLSL file support
  webpack(config) {
    config.module.rules.push({ test: /\.glsl$/, use: 'raw-loader' })
    return config
  },
}

module.exports = nextConfig
```

---

## Code Splitting

### Next.js App Router Automatic Splitting

Next.js App Router automatically code-splits by:

- Route (page) — not relevant (single page)
- Server Components vs Client Components
- Dynamic imports

### Manual Dynamic Imports

Heavy 3D scenes are loaded as dynamic imports to avoid blocking initial JS parse:

```typescript
const GlobeScene = dynamic(() => import('@/components/scenes/GlobeScene'), {
  ssr: false, // Never SSR WebGL
  loading: () => null, // No visible fallback (loading screen covers)
})
```

All 5 scene components should be dynamic imports.

### Bundle Size Targets

| Bundle              | Target                |
| ------------------- | --------------------- |
| Main JS (initial)   | `≤ 200KB` gzipped     |
| Three.js chunk      | `≤ 150KB` gzipped     |
| GSAP chunk          | `≤ 50KB` gzipped      |
| Scene chunks (lazy) | `≤ 50KB` each gzipped |

---

## SSR Strategy

### What Renders Server-Side

```
Page layout: YES (HTML shell, head, meta)
Fonts: YES (injected in <head>)
Critical CSS: YES (styles for initial render)
3D Scenes: NO (ssr: false on all Canvas components)
GSAP: NO (ssr: false or useEffect only)
Lenis: NO (useEffect only)
```

### Preventing SSR Errors

Three.js and browser-only APIs must never run on the server:

```typescript
// Check for browser environment:
if (typeof window !== 'undefined') {
  // browser-only code
}

// OR: useEffect (always runs client-side)
useEffect(() => {
  // Three.js / GSAP code here
}, [])

// OR: dynamic import with ssr: false
const Component = dynamic(() => import('./Component'), { ssr: false })
```

---

## Asset Optimization Pipeline

### GLB Models

```
Source (unoptimized) → Draco compression → /public/models/
  crane.glb: target ≤ 2MB
  truck.glb: target ≤ 1.5MB
  ship.glb:  target ≤ 2MB
  aircraft.glb: target ≤ 1MB
```

### Textures

```
Source → JPEG optimize (imagemin) → /public/textures/
  earth-albedo.jpg: ≤ 500KB
  earth-normal.jpg: ≤ 500KB
  water-normal.jpg: ≤ 100KB

Future: Convert to KTX2 for GPU compression benefit
```

### Fonts

```
Source: .ttf or .otf from type foundry
→ Convert to .woff2 (fonttools, google-fonts-helper)
→ Subset: Latin characters only (reduce file size 60–80%)
→ /public/fonts/ OR next/font/local (auto-generates)
```

---

## CDN Strategy

### Vercel CDN (Automatic)

All `/public/` assets are served from Vercel's Edge Network:

- 200+ edge locations globally
- Automatic Gzip + Brotli compression
- HTTP/2 multiplexing (multiple assets in parallel)

### Asset URLs

```
Development: http://localhost:3000/models/crane.glb
Production: https://domain.com/models/crane.glb → CDN edge
```

No separate CDN configuration needed with Vercel.

---

## Compression

### JavaScript

Next.js automatically:

- Minifies with Terser (production)
- Compresses with Gzip + Brotli on Vercel

### Images

```
Configured in next.config.js:
  formats: ['image/avif', 'image/webp']
  → Serves WebP to capable browsers, AVIF to very modern browsers
  → Falls back to JPEG/PNG
```

### Static Assets (GLB, Textures)

Vercel serves all `/public/` assets with automatic Gzip:

- GLB (binary): Gzip provides ~20% reduction
- JPEG: Already compressed — Gzip adds minimal benefit
- WOFF2: Already compressed — Gzip adds minimal benefit

---

## Caching Strategy

### Asset Cache Headers

| Asset         | Header      | Duration                          |
| ------------- | ----------- | --------------------------------- |
| GLB Models    | `immutable` | 1 year                            |
| Textures      | `immutable` | 1 year                            |
| Fonts         | `immutable` | 1 year                            |
| Draco decoder | `immutable` | 1 year                            |
| HTML pages    | `no-cache`  | Must revalidate                   |
| JS bundles    | `immutable` | 1 year (Next.js hashes filenames) |
| CSS           | `immutable` | 1 year (Next.js hashes filenames) |

### Cache Invalidation

For `immutable` assets: change the filename (Next.js does this automatically for JS/CSS via content hash). For `/public/` assets (models, textures), append version to filename:

```
crane.glb → crane.v2.glb
```

Update all references when models are updated.

---

## Environment Variables

### `.env.local` (Development)

```
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_PERF_MONITOR=true
```

### `.env.production`

```
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_PERF_MONITOR=false
```

### Security

No server-side secrets in this project (static frontend only).  
All `NEXT_PUBLIC_*` variables are exposed to the browser — do NOT store API keys here.

---

## Deployment Checklist

### Pre-Deployment

```
✓ npm run build completes without errors
✓ npm run start (local production test) verified
✓ All 4 GLB models load correctly
✓ Earth textures load correctly
✓ No console errors in production build
✓ Lighthouse score ≥ 85
✓ All r3f-perf components removed
✓ All DirectionalLightHelper removed
✓ All console.log removed (or guarded by NODE_ENV)
✓ ENV variables set correctly in Vercel dashboard
✓ Custom domain configured
✓ SSL certificate active
```

### Post-Deployment

```
✓ Visit production URL: loading screen appears
✓ Globe renders and rotates
✓ Scroll through all sections
✓ Test on iPhone (Safari)
✓ Test on Android Chrome
✓ Run Lighthouse on production URL
✓ Verify CDN cache headers (DevTools → Network → crane.glb → Cache-Control)
```

---

## Preview Deployments

Vercel creates a preview URL for every PR:

```
https://3d-atlas-git-feature-branch-team.vercel.app
```

Use for:

- QA review before merging
- Client review of specific features
- Cross-browser testing on real URLs

---

## Rollback Strategy

If production deployment has critical issues:

```
Vercel: Dashboard → Deployments → Select previous deployment → Promote to Production
Time to rollback: ~30 seconds
```
