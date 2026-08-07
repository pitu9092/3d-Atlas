'use client'

/**
 * @file three/canvas/CanvasRoot.tsx
 * @description Top-level React Three Fiber Canvas component for 3D Atlas.
 *
 * Purpose: Provides the R3F Canvas with engine-correct configuration.
 * Responsibilities:
 *   - Adaptive DPR from threeConfig
 *   - Color management (linear color space — R3F handles SRGBColorSpace on output)
 *   - PCFSoft shadow configuration from threeConfig
 *   - GSAP-ticker-controlled frameloop ('demand' or 'always' based on config)
 *   - Adaptive performance regression support
 *   - onCreated hook to configure gl renderer once
 *   - Suspension support via React Suspense wrapper
 *
 * Usage:
 *   <EngineProvider>
 *     <CanvasRoot style={{ position: 'fixed', inset: 0 }}>
 *       <RendererManager />
 *       <SceneRoot />
 *     </CanvasRoot>
 *   </EngineProvider>
 */

import { Canvas } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import { Suspense, type CSSProperties, type ReactNode } from 'react'
import * as THREE from 'three'

import { threeConfig } from '@/config/three'

// ─── Props ────────────────────────────────────────────────────────────────────

interface CanvasRootProps {
  children?: ReactNode
  /** Inline style applied to the wrapping div. */
  style?: CSSProperties
  /** CSS class applied to the wrapping div. */
  className?: string
  /**
   * Canvas fallback while children suspend.
   * Defaults to null (blank canvas).
   */
  suspenseFallback?: ReactNode
}

// ─── Canvas Root ─────────────────────────────────────────────────────────────

export function CanvasRoot({
  children,
  style,
  className,
  suspenseFallback = null,
}: CanvasRootProps) {
  const handleCreated = (state: RootState): void => {
    const { gl } = state

    // ── Color management ──────────────────────────────────────────────────
    // R3F 8.x sets outputColorSpace to SRGBColorSpace by default when linear=false.
    gl.outputColorSpace = THREE.SRGBColorSpace
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.0

    // ── Shadows ───────────────────────────────────────────────────────────
    if (threeConfig.shadows.enabled) {
      gl.shadowMap.enabled = true
      gl.shadowMap.type = THREE.PCFSoftShadowMap
    }
  }

  return (
    <Canvas
      camera={{
        far: threeConfig.canvas.camera.far,
        fov: threeConfig.canvas.camera.fov,
        manual: false,
        near: threeConfig.canvas.camera.near,
        position: threeConfig.canvas.camera.position,
      }}
      className={className}
      dpr={threeConfig.canvas.dpr}
      frameloop="always"
      gl={{
        alpha: threeConfig.canvas.gl.alpha,
        antialias: threeConfig.canvas.gl.antialias,
        powerPreference: threeConfig.canvas.gl.powerPreference as WebGLPowerPreference,
        preserveDrawingBuffer: threeConfig.canvas.gl.preserveDrawingBuffer,
      }}
      linear={false}
      performance={{ min: 0.5 }}
      shadows={threeConfig.shadows.enabled ? 'soft' : false}
      style={style}
      onCreated={handleCreated}
    >
      <Suspense fallback={suspenseFallback}>{children}</Suspense>
    </Canvas>
  )
}
