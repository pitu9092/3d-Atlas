# 01 — Project Architecture

## Pattern: Feature-Based Architecture

This project uses **Feature-Based Architecture** — code is organized by feature/domain, not by technical layer.

### Why Feature-Based?

- Each feature is a self-contained module (components + hooks + types + services)
- Engineers can work on features in parallel without conflicts
- Features can be extracted into separate packages if needed
- Easier to reason about ownership and boundaries

---

## Directory Reference

```
3d-Atlas/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   ├── page.tsx                  # Home page shell
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global CSS design token system
│
├── components/                   # Reusable, stateless UI components
│   ├── ui/                       # Primitive: Button, Input, Badge, etc.
│   └── layout/                   # Structural: Header, Footer, Section, etc.
│
├── features/                     # Feature modules (self-contained)
│   └── [feature-name]/
│       ├── components/           # Feature-specific components
│       ├── hooks/                # Feature-specific hooks
│       ├── types.ts              # Feature-specific types
│       ├── constants.ts          # Feature-specific constants
│       └── index.ts              # Public API barrel export
│
├── animations/                   # Animation configuration and presets
│   ├── gsap/                     # GSAP timeline presets, ScrollTrigger configs
│   └── motion/                   # Framer Motion variant libraries
│
├── scenes/                       # Three.js scene definitions
│   └── [scene-name]/             # One folder per scene
│       ├── Scene.tsx             # R3F Canvas scene
│       ├── objects/              # Scene-specific 3D objects
│       └── hooks/                # Scene-specific hooks
│
├── three/                        # Reusable Three.js primitives
│   ├── materials/                # Custom shader materials (MeshX)
│   ├── geometries/               # Custom geometries
│   └── utils/                   # R3F helpers and utilities
│
├── shaders/                      # Raw GLSL shader source files
│   ├── vertex/                   # .vert / .glsl vertex shaders
│   └── fragment/                 # .frag / .glsl fragment shaders
│
├── providers/                    # React context providers (app-level)
│   └── index.tsx                 # Root providers composition
│
├── contexts/                     # React context definitions and hooks
│   └── [context-name]/
│       ├── context.ts            # createContext + initial state
│       ├── provider.tsx          # Provider component
│       └── hook.ts               # useXxx hook
│
├── hooks/                        # Shared custom React hooks
│
├── lib/                          # Third-party library wrappers / config
│   ├── fonts.ts                  # Next.js font optimization
│   ├── gsap.ts                   # GSAP registration + defaults
│   └── lenis.ts                  # Lenis config + factory
│
├── services/                     # Data fetching, APIs, external services
│
├── constants/                    # App-wide constants (no magic numbers)
│   └── index.ts
│
├── types/                        # Global TypeScript types and interfaces
│   └── index.ts
│
├── utils/                        # Pure utility functions (no side effects)
│
├── styles/                       # Additional CSS modules (if needed)
│
└── public/                       # Static assets
    ├── models/                   # .glb / .gltf 3D models
    ├── textures/                 # Image textures for Three.js
    ├── videos/                   # Background video assets
    ├── images/                   # General raster images
    └── hdr/                      # HDRI environment maps
```

---

## Data Flow

```
Page (app/page.tsx)
  └─ Feature Component (features/hero/components/HeroSection.tsx)
       ├─ useScrollAnimation() hook (hooks/ or features/hero/hooks/)
       ├─ Scene (scenes/hero/Scene.tsx)
       │   ├─ Custom Material (three/materials/AtmosphereMaterial.ts)
       │   └─ Shader (shaders/vertex/atmosphere.vert)
       └─ AnimationPreset (animations/gsap/heroTimeline.ts)
```

---

## State Management Strategy

| State Type      | Solution                                 |
| --------------- | ---------------------------------------- |
| Server state    | Next.js Server Components + fetch        |
| UI state        | `useState` / `useReducer` in components  |
| Shared UI state | React Context (contexts/)                |
| Animation state | GSAP timelines (no React state for perf) |
| Scroll progress | Lenis + ScrollTrigger progress values    |
| 3D scene state  | R3F `useFrame` + Zustand (if needed)     |

---

## Import Conventions

```typescript
// 1. React + framework
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'

// 2. External libraries
import { gsap } from '@/lib/gsap'
import { motion } from 'framer-motion'

// 3. Internal — absolute paths only
import { Button } from '@/components/ui/Button'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { APP_NAME } from '@/constants'
import type { ScrollState } from '@/types'

// 4. Relative (same feature only)
import { heroVariants } from './variants'
```
