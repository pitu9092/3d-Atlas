export function HeroEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Rich atmospheric gradient to ensure perfect typography contrast against the 3D globe */}
      <div className="absolute inset-0 w-full bg-gradient-to-r from-[var(--color-background-900)] via-[var(--color-background-900)]/80 to-transparent md:w-3/4 lg:w-2/3" />

      {/* Top and bottom vignettes to frame the scene */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-background-900)] to-transparent opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--color-background-900)] to-transparent opacity-90" />
    </div>
  )
}
