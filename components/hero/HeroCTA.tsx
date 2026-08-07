import { forwardRef } from 'react'

export interface HeroCTARefs {
  buttons: HTMLButtonElement[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroCTAProps {}

export const HeroCTA = forwardRef<HeroCTARefs, HeroCTAProps>((_props, ref) => {
  return (
    <div
      className="mt-10 flex flex-wrap items-center gap-6"
      ref={(_el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { buttons: [] }
        }
      }}
    >
      <button
        className="rounded-full bg-white px-8 py-4 font-medium tracking-[var(--tracking-wide)] text-[var(--text-sm)] text-black transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:scale-95"
        ref={(_el) => {
          if (ref && typeof ref !== 'function' && _el) {
            ref.current = ref.current || { buttons: [] }
            ref.current.buttons[0] = _el
          }
        }}
      >
        EXPLORE LOGISTICS
      </button>

      <button
        className="group flex items-center gap-2 font-medium tracking-[var(--tracking-wide)] text-[var(--text-sm)] text-white transition-colors hover:text-[var(--color-accent-400)] focus-visible:outline-none"
        ref={(_el) => {
          if (ref && typeof ref !== 'function' && _el) {
            ref.current = ref.current || { buttons: [] }
            ref.current.buttons[1] = _el
          }
        }}
      >
        <span>OUR SERVICES</span>
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
