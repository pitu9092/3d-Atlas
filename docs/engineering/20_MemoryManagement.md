# 20 — Memory Management

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: RAM and GPU memory lifecycle — disposal, leak prevention, and monitoring

---

## Memory Overview

3D Atlas manages two memory spaces:

- **JavaScript Heap (RAM)**: React state, GSAP, Lenis, GLTF parse data
- **GPU VRAM**: Three.js geometries, textures, materials, render targets

JavaScript garbage collection handles heap. Three.js resources require **explicit disposal** — they are NOT garbage collected.

---

## Three.js Disposal Rules

### The Rule

Every Three.js resource that allocates GPU memory must be manually disposed:

```
geometry.dispose()      ← Frees GPU vertex/index buffers
material.dispose()      ← Frees GPU shader program
texture.dispose()       ← Frees GPU texture memory
renderTarget.dispose()  ← Frees GPU framebuffer
```

### What Does NOT Dispose Automatically

```
DOES NOT auto-dispose:
  THREE.BufferGeometry
  THREE.Material (and subclasses)
  THREE.Texture
  THREE.WebGLRenderTarget
  THREE.AnimationMixer (partial — clips stay cached)

DOES auto-dispose (via JS GC):
  THREE.Vector3, THREE.Matrix4, etc. (pure JS objects)
  THREE.Color
  THREE.Euler
```

---

## Disposal by Resource Type

### Geometry Disposal

```
geometry.dispose()

Per scene:
  Globe: earth geometry, atmosphere geometry, thermal geometry
  Globe: route arc geometries (all in loop)
  Globe: route node points geometry
  Globe: location pin geometry
  Crane: traverse gltf.scene → all mesh.geometry.dispose()
  Truck: traverse gltf.scene → all mesh.geometry.dispose()
  Ship: hull geometry, water geometry, foam points geometry
  Ship: all container geometries (or instanced mesh geometry)
  Aircraft: all GLB mesh geometries
```

### Material Disposal

```
material.dispose()

Notes:
  Disposing a material also frees its shader program from GPU.
  Shared materials must be disposed ONCE (not per-mesh that uses it).

Per scene:
  Globe: earth shader material, atmosphere shader material, thermal material
  Crane/Truck: traverse gltf.scene → deduplicate → dispose unique materials
  Ship: container materials (from pool map), water material
```

### Texture Disposal

```
texture.dispose()

CRITICAL: Textures embedded in GLB are managed by the GLTF loader cache.
  - Do NOT dispose useGLTF cached textures (shared across all consumers)
  - Only dispose textures loaded by YOUR code (TextureLoader)

Per scene:
  Globe: earth albedo, earth normal, earth specular (loaded by TextureLoader)
  Ship: water normal map (loaded by TextureLoader)
  All GLB-embedded textures: managed by useGLTF cache — DO NOT dispose
```

### Render Target Disposal

```
renderTarget.dispose()

EffectComposer creates render targets internally.
@react-three/postprocessing handles disposal when component unmounts.

If creating custom render targets:
  renderTarget.dispose()
  renderTarget.texture.dispose()  ← Dispose the texture separately
```

---

## GSAP Memory Management

### Timeline Cleanup

```
timeline.kill()       ← Kills timeline and all nested tweens
timeline.clear()      ← Removes all tweens without killing timeline itself
ctx.revert()          ← Recommended: kills all in gsap.context scope
```

### ScrollTrigger Cleanup

```
trigger.kill()        ← Kills single ST instance
ScrollTrigger.killAll()  ← Kills ALL ST instances (app teardown only)
```

### GSAP Event Listeners

GSAP does NOT add external event listeners — `ctx.revert()` handles all GSAP-internal cleanup.

---

## Event Listener Memory Leaks

Common source of memory leaks in React:

```typescript
// LEAK: Adds listener but never removes it
useEffect(() => {
  window.addEventListener('resize', handler)
}, [])

// CORRECT: Remove in cleanup
useEffect(() => {
  window.addEventListener('resize', handler)
  return () => window.removeEventListener('resize', handler)
}, [])
```

### Lenis Event Listeners

```
lenis.on('scroll', handler)
→ Cleanup: lenis.off('scroll', handler)  OR  lenis.destroy()
```

---

## React Re-Render Memory Considerations

### Closures Over Large Objects

