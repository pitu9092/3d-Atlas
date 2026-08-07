/**
 * @file three/canvas/EngineContext.tsx
 * @description React context exposing the EngineRuntime to R3F components.
 *
 * Purpose: Provides a typed React context so any component inside
 * <EngineProvider> can access engine managers without prop drilling.
 */

import { createContext, useContext } from 'react'

import type { EngineRuntime } from '@/engine/runtime/EngineRuntime'

// ─── Context ──────────────────────────────────────────────────────────────────

export interface EngineContextValue {
  /** The active engine runtime instance. Available after boot. */
  runtime: EngineRuntime
  /** Whether the engine has successfully booted. */
  isReady: boolean
}

export const EngineContext = createContext<EngineContextValue | null>(null)

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the engine runtime context.
 * Must be used within <EngineProvider>.
 *
 * @throws If used outside of an EngineProvider.
 */
export function useEngineContext(): EngineContextValue {
  const ctx = useContext(EngineContext)
  if (!ctx) {
    throw new Error(
      '[useEngineContext] Must be used within <EngineProvider>. ' +
        'Wrap your component tree with <EngineProvider>.',
    )
  }
  return ctx
}

/**
 * Access the EngineRuntime directly.
 * Convenience alias for `useEngineContext().runtime`.
 */
export function useEngine(): EngineRuntime {
  return useEngineContext().runtime
}
