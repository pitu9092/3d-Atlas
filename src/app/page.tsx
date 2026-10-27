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
import { TruckRoadScene } from '@/components/scenes/TruckRoadScene';
import { OceanScene } from '@/components/scenes/OceanScene';
import { TestimonialScene } from '@/components/scenes/TestimonialScene';
import { ClimaxScene } from '@/components/scenes/ClimaxScene';

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Smooth scroll with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    (window as any).lenis = lenis;

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

    // Smooth Anchor Link Navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const targetEl = document.querySelector(anchor.hash);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl as HTMLElement, { offset: -20, duration: 1.5 });
          window.history.pushState(null, '', anchor.hash);
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    // Initial hash scroll if present
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) lenis.scrollTo(el as HTMLElement, { offset: -20, immediate: true });
      }, 300);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('scroll', updateScrollProgress);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-[#f45300] selection:text-white">
      {/* 00: Initial Brand Loading State */}
      <Preloader />

      {/* 01: Persistent Three.js Dot-Matrix Globe */}
      <CanvasContainer scrollProgress={scrollProgress} />

      {/* Floating Navigation Header */}
      <Navbar />

      {/* Vertical Chapter Progression Track */}
      <ScrollTrack progress={scrollProgress} />

      {/* Cinematic Sequential Storytelling Sections */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Section 01: Hero Scene - One operator / Every leg of the journey */}
        <HeroScene />

        {/* Section 02: Brand Statement - We move freight. We own the outcome. */}
        <EditorialScene />

        {/* Section 03: Reachstacker Crane & 6 Freight Services */}
        <LogisticsScene />

        {/* Section 04: Line-Haul Highway Truck - Reliability at every milestone */}
        <TruckRoadScene />

        {/* Section 05: Ocean Container Vessel & 5 Pillars - Why us */}
        <OceanScene />

        {/* Section 06: Real APAC Client Reviews & Industry Insights */}
        <TestimonialScene />

        {/* Section 07: F.A.Q Accordion & Climax CTA / Footer */}
        <ClimaxScene />
      </div>
    </main>
  );
}
