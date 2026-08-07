import { forwardRef } from 'react'

export interface HeroSubheadlineRefs {
  eyebrow: HTMLParagraphElement | null
  bodyWords: HTMLSpanElement[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroSubheadlineProps {}

export const HeroSubheadline = forwardRef<HeroSubheadlineRefs, HeroSubheadlineProps>(
  (_props, ref) => {
    const bodyText =
      'We orchestrate complex global supply chains with precision, scale, and uncompromising reliability. Seamless integration from end to end.'
    const words = bodyText.split(' ')

    return (
      <div className="flex flex-col gap-6">
        {/* Eyebrow Label */}
        <p
          className="font-medium tracking-[var(--tracking-wider)] text-[var(--color-accent-400)] text-[var(--text-sm)] uppercase md:text-[var(--text-base)]"
          ref={(_el) => {
            if (ref && typeof ref !== 'function') {
              ref.current = ref.current || { eyebrow: null, bodyWords: [] }
              ref.current.eyebrow = _el
            }
          }}
        >
          ONE OPERATOR
        </p>

        {/* Body Copy */}
        <p className="max-w-[500px] leading-[var(--leading-relaxed)] text-[var(--color-text-200)] text-[var(--text-lg)] md:text-[var(--text-xl)]">
          {words.map((word, i) => (
            <span className="inline-mask" key={i}>
              <span
                className="will-transform inline-block"
                ref={(_el) => {
                  if (ref && typeof ref !== 'function' && _el) {
                    ref.current = ref.current || { eyebrow: null, bodyWords: [] }
                    ref.current.bodyWords[i] = _el
                  }
                }}
              >
                {word}
                {/* Add a non-breaking space after each word except the last to preserve spacing */}
                {i < words.length - 1 ? '\u00A0' : ''}
              </span>
            </span>
          ))}
        </p>
      </div>
    )
  },
)

HeroSubheadline.displayName = 'HeroSubheadline'
