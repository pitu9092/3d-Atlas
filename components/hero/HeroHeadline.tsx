import { forwardRef } from 'react'

export interface HeroHeadlineRefs {
  lines: HTMLDivElement[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroHeadlineProps {}

/**
 * Animated H1 Headline for the Hero scene.
 * Text is pre-split into lines to allow GSAP yPercent clip reveal without requiring SplitText plugin.
 */
export const HeroHeadline = forwardRef<HeroHeadlineRefs, HeroHeadlineProps>((_props, ref) => {
  const lines = ['EVERY LEG', 'OF THE', 'JOURNEY']

  return (
    <h1
      className="mb-6 leading-none font-black tracking-[var(--tracking-tightest)] text-[var(--text-display-2xl)] text-white uppercase"
      ref={(_el) => {
        if (ref && typeof ref !== 'function') {
          ref.current = ref.current || { lines: [] }
        }
      }}
    >
      {lines.map((text, i) => (
        <div className="overflow-hidden" key={i}>
          <div
            className="will-transform origin-bottom"
            ref={(_el) => {
              if (ref && typeof ref !== 'function' && _el) {
                ref.current = ref.current || { lines: [] }
                ref.current.lines[i] = _el
              }
            }}
          >
            {text}
          </div>
        </div>
      ))}
    </h1>
  )
})

HeroHeadline.displayName = 'HeroHeadline'
