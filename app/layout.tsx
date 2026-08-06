import type { Metadata, Viewport } from 'next'

import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/constants'
import { inter, outfit } from '@/lib/fonts'
import { Providers } from '@/providers'

import './globals.css'

// ─── Viewport ───────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  themeColor: '#0a0b10',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['3D', 'interactive', 'cinematic', 'webgl', 'three.js', 'scroll-driven'],
  authors: [{ name: '3D Atlas Team' }],
  creator: '3D Atlas',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ─── Layout ─────────────────────────────────────────────────────────────────

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`} lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
