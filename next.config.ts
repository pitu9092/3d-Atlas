import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // ─── Image Optimization ──────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Add external image domains here when needed
      // { protocol: 'https', hostname: 'example.com' },
    ],
  },

  // ─── Compiler Options ────────────────────────────────────────────────────────
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ─── Transpile Packages ──────────────────────────────────────────────────────
  // Required for Three.js and related packages
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
  ],

  // ─── Experimental ────────────────────────────────────────────────────────────
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ['gsap', 'framer-motion', 'clsx', 'class-variance-authority'],
  },

  // ─── Headers ─────────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // Cache static 3D assets aggressively
        source: '/models/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/textures/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/hdr/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
