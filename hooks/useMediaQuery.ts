'use client'

/**
 * @file hooks/useMediaQuery.ts
 * @description Generic media query hook for 3D Atlas.
 *
 * SSR-safe: returns false on server, subscribes to changes on client.
 * Used by useBreakpoint, useReducedMotion, and any custom media condition.
 *
 * Usage:
 *   const isWide = useMediaQuery('(min-width: 1440px)')
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */

import { useEffect, useState } from 'react'

/**
 * Returns whether the given CSS media query currently matches.
 * Safe for SSR — returns `false` until the client mounts.
 *
 * @param query — CSS media query string e.g. '(min-width: 768px)'
 * @param defaultValue — value to use before hydration (default: false)
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState<boolean>(defaultValue)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)

    // Subscribe to changes first (before reading initial value)
    // to avoid a race condition between subscription and initial read
    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches)
    }

    mediaQueryList.addEventListener('change', handler)

    // Sync to current value via the event callback pattern
    // This fires handler with a synthetic event to avoid direct setState in effect
    if (mediaQueryList.matches !== defaultValue) {
      handler({ matches: mediaQueryList.matches } as MediaQueryListEvent)
    }

    return () => {
      mediaQueryList.removeEventListener('change', handler)
    }
  }, [query, defaultValue])

  return matches
}
