# 03 — Folder Structure

## Annotated Tree

```
3d-Atlas/
│
├── app/                              # Next.js App Router (pages, layouts, routes)
│   ├── layout.tsx                    # Root layout — fonts, metadata, providers
│   ├── page.tsx                      # / (home)
│   ├── not-found.tsx                 # /404
│   ├── globals.css                   # Global CSS design token system
│   └── favicon.ico
│
├── components/                       # Stateless, reusable UI components
│   ├── ui/                           # Primitive components (Button, Badge, Input…)
│   └── layout/                       # Layout components (Header, Footer, Section…)
│
├── features/                         # Feature modules — self-contained domains
│   └── [feature-name]/               # One folder per feature
│       ├── components/               # Feature UI (not shared outside)
│       ├── hooks/                    # Feature hooks
│       ├── types.ts                  # Feature-specific types
│       ├── constants.ts              # Feature-specific constants
│       └── index.ts                  # Public barrel export
│
├── animations/                       # Animation presets and configuration
│   ├── gsap/                         # GSAP timelines, ScrollTrigger configs
│   │   └── presets.ts                # Reusable GSAP animation presets
│   └── motion/                       # Framer Motion variant definitions
│       └── variants.ts               # Reusable motion variants
│
├── scenes/                           # Three.js / R3F scene definitions
│   └── [scene-name]/                 # One folder per named scene
│       ├── Scene.tsx                 # R3F Canvas root
│       ├── objects/                  # 3D objects / meshes in the scene
│       └── hooks/                    # Scene-local hooks (useFrame, etc.)
│
├── three/                            # Reusable Three.js building blocks
│   ├── materials/                    # Custom shader materials (extend Three.js Material)
│   ├── geometries/                   # Custom BufferGeometry subclasses
│   └── utils/                       # R3F helpers, loaders, conversion utilities
│
├── shaders/                          # GLSL shader source files (raw)
│   ├── vertex/                       # Vertex shaders (.vert.glsl)
│   └── fragment/                     # Fragment shaders (.frag.glsl)
│
├── providers/                        # App-level React context providers
│   └── index.tsx                     # Composes all providers into one wrapper
│
├── contexts/                         # React context definitions (split from providers)
│   └── [name]/
│       ├── context.ts                # createContext + initial state
│       ├── provider.tsx              # Provider component
│       └── hook.ts                   # useXxx hook
│
├── hooks/                            # Shared custom React hooks (not feature-specific)
│   └── useScrollProgress.ts          # (example)
│
├── lib/                              # Third-party library wrappers and config
│   ├── fonts.ts                      # Next.js Google Font config
│   ├── gsap.ts                       # GSAP plugin registration
│   └── lenis.ts                      # Lenis factory and config
│
├── services/                         # External data fetching and API clients
│
├── constants/                        # App-wide constants — no magic numbers
│   └── index.ts
│
├── types/                            # Global TypeScript type definitions
│   └── index.ts
│
├── utils/                            # Pure utility functions (no side effects, no React)
│
├── styles/                           # Additional CSS files (CSS Modules if needed)
│
├── public/                           # Static assets (served at /)
│   ├── models/                       # 3D models (.glb, .gltf)
│   ├── textures/                     # Three.js texture maps
│   ├── videos/                       # Background/hero video files
│   ├── images/                       # Raster images (not imported by JS)
│   └── hdr/                          # HDRI environment maps (.hdr, .exr)
│
└── docs/                             # Project documentation
    ├── 00_ProjectVision.md
    ├── 01_ProjectArchitecture.md
    ├── 02_CodingStandards.md
    ├── 03_FolderStructure.md
    ├── 04_Dependencies.md
    ├── 05_PerformanceGuide.md
    ├── 06_AnimationStrategy.md
    ├── 07_ResponsiveStrategy.md
    ├── 08_QAChecklist.md
    └── 09_ImplementationRoadmap.md
```

---

## Naming Rules

- **Files**: PascalCase for components (`HeroSection.tsx`), camelCase for everything else
- **Folders**: kebab-case for all directories
- **Barrel exports**: every `features/`, `components/`, and `contexts/` subfolder has an `index.ts`
- **No barrel from `app/`**: Next.js App Router files are file-system routed — never barrel

---

## Adding a New Feature

```bash
features/
└── my-feature/
    ├── components/
    │   └── MyFeature.tsx
    ├── hooks/
    │   └── useMyFeature.ts
    ├── types.ts
    ├── constants.ts
    └── index.ts        ← export { MyFeature } from './components/MyFeature'
```

Then import in the page:

```typescript
import { MyFeature } from '@/features/my-feature'
```
