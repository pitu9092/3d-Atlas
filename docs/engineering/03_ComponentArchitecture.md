# 03 — Component Architecture

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Complete component tree, dependency graph, and categorization

---

## Component Categories

| Category  | Count | Responsibility                |
| --------- | ----- | ----------------------------- |
| Layout    | 4     | Page structure, wrappers      |
| Sections  | 10    | Per-section DOM content       |
| Scenes    | 6     | WebGL canvases                |
| UI        | 8     | Shared interactive elements   |
| Animation | 3     | Animation-specific components |
| Hooks     | 8     | Stateful logic encapsulation  |
| Providers | 3     | React context                 |
| Utilities | 6     | Pure helper functions         |
| Types     | 5     | TypeScript definitions        |

---

## Component Tree

```
<RootLayout>                     ← app/layout.tsx
  <LenisProvider>
  <LoadingProvider>
  <ThemeProvider>
    <PageWrapper>                ← components/layout/
      <Navbar />                 ← components/ui/
      <CursorRing />             ← components/ui/
      <LoadingScreen />          ← components/ui/

      <HeroSection>              ← components/sections/
        <GlobeScene />           ← components/scenes/
        [DOM content: eyebrow, H1, body, CTA]
      </HeroSection>

      <AtmosphereSection />      ← components/sections/ (CSS only)

      <EditorialSection>         ← components/sections/
        [H2, Stats ×3, Photo, Body]
        <StatCounter />          ← components/ui/
      </EditorialSection>

      <CraneSection>             ← components/sections/
        <CraneScene />           ← components/scenes/
      </CraneSection>

      <TruckSection>             ← components/sections/
        <TruckScene />           ← components/scenes/
      </TruckSection>

      <ServicesSection>          ← components/sections/
        <WordShuffle />          ← components/ui/
        [Service columns ×5]
      </ServicesSection>

      <WipeSection>              ← components/sections/
        <WordShuffle />          ← components/ui/
        [Feature label]
      </WipeSection>

      <ShipSection>              ← components/sections/
        <ShipScene />            ← components/scenes/
        [Text overlay, Feature labels ×3]
      </ShipSection>

      <AircraftSection>          ← components/sections/
        <AircraftScene />        ← components/scenes/
      </AircraftSection>

      <TestimonialsSection>      ← components/sections/
        [H2, Client cards ×N, Quotes]
      </TestimonialsSection>

    </PageWrapper>
  </ThemeProvider>
  </LoadingProvider>
  </LenisProvider>
</RootLayout>
```

---

## Layout Components

### `PageWrapper`

| Property     | Spec                                      |
| ------------ | ----------------------------------------- |
| Purpose      | Sets `min-height`, scroll container       |
| Props        | `children`                                |
| CSS          | `position: relative`, overflow management |
| Dependencies | None                                      |

### `SectionWrapper`

| Property     | Spec                                              |
| ------------ | ------------------------------------------------- |
| Purpose      | Consistent section spacing, optional pin          |
| Props        | `children`, `id`, `className`, `pinned?: boolean` |
| CSS          | Padding, scroll anchoring                         |
| Dependencies | None                                              |

### `Navbar`

| Property        | Spec                                                  |
| --------------- | ----------------------------------------------------- |
| Purpose         | Fixed navigation, theme-aware color switching         |
| Props           | None (reads from `ThemeProvider`)                     |
| State           | `navTheme: 'light'                                    | 'dark'` (from context) |
| Animation       | CSS `transition: color 0.3s`                          |
| Scroll behavior | Theme changes via ScrollTrigger at section boundaries |
| Dependencies    | `useScrollTrigger`, `ThemeProvider`                   |

### `CursorRing`

| Property       | Spec                                                     |
| -------------- | -------------------------------------------------------- |
| Purpose        | Custom white ring cursor                                 |
| Implementation | Fixed `div`, `pointer-events: none`, GSAP mouse tracking |
| Size           | `40px × 40px` circle, no fill                            |
| Dependencies   | `useLenis` (for velocity-based scale?)                   |

---

## Section Components

All section components follow this pattern:

- Accept no external props (read from scroll context)
- Provide animation refs via `useRef`
- Register their ScrollTrigger in `useLayoutEffect`
- Clean up in `useLayoutEffect` return
- Render DOM structure + optional scene canvas

### Section Dependencies

| Section             | Depends On          | Provides To                    |
| ------------------- | ------------------- | ------------------------------ |
| HeroSection         | GlobeScene, fonts   | Load animations, scroll camera |
| AtmosphereSection   | HeroSection exit    | BG gradient                    |
| EditorialSection    | AtmosphereSection   | H2 reveal, stats               |
| CraneSection        | crane.glb loaded    | Crane scroll animation         |
| TruckSection        | truck.glb loaded    | Truck entry animation          |
| ServicesSection     | TruckSection        | Word shuffle                   |
| WipeSection         | ServicesSection     | Panel animation                |
| ShipSection         | ship.glb loaded     | Camera animation, text         |
| AircraftSection     | aircraft.glb loaded | Camera zoom                    |
| TestimonialsSection | AircraftSection     | H2, card reveals               |

