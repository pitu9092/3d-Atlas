'use client'

/**
 * @file providers/ScrollProvider.tsx
 * @description Lenis smooth scroll context provider for 3D Atlas.
 *
 * Derived from: docs/engineering/08_ScrollEngine.md
 *               docs/engineering/25_FinalArchitecture.md
 *               docs/motion-blueprint/05_LenisBlueprint.md
 *               lib/lenis.ts (Lenis configuration)
 *
 * Architecture rules (from docs):
 *   - ONE Lenis instance (singleton) — multiple instances conflict
 *   - ONE GSAP ticker — single RAF loop for Lenis + GSAP
 *   - lenis.on('scroll', ScrollTrigger.update) for ST integration
 *   - Stop Lenis on tab hidden, resume on tab visible
 *   - Destroy Lenis on unmount to prevent memory leaks
 *
 * Lenis config (from docs/engineering/25_FinalArchitecture.md):
 *   duration: 1.2, easing: quartOut, smoothWheel: true, smoothTouch: false
 *
 * Usage:
 *   const { lenis, scrollY, direction } = useScroll()
 *   lenis?.scrollTo('#section', { offset: -80 })
 */

import type Lenis from 'lenis'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

// ─── Scroll State ─────────────────────────────────────────────────────────────

export interface ScrollState {
  /** Current scroll Y position */
  scrollY: number
  /** Scroll direction: 1 = down, -1 = up, 0 = idle */
  direction: 1 | -1 | 0
  /** Scroll progress: 0–1 (page top to bottom) */
  progress: number
  /** Current scroll velocity */
  velocity: number
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ScrollContextValue {
  /** The Lenis smooth scroll instance (null until mounted) */
  lenis: Lenis | null
  /** Current scroll state */
  scroll: ScrollState
  /** Manually stop smooth scroll (e.g. during loading) */
  stop: () => void
  /** Resume smooth scroll */
  start: () => void
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ScrollProviderProps {
  children: ReactNode
}

const DEFAULT_SCROLL_STATE: ScrollState = {
  scrollY: 0,
  direction: 0,
  progress: 0,
  velocity: 0,
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  // Track lenis as state so consumers re-render when it's ready
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)
  const [scroll, setScroll] = useState<ScrollState>(DEFAULT_SCROLL_STATE)

  useEffect(() => {
    let cleanupFn: (() => void) | undefined

    const init = async (): Promise<() => void> => {
      const { createLenisInstance } = await import('@/lib/lenis')
      const { gsap, ScrollTrigger } = await import('@/lib/gsap')
      const { globalEventBus } = await import('@/engine/events')

      const lenis = createLenisInstance()
      lenisRef.current = lenis
      setLenisInstance(lenis)

      // ── Lock scroll until loader completes ──────────────────────────
      // Start Lenis in stopped state so the user cannot scroll during loading.
      lenis.stop()

      // Unlock scroll when the loader emits 'loader:hidden'
      const onLoaderHidden = () => {
        lenis.start()
        // Refresh ScrollTrigger after content is visible
        ScrollTrigger.refresh()
      }
      globalEventBus.on('loader:hidden', onLoaderHidden)

      // ── Single RAF loop: GSAP ticker drives Lenis ─────────────────
      // From docs: gsap.ticker.add((t) => lenis.raf(t * 1000))
      const tickerCallback = (time: number): void => {
        lenis.raf(time * 1000)
      }

      gsap.ticker.add(tickerCallback)
      // From docs: gsap.ticker.lagSmoothing(0)
      gsap.ticker.lagSmoothing(0)

      // ── Lenis → ScrollTrigger integration ────────────────────────
      // From docs: lenis.on('scroll', ScrollTrigger.update)
      lenis.on('scroll', ScrollTrigger.update)

      // ── Track scroll state for consumers ─────────────────────────
      lenis.on(
        'scroll',
        (e: { scroll: number; direction: number; progress: number; velocity: number }) => {
          setScroll({
            scrollY: e.scroll,
            direction: e.direction as 1 | -1 | 0,
            progress: e.progress,
            velocity: e.velocity,
          })
        },
      )

      // ── Pause on hidden tab, resume on visible ────────────────────
      const handleVisibility = (): void => {
        if (document.hidden) {
          lenis.stop()
        } else {
          lenis.start()
        }
      }

      document.addEventListener('visibilitychange', handleVisibility)

      // ── Return cleanup function ───────────────────────────────────
      return () => {
        globalEventBus.off('loader:hidden', onLoaderHidden)
        gsap.ticker.remove(tickerCallback)
        document.removeEventListener('visibilitychange', handleVisibility)
        lenis.destroy()
        lenisRef.current = null
        setLenisInstance(null)
      }
    }

    init()
      .then((fn) => {
        cleanupFn = fn
      })
      .catch(() => {
        // Scroll init failed — graceful degradation (native scroll)
      })

    return () => {
      cleanupFn?.()
    }
  }, [])

  const stop = useCallback((): void => {
    lenisRef.current?.stop()
  }, [])

  const start = useCallback((): void => {
    lenisRef.current?.start()
  }, [])

  const value = useMemo<ScrollContextValue>(
    () => ({
      lenis: lenisInstance,
      scroll,
      stop,
      start,
    }),
    [lenisInstance, scroll, stop, start],
  )

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the Lenis scroll context.
 * Must be used within <ScrollProvider>.
 */
export function useScroll(): ScrollContextValue {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}
