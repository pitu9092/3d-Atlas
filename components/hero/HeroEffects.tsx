export function HeroEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Subtle vignette / gradient to ensure text readability against the 3D canvas if needed */}
      <div className="absolute inset-0 w-full bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent md:w-2/3" />
    </div>
  )
}
