import { forwardRef } from 'react'

export interface HeroCTARefs {
  buttons: HTMLButtonElement[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroCTAProps {}

export const HeroCTA = forwardRef<HeroCTARefs, HeroCTAProps>((_props, ref) => {
  return (
    <div
      className="mt-12 flex flex-wrap items-center gap-8"
      ref={(_el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { buttons: [] }
        }
      }}
    >
      <button
        className="group relative overflow-hidden rounded-full bg-[var(--color-text-50)] px-10 py-4 font-semibold tracking-[var(--tracking-wide)] text-[var(--color-background-900)] text-[var(--text-sm)] shadow-lg transition-all duration-500 ease-out hover:scale-105 hover:shadow-[0_0_32px_rgba(255,255,255,0.3)] focus-visible:ring-2 focus-visible:ring-[var(--color-text-50)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background-900)] focus-visible:outline-none active:scale-95"
        ref={(_el) => {
          if (ref && typeof ref !== 'function' && _el) {
            ref.current = ref.current || { buttons: [] }
            ref.current.buttons[0] = _el
          }
        }}
      >
        <span className="relative z-10">EXPLORE LOGISTICS</span>
        <div className="absolute inset-0 z-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <button
        className="group relative flex items-center gap-3 font-semibold tracking-[var(--tracking-wider)] text-[var(--color-text-200)] text-[var(--text-sm)] transition-colors duration-300 hover:text-[var(--color-text-50)] focus-visible:outline-none"
        ref={(_el) => {
          if (ref && typeof ref !== 'function' && _el) {
            ref.current = ref.current || { buttons: [] }
            ref.current.buttons[1] = _el
          }
        }}
      >
        <span className="relative pb-1">
          OUR SERVICES
          {/* Animated underline */}
          <span className="absolute right-0 bottom-0 h-[2px] w-0 bg-[var(--color-accent-500)] transition-all duration-300 ease-out group-hover:right-auto group-hover:left-0 group-hover:w-full" />
        </span>
        <svg
          className="h-4 w-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M14 5l7 7m0 0l-7 7m7-7H3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
    </div>
  )
})

HeroCTA.displayName = 'HeroCTA'
