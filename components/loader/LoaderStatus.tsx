import { forwardRef } from 'react'

interface LoaderStatusProps {
  currentItem: string | null
  phase: string
}

/**
 * Displays the current loading status and asset name.
 */
export const LoaderStatus = forwardRef<HTMLDivElement, LoaderStatusProps>(
  ({ currentItem, phase }, ref) => {
    // Format the text based on phase
    const statusText =
      phase === 'idle'
        ? 'INITIALIZING'
        : phase === 'completing' || phase === 'complete'
          ? 'READY'
          : currentItem
            ? `LOADING: ${currentItem.toUpperCase()}`
            : 'LOADING ASSETS'

    return (
      <div
        className="will-transform relative z-10 mt-6 flex h-6 items-center justify-center opacity-0"
        ref={ref}
      >
        <span className="max-w-[300px] truncate font-mono tracking-widest text-[var(--color-text-500)] text-[var(--text-xs)] uppercase">
          {statusText}
        </span>
      </div>
    )
  },
)

LoaderStatus.displayName = 'LoaderStatus'
