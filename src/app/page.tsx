'use client';

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { CanvasContainer } from '@/components/canvas/CanvasContainer';
import { Navbar } from '@/components/common/Navbar';
import { ScrollTrack } from '@/components/common/ScrollTrack';
import { Preloader } from '@/components/common/Preloader';
import { HeroScene } from '@/components/scenes/HeroScene';
import { EditorialScene } from '@/components/scenes/EditorialScene';
import { LogisticsScene } from '@/components/scenes/LogisticsScene';
import { CommandMatrixScene } from '@/components/scenes/CommandMatrixScene';
import { ClimaxScene } from '@/components/scenes/ClimaxScene';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    const updateScrollProgress = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        setScrollProgress(progress);
      }
    };

    lenis.on('scroll', () => {
      updateScrollProgress();
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', updateScrollProgress);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-slate-100 selection:bg-cyan-400 selection:text-black">
      {/* Sequence 00: Initial Loading State */}
      <Preloader />

      {/* Persistent Single WebGL 3D Canvas */}
      <CanvasContainer scrollProgress={scrollProgress} />

      {/* Floating Glassmorphic Navigation */}
      <Navbar />

      {/* Vertical Stonic-style Scroll Track */}
      <ScrollTrack progress={scrollProgress} />

      {/* Interactive Cinematic DOM Overlay Storytelling */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Sequence 01: Hero Scene */}
        <HeroScene />

        {/* Sequence 02: Editorial Brand Statement */}
        <EditorialScene />

        {/* Sequence 03: Global Logistics Network */}
        <LogisticsScene />

        {/* Sequence 04: Command Matrix HUD & Telemetry */}
        <CommandMatrixScene />

        {/* Sequence 05: Climax Access & Footer */}
        <ClimaxScene />
      </div>
    </main>
  );
}
