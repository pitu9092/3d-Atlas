# 02 — Coding Standards

## TypeScript

### Strict Mode

All TypeScript is written in **strict mode**. The following flags are enforced:

- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

### Forbidden Patterns

```typescript
// ❌ NEVER — explicit any
const value: any = getData()

// ✅ ALWAYS — proper typing
const value: UserData = getData()

// ❌ NEVER — type assertion as escape hatch
const el = document.getElementById('canvas') as HTMLCanvasElement

// ✅ ALWAYS — type guard
const el = document.getElementById('canvas')
if (!(el instanceof HTMLCanvasElement)) throw new Error('Canvas not found')
```

### Type Definitions

```typescript
// ❌ NEVER — inline anonymous types for reusable shapes
function render({ name, age }: { name: string; age: number }) {}

// ✅ ALWAYS — named interface or type
interface UserProps {
  name: string
  age: number
}
function render({ name, age }: UserProps) {}
```

---

## React Components

### Rules

- **Functional components only** — no class components
- **Named exports** — no default exports for components
- **Props interface** — always define a typed `XxxProps` interface
- **No inline handlers** — extract complex logic into hooks

```typescript
// ❌ NEVER
export default function ({ onClick }: { onClick: () => void }) {
  return <button onClick={() => { /* inline logic */ }}>Click</button>
}

// ✅ ALWAYS
interface ButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
}

export function Button({ onClick, label, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} type="button">
      {label}
    </button>
  )
}
```

### Component File Structure

```typescript
// 1. Imports (external → internal → relative)
// 2. Types / Interfaces
// 3. Constants (component-scoped)
// 4. Component function
// 5. Subcomponents (if small and tightly coupled)
// 6. Named export
```

---

## Naming Conventions

| Entity           | Convention                     | Example                |
| ---------------- | ------------------------------ | ---------------------- |
| Component        | PascalCase                     | `HeroSection.tsx`      |
| Hook             | camelCase + `use` prefix       | `useScrollProgress.ts` |
| Utility          | camelCase                      | `clampValue.ts`        |
| Type / Interface | PascalCase                     | `ScrollState`          |
| Constant         | SCREAMING_SNAKE_CASE           | `MAX_PIXEL_RATIO`      |
| CSS class        | kebab-case                     | `hero-section`         |
| GLSL file        | kebab-case + ext               | `atmosphere.vert.glsl` |
| Context          | PascalCase + `Context` suffix  | `LenisContext`         |
| Provider         | PascalCase + `Provider` suffix | `LenisProvider`        |

---

## Values and Tokens

```typescript
// ❌ NEVER — magic numbers or hardcoded values
gsap.to(el, { duration: 0.8, ease: 'power3.out' })
style={{ color: '#6366f1', gap: '16px' }}

// ✅ ALWAYS — constants and CSS tokens
import { ANIMATION } from '@/constants'
gsap.to(el, { duration: ANIMATION.DURATION.SLOWER, ease: ANIMATION.EASE.DEFAULT })
style={{ color: 'var(--color-accent-primary)', gap: 'var(--space-4)' }}
```

---

## File Organization

### One component per file

```
components/ui/Button/
  ├── Button.tsx
  ├── Button.types.ts   (if types are complex)
  └── index.ts          (re-export)
```

### Barrel exports

Every feature directory exports a public API via `index.ts`:

```typescript
// features/hero/index.ts
export { HeroSection } from './components/HeroSection'
export { useHeroAnimation } from './hooks/useHeroAnimation'
export type { HeroProps } from './types'
```

---

## Comments

```typescript
// ─── Section Dividers ────────────────────────────────────────────────────────
// Use GSAP-style section dividers for visual grouping in long files

/**
 * JSDoc for all public functions, hooks, and components.
 * @param value — description
 * @returns description
 */

// Inline TODO format:
// TODO: [Phase N] — Description of what needs to be done
```

---

## Forbidden Practices

| Pattern                                   | Why Forbidden                         |
| ----------------------------------------- | ------------------------------------- |
| `console.log` in production               | Use `removeConsole` in next.config.ts |
| `!important` in CSS                       | Always fix specificity properly       |
| Inline styles for design values           | Use CSS variables                     |
| `useEffect` for GSAP timelines            | Use `useGSAP` from @gsap/react        |
| Mutating `ref.current` directly in render | Side effects only in effects          |
| `document.querySelector` in components    | Use `useRef`                          |
