'use client'

/**
 * @file three/canvas/EngineProvider.tsx
 * @description Root provider that boots the engine and exposes the runtime via context.
 *
 * Purpose: Provides the EngineRuntime to the entire component tree.
 * Responsibilities:
 *   - Call Bootstrap.boot() exactly once on client mount
 *   - Handle boot errors gracefully (renders children to allow fallback UI)
 *   - Call Bootstrap.shutdown() on unmount to prevent memory leaks
 *   - Expose runtime via EngineContext
 *
 * Usage:
 *   <EngineProvider>
 *     <CanvasRoot>...</CanvasRoot>
 *     {children}
 *   </EngineProvider>
 */

import { useEffect, useState, useRef, type ReactNode } from 'react'

import { Bootstrap } from '@/engine/runtime/Bootstrap'
import type { EngineRuntime } from '@/engine/runtime/EngineRuntime'
import { logger } from '@/lib/core'

import { EngineContext } from './EngineContext'

// ─── Props ────────────────────────────────────────────────────────────────────

interface EngineProviderProps {
  children: ReactNode
  /**
   * Optional fallback rendered while the engine is booting.
   * Defaults to null (invisible during boot).
   */
  fallback?: ReactNode
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function EngineProvider({ children, fallback = null }: EngineProviderProps) {
  const [runtime, setRuntime] = useState<EngineRuntime | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    Bootstrap.boot()
      .then((rt) => {
        if (!isMountedRef.current) return
        setRuntime(rt)
        setIsReady(true)
        logger.info('[EngineProvider] Runtime ready.')
      })
      .catch((error: unknown) => {
        if (!isMountedRef.current) return
        logger.error('[EngineProvider] Boot failed', error)
        setHasError(true)
      })

    return () => {
      isMountedRef.current = false
      Bootstrap.shutdown()
    }
  }, [])

  // ── Error state: render children anyway so app can show fallback UI ────
  if (hasError) {
    return <>{children}</>
  }

  // ── Booting: show optional fallback ────────────────────────────────────
  if (!runtime) {
    return <>{fallback}</>
  }

  return <EngineContext.Provider value={{ runtime, isReady }}>{children}</EngineContext.Provider>
}
