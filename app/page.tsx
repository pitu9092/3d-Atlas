/**
 * @file app/page.tsx
 * @description Home page — growing scroll-driven experience.
 */

import { Hero } from '@/components/hero'
import { Loader } from '@/components/loader'
import { Scene01 } from '@/components/scenes'

export default function Home() {
  return (
    <main className="relative w-full">
      <Loader />
      {/* Scene 0 (0–150vh): Hero — Globe cinematic intro */}
      <Hero />
      {/* Scene 01 (150–200vh): Atmosphere Transition */}
      <Scene01 />
      {/* Phase 10+: Editorial, Crane, Truck, Services, Ship, Aircraft, Testimonials */}
    </main>
  )
}
