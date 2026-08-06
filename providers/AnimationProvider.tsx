'use client'

/**
 * @file providers/AnimationProvider.tsx
 * @description Animation context provider for 3D Atlas.
 *
 * Derived from: docs/engineering/07_GSAPArchitecture.md
 *               docs/engineering/22_AccessibilityStrategy.md
 *               docs/motion-blueprint/03_GSAPBlueprint.md
 *
 * Responsibilities:
 *   - Detect prefers-reduced-motion and expose it to all consumers
 *   - Track page load animation completion
 *   - Provide animation-ready signal (fonts + Three.js canvas ready)
 *   - Apply GSAP reduced-motion overrides when needed
 *
 * Architecture note:
 *   GSAP plugin registration happens in lib/gsap.ts (imported at app boot).
 *   This provider manages the React-side animation state only.
 *
 * Usage:
 *   const { isLoadComplete, motionPreferences } = useAnimation()
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { AnimationContextValue, MotionPreferences } from '@/types/animation'

// ─── Context ──────────────────────────────────────────────────────────────────

const AnimationContext = createContext<AnimationContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AnimationProviderProps {
  children: ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [isLoadComplete, setIsLoadComplete] = useState(false)
  const [isGSAPReady, setIsGSAPReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // ── Detect prefers-reduced-motion ────────────────────────────────
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handler = (e: MediaQueryListEvent): void => {
      setReducedMotion(e.matches)
    }

    mql.addEventListener('change', handler)

    // Read initial value via RAF to avoid synchronous setState in effect
    const raf = requestAnimationFrame(() => {
      setReducedMotion(mql.matches)
    })

    return () => {
      cancelAnimationFrame(raf)
      mql.removeEventListener('change', handler)
    }
  }, [])

  // ── Initialize GSAP (import side-effect triggers registration) ────
  // GSAP plugins are registered in lib/gsap.ts.
  // We mark GSAP as ready after the first client-side effect completes.
  useEffect(() => {
    // Dynamic import ensures GSAP only runs on client
    import('@/lib/gsap')
      .then(() => {
        setIsGSAPReady(true)
      })
      .catch(() => {
        // GSAP failed to load — animations will degrade gracefully
        setIsGSAPReady(false)
      })
  }, [])

  // ── Actions ───────────────────────────────────────────────────────
  const setLoadComplete = useCallback((complete: boolean): void => {
    setIsLoadComplete(complete)
  }, [])

  // ── Motion preferences ────────────────────────────────────────────
  const motionPreferences = useMemo<MotionPreferences>(
    () => ({
      reducedMotion,
      motionScale: reducedMotion ? 0 : 1,
    }),
    [reducedMotion],
  )

  const value = useMemo<AnimationContextValue>(
    () => ({
      isLoadComplete,
      setLoadComplete,
      motionPreferences,
      isGSAPReady,
    }),
    [isLoadComplete, setLoadComplete, motionPreferences, isGSAPReady],
  )

  return <AnimationContext.Provider value={value}>{children}</AnimationContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the animation context.
 * Must be used within <AnimationProvider>.
 */
export function useAnimation(): AnimationContextValue {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}
