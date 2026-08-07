import type { ReactNode } from 'react'

interface LoaderOverlayProps {
  children: ReactNode
}

/**
 * Full-screen overlay container for the cinematic loader.
 * Positioned on top of everything (`z-index: 400`).
 * Disables pointer events to prevent interaction during loading.
 */
export function LoaderOverlay({ children }: LoaderOverlayProps) {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="no-select fixed inset-0 z-[var(--z-loader)] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-background-900)] text-[var(--color-text-50)]"
      style={{ pointerEvents: 'none' }}
    >
      {children}
    </div>
  )
}
