'use client';

import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Eye, EyeOff, RotateCw } from 'lucide-react';

export const HeroScene: React.FC = () => {
  const [speed, setSpeed] = useState<number>(1.0);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-between px-6 sm:px-12 lg:px-20 pt-32 pb-16 text-left select-none overflow-hidden"
    >
      {/* Deep Space Background ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(244,83,0,0.08) 0%, rgba(0,22,203,0.06) 50%, transparent 75%)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Statement & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start z-20">
          
          {/* Tag Line */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold">
              ONE OPERATOR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f45300]" />
          </div>

          {/* 3-Line Giant Bold Headline Matching Reference Video Exactly */}
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-bold tracking-tight text-white leading-[0.88] uppercase mb-8">
            EVERY<br />
            LEG OF THE<br />
            JOURNEY
          </h1>

          {/* Subtext */}
          <p className="max-w-lg text-base sm:text-lg text-white/75 font-normal leading-relaxed mb-10">
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
              className="px-8 py-3.5 rounded-full border border-white/25 bg-black/40 backdrop-blur-md text-white font-heading font-medium text-sm tracking-tight transition-all duration-300 hover:bg-white/10 hover:border-white/50 active:scale-95"
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

        {/* Right Column: Globe Frame & Dual Atmosphere Halos */}
        <div className="lg:col-span-5 relative flex items-center justify-center pointer-events-none">
          {/* Layered Atmosphere Halos hugging the 3D globe circumference */}
          <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] flex items-center justify-center">
            <div className="home-hero-globe-shadow-grp">
              <div className="home-hero-globe-shadow orange" />
              <div className="home-hero-globe-shadow blue" />
              <div className="home-hero-globe-shadow blue-plus" />
              <div className="home-hero-globe-shadow orange-plus" />
              <div className="home-hero-black-overlap" />
            </div>
          </div>
        </div>

      </div>

      {/* Pinned Bottom-Right Controls (Unobtrusive & Clean matching original site) */}
      <div className="fixed bottom-6 right-6 z-40 pointer-events-auto hidden sm:flex items-center gap-2.5">
        {/* Speed Slider Capsule */}
        <div className="px-3.5 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center gap-2 text-white shadow-2xl">
          <RotateCw className="w-3.5 h-3.5 text-[#f45300]" />
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-16 h-1 accent-[#f45300] cursor-pointer"
            aria-label="Globe rotation speed"
          />
          <span className="font-mono text-[11px] text-white/80 w-6">
            {speed.toFixed(1)}×
          </span>
        </div>

        {/* Label Toggle Pill */}
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:border-white/30 transition-all shadow-2xl"
          aria-label="Toggle Globe Port Labels"
        >
          {showLabels ? <Eye className="w-3.5 h-3.5 text-[#f45300]" /> : <EyeOff className="w-3.5 h-3.5 text-white/50" />}
        </button>
      </div>
    </section>
  );
};
