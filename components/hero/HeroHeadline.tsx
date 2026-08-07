import { forwardRef } from 'react'

export interface HeroHeadlineRefs {
  words: HTMLDivElement[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface HeroHeadlineProps {}

/**
 * Animated H1 Headline for the Hero scene.
 * Text is pre-split into words to allow GSAP yPercent clip reveal without requiring SplitText plugin.
 */
export const HeroHeadline = forwardRef<HeroHeadlineRefs, HeroHeadlineProps>((_props, ref) => {
  const lines = ['EVERY LEG', 'OF THE', 'JOURNEY']

  let wordIndexCount = 0

  return (
    <h1 className="mb-6 leading-[0.9] font-black tracking-[var(--tracking-tightest)] text-[var(--text-display-2xl)] text-white uppercase">
      {lines.map((line, lineIndex) => (
        <div className="flex flex-wrap gap-x-[0.25em]" key={lineIndex}>
          {line.split(' ').map((word) => {
            const currentIndex = wordIndexCount++
            return (
              <div className="inline-mask" key={currentIndex}>
                <div
                  className="will-transform origin-bottom"
                  ref={(_el) => {
                    if (ref && typeof ref !== 'function' && _el) {
                      ref.current = ref.current || { words: [] }
                      ref.current.words[currentIndex] = _el
                    }
                  }}
                >
                  {word}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </h1>
  )
})

HeroHeadline.displayName = 'HeroHeadline'
