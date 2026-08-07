/**
 * @file app/page.tsx
 * @description Home page — shell only for Phase 0.
 * Full implementation begins in Phase 2 (Layout).
 */

import { Hero } from '@/components/hero'
import { Loader } from '@/components/loader'

export default function Home() {
  return (
    <main className="relative w-full">
      <Loader />
      <Hero />
      {/* Phase 2: Feature sections */}
      {/* Phase 2: Footer */}
    </main>
  )
}
