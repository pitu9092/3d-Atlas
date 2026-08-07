/**
 * @file three/canvas/CanvasProvider.tsx
 * @description Convenience wrapper that composes EngineProvider + CanvasRoot.
 *
 * Purpose: Single import that provides both the engine runtime context
 * and the R3F Canvas for standard page-level 3D use cases.
 *
 * Responsibilities:
 *   - Boots the engine via EngineProvider
 *   - Mounts the R3F Canvas via CanvasRoot
 *   - Mounts RendererManager inside the Canvas (engine frame driver)
 *   - Exposes EngineContext to all descendants
 *
 * Usage:
 *   CanvasProvider renders EngineProvider > CanvasRoot > RendererManager > children.
 */

'use client'

import { type CSSProperties, type ReactNode } from 'react'

import { CanvasRoot } from './CanvasRoot'
import { EngineProvider } from './EngineProvider'
import { RendererManager } from './RendererManager'

// ─── Props ────────────────────────────────────────────────────────────────────

interface CanvasProviderProps {
  children?: ReactNode
  style?: CSSProperties
  className?: string
  /** Shown while the engine boots. */
  loadingFallback?: ReactNode
  /** Shown while R3F children suspend. */
  suspenseFallback?: ReactNode
}

// ─── Canvas Provider ─────────────────────────────────────────────────────────

export function CanvasProvider({
  children,
  style,
  className,
  loadingFallback,
  suspenseFallback,
}: CanvasProviderProps) {
  return (
    <EngineProvider fallback={loadingFallback}>
      <CanvasRoot className={className} style={style} suspenseFallback={suspenseFallback}>
        {/* Engine frame driver — must be first child inside Canvas */}
        <RendererManager />

        {/* Scene content */}
        {children}
      </CanvasRoot>
    </EngineProvider>
  )
}
