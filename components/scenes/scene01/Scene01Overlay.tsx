'use client'

/**
 * @file components/scenes/scene01/Scene01Overlay.tsx
 * @description DOM overlay wrapper for Scene 01.
 *
 * Sits above the Canvas (z-index 10) and holds any DOM content for this scene.
 * Scene 01 currently has no DOM content (pure visual transition), but the
 * overlay is kept for architectural parity and future extension.
 */

import type { ReactNode } from 'react'

interface Scene01OverlayProps {
  children?: ReactNode
}

export function Scene01Overlay({ children }: Scene01OverlayProps) {
  if (!children) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {children}
    </div>
  )
}
