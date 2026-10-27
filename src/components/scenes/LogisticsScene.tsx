'use client';

import React, { useState } from 'react';
import { GLOBAL_HUBS, ACTIVE_ARCS } from '@/constants/hubs';
import { HubNode } from '@/types';
import { Plane, Activity, Signal, Navigation2 } from 'lucide-react';

export const LogisticsScene: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<HubNode>(GLOBAL_HUBS[0]);

  return (
    <section
      id="network"
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 py-24 max-w-6xl mx-auto"
    >
      <div className="flex flex-col gap-8">
        {/* Section Identifier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-cyan-400" />
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.25em]">
              03 // GLOBAL LOGISTICS MATRIX
            </span>
          </div>
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE ORBITAL ARCS: {ACTIVE_ARCS.length}
          </span>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Intercontinental{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              Logistics Trajectories.
            </span>
          </h2>
          <p className="mt-4 text-slate-300/80 font-light text-base sm:text-lg leading-relaxed">
            Every glowing arc on the planetary surface represents high-speed supply routes and real-time data packets traversing intermodal conduits across continents.
          </p>
        </div>

        {/* Hub Selector and Detail Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          
          {/* Hub Selection Column */}
          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
              Active Telemetry Stations:
            </span>
            {GLOBAL_HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Navigation2 className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-sm font-semibold text-white">{hub.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{hub.code} &bull; {hub.country}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs text-emerald-400">{hub.pingMs}ms</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hub Expanded Inspector Panel */}
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-cyan-500/30 relative overflow-hidden">
            {/* Diffuse background ambient light */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Selected Terminal Readout
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-0.5">{selectedHub.name}</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-semibold">
                  STATUS: {selectedHub.status}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Coordinates</div>
                  <div className="text-xs font-mono text-white mt-1">
                    {selectedHub.lat.toFixed(2)}°N, {selectedHub.lon.toFixed(2)}°E
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Network Ping</div>
                  <div className="text-xs font-mono text-emerald-400 mt-1 flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    {selectedHub.pingMs} ms (Ultra-low)
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Active Shipments</div>
                  <div className="text-xs font-mono text-white mt-1 flex items-center gap-1">
                    <Plane className="w-3 h-3 text-cyan-400" />
                    {selectedHub.activeShipments.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Bandwidth</div>
                  <div className="text-xs font-mono text-cyan-400 mt-1">
                    {selectedHub.bandwidthGbps} Gbps
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300/80 font-light leading-relaxed">
                Primary gateway directing trans-oceanic freight corridors. Synchronized with orbital GPS satellites and maritime AIS transponders every 250 milliseconds.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>ENCRYPTION: QUANTUM 512-BIT</span>
              <span className="text-cyan-400">AUTONOMOUS DISPATCH ENABLED</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