---

## Scene Components

All scene components follow this pattern:

```
<BaseCanvas frameloop={isActive ? "always" : "demand"} alpha={needsAlpha}>
  <Suspense fallback={null}>
    <PerspectiveCamera ... />
    <ambientLight ... />
    <directionalLight ... />
    [Model or procedural geometry]
    <EffectComposer>
      [PostProcessing effects]
    </EffectComposer>
  </Suspense>
</BaseCanvas>
```

### Scene Component API

| Prop             | Type         | Default     | Description                    |
| ---------------- | ------------ | ----------- | ------------------------------ |
| `isActive`       | `boolean`    | `false`     | Controls frameloop             |
| `scrollProgress` | `number`     | `0`         | Progress 0–1 within section    |
| `onReady`        | `() => void` | `undefined` | Fires when first frame renders |

### `BaseCanvas`

| Property     | Spec                                                              |
| ------------ | ----------------------------------------------------------------- |
| Purpose      | Shared canvas configuration                                       |
| Renderer     | `alpha`, `antialias: true`, `powerPreference: "high-performance"` |
| Tone mapping | `ACESFilmicToneMapping`                                           |
| Color space  | `SRGBColorSpace`                                                  |
| Pixel ratio  | `Math.min(dpr, 2)`                                                |
| Resize       | Handled by R3F internally                                         |

---

## UI Components

### `StatCounter`

| Property      | Spec                                                               |
| ------------- | ------------------------------------------------------------------ |
| Props         | `end: number`, `format: (n: number) => string`, `duration: number` |
| Animation     | GSAP count-up from 0, `power2.out`                                 |
| Trigger       | ScrollTrigger `once: true`                                         |
| Accessibility | `aria-live="polite"` on counter element                            |

### `WordShuffle`

| Property       | Spec                                     |
| -------------- | ---------------------------------------- |
| Props          | `lines: string[]`, `trigger: 'immediate' | 'scroll'` |
| Character pool | `A–Z`, `0–9`                             |
| Settle timing  | `i × 30ms` stagger per character         |
| Cycle speed    | `80ms` per character swap                |
| Implementation | Custom class, no GSAP dependency         |

### `LoadingScreen`

| Property | Spec                                        |
| -------- | ------------------------------------------- |
| Purpose  | Covers page while models/fonts load         |
| Exit     | Fade out `opacity: 1→0` on all models ready |
| z-index  | `9999` — above everything                   |
| Content  | Brand name or progress indicator            |

---

## Hooks

### `useLenis`

```
Input: none
Output: { lenis: Lenis | null, scrollTo: (target, options) => void }
Source: LenisProvider context
```

### `useScrollProgress`

```
Input: { trigger: RefObject<HTMLElement>, start, end }
Output: { progress: number, direction: 1 | -1, velocity: number }
Implementation: ScrollTrigger onUpdate callback
```

### `useCanvasVisibility`

```
Input: { ref: RefObject<HTMLElement>, threshold: number }
Output: { isVisible: boolean, isNear: boolean }
Implementation: IntersectionObserver
Side effect: Toggles canvas frameloop
```

### `useGSAPContext`

```
Input: none
Output: { ctx: gsap.Context, cleanup: () => void }
Purpose: Scoped GSAP context for React cleanup
```

### `useDeviceCapability`

```
Input: none
Output: { gpuTier: 'low' | 'medium' | 'high', prefersReducedMotion: boolean, deviceMemory: number }
Implementation: navigator.deviceMemory, matchMedia, WebGL debug info
```

---

## Providers

### `LenisProvider`

```
Initializes: Lenis instance on mount
Syncs: GSAP ticker → Lenis RAF
Provides: { lenis, scrollTo }
Cleanup: lenis.destroy() on unmount
```

### `LoadingProvider`

```
Tracks: All useGLTF.preload promises + document.fonts.ready
Provides: { isLoaded: boolean, progress: number }
Controls: LoadingScreen visibility
```

### `ThemeProvider`

```
Provides: { navTheme: 'light' | 'dark', setNavTheme }
Consumers: Navbar
Updated by: ScrollTrigger section boundaries
```

---

## Component Communication Rules

| Rule                                                | Reason                                      |
| --------------------------------------------------- | ------------------------------------------- |
| Sections do NOT pass scroll props to scenes         | Scenes read from their own ScrollTrigger    |
| Scenes communicate readiness via `onReady` callback | LoadingProvider tracks this                 |
| Providers are siblings, not nested in each other    | Prevents context re-render cascade          |
| Navbar theme is NOT driven by scroll directly       | ThemeProvider batches updates               |
| DOM refs exposed upward via callback refs           | Avoids ref drilling through multiple layers |
