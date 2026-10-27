# Requirements — 3D Atlas

## Overview
This document specifies the exact, non-negotiable requirements for building the 3D Atlas web experience. Each requirement is assigned to a discrete phase to guarantee pixel perfection and prevent feature creep or architectural drift.

## V1 — Must Have (Production Baseline)

| ID | Requirement | Phase | Status |
|----|-------------|-------|--------|
| **R01** | Next.js 15+ & TypeScript Setup with Tailwind CSS v4, custom fonts, and root layout | Phase 01 | Planned |
| **R02** | Core WebGL Engine: Single Canvas, SceneManager, CameraManager, RAF render loop | Phase 02 | Planned |
| **R03** | Smooth Scroll Engine: Lenis + GSAP ScrollTrigger synchronization | Phase 02 | Planned |
| **R04** | 3D Interactive Dot-Matrix Globe with GLSL atmospheric rim glow & particle rings | Phase 03 | Planned |
| **R05** | Sequence 00: Cinematic Preloader with asset progress and transition wipe | Phase 04 | Planned |
| **R06** | Sequence 01 (Hero): Floating 3D Planetary Core, Stonic-style glowing typography, pill CTA | Phase 05 | Planned |
| **R07** | Sequence 02 (Editorial Statement): Pinned scroll storytelling, scrubbed text masks, camera orbit | Phase 06 | Planned |
| **R08** | Sequence 03 (Global Network): 3D Bezier logistics arcs, pulsing node telemetry, data cards | Phase 07 | Planned |
| **R09** | Sequence 04 (Command Matrix): Sci-fi HUD telemetry layer, UTC clock, live coordinates, 2D/3D toggle | Phase 08 | Planned |
| **R10** | Sequence 05 (Climax & CTA): Particle explosion transition, interactive glassmorphic footer | Phase 09 | Planned |
| **R11** | Performance Hardening: Adaptive DPR, frustum culling, asset lazy loading, 60 FPS audit | Phase 10 | Planned |
| **R12** | Responsive Choreography: Mobile & Tablet camera adjustments, touch scroll optimization | Phase 10 | Planned |

## V2 — Enhancements & Polish (Post-V1)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| **R13** | Audio Experience: Subtle sci-fi ambient hum, hover sound fx, scroll tick synthesizer | Medium | Backlog |
| **R14** | Live Real-World Satellite Tracker API integration (NORAD / TLE data) | Low | Backlog |
| **R15** | Interactive Custom Flight Path Creator (drag-and-drop node linking) | Low | Backlog |

## Out of Scope
- White backgrounds or flat generic 2D templates (contrary to dark sci-fi aesthetic).
- Colored placeholder cubes or demo 3D geometries (strictly prohibited).
- Heavy uncompressed 3D models (>10MB) that degrade mobile loading.

---
*Last updated: 2026-10-27*
