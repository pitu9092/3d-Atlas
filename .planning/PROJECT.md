# Project 3D Atlas

## Vision
**3D Atlas** is an Awwwards-caliber, cinematic, scroll-driven interactive 3D web experience. It combines high-end WebGL engineering with editorial typography, atmospheric lighting, and fluid camera choreography. The project merges the cinematic scroll storytelling of global network logistics with the dark sci-fi aesthetic, glowing HUD overlays, and micro-interactions inspired by Stonic AI and Apple-grade product showcases.

## Core Value
The single non-negotiable metric for success is **Pixel-Perfect Cinematic Execution at 60 FPS**. Every scroll tick drives camera motion, 3D globe rotation, particle field transitions, and typographic reveals seamlessly without flashes, stutter, layout shifts, or generic fallback geometries.

## Target Users
- Designers, creative directors, and creative technologists seeking state-of-the-art WebGL/3D web benchmarks.
- Global enterprise & logistics partners evaluating next-generation satellite, telematics, and planetary data command centers.
- Discerning visitors expecting an immersive, tactile interactive storytelling experience.

## Technical Context
- **Runtime & Framework**: Next.js 15+ (App Router) / React 19 / TypeScript (Strict mode, zero `any`).
- **Styling & Design System**: Tailwind CSS v4 + HSL/OKLCH CSS variables, custom noise grain, glow filters, glassmorphism (`backdrop-blur-xl`, `border-white/10`).
- **3D & Shaders**: Three.js, React Three Fiber, Drei, custom GLSL vertex/fragment shaders for atmospheric rim glow, dot-matrix globe points, and bezier arc animations.
- **Motion & Scroll Engine**: GSAP (GreenSock), ScrollTrigger, Lenis smooth scrolling, Framer Motion for UI micro-interactions.
- **Typography**: Inter / Syne / JetBrains Mono (monospaced telemetry coordinates and timestamps).
- **Architecture**: Single unified WebGL Canvas, SceneManager state machine, CameraManager with bezier easing, zero redundant render loops.

## Anti-Hallucination & Reference Locking Rules
1. **Never Invent Placeholder Geometry**: Absolutely zero colored cubes, default spheres, or generic untextured boxes. All 3D assets and visual sequences must strictly follow the reference blueprint.
2. **Never Break Continuity**: Transitions between Hero, Editorial Statement, Global Routes, Command Matrix, and Climax must operate as ONE continuous sequence.
3. **No Redesign or Simplification**: Spacing, easing, typographic scales, and color schemes are locked to the reference specifications.
4. **Validation Before Completion**: Every sequence must compile with zero TypeScript errors, zero hydration errors, and pass visual scrutiny.

## Key Decisions

| Decision | Source | Rationale | Outcome |
|----------|--------|-----------|---------|
| Project Name: 3D Atlas | User & ChatGPT | Premium, planetary, engineering-focused identity | Decided |
| GSD Methodology | User | Spec-driven development preventing context rot & model degradation | Adopted |
| Dual Reference Fusion | User & ChatGPT | Combines cinematic scroll storytelling with Stonic AI sci-fi polish | Approved |
| Single Canvas Architecture | Engineering | Prevents WebGL context loss, memory leaks, and ensures 60 FPS | Locked |
| Reference-Driven Sequences | ChatGPT & User | Prevents AI hallucinations (e.g. colored cubes) by locking frame boundaries | Enforced |

---
*Last updated: 2026-10-27 after GSD initialization*
