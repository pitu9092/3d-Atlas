'use client'

/**
 * @file providers/ThemeProvider.tsx
 * @description Theme context provider for 3D Atlas.
 *
 * Manages dark/light theme mode with:
 *   - OS preference detection (prefers-color-scheme)
 *   - localStorage persistence
 *   - SSR-safe hydration (suppresses flash)
 *   - data-theme attribute on <html> for CSS scoping
 *
 * Usage:
 *   const { theme, toggleTheme, setTheme } = useTheme()
 *
 * CSS targeting:
 *   :root { ... }            — default (dark)
 *   [data-theme="light"] { } — light overrides
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { DEFAULT_THEME } from '@/lib/design-system/theme'
import type { ThemeContextValue, ThemeMode } from '@/types/theme'

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode
  /** Override the default theme mode (useful for testing) */
  defaultTheme?: ThemeMode
  /** LocalStorage key for persistence */
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = 'atlas-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme)
  const [systemPrefersDark, setSystemPrefersDark] = useState(true)
  const [resolved, setResolved] = useState(false)

  // ── Resolve theme on mount (SSR-safe) ────────────────────────────
  // Uses a single effect for all initialisation to batch state updates
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as ThemeMode | null
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const initialTheme: ThemeMode = stored ?? (mql.matches ? 'dark' : 'light')

    // Batch state updates together (React 18+ batches these in effects)
    const handler = (e: MediaQueryListEvent): void => {
      setSystemPrefersDark(e.matches)
    }

    mql.addEventListener('change', handler)

    // Update via the event handler pattern to avoid direct setState calls
    // We call our setter via a timeout to batch with the event subscription
    const raf = requestAnimationFrame(() => {
      setSystemPrefersDark(mql.matches)
      setThemeState(initialTheme)
      setResolved(true)
    })

    return () => {
      cancelAnimationFrame(raf)
      mql.removeEventListener('change', handler)
    }
  }, [storageKey])

  // ── Apply data-theme attribute to <html> ─────────────────────────
  useEffect(() => {
    if (!resolved) return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem(storageKey, theme)
  }, [theme, resolved, storageKey])

  // ── Actions ───────────────────────────────────────────────────────
  const setTheme = useCallback((mode: ThemeMode): void => {
    setThemeState(mode)
  }, [])

  const toggleTheme = useCallback((): void => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      systemPrefersDark,
      resolved,
    }),
    [theme, toggleTheme, setTheme, systemPrefersDark, resolved],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the theme context.
 * Must be used within <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
