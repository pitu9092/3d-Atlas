import { useState, useEffect } from 'react'

export function useScroll() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY }
}
