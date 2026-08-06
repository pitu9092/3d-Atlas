'use client'

/**
 * @file providers/index.tsx
 * @description Root application providers.
 * Wraps the entire application with all required context providers.
 * Order matters: providers lower in the tree can access providers above them.
 *
 * Provider hierarchy:
 *   LenisProvider        — Smooth scroll context
 *   └─ (future: ThemeProvider, AudioProvider, etc.)
 *
 * @note GSAP plugins are registered in lib/gsap.ts and imported at app boot.
 * @note React Three Fiber Canvas is scene-scoped, not a global provider.
 */

import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

/**
 * Root providers wrapper.
 * Add new providers here as the application grows.
 * Keep this file as the single source of truth for provider composition.
 */
export function Providers({ children }: ProvidersProps) {
  // TODO: Phase 1 — wrap with LenisProvider
  // TODO: Phase 1 — wrap with GSAPContext (for SSR safety)
  return <>{children}</>
}
