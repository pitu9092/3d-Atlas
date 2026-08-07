'use client'

/**
 * @file three/canvas/SceneRoot.tsx
 * @description R3F scene graph root component.
 *
 * Purpose: Provides the base scene structure that all 3D scene content lives within.
 * Responsibilities:
 *   - Ambient and directional lighting from threeConfig.lighting
 *   - Debug helpers (axes, grid) from featureFlags
 *   - Scene lifecycle integration via SceneManager / EventBus
 *   - Slot for scene-specific content via children
 *
 * Usage:
 *   SceneRoot renders inside CanvasRoot > RendererManager alongside SceneRoot children.
 */

import { useEffect, type ReactNode } from 'react'

import { threeConfig } from '@/config/three'
import { globalEventBus } from '@/engine/events'
import { featureFlags } from '@/lib/core/featureFlags'

// ─── Props ────────────────────────────────────────────────────────────────────

interface SceneRootProps {
  children?: ReactNode
}

// ─── Scene Root ──────────────────────────────────────────────────────────────

export function SceneRoot({ children }: SceneRootProps) {
  // ── Listen for scene lifecycle events ─────────────────────────────────────
  useEffect(() => {
    const handleTransitionStart = ({ from, to }: { from: string; to: string }): void => {
      // Could be used to trigger fade overlays, etc.
      void from
      void to
    }

    const handleTransitionComplete = ({ current }: { current: string }): void => {
      void current
    }

    globalEventBus.on('scene:transition_start', handleTransitionStart)
    globalEventBus.on('scene:transition_complete', handleTransitionComplete)

    return () => {
      globalEventBus.off('scene:transition_start', handleTransitionStart)
      globalEventBus.off('scene:transition_complete', handleTransitionComplete)
    }
  }, [])

  return (
    <>
      {/* ── Lighting from config ──────────────────────────────────────────── */}
      <ambientLight
        color={threeConfig.lighting.ambient.color}
        intensity={threeConfig.lighting.ambient.intensity}
      />

      <directionalLight
        castShadow={threeConfig.shadows.enabled}
        color={threeConfig.lighting.directional.color}
        intensity={threeConfig.lighting.directional.intensity}
        position={[5, 10, 5]}
        shadow-mapSize={[threeConfig.shadows.mapSize, threeConfig.shadows.mapSize]}
      />

      {/* ── Debug Helpers ─────────────────────────────────────────────────── */}
      {featureFlags.enableHelpers && (
        <>
          <axesHelper args={[5]} />
          <gridHelper args={[20, 20]} />
        </>
      )}

      {/* ── Scene content slot ────────────────────────────────────────────── */}
      {children}
    </>
  )
}
