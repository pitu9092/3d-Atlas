'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Eye, EyeOff, RotateCw } from 'lucide-react';

export const HeroScene: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1.0);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-28 pb-16 text-left select-none overflow-hidden"
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(244,83,0,0.12) 0%, rgba(0,22,203,0.08) 50%, transparent 75%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Statement & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          
          {/* Tag Line */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold">
              ONE OPERATOR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f45300]" />
          </div>

          {/* Main Giant Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[0.94] uppercase mb-8">
            Every leg <br />
            of the journey
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-base sm:text-lg text-white/75 font-normal leading-relaxed mb-10">
            Freight forwarding, land transport, and customs brokerage, unified across APAC under one accountable team.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full bg-white text-black font-heading font-medium text-sm tracking-tight transition-all duration-300 hover:bg-[#f45300] hover:text-white hover:shadow-[0_0_25px_rgba(244,83,0,0.4)] active:scale-95 flex items-center gap-2"
            >
              <span>Talk with us</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="#services"
              className="px-8 py-3.5 rounded-full border border-white/25 text-white font-heading font-medium text-sm tracking-tight transition-all duration-300 hover:bg-white/10 hover:border-white/50 active:scale-95"
            >
              Our services
            </a>
          </div>

          {/* Scroll Cue */}
          <div className="flex items-center gap-3 mt-16 text-white/40">
            <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
              <ArrowDown className="w-3.5 h-3.5 text-[#f45300]" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-widest">
              Scroll to explore freight network
            </span>
          </div>

        </div>

        {/* Right Column: Framed 3D Globe with dual rim halo */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          {/* Framed Atmosphere Halos */}
          <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[520px] md:h-[520px] flex items-center justify-center pointer-events-none">
            {/* Top-Right Fiery Orange Atmospheric Rim */}
            <div className="home-hero-globe-shadow orange-plus" />
            
            {/* Bottom Atmospheric Deep Blue Rim */}
            <div className="home-hero-globe-shadow blue-plus" />
          </div>

          {/* Interactive Globe Widgets (Speed slider & Label toggle matching United Carriers) */}
          <div className="absolute right-0 bottom-4 pointer-events-auto flex flex-col items-center gap-3 z-20">
            
            {/* Speed Control Slider */}
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col items-center gap-2 text-white">
              <RotateCw className="w-3.5 h-3.5 text-[#f45300]" />
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-16 h-1 accent-[#f45300] cursor-pointer rotate-[-90deg] my-6"
                aria-label="Globe rotation speed"
              />
              <span className="font-mono text-[10px] text-white/80">
                {speed.toFixed(1)}×
              </span>
            </div>

            {/* Label Toggle Button */}
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:border-white/30 transition-all"
              aria-label="Toggle Globe Port Labels"
            >
              {showLabels ? <Eye className="w-4 h-4 text-[#f45300]" /> : <EyeOff className="w-4 h-4 text-white/50" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
