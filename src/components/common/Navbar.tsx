'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Image from 'next/image';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-center px-4 py-4 md:px-8 md:py-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between w-full max-w-7xl px-5 py-3 md:px-8 md:py-3.5 rounded-full border border-white/10 bg-black/70 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-base md:text-lg tracking-wider text-white uppercase">
              UNITED CARRIERS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f45300] shadow-[0_0_8px_#f45300]" />
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            Services
          </a>
          <a
            href="#about"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            About
          </a>
          <a
            href="#why-us"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            Why us
          </a>
          <a
            href="#insights"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            Insights
          </a>
          <a
            href="#faq"
            className="text-[13px] font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            FAQ
          </a>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="group flex items-center gap-2 px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-white text-black font-heading font-medium text-[13px] tracking-tight transition-all duration-300 hover:bg-[#f45300] hover:text-white hover:shadow-[0_0_20px_rgba(244,83,0,0.4)] active:scale-95"
          >
            <span>Talk with us</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white/80 hover:text-white rounded-full transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto fixed top-20 inset-x-4 p-6 rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-1 border-b border-white/10"
          >
            Services
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-1 border-b border-white/10"
          >
            About
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-1 border-b border-white/10"
          >
            Why us
          </a>
          <a
            href="#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-1 border-b border-white/10"
          >
            Insights
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-1"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-3 rounded-full bg-[#f45300] text-white font-heading text-center text-sm font-medium"
          >
            Talk with us
          </a>
        </div>
      )}
    </header>
  );
};
