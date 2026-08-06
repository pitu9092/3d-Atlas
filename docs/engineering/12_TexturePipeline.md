# 12 — Texture Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Texture formats, resolutions, mipmaps, compression, reuse, and GPU memory budget

---

## Texture Inventory

| Texture         | Scene                      | Resolution         | Format | GPU Memory                |
| --------------- | -------------------------- | ------------------ | ------ | ------------------------- |
| Earth albedo    | Globe                      | `2048×1024`        | `.jpg` | `8MB` (uncompressed RGBA) |
| Earth normal    | Globe                      | `2048×1024`        | `.jpg` | `8MB`                     |
| Earth specular  | Globe                      | `1024×512`         | `.jpg` | `2MB`                     |
| Water normal    | Ship                       | `512×512` (tiling) | `.jpg` | `1MB`                     |
| Container baked | Ship (embedded in GLB)     | `512×512` each     | `.jpg` | `~1MB total`              |
| Aircraft livery | Aircraft (embedded in GLB) | `512×512`          | `.jpg` | `1MB`                     |
| Crane paint     | Crane (embedded in GLB)    | `512×512`          | `.jpg` | `1MB`                     |

---

## Format Selection

### Current: JPEG for Delivery

| Pros                        | Cons                            |
| --------------------------- | ------------------------------- |
| Universal support           | Decompressed on GPU upload      |
| Small file sizes (download) | No hardware texture compression |
| Easy to author and preview  | Full RGBA memory on GPU         |

### Future: KTX2 (Basis Universal) for GPU Efficiency

| Pros                    | Cons                           |
| ----------------------- | ------------------------------ |
| Stays compressed on GPU | More complex toolchain         |
| 4–8× less GPU memory    | Not supported on older devices |
| Fast decode (hardware)  | Requires KTX2Loader            |

### When to Upgrade to KTX2

If GPU memory budget is exceeded OR mobile performance is insufficient, migrate earth textures to KTX2.

---

## Resolution Rules

| Use Case                     | Max Resolution | Reason                                        |
| ---------------------------- | -------------- | --------------------------------------------- |
| Globe surface (sphere 64×64) | `2048×1024`    | Sphere has limited texel density at any angle |
| Normal maps                  | Same as albedo | Must match to avoid seams                     |
| Tiling textures (water)      | `512×512`      | Tiles — higher resolution wasted              |
| Embedded GLB textures        | `512×512`      | Small screen footprint per material           |
| UI images                    | `@2x` source   | CSS handles display size                      |

### Resolution Guidance

Higher resolution is NOT always better. A `4096×4096` earth texture on a `600px` globe canvas wastes GPU memory without visible quality improvement.

Formula:  
`Max useful resolution = (sphere screen pixels × detail factor × 2)`

At typical 60% viewport globe: `1080px × 0.6 × 2 = ~1300px` — `2048` is sufficient.

---

## Mipmaps

### Why Mipmaps

Without mipmaps, distant or small-screen textures cause aliasing (shimmer/moiré). Three.js generates mipmaps automatically for power-of-two textures.

### Mipmap Configuration

```
THREE.TextureLoader loaded textures:
  texture.generateMipmaps = true     ← Default (leave as-is)
  texture.minFilter = THREE.LinearMipmapLinearFilter  ← Best quality
  texture.magFilter = THREE.LinearFilter               ← Default
```

### Non-Power-of-Two (NPOT) Textures

```
If texture is not power-of-two (e.g., 1920×1080):
  mipmaps CANNOT be generated
  Solution: Resize to nearest POT: 2048×1024
```

All textures in this project must be power-of-two.

---

## Texture Compression

### JPEG Quality Settings

| Texture      | Quality | Reason                                    |
| ------------ | ------- | ----------------------------------------- |
| Earth albedo | `85%`   | Visible detail, reasonable size           |
| Normal maps  | `90%`   | Normal artifacts are very visible         |
| Specular     | `80%`   | Less visible, can afford more compression |
| Water normal | `85%`   | Tiling must be seamless                   |

### Using WebP (Alternative)

```
WebP achieves similar quality to JPEG at ~25% smaller size.
Three.js TextureLoader supports WebP.
Use WebP for all textures that don't need HDR.
Fallback: JPEG (for Safari ≤ 13)
```

---

## Texture Reuse

### Policy

| Situation                      | Policy                                     |
| ------------------------------ | ------------------------------------------ |
| Same texture, different meshes | Share one `THREE.Texture` instance         |
| Same material across scenes    | NEVER share — different renderer context   |
| GLB embedded textures          | useGLTF cache handles sharing within scene |

### Texture Registry (Per Scene)

```typescript
const textureRegistry = new Map<string, THREE.Texture>()

// Load once:
const albedo = textureLoader.load('/textures/earth-albedo.jpg')
textureRegistry.set('earth-albedo', albedo)

// Access later:
const t = textureRegistry.get('earth-albedo')
mesh.material.map = t // Shared reference — no duplicate
```

---

## GPU Memory Budget

### Per-Canvas Budget

| Canvas    | Texture Memory        | Geometry  | Total GPU |
| --------- | --------------------- | --------- | --------- |
| Globe     | `~18MB`               | `< 2MB`   | `~20MB`   |
| Crane     | `~3MB` (GLB embedded) | `< 5MB`   | `~8MB`    |
| Truck     | `~2MB` (GLB embedded) | `< 3MB`   | `~5MB`    |
| Ship      | `~5MB`                | `< 5MB`   | `~10MB`   |
| Aircraft  | `~2MB` (GLB embedded) | `< 2MB`   | `~4MB`    |
| **TOTAL** | **~30MB**             | **~17MB** | **~47MB** |

### Budget Limit

**Maximum GPU memory: 256MB** (typical lower-mid GPU)  
Total estimated: ~47MB — well within budget.  
If KTX2 applied: ~15MB GPU — significant reduction.

---

## Texture Disposal

All textures must be disposed when their scene unmounts:

```
textureRegistry.forEach(texture => texture.dispose())
textureRegistry.clear()
```

Three.js does NOT automatically free GPU texture memory on garbage collection. Manual `dispose()` is mandatory.

---

## Pre-Deployment Texture Checklist

```
✓ All textures are power-of-two dimensions
✓ Earth textures are ≤ 2048×1024
✓ Water normal is seamlessly tiling (no edge seams)
✓ JPEG quality appropriate per texture type
✓ No EXIF data in JPEG files (strip with imagemin)
✓ TextureLoader path matches /public/ location
✓ Normal maps set to colorSpace = LinearSRGBColorSpace (not SRGB)
  (Normal maps are linear data — wrong colorspace breaks normals)
```
