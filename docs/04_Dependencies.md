# 04 — Dependencies

## Production Dependencies

| Package                       | Version | Purpose                                               |
| ----------------------------- | ------- | ----------------------------------------------------- |
| `next`                        | 16.x    | Framework — App Router, SSR, image optimization       |
| `react`                       | 19.x    | UI library — concurrent features, server components   |
| `react-dom`                   | 19.x    | React DOM renderer                                    |
| `gsap`                        | 3.x     | Core animation engine — timelines, tweens             |
| `@gsap/react`                 | 2.x     | GSAP React hooks (`useGSAP`) — safe cleanup           |
| `lenis`                       | 1.x     | Smooth scroll engine — inertia-based scrolling        |
| `framer-motion`               | 11.x    | React animation library — layout animations, gestures |
| `three`                       | 0.172.x | Core WebGL/3D rendering engine                        |
| `@react-three/fiber`          | 8.x     | React renderer for Three.js — declarative 3D          |
| `@react-three/drei`           | 9.x     | R3F helpers — Environment, Text, Html, Controls       |
| `@react-three/postprocessing` | 2.x     | Post-processing effects — Bloom, SSAO, DOF            |
| `clsx`                        | 2.x     | Conditional class name utility                        |
| `class-variance-authority`    | 0.7.x   | Component variant system (cva)                        |
| `zod`                         | 3.x     | Schema validation — env vars, API responses           |
| `react-use`                   | 17.x    | General React hooks collection                        |
| `usehooks-ts`                 | 3.x     | TypeScript-first React hooks                          |

---

## Development Dependencies

| Package                       | Version | Purpose                          |
| ----------------------------- | ------- | -------------------------------- |
| `typescript`                  | 5.x     | Static typing                    |
| `tailwindcss`                 | 4.x     | Utility-first CSS                |
| `@tailwindcss/postcss`        | 4.x     | Tailwind PostCSS integration     |
| `eslint`                      | 9.x     | Code linting                     |
| `eslint-config-next`          | 16.x    | Next.js ESLint rules             |
| `prettier`                    | 3.x     | Code formatting                  |
| `prettier-plugin-tailwindcss` | 0.6.x   | Tailwind class sorting           |
| `husky`                       | 9.x     | Git hooks                        |
| `lint-staged`                 | 15.x    | Run linters on staged files only |
| `@types/node`                 | 20.x    | Node.js TypeScript types         |
| `@types/react`                | 19.x    | React TypeScript types           |
| `@types/react-dom`            | 19.x    | ReactDOM TypeScript types        |
| `@types/three`                | 0.172.x | Three.js TypeScript types        |

---

## Upgrade Strategy

### Breaking change risk

| Package              | Risk   | Notes                                             |
| -------------------- | ------ | ------------------------------------------------- |
| `three`              | Medium | API changes between minor versions — pin to patch |
| `@react-three/fiber` | Low    | Follows R3F lifecycle closely                     |
| `gsap`               | Low    | Very stable API, GSAP 4 is a future consideration |
| `lenis`              | Medium | API changed significantly from v1 to v2           |
| `framer-motion`      | Low    | Well-versioned API, avoid major jumps             |

### Update cadence

- **Security patches**: Apply within 48 hours
- **Minor updates**: Review and apply monthly
- **Major updates**: Scheduled per roadmap phase, with dedicated testing

---

## GLSL / Shader Setup

Three.js shaders (`.glsl`, `.vert`, `.frag`) are loaded as raw strings.  
Configure Next.js webpack to handle them:

```typescript
// next.config.ts (future addition)
webpack(config) {
  config.module.rules.push({
    test: /\.(glsl|vs|fs|vert|frag)$/,
    use: 'raw-loader',
    exclude: /node_modules/,
  })
  return config
}
```

Install when needed: `npm install --save-dev raw-loader`
