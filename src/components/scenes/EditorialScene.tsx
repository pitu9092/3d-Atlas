'use client';

import React from 'react';
import { Cpu, Server, Zap, Globe2 } from 'lucide-react';

export const EditorialScene: React.FC = () => {
  return (
    <section
      id="vision"
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 py-24 max-w-6xl mx-auto"
    >
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Section Identifier */}
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-cyan-400" />
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.25em]">
            02 // EDITORIAL VISION
          </span>
        </div>

        {/* Big Editorial Statement */}
        <div className="max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.12] tracking-tight">
            The world does not sleep.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-400">
              It computes.
            </span>
          </h2>

          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-slate-300/80 font-light leading-relaxed max-w-3xl">
            Over 120,000 planetary vectors traversing the stratosphere at the speed of light. We link semiconductor fabrication lines, quantum cloud datacenters, and automated cargo vessels into a single, synchronized telemetry pulse.
          </p>
        </div>

        {/* Feature telemetry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 group hover:border-cyan-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg tracking-tight">Spherical Topology</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Full 360-degree real-time geodesic routing avoiding ionospheric interference and geo-fenced bottlenecks.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 group hover:border-emerald-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg tracking-tight">Zero-Jitter Optical Sync</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Sub-millisecond inter-satellite laser links transferring petabytes across continental divides effortlessly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3 group hover:border-blue-400/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg tracking-tight">Autonomous Dispatch</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Self-healing routing algorithms dynamically re-routing air, sea, and fiber traffic around global storm corridors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
