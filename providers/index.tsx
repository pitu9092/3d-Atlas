'use client'

/**
 * @file providers/index.tsx
 * @description Root application providers composition for 3D Atlas.
 *
 * Provider hierarchy (outer → inner):
 *   ThemeProvider    — dark/light theme, data-theme attribute, OS preference
 *   AnimationProvider — GSAP readiness, load completion, reduced motion
 *   ScrollProvider   — Lenis smooth scroll, single RAF loop, scroll state
 *
 * Order rationale:
 *   - ThemeProvider is outermost: CSS variables must be available to all
 *   - AnimationProvider wraps ScrollProvider: GSAP ticker must be ready
 *     before Lenis integrates with ScrollTrigger
 *   - ScrollProvider is innermost: depends on both theme and animation state
 *
 * @note GSAP plugins are registered in lib/gsap.ts (side-effect import).
 *       Animation provider triggers that import dynamically (client-only).
 * @note React Three Fiber <Canvas> components are scene-scoped,
 *       not registered here — they live in their own section components.
 */

import type { ReactNode } from 'react'

import { AnimationProvider } from './AnimationProvider'
import { ScrollProvider } from './ScrollProvider'
import { ThemeProvider } from './ThemeProvider'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Root providers wrapper.
 * Compose all application-level providers here.
 * Add new providers inside ScrollProvider (innermost) or before ThemeProvider (outermost).
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <AnimationProvider>
        <ScrollProvider>{children}</ScrollProvider>
      </AnimationProvider>
    </ThemeProvider>
  )
}

// Re-export individual providers and hooks for direct use
export { ThemeProvider, useTheme } from './ThemeProvider'
export { AnimationProvider, useAnimation } from './AnimationProvider'
export { ScrollProvider, useScroll } from './ScrollProvider'
export type { ScrollState } from './ScrollProvider'
