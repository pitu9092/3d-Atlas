# 09 — State Management

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: All application state — global, scene, scroll, animation, loading, and UI

---

## State Philosophy

3D Atlas uses **minimal, decentralized state**. No Redux, no Zustand, no MobX.

| Principle                     | Reason                                              |
| ----------------------------- | --------------------------------------------------- |
| Local state first             | Most state is section-scoped                        |
| Refs for animation            | GSAP reads from refs — no re-renders                |
| Context only for truly global | NavTheme, Loading, Lenis instance                   |
| Derived state over stored     | Progress %, viewport fraction computed at read time |

---

## State Categories

| Category  | Storage              | Owner                          |
| --------- | -------------------- | ------------------------------ |
| Global    | React Context        | Providers                      |
| Loading   | React Context        | `LoadingProvider`              |
| Scroll    | Refs + ST            | `LenisProvider` + each Section |
| Scene     | Local component refs | Each scene component           |
| Animation | GSAP internals       | GSAP                           |
| UI        | Local `useState`     | Each UI component              |
| Three.js  | Three.js scene graph | R3F canvas                     |

---

## Global State (React Context)

### LoadingState

```typescript
interface LoadingState {
  isLoaded: boolean // All assets ready
  progress: number // 0–1 overall loading progress
  fontsReady: boolean // document.fonts.ready resolved
  modelsReady: boolean // All 4 GLBs loaded
  texturesReady: boolean // Earth textures loaded
}
```

**Provider**: `LoadingProvider`  
**Consumers**: `LoadingScreen`, `HeroSection` (start load animations)

### LenisState

```typescript
interface LenisState {
  lenis: Lenis | null // Lenis instance
  scrollTo: (target: Element | string | number, options?: ScrollToOptions) => void
}
```

**Provider**: `LenisProvider`  
**Consumers**: `useLenis` hook, Navbar, CTA buttons

### ThemeState

```typescript
interface ThemeState {
  navTheme: 'light' | 'dark' // Current navbar color scheme
  setNavTheme: (theme: 'light' | 'dark') => void
}
```

**Provider**: `ThemeProvider`  
**Consumers**: `Navbar`  
**Updated by**: ScrollTrigger `onEnter`/`onLeave` callbacks at section boundaries

---

## Scene State (Refs — Not React State)

Scene state is stored in refs to avoid React re-renders on every frame.

### Per-Scene Ref Map

**Globe Scene Refs**

```typescript
{
  globe: THREE.Mesh | null // Globe mesh ref
  camera: THREE.PerspectiveCamera // Camera ref
  cameraZTarget: number // Target Z from ScrollTrigger
  nodes: THREE.Points | null // Route network dots
  animationMixer: null // Globe has no mixer
}
```

**Crane Scene Refs**

```typescript
{
  craneGroup: THREE.Group | null // GLTF root
  animationMixer: THREE.AnimationMixer | null
  clip: THREE.AnimationClip | null
  clipDuration: number
  scrollProgress: number // From ScrollTrigger
}
```

**Ship Scene Refs**

```typescript
{
  camera: THREE.PerspectiveCamera
  cameraYTarget: number // From ScrollTrigger
  shipGroup: THREE.Group | null
  foamParticles: FoamParticleSystem | null
  textOverlayVisible: boolean
  labelsVisible: boolean
}
```

**Aircraft Scene Refs**

```typescript
{
  camera: THREE.PerspectiveCamera
  cameraZTarget: number
  cameraYTarget: number
  aircraftGroup: THREE.Group | null
  elapsed: number // For banking oscillation
}
```

---

## Scroll State

Scroll state is NOT stored in React. It flows through refs and GSAP callbacks.

### Scroll Data Flow

```
Lenis scroll event
  → velocity, direction (per-event, not stored)
  → ST onUpdate fires
  → progress value → written to scene ref (scrollProgress)
  → useFrame reads ref → applies to camera
```

### What IS stored

```typescript
// Per-section in useRef:
const scrollProgressRef = useRef(0) // Written by ST, read by useFrame
```

### What is NOT stored

- `window.scrollY` — never cache this
- Scroll position — read from Lenis only
- Animation state booleans — ST handles start/end

---

## Animation State (GSAP Internals)

GSAP manages its own animation state. Application code does NOT track:

- Tween progress
- Timeline position
- Whether an animation is playing

Instead, use GSAP API when needed:

```
tween.isActive()        // Is currently animating?
timeline.totalProgress() // 0–1 overall progress
```

### One-Shot Animation Guard

For animations that should fire ONCE (ship labels):

```typescript
const hasLabelsAnimated = useRef(false)

// In ST onUpdate:
if (progress > 0.62 && !hasLabelsAnimated.current) {
  hasLabelsAnimated.current = true
  gsap.to(labelRefs, { opacity: 1, stagger: 0.15 })
}
```

---

## Loading State Machine

```
INITIAL
  │
  ├──→ LOADING (GLBs + fonts downloading)
  │         │
  │         ├──→ LOADED (all assets ready)
  │         │         │
  │         │         └──→ ANIMATING (load timeline playing)
  │         │
  └──→ ERROR (asset load failure) → FALLBACK
```

### State Transitions

| From    | To        | Trigger                                |
| ------- | --------- | -------------------------------------- |
| INITIAL | LOADING   | `LenisProvider` mounts                 |
| LOADING | LOADED    | All Promises resolve                   |
| LOADED  | ANIMATING | `delay(0.4)` after LoadingScreen fade  |
| LOADING | ERROR     | Any asset fetch fails (timeout or 404) |
| ERROR   | FALLBACK  | Show static fallback content           |

---

## UI State

UI components use local `useState` or `useReducer` for their own state.

| Component       | State          | Type                                       |
| --------------- | -------------- | ------------------------------------------ |
| `Navbar`        | `isScrolled`   | `boolean` — for background opacity         |
| `Button`        | `isHovered`    | `boolean` — for hover animation            |
| `CursorRing`    | `position`     | `{x, y}` — NOT useState (use ref for perf) |
| `LoadingScreen` | `isVisible`    | `boolean`                                  |
| `WordShuffle`   | `currentChars` | `string[]` — internal only                 |
| `StatCounter`   | `currentValue` | `number` — driven by GSAP, not useState    |

### Cursor State Special Case

The cursor position must update 60+ times per second. Using `useState` would trigger 60+ re-renders per second — unacceptable.

**Solution**: Use `useRef` for position + directly mutate `style.transform` via GSAP:

```
// In GSAP mouse handler:
gsap.to(cursorRef.current, { x: e.clientX - 20, y: e.clientY - 20 })
```

No React re-renders. Pure DOM mutation.

---

## Three.js State

Three.js scene graph IS the state for all 3D content. There is no React state mirroring Three.js.

### What lives in Three.js:

- All mesh positions, rotations, scales
- Material properties
- Light intensities
- Particle buffer data

### What React does NOT do:

- Never store `position.x` in React state
- Never store material color in React state
- Never trigger re-render on camera position change
