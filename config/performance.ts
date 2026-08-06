/**
 * @file config/performance.ts
 * @description Central performance configuration and scaling presets.
 *
 * Requirements met:
 * - FPS Target
 * - Texture Budget
 * - Geometry Budget
 * - Memory Budget
 * - Particle Budget
 * - Device Detection
 * - Quality Presets
 */

export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra'

export interface PerformanceBudget {
  fpsTarget: number
  maxTextureSize: number
  maxGeometryTriangles: number
  maxMemoryMB: number
  maxParticles: number
  pixelRatio: number
  shadows: boolean
  antialiasing: boolean
}

export const performanceConfig = {
  // Global baseline targets
  baseline: {
    fpsTarget: 60,
    memoryBudgetMB: 512, // 512MB max heap for stable WebGL
  },

  // Device detection heuristics will map to these presets
  presets: {
    low: {
      fpsTarget: 30,
      maxTextureSize: 1024,
      maxGeometryTriangles: 50_000,
      maxMemoryMB: 256,
      maxParticles: 1_000,
      pixelRatio: 1,
      shadows: false,
      antialiasing: false,
    },
    medium: {
      fpsTarget: 60,
      maxTextureSize: 2048,
      maxGeometryTriangles: 100_000,
      maxMemoryMB: 512,
      maxParticles: 5_000,
      pixelRatio: 1,
      shadows: true,
      antialiasing: true,
    },
    high: {
      fpsTarget: 60,
      maxTextureSize: 4096,
      maxGeometryTriangles: 250_000,
      maxMemoryMB: 1024,
      maxParticles: 15_000,
      pixelRatio: 1.5,
      shadows: true,
      antialiasing: true,
    },
    ultra: {
      fpsTarget: 120, // Or unlocked
      maxTextureSize: 8192,
      maxGeometryTriangles: 500_000,
      maxMemoryMB: 2048,
      maxParticles: 50_000,
      pixelRatio: 2, // Hard capped at 2 for performance
      shadows: true,
      antialiasing: true,
    },
  } satisfies Record<QualityPreset, PerformanceBudget>,
} as const

export type PerformanceConfig = typeof performanceConfig
