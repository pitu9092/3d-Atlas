'use client';

import React, { useState } from 'react';
import { Globe, Radio, Shield, Terminal, ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center p-4 md:p-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-4 w-full max-w-6xl px-4 py-2.5 md:px-6 md:py-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] transition-all duration-300">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30">
            <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '18s' }} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">
              3D ATLAS
            </span>
            <span className="text-[9px] text-cyan-400/80 font-mono tracking-wider -mt-1 hidden sm:block">
              GLOBAL TELEMETRY V2.4
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          <a
            href="#hero"
            className="text-[13px] font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide"
          >
            Overview
          </a>
          <a
            href="#vision"
            className="text-[13px] font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide"
          >
            Vision
          </a>
          <a
            href="#network"
            className="text-[13px] font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide"
          >
            Logistics Grid
          </a>
          <a
            href="#command"
            className="text-[13px] font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide"
          >
            Command Matrix
          </a>
          <a
            href="#footer"
            className="text-[13px] font-medium text-slate-300 hover:text-cyan-400 transition-colors tracking-wide"
          >
            Terminal
          </a>
        </div>

        {/* Live Status and Action Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 font-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>48 SATS // 14ms</span>
          </div>

          <a
            href="#command"
            className="group relative flex items-center gap-2 px-4 py-2 md:px-5 md:py-2 rounded-full bg-cyan-400 text-black font-semibold text-xs tracking-tight transition-all duration-300 hover:bg-white hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] active:scale-95"
          >
            <span>Console</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-full transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto fixed top-20 inset-x-4 p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
          >
            Overview
          </a>
          <a
            href="#vision"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
          >
            Vision
          </a>
          <a
            href="#network"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
          >
            Logistics Grid
          </a>
          <a
            href="#command"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-200 hover:text-cyan-400 py-1"
          >
            Command Matrix
          </a>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyan-400">
            <span>SYS: OPTIMAL</span>
            <span>LATENCY: 14MS</span>
          </div>
        </div>
      )}
    </header>
  );
};
