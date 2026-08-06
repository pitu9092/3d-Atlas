# 04 — Scene Architecture

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Per-scene lifecycle, render conditions, inputs, outputs, and dependencies

---

## Scene Lifecycle Model

Every 3D scene follows this universal lifecycle:

```
[PRELOAD] → [MOUNT] → [IDLE] → [ACTIVATE] → [ANIMATE] → [DEACTIVATE] → [UNMOUNT]

PRELOAD:    useGLTF.preload() fires at module level (before React mounts)
MOUNT:      React component mounts, canvas created, context initialized
IDLE:       Canvas exists, frameloop="demand" (no rendering)
ACTIVATE:   Section enters viewport → frameloop="always"
ANIMATE:    ScrollTrigger drives camera/model, useFrame runs continuous animations
DEACTIVATE: Section exits viewport → frameloop="demand" (rendering pauses)
UNMOUNT:    Component unmounts → dispose all Three.js resources
```

---

## SCENE 01 — Globe Hero

### Identity

| Property  | Value                    |
| --------- | ------------------------ |
| Component | `GlobeScene`             |
| Canvas    | Transparent (alpha)      |
| Z-index   | `0` (behind DOM overlay) |
| Section   | `HeroSection`            |

### Inputs

| Input           | Type         | Source                     |
| --------------- | ------------ | -------------------------- |
| `isActive`      | `boolean`    | `useCanvasVisibility` hook |
| Scroll progress | `number` 0–1 | ScrollTrigger `hero-cam`   |

### Outputs

| Output             | Type                       | Consumer          |
| ------------------ | -------------------------- | ----------------- |
| `onReady` callback | `void`                     | `LoadingProvider` |
| Camera Z ref       | `MutableRefObject<number>` | Internal only     |

### Dependencies (Build Order)

```
1. Earth albedo texture loaded (TextureLoader)
2. Earth normal map loaded
3. Earth surface shader compiled
4. Atmosphere Fresnel shader compiled
5. Globe mesh created
6. Atmosphere shell created
7. Route network nodes created
8. Arc geometries created
9. Location pin created
10. Lighting rig created
11. Post-processing (Bloom + SMAA) created
12. Scene ready → fires onReady
```

### Render Conditions

| Condition                 | Frameloop                                  |
| ------------------------- | ------------------------------------------ |
| Page load                 | `always` (renders first frame immediately) |
| Hero section in viewport  | `always`                                   |
| Hero section 50% exited   | `demand`                                   |
| Hero section fully exited | `demand`                                   |

### Destroy Conditions (unmount)

```
Globe geometry: dispose()
Globe material: dispose()
Atmosphere geometry: dispose()
Atmosphere material: dispose()
All textures: dispose()
Route points geometry: dispose()
All arc geometries: dispose() (loop)
Post-processing: effectComposer.dispose()
```

### Scroll Animation Mapping

| Progress | Camera Z                   |
| -------- | -------------------------- |
| `0.0`    | `3.5`                      |
| `1.0`    | `7.0`                      |
| Formula  | `z = 3.5 + progress × 3.5` |

---

## SCENE 02 — Reach Stacker Crane

### Identity

| Property       | Value               |
| -------------- | ------------------- |
| Component      | `CraneScene`        |
| Canvas         | Transparent (alpha) |
| Section        | `CraneSection`      |
| Scroll wrapper | `450vh`             |

### Inputs

| Input           | Type         | Source                    |
| --------------- | ------------ | ------------------------- |
| `isActive`      | `boolean`    | `useCanvasVisibility`     |
| Scroll progress | `number` 0–1 | ScrollTrigger `crane-pin` |

### Dependencies

```
1. crane.glb preloaded (Draco)
2. GLTF parsed, scene graph ready
3. AnimationMixer created
4. AnimationClip identified
5. Studio lighting rig created
6. Canvas ready
```

### Render Conditions

| Condition             | Frameloop |
| --------------------- | --------- |
| Section ≥ 80% visible | `always`  |
| Section < 80% visible | `demand`  |

### Animation Binding

| ScrollTrigger Progress | AnimationMixer Time                      |
| ---------------------- | ---------------------------------------- |
| `0.0`                  | `0` (clip start)                         |
| `1.0`                  | `clip.duration` (clip end)               |
| Formula                | `mixer.setTime(progress × clipDuration)` |

### Destroy Conditions

```
GLTF scene traverse: each mesh → geometry.dispose(), material.dispose()
AnimationMixer: stopAllAction(), uncacheRoot()
All cached textures from GLB: dispose()
```

---

## SCENE 03 — Semi-Truck

### Identity

| Property  | Value               |
| --------- | ------------------- |
| Component | `TruckScene`        |
| Canvas    | Transparent (alpha) |
| Section   | `TruckSection`      |

### Inputs