```typescript
// WRONG: Creates closure over entire gltf object
useEffect(() => {
  const animate = () => {
    gltf.scene.traverse(...)  // gltf captured in closure
  }
  requestAnimationFrame(animate)
}, [gltf])

// CORRECT: Store only what's needed in refs
const meshRef = useRef(null)
useEffect(() => {
  meshRef.current = gltf.scene.children[0]
}, [gltf])
```

### useCallback and useMemo

Only apply where genuinely needed (animation callbacks, expensive computations). Premature memoization adds memory overhead.

---

## Memory Leak Detection

### Chrome DevTools — Heap Snapshot

```
1. Open DevTools → Memory tab
2. Take heap snapshot (baseline)
3. Navigate through all sections (scroll through full experience)
4. Take second heap snapshot
5. Compare: look for growing object counts
6. Focus on: detached DOM trees, growing Arrays, Three.js objects
```

### Suspicious Signs

| Symptom                         | Likely Cause                      |
| ------------------------------- | --------------------------------- |
| Growing heap over time          | Event listener not removed        |
| GPU memory growing              | Texture not disposed              |
| GLTF objects in "retained"      | useGLTF cache normal — not a leak |
| `ScrollTrigger` objects growing | ST not killed on unmount          |

### `renderer.info` Monitoring

```
// In development, log every 300 frames:
if (frameCount % 300 === 0) {
  console.log('Textures on GPU:', renderer.info.memory.textures)
  console.log('Geometries on GPU:', renderer.info.memory.geometries)
  console.log('Programs:', renderer.info.programs?.length)
}
```

After scene deactivation, texture count should drop (if disposed).

---

## GLTF Cache Management

### useGLTF Internal Cache

```
useGLTF caches loaded GLTFs by URL:
  First call: fetches + decodes → stores in cache
  Subsequent calls: returns from cache immediately

Cache lifecycle:
  Cache persists for app lifetime (module-level)
  Cache does NOT auto-expire

Manual cache clear (if needed):
  useGLTF.clear('/models/crane.glb')  ← Removes from cache
```

### When to Clear Cache

Do NOT clear normally — this would re-fetch on next use. Only clear if:

- Model URL has changed (version bump)
- Memory is critically low

---

## AnimationMixer Cleanup (Crane)

```
// Stop all actions:
animationMixer.stopAllAction()

// Remove clip from cache (otherwise clip stays in Three.js animation cache):
animationMixer.uncacheRoot(gltf.scene)
animationMixer.uncacheClip(clip)

// Remove mixer reference:
mixer.current = null
```

---

## Disposal Timing

### When to Dispose

```
On section component unmount:
  → Scene component unmount
  → useEffect or useLayoutEffect cleanup function

Pattern:
  useEffect(() => {
    return () => {
      disposeScene()  // All geometry, material, texture disposal
    }
  }, [])
```

### Dispose Order (Important)

```
1. Stop RAF / frameloop first
2. Kill GSAP animations
3. Kill ScrollTrigger instances
4. Traverse and dispose geometries
5. Dispose materials (unique materials only)
6. Dispose textures (own textures only)
7. Dispose render targets
8. Null all refs
```

Disposing in wrong order (e.g., material before geometry) is safe but may log warnings.

---

## Memory Budget

| Category            | Budget          | Monitoring                        |
| ------------------- | --------------- | --------------------------------- |
| JS Heap             | `≤ 50MB` active | Chrome Memory tab                 |
| GPU Textures        | `≤ 128MB`       | `renderer.info.memory.textures`   |
| GPU Geometries      | `≤ 30MB`        | `renderer.info.memory.geometries` |
| GLTF Cache          | `≤ 30MB`        | One-time, not growing             |
| GSAP internals      | `≤ 5MB`         | Stable after setup                |
| **Total estimated** | **≤ 243MB**     |                                   |

---

## Memory Optimization Checklist

```
✓ All TextureLoader textures disposed on scene unmount
✓ All custom BufferGeometries disposed on scene unmount
✓ All custom Materials disposed on scene unmount (not GLB-embedded)
✓ AnimationMixer.uncacheRoot() called on crane unmount
✓ All window event listeners removed in useEffect cleanup
✓ All lenis.on() listeners removed with lenis.off()
✓ All GSAP contexts reverted (ctx.revert()) on unmount
✓ All ScrollTrigger instances killed on unmount
✓ No closures holding large objects across component lifetime
✓ No useState holding Three.js objects (use refs)
✓ renderer.info monitored in development (no growing values)
```
