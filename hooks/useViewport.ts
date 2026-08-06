'use client'

/**
 * @file hooks/useViewport.ts
 * @description Viewport dimension hook for 3D Atlas.
 *
 * Provides accurate viewport width/height for use in:
 *   - Three.js canvas sizing
 *   - GSAP viewport-relative animations
 *   - Responsive layout calculations
 *
 * Usage:
 *   const { width, height, aspect } = useViewport()
 *   // Use aspect for Three.js camera aspect ratio
 */

import { useEffect, useState } from 'react'

export interface ViewportState {
  /** Viewport width in pixels */
  width: number
  /** Viewport height in pixels */
  height: number
  /** width / height ratio (useful for Three.js PerspectiveCamera) */
  aspect: number
  /** Device pixel ratio (capped at 2 for performance budget compliance) */
  dpr: number
  /** Visual viewport width (may differ on mobile with on-screen keyboard) */
  visualWidth: number
  /** Visual viewport height */
  visualHeight: number
  /** Is in portrait orientation? */
  isPortrait: boolean
}

function getViewportState(): ViewportState {
  const width = window.innerWidth
  const height = window.innerHeight
  const visualWidth = window.visualViewport?.width ?? width
  const visualHeight = window.visualViewport?.height ?? height

  return {
    width,
    height,
    aspect: width / height,
    // Cap DPR at 2.0 per performance budget (docs/engineering/18_PerformanceBudget.md)
    dpr: Math.min(window.devicePixelRatio ?? 1, 2),
    visualWidth,
    visualHeight,
    isPortrait: height > width,
  }
}

const SSR_STATE: ViewportState = {
  width: 1280,
  height: 800,
  aspect: 1280 / 800,
  dpr: 1,
  visualWidth: 1280,
  visualHeight: 800,
  isPortrait: false,
}

/**
 * Returns current viewport dimensions with DPR.
 * SSR-safe: returns 1280×800 desktop default on server.
 * Updates on resize and visualViewport change.
 *
 * DPR is capped at 2.0 per the project performance budget:
 * docs/engineering/18_PerformanceBudget.md
 */
export function useViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>(SSR_STATE)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let rafId: number

    const update = (): void => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setState(getViewportState())
      })
    }

    window.addEventListener('resize', update, { passive: true })
    window.visualViewport?.addEventListener('resize', update)

    // Initial read via the RAF update path (avoids synchronous setState in effect)
    update()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [])

  return state
}
