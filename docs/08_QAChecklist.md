# 08 — QA Checklist

Use this checklist before every phase completion and before any production deployment.

---

## Code Quality

- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes with zero errors or warnings
- [ ] `npm run format:check` passes (no unformatted files)
- [ ] No `console.log` statements in production code
- [ ] No `// @ts-ignore` or `// eslint-disable` comments without justification
- [ ] No hardcoded magic numbers — all values from constants or tokens
- [ ] No hardcoded colors or spacing — all from CSS variables

---

## Build

- [ ] `npm run build` completes without errors
- [ ] No type errors during build
- [ ] Bundle size within budget (see `05_PerformanceGuide.md`)
- [ ] No missing environment variables (check `.env.example`)

---

## Performance

- [ ] Desktop Lighthouse score ≥ 95
- [ ] Mobile Lighthouse score ≥ 80
- [ ] CLS < 0.05
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] 60 FPS sustained during scroll (Chrome DevTools → Performance)
- [ ] No dropped frames during Three.js animations
- [ ] GPU memory stable (no leak over 30s idle)

---

## Animations

- [ ] All GSAP ScrollTriggers clean up on unmount
- [ ] Lenis smooth scroll works on all tested viewports
- [ ] `prefers-reduced-motion` is respected
- [ ] No animation jank on initial page load
- [ ] No animation state leaks between route navigations
- [ ] Three.js geometry/material/texture disposed on unmount

---

## Responsive

- [ ] Tested at 375px (mobile)
- [ ] Tested at 768px (tablet)
- [ ] Tested at 1024px (laptop)
- [ ] Tested at 1440px (desktop)
- [ ] Tested at 1920px (large desktop)
- [ ] No horizontal scroll at any viewport
- [ ] Touch interactions work on mobile (tap, swipe)
- [ ] 3D scenes degrade gracefully at low DPR

---

## Accessibility

- [ ] All interactive elements have focus-visible states
- [ ] Keyboard navigation works for all interactive elements
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast ≥ 4.5:1 for normal text
- [ ] Color contrast ≥ 3:1 for large text
- [ ] No content conveyed by color alone

---

## SEO

- [ ] Each page has a unique `<title>`
- [ ] Each page has a `<meta name="description">`
- [ ] Single `<h1>` per page
- [ ] OpenGraph tags present
- [ ] Robots meta configured correctly
- [ ] No broken links
- [ ] `sitemap.xml` generated (Phase 3+)

---

## Security

- [ ] Security headers configured in `next.config.ts`
- [ ] No secrets in client-side code
- [ ] All env vars prefixed correctly (`NEXT_PUBLIC_` for client-safe)
- [ ] No XSS vulnerabilities in dynamic content

---

## Browser Compatibility

| Browser        | Version   | Status      |
| -------------- | --------- | ----------- |
| Chrome         | Latest -1 | ✅ Primary  |
| Firefox        | Latest -1 | ✅ Required |
| Safari         | Latest -1 | ✅ Required |
| Edge           | Latest -1 | ✅ Required |
| Safari iOS     | Latest    | ✅ Required |
| Chrome Android | Latest    | ✅ Required |

---

## WebGL / Three.js

- [ ] Canvas renders on all target browsers
- [ ] Graceful fallback if WebGL is unavailable
- [ ] No console errors from Three.js
- [ ] Shaders compile without warnings
- [ ] No texture loading errors (check Network tab)
