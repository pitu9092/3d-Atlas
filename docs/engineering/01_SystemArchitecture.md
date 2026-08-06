# 01 — System Architecture

**Project**: 3D Atlas  
**Document Type**: Engineering Architecture  
**Version**: 1.0  
**Source**: docs/motion-blueprint/, docs/reference/, docs/frame-analysis/

---

## System Overview

3D Atlas is a **cinematic scroll-driven web experience** built as a Next.js application. The system combines a DOM render layer with multiple isolated WebGL render layers, unified by a single scroll engine and animation orchestration system.

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │                NEXT.JS APP                        │   │
│  │                                                   │   │
│  │  ┌─────────────┐    ┌────────────────────────┐   │   │
│  │  │  React DOM   │    │   WebGL Canvas Layer   │   │   │
│  │  │  Layer       │    │   (5 isolated canvases) │   │   │
│  │  └──────┬───────┘    └───────────┬────────────┘   │   │
│  │         │                        │                 │   │
│  │  ┌──────▼───────────────────────▼────────────┐   │   │
│  │  │           ANIMATION LAYER                  │   │   │
│  │  │   GSAP Timelines + ScrollTrigger            │   │   │
│  │  └──────────────────┬─────────────────────────┘   │   │
│  │                     │                              │   │
│  │  ┌──────────────────▼─────────────────────────┐   │   │
│  │  │           SCROLL ENGINE                     │   │   │
│  │  │   Lenis (smooth scroll) + RAF loop          │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │           ASSET LAYER                        │   │   │
│  │  │   GLB Loader, Texture Loader, Font Loader    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Application Layers

### Layer 01 — React DOM Layer

**Responsibility**: Structure, content, layout, and accessibility  
**Technology**: Next.js App Router, React 18, TypeScript

| Component          | Responsibility                                           |
| ------------------ | -------------------------------------------------------- |
| Page layout        | Root HTML structure, font injection, global providers    |
| Section components | Per-section DOM content (H1, body, stats, services grid) |
| UI components      | Navbar, buttons, cursor, loading screen                  |
| Providers          | LenisProvider, LoadingProvider, ThemeProvider            |
| Portals            | Cursor overlay, loading overlay                          |

**Does NOT**: Render 3D. Does NOT own scroll state.  
**Receives from**: Scroll Engine (section visibility). Animation Layer (animation targets).  
**Sends to**: Animation Layer (DOM element refs for animation).

---

### Layer 02 — WebGL Canvas Layer

**Responsibility**: All 3D rendering — globe, crane, truck, ship, aircraft  
**Technology**: Three.js via React-Three-Fiber (R3F), @react-three/drei

| Canvas           | Scene          | Background              |
| ---------------- | -------------- | ----------------------- |
| `GlobeCanvas`    | Earth Globe    | Transparent             |
| `CraneCanvas`    | Reach Stacker  | Transparent             |
| `TruckCanvas`    | Semi-Truck     | Transparent             |
| `ShipCanvas`     | Container Ship | Opaque (#133D77)        |
| `AircraftCanvas` | Aircraft + Sky | Opaque (procedural sky) |

**Isolation**: Each canvas is a completely independent WebGLRenderer instance. No shared scene graph, no shared lights, no shared context.

**Does NOT**: Handle scroll. Does NOT manage DOM text.  
**Receives from**: Scroll Engine (progress values for camera/animation). Animation Layer (trigger signals).  
**Sends to**: Animation Layer (canvas ready events).

---

### Layer 03 — Animation Layer

**Responsibility**: Orchestrate all animations — DOM and 3D — in response to scroll and time  
**Technology**: GSAP 3, ScrollTrigger plugin

| Sub-system           | Responsibility                              |
| -------------------- | ------------------------------------------- |
| Load Timeline        | Entry animations on page load               |
| Scroll Timelines     | ScrollTrigger-driven per-section animations |
| DOM Animations       | Text reveals, fades, word shuffles          |
| 3D Proxy Animations  | Camera position, object transforms via refs |
| Transition Timelines | Cross-section color and mask transitions    |

**Does NOT**: Create DOM elements. Does NOT call WebGL APIs directly.  
**Receives from**: Scroll Engine (ScrollTrigger.update events). DOM Layer (element refs). WebGL Layer (camera/object refs via React context).  
**Sends to**: DOM Layer (applies transforms). WebGL Layer (updates camera/object positions).

---

### Layer 04 — Scroll Engine

**Responsibility**: Smooth scroll, progress tracking, RAF orchestration  
**Technology**: Lenis + GSAP ticker integration

| Component      | Responsibility                                |
| -------------- | --------------------------------------------- |
| Lenis instance | Smooth scroll inertia, RAF                    |
| GSAP ticker    | Single RAF loop driving both Lenis and GSAP   |
| ScrollTrigger  | Per-section trigger management                |
| Pin strategy   | Sticky section management (5 pinned sections) |

**Is the single source of scroll truth**. All other layers read from Lenis/ScrollTrigger.

---

### Layer 05 — Asset Layer

**Responsibility**: Load, cache, and serve all binary assets  
**Technology**: useGLTF (Drei), THREE.TextureLoader, Next.js font optimization

| Asset Type | Loader                                  | Cache                |
| ---------- | --------------------------------------- | -------------------- |
| GLB Models | `useGLTF` + Draco                       | Module-level preload |
| Textures   | `THREE.TextureLoader`                   | Manual ref map       |
| Fonts      | CSS @font-face + `document.fonts.ready` | Browser cache        |
| HDRI/Env   | `useEnvironment` (Drei)                 | Module-level         |

---

### Layer 06 — Utilities & Services

**Responsibility**: Shared logic, math, formatters, and helpers

| Utility          | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `mathUtils`      | `lerp`, `clamp`, `easeInOut`, `latLonToVec3`           |
| `formatUtils`    | Stat number formatting (space separator)               |
| `animationUtils` | Shared GSAP helper functions                           |
| `deviceUtils`    | GPU tier detection, device memory, reduced motion      |
| `scrollUtils`    | Progress-to-phase converters for ship/aircraft cameras |

---

## Layer Communication Map

```
Asset Layer
    │ (loaded assets)
    ▼
WebGL Canvas Layer ◄──────────────────── Animation Layer ◄───────────────── Scroll Engine
    │                (camera/obj refs)        │                (scroll progress)      │
    │                                   (DOM element refs)                      Lenis RAF
    ▼                                         │                                       │
WebGL Renderer                           React DOM Layer                        GSAP Ticker
(5 independent)                          (text, layout)                         (shared loop)
```

---

## Non-Negotiable Architectural Rules

| Rule                                        | Reason                                          |
| ------------------------------------------- | ----------------------------------------------- |
| One Lenis instance                          | Multiple smooth scroll instances conflict       |
| One GSAP ticker                             | Prevents double-RAF frame calls                 |
| Canvases are isolated                       | WebGL context limits (max 16 per browser)       |
| No direct DOM manipulation from WebGL layer | Violates separation of concerns                 |
| All animations cleaned up on unmount        | Memory leak prevention                          |
| ScrollTrigger.refresh() called once         | Expensive — triggered once, after layout stable |
| Fonts loaded before animations start        | Clip-path reveals break with wrong font metrics |
| Models preloaded at page start              | Prevents loading hitches during scroll          |
