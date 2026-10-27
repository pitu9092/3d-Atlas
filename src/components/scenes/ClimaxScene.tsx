'use client';

import React from 'react';
import { ArrowRight, Globe, Lock, Cpu, Sparkles } from 'lucide-react';

export const ClimaxScene: React.FC = () => {
  return (
    <footer id="footer" className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-4 md:px-12 max-w-6xl mx-auto">
      
      {/* Climax CTA Section */}
      <div className="relative glass-panel p-8 sm:p-14 rounded-3xl border border-cyan-500/30 overflow-hidden text-center my-auto">
        {/* Glowing backdrop halo */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-950/40 text-cyan-300 font-mono text-[11px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>05 // SYSTEM INITIATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Command the Planetary Grid.
          </h2>

          <p className="text-base sm:text-lg text-slate-300/80 font-light leading-relaxed">
            Integrate your enterprise logistics fleet, satellite constellations, or distributed cloud datacenters into the 3D Atlas real-time intelligence network.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 w-full justify-center">
            <button
              onClick={() => alert('Atlas Orbital Access: System initialized successfully.')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-cyan-400 text-black font-bold text-sm tracking-tight transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(56,189,248,0.8)] active:scale-95 flex items-center justify-center gap-2 group"
            >
              <span>Initialize System Access</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border border-white/10 text-white font-semibold text-sm tracking-tight transition-all duration-300 hover:bg-white/10 active:scale-95"
            >
              Back to Orbit Core
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400 mt-4">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 Type II Certified
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Sub-15ms Edge Telemetry
            </span>
            <span>&bull;</span>
            <span>Zero Data Ingress Fee</span>
          </div>
        </div>
      </div>

      {/* Production Agency Footer Bar */}
      <div className="pt-12 mt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-slate-400">
        
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">3D ATLAS // CORE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">GLOBAL OPERATIONS ACTIVE</span>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <a href="#hero" className="hover:text-cyan-400 transition-colors">Overview</a>
          <a href="#vision" className="hover:text-cyan-400 transition-colors">Vision</a>
          <a href="#network" className="hover:text-cyan-400 transition-colors">Logistics</a>
          <a href="#command" className="hover:text-cyan-400 transition-colors">HUD</a>
        </div>

        <div className="text-[11px] text-slate-500 text-center md:text-right">
          &copy; 2026 3D ATLAS LABS. PIXEL-PERFECT WEBGL ENGINE.
        </div>

      </div>

    </footer>
  );
};
