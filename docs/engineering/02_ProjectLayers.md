# 02 — Project Layers

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Purpose**: Folder structure, responsibilities, and inter-folder communication rules

---

## Root Directory Structure

```
3d-Atlas/
├── src/                        ← All application source code
│   ├── app/                    ← Next.js App Router
│   ├── components/             ← React components (all UI)
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/                    ← Business logic, utilities
│   ├── providers/              ← React context providers
│   ├── shaders/                ← GLSL shader source files
│   ├── styles/                 ← Global CSS, design tokens
│   └── types/                  ← TypeScript type definitions
├── public/                     ← Static assets (served as-is)
│   ├── models/                 ← GLB 3D models
│   ├── textures/               ← Earth textures, water normals
│   └── fonts/                  ← Self-hosted font files (if any)
├── docs/                       ← Engineering documentation (this project)
│   ├── reference/              ← Phase 2: UI/design spec
│   ├── video-analysis/         ← Phase 3A: Timeline analysis
│   ├── frame-analysis/         ← Phase 3B: Frame-level specs
│   ├── motion-blueprint/       ← Phase 3C: Animation blueprints
│   └── engineering/            ← Phase 3D: This document set
├── .env.local                  ← Environment variables
├── next.config.js              ← Next.js configuration
├── tsconfig.json               ← TypeScript configuration
└── package.json                ← Dependencies
```

---

## `/src/app/` — Next.js App Router

**Why it exists**: Required by Next.js App Router for page and layout definitions.

| File          | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `layout.tsx`  | Root layout — HTML, body, font injection, global providers wrap |
| `page.tsx`    | Home page — renders all sections in sequence                    |
| `globals.css` | Imported here only (Next.js convention)                         |

**Communication**:

- Imports from `components/`, `providers/`
- Does NOT import from `lib/shaders/` directly
- Wraps children in all providers

---

## `/src/components/` — All React Components

```
components/
├── scenes/         ← WebGL R3F canvas scenes
├── sections/       ← DOM page sections
├── ui/             ← Shared UI elements
└── layout/         ← Layout components (navbar, footer)
```

### `/src/components/scenes/`

**Why it exists**: Isolates all Three.js/R3F code. Nothing outside this folder imports Three.js.

| Component           | Responsibility                                  |
| ------------------- | ----------------------------------------------- |
| `GlobeScene.tsx`    | Earth globe canvas                              |
| `CraneScene.tsx`    | Reach stacker crane canvas                      |
| `TruckScene.tsx`    | Semi-truck canvas                               |
| `ShipScene.tsx`     | Container ship canvas                           |
| `AircraftScene.tsx` | Aircraft + sky canvas                           |
| `BaseCanvas.tsx`    | Shared canvas wrapper (alpha, renderer, resize) |

**Communication**:

- Receives props: `isActive: boolean`, `scrollProgress?: number`
- Exports: canvas DOM ref for measurement
- Imports from: `lib/shaders/`, `lib/models/`, `hooks/`
- Does NOT import from `sections/`

### `/src/components/sections/`

**Why it exists**: Separates DOM section content from 3D scenes.

| Component                 | Responsibility                     |
| ------------------------- | ---------------------------------- |
| `HeroSection.tsx`         | Globe wrapper + DOM overlay        |
| `AtmosphereSection.tsx`   | CSS gradient transition section    |
| `EditorialSection.tsx`    | Brand H2 + stats                   |
| `CraneSection.tsx`        | Crane canvas wrapper               |
| `TruckSection.tsx`        | Truck canvas wrapper               |
| `ServicesSection.tsx`     | Services grid + word shuffle       |
| `WipeSection.tsx`         | Wipe panel transition              |
| `ShipSection.tsx`         | Ship canvas wrapper + DOM overlays |
| `AircraftSection.tsx`     | Aircraft canvas wrapper            |
| `TestimonialsSection.tsx` | Client testimonials                |

**Communication**:

- Imports scenes from `scenes/`
- Receives scroll progress from scroll hooks
- Provides DOM refs to Animation Layer via hooks

### `/src/components/ui/`

| Component           | Responsibility                |
| ------------------- | ----------------------------- |
| `Navbar.tsx`        | Fixed navigation, theme-aware |
| `CursorRing.tsx`    | Custom cursor overlay         |
| `Button.tsx`        | Shared button variants        |
| `LoadingScreen.tsx` | Pre-load overlay              |
| `StatCounter.tsx`   | Animated number counter       |
| `WordShuffle.tsx`   | Slot-machine text effect      |

### `/src/components/layout/`

| Component            | Responsibility                    |
| -------------------- | --------------------------------- |
| `PageWrapper.tsx`    | Outer wrapper, sets min-height    |
| `SectionWrapper.tsx` | Section spacing, pin-spacer aware |

---

## `/src/hooks/` — Custom React Hooks

**Why it exists**: Encapsulates stateful logic, prevents duplication.

