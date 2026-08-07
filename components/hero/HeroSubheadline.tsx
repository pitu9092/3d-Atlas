import { forwardRef } from 'react'

export interface HeroSubheadlineRefs {
  eyebrow: HTMLParagraphElement | null
  body: HTMLParagraphElement | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroSubheadlineProps {}

export const HeroSubheadline = forwardRef<HeroSubheadlineRefs, HeroSubheadlineProps>(
  (_props, ref) => {
    return (
      <div
        className="flex flex-col gap-4"
        ref={(_el) => {
          if (ref && typeof ref !== 'function') {
            ref.current = ref.current || { eyebrow: null, body: null }
          }
        }}
      >
        {/* Eyebrow Label */}
        <p
          className="font-medium tracking-[var(--tracking-widest)] text-[var(--color-accent-400)] text-[var(--text-xs)] uppercase md:text-[var(--text-sm)]"
          ref={(_el) => {
            if (ref && typeof ref !== 'function') {
              ref.current = ref.current || { eyebrow: null, body: null }
              ref.current.eyebrow = _el
            }
          }}
        >
          ONE OPERATOR
        </p>

        {/* Body Copy */}
        <p
          className="max-w-[480px] leading-[var(--leading-loose)] text-[var(--color-text-200)] text-[var(--text-base)]"
          ref={(_el) => {
            if (ref && typeof ref !== 'function') {
              ref.current = ref.current || { eyebrow: null, body: null }
              ref.current.body = _el
            }
          }}
        >
          We orchestrate complex global supply chains with precision, scale, and uncompromising
          reliability. Seamless integration from end to end.
        </p>
      </div>
    )
  },
)

HeroSubheadline.displayName = 'HeroSubheadline'
