'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 sm:px-10 lg:px-14 py-6 flex items-center justify-between pointer-events-none transition-all duration-300">
      
      {/* Brand Logo & Mark */}
      <a
        href="#hero"
        className="pointer-events-auto flex items-center gap-3 group"
        aria-label="United Carriers Home"
      >
        <div className="w-5 h-5 flex items-center justify-center text-white">
          <svg viewBox="0 0 15 16" fill="none" className="w-full h-full">
            <path
              d="M12.0078 0C11.5506 0 11.1767 0.374 11.1767 0.831V11.97C11.1767 12.427 10.803 12.8 10.346 12.8H4.031C3.575 12.8 3.201 12.427 3.201 11.97V0.831C3.201 0.374 2.826 0 2.37 0H0.831C0.374 0 0 0.374 0 0.831V13.59C0 14.05 0.265 14.687 0.588 15.01L0.99 15.412C1.313 15.736 1.951 16 2.409 16H11.946C12.403 16 13.042 15.736 13.365 15.412L13.766 15.01C14.089 14.687 14.354 14.05 14.354 13.59V0.831C14.354 0.374 13.98 0 13.523 0H12.008Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="font-heading font-bold text-base sm:text-lg tracking-wider text-white uppercase">
          UNITED CARRIERS
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#f45300] shadow-[0_0_8px_#f45300]" />
      </a>

      {/* Desktop Navigation Links */}
      <nav className="pointer-events-auto hidden md:flex items-center gap-7 lg:gap-9">
        <a
          href="#about"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          About
        </a>
        <a
          href="#services"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          Services
        </a>
        <a
          href="#milestones"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          Industries
        </a>
        <a
          href="#insights"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          Insights
        </a>
        <a
          href="#why-us"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          Careers
        </a>
        <a
          href="#faq"
          className="text-xs lg:text-[13px] font-heading font-medium uppercase tracking-wider text-white/70 hover:text-white transition-colors"
        >
          FAQ
        </a>
      </nav>

      {/* Top-Right CTA Pill Button & Mobile Hamburger */}
      <div className="pointer-events-auto flex items-center gap-3">
        <a
          href="#contact"
          className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-heading font-medium text-xs tracking-tight transition-all duration-300 hover:bg-[#f45300] hover:text-white hover:shadow-[0_0_20px_rgba(244,83,0,0.5)] active:scale-95"
        >
          <span>Talk with us</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white rounded-full transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto fixed top-20 inset-x-4 p-6 rounded-3xl bg-black/95 backdrop-blur-2xl border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-2 border-b border-white/10"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-2 border-b border-white/10"
          >
            Services
          </a>
          <a
            href="#milestones"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-2 border-b border-white/10"
          >
            Industries
          </a>
          <a
            href="#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-2 border-b border-white/10"
          >
            Insights
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-heading font-medium text-white/80 hover:text-[#f45300] py-2 border-b border-white/10"
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
