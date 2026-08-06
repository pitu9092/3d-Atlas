/**
 * @file app/not-found.tsx
 * @description 404 Not Found page — shell only.
 * Full implementation in a later phase.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>404</h1>
      <p style={{ opacity: 0.6 }}>Page not found</p>
    </main>
  )
}
