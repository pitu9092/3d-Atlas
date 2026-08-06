# 20 — Implementation Notes

This document is written for the engineering team who will build the experience. It contains strategic decisions, risk assessments, and recommended implementation approaches based on the reference analysis.

---

## Architecture Decision: Canvas Strategy

### Recommendation: Multiple Scene Canvases with Intersection Observer

Based on the reference analysis, the recommended approach is:

```
One R3F <Canvas> per 3D scene, mounted within its section.
Scenes are activated/deactivated using IntersectionObserver.
When a scene exits the viewport, it is paused (useFrame disabled).
```

**Why not a single canvas?**

- The scenes have completely different materials, lighting, and camera setups
- A single canvas would require complex scene management
- Multiple canvases is the standard R3F pattern and scales better

**Performance mitigation:**

- Use `frameloop="demand"` on canvases not currently visible
- Dispose resources when scenes unmount

---

## Implementation Order (Recommended)

### Phase 1: Infrastructure

1. Lenis setup + GSAP ScrollTrigger integration
2. Custom cursor component
3. Navbar with scroll state
4. Base section structure (heights, pinning)

### Phase 2: Globe Scene (Hero)

1. Earth sphere with texture
2. Atmosphere Fresnel shader
3. Thermal glow shader
4. Route network (Points + Lines)
5. Scroll-driven camera pull-back

### Phase 3: Editorial Section (Scene 3)

1. Layout + typography
2. Text reveal animations
3. Stat counter

### Phase 4: Reach Stacker (Scene 4)

1. GLB model loading + Suspense
2. Pinned scroll section setup
3. Scroll-scrubbed animation
4. Container picking sequence

### Phase 5: Truck (Scene 5)

1. GLB model loading
2. Split layout (white + dark)
3. Features grid with scroll reveals

### Phase 6: Container Ship (Scene 7)

1. GLB model (aerial view)
2. Blue ocean background
3. Water/foam effect
4. Feature labels around ship
5. Scroll-driven zoom

### Phase 7: Wipe Transition (Scene 8)

1. Clip-path wipe animation
2. Word shuffle component

### Phase 8: Aircraft (Scene 9)

1. GLB model loading
2. Sky/cloud environment
3. Camera positioning + scroll animation

### Phase 9: Testimonials (Scene 10)

1. Layout + content
2. Scroll reveal animations

---

## Key Risks and Mitigations

### Risk 1: 3D Model Acquisition

**Risk**: High-quality GLB models for reach stacker, truck, ship, and aircraft must be sourced.
**Mitigation**:

- Use licensed models from CGTrader / Turbosquid (~$30–200 each)
- Budget for model optimization (Draco compression, LOD creation)
- Allocate 1 week for model sourcing and processing

### Risk 2: GLB Animation Scrubbing

**Risk**: The reach stacker animation sequence (crane picking up container) requires precisely scrubbing a 3D animation timeline.
**Mitigation**:

```typescript
// Use AnimationMixer.setTime() to scrub
const { animations, mixer } = useAnimations(scene.animations)
// In scroll callback:
mixer.setTime(scrollProgress * animations[0].duration)
```

This requires the GLB model to have **embedded keyframe animations**. If the model has no animations, the movement must be implemented manually via `useFrame` + GSAP targets.

### Risk 3: Atmosphere Shader Complexity

**Risk**: The globe Fresnel atmosphere shader requires knowledge of GLSL.
**Mitigation**:

- Use the well-documented Fresnel shader from the Three.js examples
- Reference: `examples/webgl_materials_envmaps.html` (Three.js repo)
- Drei's `<MeshWobbleMaterial>` and other custom materials show the pattern

### Risk 4: Performance Budget

**Risk**: Running 5+ WebGL canvases simultaneously on mid-range devices.
**Mitigation**:

- Only active viewport canvas runs `useFrame`
- Inactive canvases use `frameloop="demand"` + `invalidate()` only when needed
- DPR capped at 2
- Bloom only on globe scene (most impactful)

### Risk 5: Scroll Performance

