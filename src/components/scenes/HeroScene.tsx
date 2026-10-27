'use client';

import React from 'react';
import { ArrowDown, Radio, Activity, Compass, ShieldCheck } from 'lucide-react';

export const HeroScene: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-32 pb-16 text-center select-none"
    >
      {/* Background Soft Diffuse Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(74,168,255,0.06) 45%, transparent 70%)',
        }}
      />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        
        {/* Top Sci-Fi Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/20 backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Global Planetary Command // V2.4
          </span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] font-sans">
          Autonomous Planetary{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 glow-text-cyan">
            Intelligence.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300/80 font-light leading-relaxed">
          Real-time orbital tracking, multi-continental logistics vectors, and high-frequency planetary telemetry visualized across an interactive 3D canvas.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <a
            href="#network"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-cyan-400 text-black font-bold text-sm tracking-tight transition-all duration-300 hover:bg-white hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] active:scale-95 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Planetary Grid</span>
          </a>
          <a
            href="#command"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-panel border border-white/10 text-white font-semibold text-sm tracking-tight transition-all duration-300 hover:bg-white/10 active:scale-95 flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Open Telemetry HUD</span>
          </a>
        </div>

        {/* Telemetry Stat Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mt-10">
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-cyan-400">8</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Orbital Hubs</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-emerald-400">14 ms</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Mean Ping</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-cyan-400">4.8 Tbps</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Throughput</span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl flex flex-col items-center">
            <span className="text-xl font-bold font-mono text-emerald-400">99.98%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Coverage</span>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="flex flex-col items-center gap-2 mt-8 animate-bounce text-slate-500">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">Scroll to Orbit</span>
          <ArrowDown className="w-4 h-4 text-cyan-400" />
        </div>

      </div>
    </section>
  );
};
