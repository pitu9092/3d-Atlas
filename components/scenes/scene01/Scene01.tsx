'use client'

/**
 * @file components/scenes/scene01/Scene01.tsx
 * @description Root component for Scene 01 — Atmosphere Transition.
 *
 * Architecture per reference docs:
 *   - Scroll range: 150vh → 200vh (immediately follows Hero's 150vh)
 *   - Section height: 50vh (SCENE01_SCROLL_VH)
 *   - No sticky pin — this is a standard scroll-driven section
 *   - The sticky hero ends at 150vh; this section scrolls naturally above it
 *   - Background transitions from black (#0a0a0a) → electric blue → off-white
 *
 * Engine integration:
 *   - scene01Manager (engine/scenes/Scene01Manager.ts) owns the ScrollTrigger
 *   - This component wires up DOM refs, registers the scene, and handles cleanup
 *   - React state is driven by Scene01Controller, which listens to globalEventBus
 *
 * Scene registration:
 *   The scene is registered with SceneManager.registry on mount (if SceneManager
 *   is available via context). Fallback: scene01Manager is self-contained and
 *   works without SceneManager registration for this phase.
 */

import { useEffect, useMemo, useRef, useState } from 'react'

import { scene01Manager } from '@/engine/scenes/Scene01Manager'
import { useAnimation } from '@/providers/AnimationProvider'

import { Scene01Content } from './Scene01Content'
import { Scene01Controller } from './Scene01Controller'
import { Scene01Effects, type Scene01EffectsRefs } from './Scene01Effects'
import { Scene01Overlay } from './Scene01Overlay'
import { createInitialScene01State, type Scene01StateValue } from './Scene01State'
import { SCENE01_COLORS, SCENE01_SCROLL_VH } from './Scene01Timeline'

export function Scene01() {
  const { motionPreferences, isGSAPReady } = useAnimation()

  // Local React state driven by Scene01Controller via callbacks
  const [sceneState, setSceneState] = useState<Scene01StateValue>(createInitialScene01State())

  // DOM refs wired to engine manager
  const sectionRef = useRef<HTMLElement>(null)
  const effectsRefs = useRef<Scene01EffectsRefs>({ atmosphereBand: null })

  // Controller (stable reference via useMemo — avoids ref.current access during render)
  const controller = useMemo(
    () =>
      new Scene01Controller({
        onStateChange: (newState) => setSceneState(newState),
      }),
    [],
  )

  useEffect(() => {
    controller.mount()
    return () => controller.dispose()
  }, [controller])

  // ── Wire engine manager once GSAP is ready and DOM refs are available ──────
  useEffect(() => {
    if (!isGSAPReady || !sectionRef.current || !effectsRefs.current.atmosphereBand) return

    // Register DOM refs with the engine manager
    scene01Manager.setTriggerElement(sectionRef.current)
    scene01Manager.setOverlayElement(effectsRefs.current.atmosphereBand)

    // Execute the scene lifecycle
    void (async () => {
      await scene01Manager.load()
      scene01Manager.mount()
      await scene01Manager.enter()
      controller.setInitialized()
    })()

    return () => {
      void scene01Manager.exit().then(() => scene01Manager.unmount())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGSAPReady])

  // ── Re-build timeline when reducedMotion changes ────────────────────────────
  useEffect(() => {
    if (!sceneState.isInitialized) return
    scene01Manager.buildScrollTimeline(motionPreferences.reducedMotion)
  }, [motionPreferences.reducedMotion, sceneState.isInitialized])

  return (
    <section
      aria-label="Atmosphere Transition"
      className="relative w-full overflow-hidden"
      ref={sectionRef}
      style={{
        // Height drives the scroll budget for this section.
        // 50vh means the user has 50vh of scroll to drive the atmosphere animation.
        height: `${SCENE01_SCROLL_VH}vh`,
        // Background gradient transitions from hero black → off-white
        background: `linear-gradient(to bottom, ${SCENE01_COLORS.spaceBlack} 0%, ${SCENE01_COLORS.offWhite} 100%)`,
      }}
    >
      {/* 3D Canvas slot (no-op for Scene 01) */}
      {/* Scene01Canvas is null, no render needed */}

      {/* Atmosphere visual effects (the animated blue glow) */}
      <Scene01Effects ref={effectsRefs} />

      {/* DOM Overlay (empty for Scene 01, kept for architectural parity) */}
      <Scene01Overlay>
        <Scene01Content />
      </Scene01Overlay>
    </section>
  )
}