| Hook                    | Purpose                         | Returns                             |
| ----------------------- | ------------------------------- | ----------------------------------- |
| `useLenis()`            | Access Lenis instance           | `lenis`                             |
| `useScrollProgress()`   | Track progress within a section | `{ progress, direction, velocity }` |
| `useScrollTrigger()`    | Create a ScrollTrigger instance | Cleanup function                    |
| `useCanvasVisibility()` | IntersectionObserver for canvas | `{ isVisible, isNear }`             |
| `useGSAPContext()`      | Scoped GSAP context             | `{ ctx, cleanup }`                  |
| `useDeviceCapability()` | GPU tier, reduced motion        | `{ tier, prefersReducedMotion }`    |
| `useModelLoader()`      | Load + cache GLB                | `{ gltf, isLoaded, error }`         |

**Communication**:

- Imports from `lib/` utilities
- Used by `components/` — NOT by each other (avoid hook chains)
- Provide scroll/GSAP state upward via return values

---

## `/src/lib/` — Business Logic & Utilities

```
lib/
├── scroll/         ← Lenis init, ScrollTrigger setup
├── animation/      ← GSAP helpers, timeline builders
├── math/           ← lerp, clamp, easing functions
├── format/         ← Number formatters
├── device/         ← GPU detection, capability checks
├── shaders/        ← Shader string constants
└── constants/      ← App-wide constants (colors, durations)
```

**Why it exists**: Pure logic — no React, no DOM, no Three.js. Can be unit-tested in isolation.

**Communication**:

- No imports from `components/` or `hooks/`
- Imported by: `hooks/`, `components/scenes/`

---

## `/src/providers/` — React Context Providers

| Provider          | Context Value          | Consumers                         |
| ----------------- | ---------------------- | --------------------------------- |
| `LenisProvider`   | `lenis`, `scrollTo`    | `useLenis()`, Navbar, CTA buttons |
| `LoadingProvider` | `isLoaded`, `progress` | `LoadingScreen`, all scenes       |
| `ThemeProvider`   | `navTheme`             | `Navbar`                          |

**Communication**:

- Wrap `app/layout.tsx`
- Consumed via hooks from `components/`

---

## `/src/shaders/` — GLSL Shader Files

```
shaders/
├── earth/
│   ├── vertex.glsl
│   └── fragment.glsl
├── atmosphere/
│   ├── vertex.glsl
│   └── fragment.glsl
├── thermal/
│   ├── vertex.glsl
│   └── fragment.glsl
└── water/
    ├── vertex.glsl
    └── fragment.glsl
```

**Why it exists**: Separates GLSL from TypeScript. Enables syntax highlighting and separate review.

**Communication**:

- Imported by `components/scenes/` as raw strings
- No dependencies on anything else

---

## `/src/styles/` — Global CSS & Design Tokens

| File             | Contents                                      |
| ---------------- | --------------------------------------------- |
| `globals.css`    | CSS custom properties (design tokens), resets |
| `typography.css` | Font-face declarations, text utilities        |
| `animations.css` | CSS keyframe animations (if any)              |
| `components.css` | Base component styles                         |

**Why it exists**: Centralizes all visual tokens. No hardcoded colors or spacing in components.

---

## `/src/types/` — TypeScript Definitions

| File                 | Contents                                |
| -------------------- | --------------------------------------- |
| `scene.types.ts`     | Scene state, canvas props               |
| `animation.types.ts` | Timeline types, ScrollTrigger configs   |
| `scroll.types.ts`    | Lenis events, scroll progress shape     |
| `model.types.ts`     | GLB structure types (nodes, animations) |
| `device.types.ts`    | GPU tier, device capability             |

---

## `/public/` — Static Assets

| Folder      | Contents                                     | Format          |
| ----------- | -------------------------------------------- | --------------- |
| `models/`   | All GLB models (Draco compressed)            | `.glb`          |
| `textures/` | Earth albedo, normal, specular; water normal | `.jpg`, `.ktx2` |
| `fonts/`    | Brand font files (if self-hosted)            | `.woff2`        |

**Why NOT in `src/`**: Next.js serves `/public/` as static files with correct headers.

---

## Inter-Folder Communication Rules

| From                   | To                   | Method            |
| ---------------------- | -------------------- | ----------------- |
| `hooks/`               | `lib/`               | Direct import     |
| `components/`          | `hooks/`             | `useX()` calls    |
| `components/scenes/`   | `shaders/`           | Raw string import |
| `components/sections/` | `components/scenes/` | JSX composition   |
| `providers/`           | `lib/scroll/`        | Internal usage    |
| `app/`                 | `providers/`         | JSX wrapper       |
| `app/`                 | `components/layout/` | JSX composition   |

**Forbidden imports**:

- `lib/` → `components/` (would create React dependency in pure logic)
- `hooks/` → `components/` (circular dependency)
- `components/scenes/` → `components/sections/` (circular)
- `shaders/` → anything (it's a sink, no imports)