| Input         | Type      | Source                      |
| ------------- | --------- | --------------------------- |
| `isActive`    | `boolean` | `useCanvasVisibility`       |
| Entry trigger | `void`    | ScrollTrigger `truck-enter` |

### Dependencies

```
1. truck.glb preloaded
2. GLTF parsed
3. Studio lighting + rim light
4. Entry animation ready
```

### Render Conditions

| Condition                      | Frameloop |
| ------------------------------ | --------- |
| Section in viewport            | `always`  |
| Services section > 50% covered | `demand`  |

### Destroy Conditions

Same pattern as Crane scene — traverse and dispose all.

---

## SCENE 04 — Container Ship

### Identity

| Property       | Value              |
| -------------- | ------------------ |
| Component      | `ShipScene`        |
| Canvas         | Opaque (`#133D77`) |
| Section        | `ShipSection`      |
| Scroll wrapper | `300vh`            |

### Inputs

| Input           | Type         | Source                   |
| --------------- | ------------ | ------------------------ |
| `isActive`      | `boolean`    | `useCanvasVisibility`    |
| Scroll progress | `number` 0–1 | ScrollTrigger `ship-pin` |

### Dependencies

```
1. ship.glb preloaded
2. GLTF parsed, container grid identified
3. Water plane + material created
4. Foam particle system created
5. Maritime lighting rig
6. Aerial camera (rotation.x = -PI/2)
7. Text overlay DOM ref connected
8. Feature label DOM refs connected
```

### Camera Phase Logic

| Progress Range | Camera Y Formula                         |
| -------------- | ---------------------------------------- |
| `0.00 → 0.40`  | `lerp(20, 10, progress / 0.40)`          |
| `0.40 → 0.55`  | `10` (hold)                              |
| `0.55 → 1.00`  | `lerp(10, 20, (progress - 0.55) / 0.45)` |

### Render Conditions

| Condition               | Frameloop |
| ----------------------- | --------- |
| Wipe section exits      | `always`  |
| Aircraft section enters | `demand`  |

---

## SCENE 05 — Commercial Aircraft

### Identity

| Property       | Value                         |
| -------------- | ----------------------------- |
| Component      | `AircraftScene`               |
| Canvas         | Opaque (sky fills background) |
| Section        | `AircraftSection`             |
| Scroll wrapper | `220vh`                       |

### Inputs

| Input           | Type         | Source                       |
| --------------- | ------------ | ---------------------------- |
| `isActive`      | `boolean`    | `useCanvasVisibility`        |
| Scroll progress | `number` 0–1 | ScrollTrigger `aircraft-pin` |

### Dependencies

```
1. aircraft.glb preloaded
2. Sky component parameters configured
3. Cloud components positioned
4. Solar + sky ambient lighting
5. Camera at initial Z=30
```

### Camera Animation

| Progress  | Camera Z                | Camera Y |
| --------- | ----------------------- | -------- |
| `0.0`     | `30`                    | `5`      |
| `1.0`     | `5`                     | `3`      |
| Formula Z | `lerp(30, 5, progress)` |
| Formula Y | `lerp(5, 3, progress)`  |

### Continuous Animation (useFrame)

| Property              | Formula                     |
| --------------------- | --------------------------- |
| Aircraft `rotation.z` | `sin(elapsed × 0.5) × 0.05` |
| Aircraft `position.y` | `sin(elapsed × 0.3) × 0.1`  |

### Render Conditions

| Condition                          | Frameloop |
| ---------------------------------- | --------- |
| Ship section exits                 | `always`  |
| Testimonials section > 70% covered | `demand`  |

---

## Scene Overlap Management

| Priority | Scene            | z-index (canvas element) |
| -------- | ---------------- | ------------------------ |
| Lowest   | Aircraft         | `0`                      |
| Higher   | Testimonials DOM | `1`                      |

The aircraft canvas remains mounted while testimonials scroll over it. The testimonials DOM background (`#F5F4F0`) visually covers the aircraft canvas as it scrolls up.

---

## Scene State Contract

Each scene must expose:

```typescript
interface SceneState {
  isReady: boolean // Has rendered at least 1 frame
  isActive: boolean // Currently rendering (frameloop = always)
  modelLoaded: boolean // GLB/assets available
  error: Error | null // Any initialization error
}
```

The `LoadingProvider` aggregates `isReady` from all scenes to control the loading screen.

---

## Scene Error Boundaries

Each `<Suspense>` boundary around a scene component should have a fallback:

| Fallback Type | Trigger                  | Display                                      |
| ------------- | ------------------------ | -------------------------------------------- |
| Loading state | Model not yet available  | No visible fallback (transparent canvas)     |
| Error state   | WebGL failure            | Static background image matching scene color |
| No WebGL      | Context creation failure | Full-page fallback message                   |
