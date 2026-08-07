'use client'

/**
 * @file three/canvas/RendererManager.tsx
 * @description R3F inner component that drives the engine tick and handles adaptive DPR.
 *
 * Purpose: Runs inside the R3F Canvas context to:
 *   1. Sync R3F camera to the engine camera registry
 *   2. Tick engine managers every frame via useFrame
 *   3. Adapt DPR based on PerformanceMonitor quality events
 *   4. Forward R3F size changes to the engine resize system
 *
 * NOTE: Renderer gl configuration (outputColorSpace, toneMapping, shadows) is
 * handled in CanvasRoot via the onCreated prop — this avoids react-hooks/immutability
 * violations from mutating the gl object returned by useThree().
 *
 * This component MUST be placed inside Canvas (inside the R3F context).
 * SceneRoot renders alongside RendererManager as a sibling.
 */

import { addAfterEffect, addEffect, useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

import { globalEventBus } from '@/engine/events'
import { Bootstrap } from '@/engine/runtime/Bootstrap'

// ─── Renderer Manager ────────────────────────────────────────────────────────

export function RendererManager() {
  const { camera, gl, setDpr, size } = useThree()

  // ── Sync R3F camera → engine camera registry ──────────────────────────────
  useEffect(() => {
    if (!Bootstrap.isBooted) return
    const runtime = Bootstrap.getRuntime()

    if (camera instanceof THREE.PerspectiveCamera) {
      runtime.camera.registerCamera('r3f', camera)
      runtime.camera.setActiveCamera('r3f')
    }
  }, [camera])

  // ── Forward R3F size changes → engine resize ──────────────────────────────
  useEffect(() => {
    if (!Bootstrap.isBooted) return
    const runtime = Bootstrap.getRuntime()
    const dpr = gl.getPixelRatio()
    runtime.resize(size.width, size.height, dpr)
  }, [gl, size])

  // ── Adaptive DPR based on performance quality events ─────────────────────
  useEffect(() => {
    const handleQualityChange = ({
      newQuality,
    }: {
      previousQuality: string
      newQuality: string
    }): void => {
      const dprMap: Record<string, number> = {
        low: 1,
        medium: 1,
        high: 1.5,
        ultra: 2,
      }
      setDpr(dprMap[newQuality] ?? 1)

      if (!Bootstrap.isBooted) return
      const runtime = Bootstrap.getRuntime()
      runtime.performance.fps.setTargetFPS(newQuality === 'low' ? 30 : 60)
    }

    globalEventBus.on('perf:quality_adjust', handleQualityChange)
    return () => {
      globalEventBus.off('perf:quality_adjust', handleQualityChange)
    }
  }, [setDpr])

  // ── DPR sync: engine ResizeManager → R3F DPR ─────────────────────────────
  useEffect(() => {
    const handleResize = ({
      pixelRatio,
    }: {
      width: number
      height: number
      pixelRatio: number
    }): void => {
      setDpr(pixelRatio)
    }

    globalEventBus.on('window:resize', handleResize)
    return () => {
      globalEventBus.off('window:resize', handleResize)
    }
  }, [setDpr])

  // ── Per-frame engine tick ─────────────────────────────────────────────────
  useFrame((state, delta) => {
    if (!Bootstrap.isBooted) return
    const runtime = Bootstrap.getRuntime()
    if (runtime.state !== 'running') return

    // R3F provides delta in seconds; engine managers expect milliseconds
    const deltaMs = delta * 1000
    const timeMs = state.clock.getElapsedTime() * 1000

    runtime.performance.tick(timeMs, deltaMs, 0)
    runtime.camera.tick(timeMs, deltaMs, 0)
    runtime.scene.tick(timeMs, deltaMs, 0)
  })

  // ── Pre/post render hooks for future integrations ─────────────────────────
  useEffect(() => {
    // addEffect runs before R3F renders each frame
    const removePreEffect = addEffect(() => {
      // Future: GSAP ticker sync hook, stats.js begin
    })

    // addAfterEffect runs after R3F renders
    const removePostEffect = addAfterEffect(() => {
      // Future: stats.js end, frame capture
    })

    return () => {
      removePreEffect()
      removePostEffect()
    }
  }, [])

  // Purely a side-effect component — renders nothing
  return null
}
