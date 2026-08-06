# 09 — Implementation Roadmap

## Phase Structure

The project is built in sequential phases. Each phase must pass QA before the next begins.

---

## Phase 0 — Project Initialization ✅ COMPLETE

**Goal**: Production-ready scaffold. No UI.

- [x] Next.js 15 + React 19 + TypeScript scaffold
- [x] Tailwind v4 + CSS design token system
- [x] GSAP + ScrollTrigger + Lenis configured
- [x] Three.js + R3F + Drei installed
- [x] Framer Motion installed
- [x] ESLint + Prettier + Husky + lint-staged
- [x] Absolute imports + path aliases
- [x] Feature-based folder structure
- [x] Root layout with fonts (Inter + Outfit) and SEO metadata
- [x] Stub: providers/index.tsx, lib/gsap.ts, lib/lenis.ts, lib/fonts.ts
- [x] Global types, constants, environment variables
- [x] Documentation (docs/00 — 09)

---

## Phase 1 — Core Infrastructure

**Goal**: All shared providers, hooks, and base components ready. No page UI.

### Deliverables

- [ ] `LenisProvider` — smooth scroll context with GSAP connection
- [ ] `useScrollProgress` hook
- [ ] `useMediaQuery` hook
- [ ] `useReducedMotion` hook
- [ ] `useMounted` hook (SSR guard)
- [ ] `Container` layout component
- [ ] `Section` layout component
- [ ] GSAP animation presets (`animations/gsap/presets.ts`)
- [ ] Framer Motion variants (`animations/motion/variants.ts`)
- [ ] WebGL detection utility
- [ ] GLSL raw-loader webpack config in `next.config.ts`

### Exit Criteria

- `npm run build` passes
- `npm run type-check` passes
- LenisProvider wraps app and smooth scroll works

---

## Phase 2 — Home Page Layout

**Goal**: Full page structure, responsive layout, no animations yet.

### Deliverables

- [ ] Hero section layout (pixel-perfect from reference)
- [ ] Navigation component
- [ ] All page sections (markup + responsive CSS only)
- [ ] Font implementation verified

### Exit Criteria

- All breakpoints tested
- No horizontal scroll
- Lighthouse CLS = 0 (no layout shift from fonts or images)

---

## Phase 3 — Scroll Animations

**Goal**: Full GSAP + Lenis scroll animation implementation.

### Deliverables

- [ ] Hero reveal animation
- [ ] Section entrance animations
- [ ] Scroll-scrubbed parallax effects
- [ ] Navigation scroll behavior

### Exit Criteria

- 60 FPS on desktop (Chrome DevTools)
- All ScrollTriggers cleaned up on unmount
- Reduced motion respected

---

## Phase 4 — Three.js Scenes

**Goal**: All 3D scenes integrated and animated.

### Deliverables

- [ ] R3F Canvas setup (SSR disabled, DPR capped)
- [ ] Hero 3D scene
- [ ] Scene-scroll integration (ScrollTrigger → uniform updates)
- [ ] Custom shader materials
- [ ] HDR environment lighting

### Exit Criteria

- 60 FPS with 3D active
- No WebGL errors in console
- All textures/geometry disposed on unmount

---

## Phase 5 — Polish + Performance

**Goal**: Lighthouse 95+, pixel-perfect, production-ready.

### Deliverables

- [ ] Bundle optimization (dynamic imports, code splitting)
- [ ] Image optimization (AVIF/WebP, lazy loading)
- [ ] 3D asset compression (KTX2 textures, Draco geometry)
- [ ] Accessibility audit
- [ ] SEO final implementation (sitemap, structured data)
- [ ] Security headers verified
- [ ] Cross-browser testing

### Exit Criteria

- Lighthouse ≥ 95 (desktop)
- CLS < 0.05
- LCP < 2.5s
- INP < 200ms
- All `08_QAChecklist.md` items checked

---

## Phase 6 — Launch Preparation

**Goal**: Deployment-ready.

### Deliverables

- [ ] Production environment variables configured
- [ ] CI/CD pipeline (GitHub Actions or Vercel)
- [ ] Domain and SSL configured
- [ ] Analytics integrated
- [ ] Error monitoring (Sentry or similar)
- [ ] Final stakeholder review

---

## Timeline Estimate

| Phase              | Duration  | Status      |
| ------------------ | --------- | ----------- |
| 0 — Initialization | 1 day     | ✅ Complete |
| 1 — Infrastructure | 2–3 days  | ⏳ Next     |
| 2 — Layout         | 3–5 days  | —           |
| 3 — Animations     | 4–7 days  | —           |
| 4 — Three.js       | 5–10 days | —           |
| 5 — Polish         | 3–5 days  | —           |
| 6 — Launch         | 2–3 days  | —           |

_Estimates assume one senior engineer. Adjust for team size and scope._
