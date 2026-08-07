'use client'

import { forwardRef, useEffect, useRef } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoaderParticlesProps {}

/**
 * Pure DOM/CSS ambient particle field for the loader.
 * Runs independently of Three.js to provide visual interest before the engine boots.
 * Uses performant CSS transform/opacity animations.
 */
export const LoaderParticles = forwardRef<HTMLDivElement, LoaderParticlesProps>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isReducedMotion = useReducedMotion()

  useEffect(() => {
    if (isReducedMotion || !containerRef.current) return

    const container = containerRef.current
    const particleCount = 30
    const particles: HTMLDivElement[] = []

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div')

      const size = Math.random() * 3 + 1
      const x = Math.random() * 100
      const y = Math.random() * 100

      p.className = 'absolute rounded-full bg-[var(--color-text-50)] opacity-40 will-transform'
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.left = `${x}%`
      p.style.top = `${y}%`
      p.style.boxShadow = `0 0 ${size * 2}px var(--color-glow-400)`

      // Setup animation using Web Animations API for smooth independent motion
      const duration = 10000 + Math.random() * 20000
      const delay = Math.random() * -duration

      p.animate(
        [
          { transform: `translate3d(0, 0, 0) scale(1)`, opacity: 0.1 },
          {
            transform: `translate3d(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px, 0) scale(${Math.random() + 0.5})`,
            opacity: 0.6,
            offset: 0.5,
          },
          {
            transform: `translate3d(${Math.random() * 150 - 75}px, ${Math.random() * -200 - 100}px, 0) scale(1)`,
            opacity: 0.1,
          },
        ],
        {
          duration,
          delay,
          iterations: Infinity,
          easing: 'ease-in-out',
          direction: 'alternate',
        },
      )

      container.appendChild(p)
      particles.push(p)
    }

    return () => {
      particles.forEach((p) => p.remove())
    }
  }, [isReducedMotion])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
      ref={(el) => {
        containerRef.current = el
        if (typeof ref === 'function') {
          ref(el)
        } else if (ref) {
          ref.current = el
        }
      }}
    />
  )
})

LoaderParticles.displayName = 'LoaderParticles'
