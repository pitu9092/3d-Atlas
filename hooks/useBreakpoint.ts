'use client'

/**
 * @file hooks/useBreakpoint.ts
 * @description Current breakpoint detection hook for 3D Atlas.
 *
 * Derived from: docs/reference/19_ResponsiveObservations.md
 *               styles/tokens/breakpoints.ts
 *
 * Breakpoint thresholds (mobile-first):
 *   mobile:     0–767px
 *   tablet:     768–1023px
 *   laptop:     1024–1279px
 *   desktop:    1280–1439px
 *   wide:       1440–1919px
 *   ultrawide:  1920px+
 *
 * Usage:
 *   const { breakpoint, isTablet, isDesktop, isMobile } = useBreakpoint()
 */

import { useEffect, useState } from 'react'

import { breakpointValues } from '@/styles/tokens/breakpoints'

export type BreakpointName = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'wide' | 'ultrawide'

export interface BreakpointState {
  /** Current breakpoint name */
  breakpoint: BreakpointName
  /** Current viewport width in pixels */
  width: number
  /** Convenience booleans */
  isMobile: boolean
  isTablet: boolean
  isLaptop: boolean
  isDesktop: boolean
  isWide: boolean
  isUltrawide: boolean
  /** Is at least tablet (≥768px)? */
  isAtLeastTablet: boolean
  /** Is at least laptop (≥1024px)? */
  isAtLeastLaptop: boolean
  /** Is at least desktop (≥1280px)? */
  isAtLeastDesktop: boolean
}

function resolveBreakpoint(width: number): BreakpointName {
  if (width >= breakpointValues.ultrawide) return 'ultrawide'
  if (width >= breakpointValues.wide) return 'wide'
  if (width >= breakpointValues.desktop) return 'desktop'
  if (width >= breakpointValues.laptop) return 'laptop'
  if (width >= breakpointValues.tablet) return 'tablet'
  return 'mobile'
}

function buildState(width: number): BreakpointState {
  const breakpoint = resolveBreakpoint(width)
  return {
    breakpoint,
    width,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isLaptop: breakpoint === 'laptop',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
    isUltrawide: breakpoint === 'ultrawide',
    isAtLeastTablet: width >= breakpointValues.tablet,
    isAtLeastLaptop: width >= breakpointValues.laptop,
    isAtLeastDesktop: width >= breakpointValues.desktop,
  }
}

// SSR-safe initial state (assume desktop to avoid layout flash)
const SSR_WIDTH = 1280

/**
 * Returns the current breakpoint name and convenience booleans.
 * SSR-safe: uses 1280px (desktop) as server default.
 * Updates on resize with requestAnimationFrame debounce.
 */
export function useBreakpoint(): BreakpointState {
  const [state, setState] = useState<BreakpointState>(() => buildState(SSR_WIDTH))

  useEffect(() => {
    if (typeof window === 'undefined') return

    let rafId: number

    const handleResize = (): void => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setState(buildState(window.innerWidth))
      })
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Read initial value via the RAF pattern to stay consistent
    handleResize()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return state
}
