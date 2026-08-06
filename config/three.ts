/**
 * @file config/three.ts
 * @description Global Three.js configuration for 3D Atlas.
 *
 * Requirements met:
 * - Renderer defaults
 * - Camera defaults
 * - Canvas defaults
 * - Lighting & Shadows defaults
 * - Pixel Ratio defaults
 * - Performance defaults
 */

import { featureFlags } from '@/lib/core/featureFlags'

export const threeConfig = {
  canvas: {
    // These apply to the R3F Canvas component
    gl: {
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    },
    camera: {
      fov: 45,
      near: 0.1,
      far: 1000,
      position: [0, 0, 5] as [number, number, number],
    },
    dpr: [1, 2] as [number, number], // min 1, max 2 for performance
  },

  shadows: {
    enabled: true,
    type: 'PCFSoftShadowMap', // Corresponds to THREE.PCFSoftShadowMap
    mapSize: 1024,
  },

  lighting: {
    ambient: {
      intensity: 0.5,
      color: '#ffffff',
    },
    directional: {
      intensity: 1.0,
      color: '#ffffff',
    },
  },

  performance: {
    // Defaults for performance degradation
    maxPixelRatio: 2,
    framerateTarget: 60,
  },

  debug: {
    showHelpers: featureFlags.enableHelpers,
    showWireframes: featureFlags.enableWireframe,
  },
} as const

export type ThreeConfig = typeof threeConfig
