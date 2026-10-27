# Master Roadmap — 3D Atlas

## Milestone 1: Production 3D Cinematic Scroll Experience

### Progress Overview

| Phase | Name | Status | Requirements | Target Date |
|-------|------|--------|--------------|-------------|
| **01** | Project Foundation & Architecture | Planned | R01 | Sprint 1 |
| **02** | Core WebGL & Scroll Engine | Planned | R02, R03 | Sprint 1 |
| **03** | 3D Globe & Custom Shaders | Planned | R04 | Sprint 2 |
| **04** | Sequence 00: Cinematic Preloader | Planned | R05 | Sprint 2 |
| **05** | Sequence 01: Hero Scene | Planned | R06 | Sprint 3 |
| **06** | Sequence 02: Editorial Statement | Planned | R07 | Sprint 3 |
| **07** | Sequence 03: Global Logistics Network | Planned | R08 | Sprint 4 |
| **08** | Sequence 04: Command Matrix HUD | Planned | R09 | Sprint 4 |
| **09** | Sequence 05: Climax & Footer | Planned | R10 | Sprint 5 |
| **10** | Hardening, 60 FPS Audit & Mobile | Planned | R11, R12 | Sprint 5 |

---

### Detailed Phase Specifications

#### Phase 01: Project Foundation & Architecture
**Goal:** Initialize production Next.js 15+ application with strict TypeScript, Tailwind CSS v4 design tokens, custom typography, and GSD validation gates.
**Requirements:** R01
- [ ] Initialize Next.js 15 App Router project in workspace.
- [ ] Install dependencies: Three.js, @react-three/fiber, @react-three/drei, gsap, @studio-freight/lenis (or lenis), framer-motion, lucide-react, clsx, tailwind-merge.
- [ ] Configure typography: Google Fonts `Inter`, `Syne` (or `Outfit`), and `JetBrains Mono`.
- [ ] Configure Tailwind CSS v4 variables: `#000000`, `#05080c`, `#0a0a12`, Cyan `#4aa8ff`, Emerald `#34d399`, Rose `#f87171`.
- [ ] Set up absolute path aliases and verify build.

#### Phase 02: Core WebGL & Scroll Engine
**Goal:** Build the single shared WebGL canvas, CameraManager, SceneManager lifecycle, and GSAP/Lenis scroll bridge.
**Requirements:** R02, R03
- [ ] Implement `ScrollManager` with Lenis smooth scrolling and GSAP `ScrollTrigger.scrollerProxy`.
- [ ] Implement `CameraManager` supporting smooth position, target, FOV, and roll interpolations.
- [ ] Implement `SceneManager` with standard lifecycle hooks: `mount()`, `activate()`, `update()`, `deactivate()`, `dispose()`.
- [ ] Guarantee single WebGL context and single RAF loop for 60 FPS performance.

#### Phase 03: 3D Globe & Custom Shaders
**Goal:** Develop the photorealistic sci-fi 3D digital Earth and particle systems.
**Requirements:** R04
- [ ] Build dot-matrix procedural planetary sphere with continental coordinates.
- [ ] Develop GLSL custom shader material for Fresnel atmospheric rim glow (cyan/blue haze).
- [ ] Add dynamic orbital particle ring and 3D background starfield.
- [ ] Ensure lighting response with ambient, directional, and rim lights.

#### Phase 04: Sequence 00 — Cinematic Preloader
**Goal:** Deliver a hypnotic initial loading sequence that eliminates hydration flashes and prepares WebGL shaders.
**Requirements:** R05
- [ ] Fullscreen dark screen with animated circular progress indicator and percentage counter.
- [ ] Shader compilation and asset warming during loading state.
- [ ] Smooth expanding aperture wipe into the Hero scene upon completion.

#### Phase 05: Sequence 01 — Hero Scene
**Goal:** Construct the hero section combining Stonic AI's high-contrast typography, floating planetary core, and glassmorphic navbar.
**Requirements:** R06
- [ ] Floating glassmorphism navigation pill with logo, links, and status indicator.
- [ ] Hero headline: Gradient text ("An autonomous global intelligence") with bold typography.
- [ ] 3D Planetary core with interactive mouse parallax tilt.
- [ ] Primary CTA buttons ("Explore Atlas", "View Telemetry") with magnetic hover effects.

#### Phase 06: Sequence 02 — Editorial Brand Statement
**Goal:** Implement the scroll-scrubbed typography reveal with seamless camera orbit continuation.
**Requirements:** R07
- [ ] Pinned viewport transition as user scrolls down from Hero.
- [ ] Camera glides from front perspective into an angled orbital perspective.
- [ ] Word-by-word opacity and clip-path mask reveal of brand mission statement.
- [ ] Zero jumps, zero flashes, completely continuous camera trajectory.

#### Phase 07: Sequence 03 — Global Logistics Network
**Goal:** Implement the complex 3D logistics flight trajectories and pulsing telemetry nodes.
**Requirements:** R08
- [ ] Camera zooms smoothly toward planetary surface hubs (Tokyo, London, NYC, Dubai, Singapore).
- [ ] Procedural 3D glowing Bezier arcs connecting hubs with moving light pulses.
- [ ] Floating sci-fi data telemetry cards displaying route latency, flight volume, and status.
- [ ] Strict adherence to reference video: NO placeholder cubes or demo boxes.

#### Phase 08: Sequence 04 — Command Matrix HUD
**Goal:** Build the mission-control style telemetry layer with 2D radar and data displays.
**Requirements:** R09
- [ ] Sci-fi corner HUD brackets, live UTC clock, longitude/latitude crosshairs.
- [ ] Toggleable 3D Globe vs 2D Planar Mercator radar projection.
- [ ] Live data feeds: Satellite health, operational uptime, active telemetry packets.

#### Phase 09: Sequence 05 — Climax & Footer
**Goal:** Create the climactic particle acceleration wrap-up, primary conversion CTA, and sleek footer.
**Requirements:** R10
- [ ] High-speed camera hyper-drive zoom with particle acceleration effect.
- [ ] Grand finale CTA card with glowing cyan/blue diffuse backdrop.
- [ ] Complete agency-grade footer with live system status, legal links, and social links.

#### Phase 10: Hardening, 60 FPS Audit & Mobile Optimization
**Goal:** Guarantee rock-solid 60 FPS execution on desktop and responsive adaptation for mobile/tablet.
**Requirements:** R11, R12
- [ ] Implement adaptive DPR (`Math.min(window.devicePixelRatio, 2)`).
- [ ] Profile draw calls, poly counts, and texture memory consumption.
- [ ] Touch gestures and scroll optimization for iOS/Android.
- [ ] Complete linting, typecheck, and production bundle verification.

---
*Last updated: 2026-10-27*
