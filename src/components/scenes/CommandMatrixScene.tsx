'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Activity, RefreshCw, Layers } from 'lucide-react';

export const CommandMatrixScene: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([
    'SYS_BOOT: Planetary telemetry initialized [OK]',
    'SAT_LINK: 48 orbital nodes synchronized via LEO-X [OK]',
    'AIS_FEED: Maritime corridors calibrated in Indian Ocean [OK]',
    'QUANTUM_ROUTER: Latency optimized to 14.2ms [OK]',
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sampleEvents = [
      'ROUTER: Dynamic re-routing packet cluster [TYO → SFO]',
      'RADAR: Ionospheric density normal across Pacific quadrant',
      'TELEMETRY: Solar irradiance nominal on satellite bus A-3',
      'BANDWIDTH: Spike detected at London Gateway (+180 Gbps)',
      'SECURITY: Zero-knowledge encryption handshake verified',
    ];

    const logTimer = setInterval(() => {
      const randomEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLogs((prev) => [
        `[${new Date().toISOString().slice(14, 19)}] ${randomEvent}`,
        ...prev.slice(0, 4),
      ]);
    }, 4000);

    return () => clearInterval(logTimer);
  }, []);

  return (
    <section
      id="command"
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-12 py-24 max-w-6xl mx-auto"
    >
      <div className="flex flex-col gap-8">
        
        {/* Section Identifier */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[1px] bg-cyan-400" />
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.25em]">
              04 // COMMAND MATRIX HUD
            </span>
          </div>
          <div className="font-mono text-xs text-cyan-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>TIME: {utcTime || '00:00:00 UTC'}</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Planetary Operations{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400">
              HUD & Telemetry.
            </span>
          </h2>
          <p className="mt-4 text-slate-300/80 font-light text-base sm:text-lg leading-relaxed max-w-3xl">
            Live telemetric streams tracking atmospheric density, solar radiation gradients, and orbital vector velocity across every active sector.
          </p>
        </div>

        {/* Tactical HUD Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* Radar Telemetry Scope */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs uppercase text-slate-300 font-semibold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                ORBITAL SECTOR RADAR // 360° SWEEP
              </span>
              <span className="font-mono text-[11px] text-emerald-400">RANGE: 40,000 KM</span>
            </div>

            {/* Radar Circular Grid Graphic */}
            <div className="relative my-6 aspect-square max-h-56 mx-auto w-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-8 rounded-full border border-cyan-500/15" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/10" />
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/20" />

              {/* Rotating Sweep Beam */}
              <div
                className="absolute inset-0 rounded-full origin-center animate-spin"
                style={{
                  animationDuration: '4s',
                  background: 'conic-gradient(from 0deg, transparent 270deg, rgba(56,189,248,0.25) 360deg)',
                }}
              />

              {/* Blip dots */}
              <span className="absolute top-12 left-20 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="absolute bottom-16 right-16 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="absolute top-24 right-24 w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
              
              <div className="z-10 font-mono text-[10px] text-cyan-400 bg-black/60 px-2 py-1 rounded border border-cyan-400/30">
                LOCKED: 8 HUBS
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs border-t border-white/10 pt-4">
              <div>
                <div className="text-[10px] text-slate-500">APOGEE</div>
                <div className="text-white font-bold">540 KM</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">INCLINATION</div>
                <div className="text-cyan-400 font-bold">53.2°</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">PACKETS/SEC</div>
                <div className="text-emerald-400 font-bold">1.4M</div>
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Event Feed */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between border border-white/10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="font-mono text-xs uppercase text-slate-300 font-semibold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                QUANTUM DISPATCH EVENT LOG
              </span>
              <span className="font-mono text-[10px] text-slate-500">STREAMING LIVE</span>
            </div>

            {/* Terminal Log Console */}
            <div className="my-6 flex flex-col gap-3 font-mono text-xs min-h-[190px]">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    idx === 0 ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                  }`}
                >
                  <span className="text-cyan-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                INTEGRITY 100%
              </span>
              <span className="text-slate-500">BUFFER: 256 MB</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
