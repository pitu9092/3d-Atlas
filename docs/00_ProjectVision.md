# 00 — Project Vision

## Mission Statement

3D Atlas is a cinematic, scroll-driven web experience built to the highest standards of frontend engineering and creative technology. It is not a website. It is an interactive film.

## Aesthetic Direction

- **Dark, cinematic space**: Deep backgrounds, electric-indigo accents, volumetric glows
- **Fluid motion**: Every transition feels physical, every scroll tells a story
- **Premium craft**: Pixel-perfect details, consistent typography, no "lorem ipsum" aesthetics
- **Immersive 3D**: WebGL scenes that feel like part of the page, not widgets on top of it

## Core Principles

| Principle                 | Implementation                                                           |
| ------------------------- | ------------------------------------------------------------------------ |
| **Pixel-perfect**         | No approximations. Every measurement from design is implemented exactly. |
| **60 FPS**                | Performance is a feature. All animations use GPU-composited properties.  |
| **Cinematic timing**      | Custom easing curves, not ease-in-out defaults.                          |
| **Architectural clarity** | Feature-based modules, zero duplicated logic.                            |
| **Scalable**              | Built to support a team of 10 engineers without breaking.                |

## Performance Targets

| Metric           | Target           |
| ---------------- | ---------------- |
| Frame Rate       | 60 FPS sustained |
| Lighthouse Score | 95+ (desktop)    |
| CLS              | < 0.05           |
| LCP              | < 2.5 seconds    |
| INP              | < 200 ms         |

## Technology Bets

- **Next.js 15 + React 19**: Server components, streaming, concurrent features
- **Three.js + R3F**: Production 3D at scale
- **GSAP ScrollTrigger + Lenis**: Industry-standard scroll animation stack
- **Tailwind v4 + CSS Variables**: Design system with full token control
- **TypeScript strict mode**: No escapes, no shortcuts

## Non-Negotiables

- Never redesign the provided reference
- Never simplify layouts
- Never use placeholder animations
- Never hardcode colors, spacing, or timing values
- Always implement from tokens and constants