**Risk**: GSAP ScrollTrigger + Lenis + multiple pinned sections can cause scroll lag.
**Mitigation**:

- Lenis connected to GSAP ticker (standard pattern from Lenis docs)
- All ScrollTriggers use `invalidateOnRefresh: true`
- Avoid reading DOM layout during scroll callbacks

### Risk 6: Wipe Transition Complexity

**Risk**: The horizontal panel wipe + word shuffle is a complex interaction.
**Mitigation**:

- Implement wipe as a single GSAP timeline scrubbed by ScrollTrigger
- Word shuffle is a simple GSAP stagger on clip-path values
- Use `clipPath: 'inset(0 100% 0 0)'` pattern

---

## Performance Budget

| Resource               | Budget           |
| ---------------------- | ---------------- |
| Initial JS bundle      | < 200kB gzipped  |
| Total JS (lazy loaded) | < 500kB gzipped  |
| GLB models (each)      | < 5MB compressed |
| Textures (total)       | < 20MB           |
| FPS (desktop)          | 60fps sustained  |
| FPS (mobile)           | 30fps minimum    |
| Initial load time      | < 3s on 100Mbps  |

---

## Dependencies to Install (Phase 1+)

When implementing 3D scenes, these additional packages may be needed:

```bash
# Potentially needed in future phases:
npm install raw-loader              # GLSL shader file loading
npm install @next/bundle-analyzer   # Bundle analysis
npm install @react-three/postprocessing  # Already installed
```

---

## Globe Earth Texture Resource

The Earth texture for the globe scene is critical. Recommended free source:

- **NASA Blue Marble**: [https://visibleearth.nasa.gov/](https://visibleearth.nasa.gov/)
- Download `world.200401.3x5400x2700.jpg` (10.8K × 5.4K resolution)
- Resize to 2048×1024 for performance
- The shader will darken it dramatically — bright blue Earth texture is correct input

---

## Font Identification Next Steps

Before Phase 2 (Layout), identify the exact font:

1. Visit the original website in Chrome
2. Open DevTools → Elements → Computed → `font-family`
3. Also check Network → Filter by "font" to see font files loaded
4. Match the font and acquire appropriate license

---

## Testing Checklist for Each Phase

Before completing each phase:

- [ ] `npm run type-check` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] `npm run build` — zero errors
- [ ] Test on Chrome, Firefox, Safari
- [ ] Verify 60fps in Chrome DevTools Performance panel
- [ ] Check mobile viewport (375px)
- [ ] Verify Lenis scroll works correctly
- [ ] Verify all ScrollTriggers are cleaned up on unmount

---

## Unknowns Requiring Resolution

| Unknown                                   | How to Resolve                                   |
| ----------------------------------------- | ------------------------------------------------ |
| Exact font family                         | DevTools on live site                            |
| Exact hex colors                          | DevTools / eye-dropper tool                      |
| Number of WebGL canvases                  | DevTools → Performance → GPU memory              |
| Canvas architecture (single vs. multiple) | DevTools → Elements panel                        |
| Whether DOF is used                       | DevTools → Post-processing effects               |
| Mobile behavior                           | Test live site on mobile                         |
| Loading/preloader animation               | Visit live site from cold cache                  |
| Footer content                            | Scroll to end of live site                       |
| Total scroll height                       | Measure `document.body.scrollHeight` in DevTools |
| Exact animation easings                   | DevTools → Animations panel                      |

---

## Live Site Investigation Protocol

When you have access to the live site:

```javascript
// Run in browser DevTools console to extract key info:

// 1. Scroll height
console.log('Total scroll:', document.body.scrollHeight)

// 2. Font families
document.querySelectorAll('*').forEach((el) => {
  const font = getComputedStyle(el).fontFamily
  if (font && !font.includes('serif')) console.log(el.tagName, font)
})

// 3. Canvas count
console.log('Canvas count:', document.querySelectorAll('canvas').length)

// 4. GLB network requests
// Open Network tab, filter by .glb — shows all model files loaded
```
