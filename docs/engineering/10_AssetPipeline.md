# 10 — Asset Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: All asset types — loading strategy, compression, caching, lazy loading, and versioning

---

## Asset Inventory

| Type            | Assets                                       | Count | Priority |
| --------------- | -------------------------------------------- | ----- | -------- |
| 3D Models (GLB) | crane, truck, ship, aircraft                 | 4     | Critical |
| Textures        | earth albedo, normal, specular, water normal | 4–6   | Critical |
| Fonts           | Brand typeface (woff2)                       | 1–2   | Critical |
| HDRI/Env        | Studio preset (Drei)                         | 1     | Medium   |
| Images          | Aerial photo (editorial)                     | 1     | Low      |
| Audio           | None confirmed                               | 0     | —        |
| Video           | None in production build                     | 0     | —        |

---

## Loading Priority

```
Priority 1 — Block all animation:
  ├── Fonts (document.fonts.ready)
  └── Earth textures (globe renders on load)

Priority 2 — Block LoadingScreen exit:
  ├── crane.glb
  ├── truck.glb
  ├── ship.glb
  └── aircraft.glb

Priority 3 — Non-blocking (lazy):
  ├── Editorial aerial photo
  ├── Water normal map (ship can render without it briefly)
  └── Earth specular map (earth renders without it)
```

---

## GLB Model Pipeline

### Source to Public

```
1. 3D artist exports: raw .glb (may be 10–30MB)
2. Draco compression: npx gltf-pipeline -i raw.glb -o crane.glb --draco.compressionLevel=10
3. Target size: < 2MB per model after Draco
4. Place in: /public/models/
5. Preload registration: useGLTF.preload('/models/crane.glb')
```

### Draco Decoder

```
Copy to /public/draco/:
  node_modules/three/examples/jsm/libs/draco/draco_decoder.js
  node_modules/three/examples/jsm/libs/draco/draco_decoder.wasm
  node_modules/three/examples/jsm/libs/draco/draco_wasm_wrapper.js

Configure in DracoLoader:
  dracoLoader.setDecoderPath('/draco/')
```

### Model Caching

`useGLTF` caches loaded models by URL. Subsequent `useGLTF('/models/crane.glb')` calls return the cached GLTF immediately.

**Cache location**: Internal to `@react-three/drei` — not accessible to app code.

**Cache invalidation**: Version suffix on filename (`crane.v2.glb`) — OR: Next.js build hash if using import.

---

## Texture Pipeline

### Earth Textures

| Texture                 | Resolution  | Format               | Size Target |
| ----------------------- | ----------- | -------------------- | ----------- |
| Albedo (day)            | `2048×1024` | `.jpg` (85% quality) | `< 500KB`   |
| Normal map              | `2048×1024` | `.jpg` (70% quality) | `< 400KB`   |
| Specular map            | `1024×512`  | `.jpg` (70% quality) | `< 200KB`   |
| Night lights (optional) | `1024×512`  | `.jpg`               | `< 200KB`   |

### Water Normal Map

| Texture      | Resolution         | Format | Size Target |
| ------------ | ------------------ | ------ | ----------- |
| Water normal | `512×512` (tiling) | `.jpg` | `< 100KB`   |

### Texture Format Progression

```
Current: .jpg → Simple, widely supported
Future: .ktx2 (KHR_texture_basisu) → GPU-native compression, smaller size
  Tools: toktx, basisu
  Loader: KTX2Loader from drei
  Advantage: Stays compressed ON GPU (saves GPU VRAM)
```

### Texture Loading Strategy

```
Critical textures (earth albedo):
  Load during Loading phase → block LoadingScreen exit

Non-critical (water normal, specular):
  Load after LoadingScreen exits → useEffect with TextureLoader
  Ship renders with solid color until normal map arrives
```

---

## Font Pipeline

### Font Configuration

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Format         | `woff2` (broadest modern support)                     |
| Loading        | Next.js `next/font/local` OR CSS `@font-face`         |
| Display        | `font-display: block` — prevent FOUT during animation |
| Weights needed | 400 (Regular), 500 (Medium), 700 (Bold), 900 (Black)  |

### Font Loading Gate

```
document.fonts.ready.then(() => {
  fontReady = true
  // ONLY NOW: start clip-path text animations
  // Fonts affect line-breaking — wrong font = broken H1 layout
})
```

### Next.js Font Setup (Recommended)

```
Using next/font/local:
  - Automatically generates subset
  - Inlines font declaration in <head>
  - Eliminates flash of wrong font
  - Provides font CSS variable for use in styles
```

---

## Image Pipeline

### Editorial Aerial Photo

| Property     | Value                                      |
| ------------ | ------------------------------------------ |
| Size         | `80×80px` display, `160×160px` source (2×) |
| Format       | `.jpg` or `.webp`                          |
| Loading      | `<img loading="lazy">` — not critical path |
| Optimization | Next.js `<Image>` component                |

---

## Asset Versioning

### Immutable Hashing (Production)

```
Next.js production build hashes all assets in /_next/static/
  /_next/static/media/font.abc123.woff2

GLB models in /public/ do NOT get auto-versioned.
Strategy: append version to filename: crane.v3.glb
Update: all useGLTF.preload() and useGLTF() calls on version bump
```

---

## Caching Strategy

| Asset         | Cache-Control                         | Duration |
| ------------- | ------------------------------------- | -------- |
| GLB models    | `public, max-age=31536000, immutable` | 1 year   |
| Textures      | `public, max-age=31536000, immutable` | 1 year   |
| Fonts         | `public, max-age=31536000, immutable` | 1 year   |
| Draco decoder | `public, max-age=31536000, immutable` | 1 year   |

Configure via `next.config.js`:

```
headers: [
  { source: '/models/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  { source: '/textures/:path*', headers: [{ key: 'Cache-Control', value: '...' }] }
]
```

---

## Asset Size Budget

| Category              | Budget            | Current Estimate |
| --------------------- | ----------------- | ---------------- |
| Total initial JS      | `< 300KB` gzipped | UNKNOWN          |
| Total 3D models       | `< 8MB` total     | ~2MB × 4 = 8MB   |
| Total textures        | `< 2MB` total     | ~1.5MB           |
| Total fonts           | `< 400KB`         | ~300KB (woff2)   |
| **Total page weight** | `< 12MB`          | ~12MB            |

### Note

Models download after initial page render — they do not block the first paint.
