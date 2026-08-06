# 15 — Lighting Pipeline

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Lighting architecture — setup, lifecycle, performance, and management

---

## Lighting Architecture Principles

| Principle               | Rule                                          |
| ----------------------- | --------------------------------------------- |
| Scene isolation         | No lights shared between canvases             |
| Constants externalized  | All light values in `lib/constants/lights.ts` |
| No runtime modification | Lights are set once, not animated             |
| Minimal count           | Use minimum lights needed per scene           |
| Shadow discipline       | Only crane + truck use shadow maps            |

---

## Light Type Usage Per Scene

| Scene    | AmbientLight | DirectionalLight   | HemisphereLight | Special                    |
| -------- | ------------ | ------------------ | --------------- | -------------------------- |
| Globe    | ✓            | ✓ (sun)            | ✗               | Fresnel + Thermal (shader) |
| Crane    | ✓            | ✓ (key) + ✓ (fill) | ✓               | Environment map            |
| Truck    | ✓            | ✓ (key) + ✓ (rim)  | ✗               | Environment map            |
| Ship     | ✓            | ✓ (aerial sun)     | ✗               | None                       |
| Aircraft | ✓            | ✓ (solar)          | ✗               | Drei Sky                   |

---

## Per-Scene Lighting Configurations

### Configuration Source

All lighting values defined in `lib/constants/lights.ts`:

```typescript
export const GLOBE_LIGHTS = {
  ambient: { color: 0x04040a, intensity: 0.05 },
  sun: {
    color: 0xfff4e0,
    intensity: 2.0,
    position: [-5, 8, 3] as const,
  },
}

export const CRANE_LIGHTS = {
  ambient: { color: 0xffffff, intensity: 0.8 },
  key: {
    color: 0xffffff,
    intensity: 2.0,
    position: [-5, 10, 5] as const,
    castShadow: true,
    shadowMapSize: 2048,
  },
  fill: {
    color: 0xb0c8e0,
    intensity: 0.6,
    position: [5, 2, -5] as const,
  },
  hemi: {
    skyColor: 0xffffff,
    groundColor: 0xe0e0e0,
    intensity: 0.3,
  },
}

export const TRUCK_LIGHTS = {
  ...CRANE_LIGHTS,
  ambient: { color: 0xffffff, intensity: 1.0 },
  key: { ...CRANE_LIGHTS.key, position: [-3, 8, 5] as const },
  rim: {
    color: 0xc0d8ff,
    intensity: 1.0,
    position: [2, 0, -10] as const,
  },
}

export const SHIP_LIGHTS = {
  ambient: { color: 0x133d77, intensity: 0.7 },
  aerialSun: {
    color: 0xc8e0ff,
    intensity: 1.8,
    position: [0, 20, -2] as const,
  },
}

export const AIRCRAFT_LIGHTS = {
  ambient: { color: 0x80b8d8, intensity: 0.8 },
  solar: {
    color: 0xfffef0,
    intensity: 3.0,
    position: [-3, 10, 3] as const,
  },
}
```

---

## Environment Lighting

### Globe

No environment map. Lighting is handled entirely by the custom earth shader (SH-01) and Fresnel atmosphere (SH-02).

### Crane + Truck

Environment map via Drei `<Environment preset="studio">`:

- Provides reflections on metallic crane/truck paint
- Background is NOT shown (scene background is transparent/white)
- Intensity: `0.5` — subtle reflection, not dominant

### Ship

No environment map. The scene background is opaque blue (#133D77). Using an env map would add unseen overhead.

### Aircraft

Drei `<Sky>` component acts as the environment. Sky also contributes ambient lighting to the aircraft.

---

## Shadow Map Configuration

### Crane

```
DirectionalLight (key):
  castShadow: true
  shadow.mapSize: { width: 2048, height: 2048 }
  shadow.camera: { left: -10, right: 10, top: 10, bottom: -10, near: 0.1, far: 50 }
  shadow.radius: 4  ← PCFSoft shadow softness
  shadow.bias: -0.001  ← Prevent shadow acne

CraneModel: castShadow = true, receiveShadow = true
GroundPlane (if any): receiveShadow = true
```

### Truck

Same shadow configuration as crane.

### Shadow Camera Frustum Tuning

The shadow camera frustum must tightly contain the scene. Too large = poor shadow quality.

```
Crane bounding box: ~±6m (X), ~15m (Y), ~±6m (Z)
Shadow camera: left:-10, right:10, top:15, bottom:-5 → Tight fit
```

---

## Light Lifecycle

### Creation

All lights are created in R3F JSX — no imperative `scene.add(light)`.

### Modification

Lights are static — configured at creation, not modified during runtime.

Exception: UNKNOWN — If Wipe panel or Ship text requires light color change. Not visible in reference.

### Destruction

R3F manages light unmounting when the scene component unmounts.

---

## Performance Strategy

### Draw Call Impact

Each light that affects a material increases the material's shader complexity.

| Light Type       | Performance Cost                          |
| ---------------- | ----------------------------------------- |
| AmbientLight     | Negligible — adds to all surfaces equally |
| DirectionalLight | Low — one light per material              |
| PointLight       | Medium — more expensive than directional  |
| SpotLight        | High — avoid unless essential             |
| HemisphereLight  | Low — simplified sky/ground gradient      |

### Shadow Map Cost

Shadow rendering requires an additional render pass per shadow-casting light.

| Shadow Map Size | Memory | Quality                     |
| --------------- | ------ | --------------------------- |
| `512×512`       | `1MB`  | Poor                        |
| `1024×1024`     | `4MB`  | Acceptable                  |
| `2048×2048`     | `16MB` | Good                        |
| `4096×4096`     | `64MB` | Excellent (avoid on mobile) |

**Budget**: `2048×2048` for crane and truck (2 shadow lights × 16MB = 32MB shadow memory).

### Mobile Shadow Reduction

```
On low-end mobile:
  shadow.mapSize: { width: 512, height: 512 }
  OR: disable shadows entirely (renderer.shadowMap.enabled = false)
```

---

## Lighting Validation

| Check                                     | Method                                               |
| ----------------------------------------- | ---------------------------------------------------- |
| Globe terminator correct                  | Manual visual inspection (lit/dark hemisphere split) |
| Crane shadows soft                        | Check PCFSoft applied                                |
| Truck rim light separates from background | View against white background                        |
| Ship containers visible from above        | Check aerial view brightness                         |
| Aircraft not overexposed                  | Check exposure 1.3 + direct sun 3.0 combination      |

---

## Light Helper Policy

```
Development only:
  <directionalLight ref={lightRef} ... />
  <primitive object={new THREE.DirectionalLightHelper(lightRef.current)} />

Production: Remove all helpers
Guard: process.env.NODE_ENV === 'development'
```
