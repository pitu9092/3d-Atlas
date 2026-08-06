/**
 * @file lib/core/env.ts
 * @description Centralized environment variable validation and typed access.
 *
 * Requirements met:
 * - Validate
 * - Type-safe
 * - Fallback values
 * - Required & Optional variables
 * - Server & Client separation
 * - Development & Production flags
 */

import { z } from 'zod'

// ─── Client Schema ────────────────────────────────────────────────────────────
// Must start with NEXT_PUBLIC_ to be exposed to the browser

const clientSchema = z.object({
  NEXT_PUBLIC_ENABLE_DEBUG: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_STATS: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_HELPERS: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_WIREFRAME: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_FPS_METER: z.string().optional().default('false'),
  NEXT_PUBLIC_FORCE_REDUCED_MOTION: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_EXPERIMENTAL: z.string().optional().default('false'),
})

// ─── Server Schema ────────────────────────────────────────────────────────────
// Only accessible on the server

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Add secure server variables here (e.g., API keys, database URLs)
})

// ─── Validation ───────────────────────────────────────────────────────────────

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG,
  NEXT_PUBLIC_ENABLE_STATS: process.env.NEXT_PUBLIC_ENABLE_STATS,
  NEXT_PUBLIC_ENABLE_HELPERS: process.env.NEXT_PUBLIC_ENABLE_HELPERS,
  NEXT_PUBLIC_ENABLE_WIREFRAME: process.env.NEXT_PUBLIC_ENABLE_WIREFRAME,
  NEXT_PUBLIC_ENABLE_FPS_METER: process.env.NEXT_PUBLIC_ENABLE_FPS_METER,
  NEXT_PUBLIC_FORCE_REDUCED_MOTION: process.env.NEXT_PUBLIC_FORCE_REDUCED_MOTION,
  NEXT_PUBLIC_ENABLE_EXPERIMENTAL: process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL,
}

const isServer = typeof window === 'undefined'

// On the server we validate both. On the client we only validate client schema.
const parsed = isServer
  ? serverSchema.merge(clientSchema).safeParse(processEnv)
  : clientSchema.safeParse(processEnv)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

// ─── Exports ──────────────────────────────────────────────────────────────────

// Type assertion is safe here because we've validated the schema
export const env = parsed.data as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>

export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'
