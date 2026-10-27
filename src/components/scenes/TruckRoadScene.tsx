'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Radio, Globe, PhoneCall, ArrowRight } from 'lucide-react';

export const TruckRoadScene: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const height = rect.height - window.innerHeight;
      if (height > 0) {
        const progress = Math.max(0, Math.min(1, -rect.top / height));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Truck positioning along horizontal and downward vertical highway
  let truckX = 0;
  let truckY = 0;
  let truckRotation = 0;

  if (scrollProgress < 0.45) {
    const t = scrollProgress / 0.45;
    truckX = -35 + t * 35;
    truckY = 0;
    truckRotation = 0;
  } else if (scrollProgress < 0.65) {
    const t = (scrollProgress - 0.45) / 0.2;
    truckX = 0;
    truckY = t * 75;
    truckRotation = t * 90;
  } else {
    const t = (scrollProgress - 0.65) / 0.35;
    truckX = 0;
    truckY = 75 + t * 90;
    truckRotation = 90;
  }

  const milestones = [
    {
      id: 'tracking',
      title: 'Real-Time Freight Tracking',
      description:
        'Know exactly where your cargo is at every milestone. Live visibility means faster decisions and zero guesswork.',
      icon: <Radio className="w-5 h-5 text-[#f45300]" />,
      tag: 'TELEMETRY 24/7',
    },
    {
      id: 'network',
      title: 'Global Network Coverage',
      description:
        'From APAC lanes to international corridors, our partner network spans every major trade route your business relies on.',
      icon: <Globe className="w-5 h-5 text-[#f45300]" />,
      tag: 'APAC CORRIDORS',
    },
    {
      id: 'support',
      title: '24/7 Customer Support',
      description:
        'Real people, always available. Whether it is a routine update or an urgent issue, we pick up the phone and we own the outcome.',
      icon: <PhoneCall className="w-5 h-5 text-[#f45300]" />,
      tag: 'DIRECT ACCESS',
    },
  ];

  return (
    <section
      id="milestones"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#050505] text-white py-32 px-6 sm:px-12 lg:px-20 overflow-hidden border-t border-white/10"
    >
      {/* Background Highway Markings */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-[2px] bg-repeat-x absolute top-1/2 -translate-y-1/2"
          style={{
            backgroundImage: 'linear-gradient(90deg, #ffffff 40%, transparent 40%)',
            backgroundSize: '40px 2px',
          }}
        />
        <div
          className="h-full w-[2px] bg-repeat-y absolute left-1/2 -translate-x-1/2"
          style={{
            backgroundImage: 'linear-gradient(180deg, #ffffff 40%, transparent 40%)',
            backgroundSize: '2px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold mb-4 block">
            FLEET RELIABILITY
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[0.96] mb-8">
            Reliability <br />
            at every milestone
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
            With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses.
          </p>
        </div>

        {/* Dynamic Truck & Highway Road Display */}
        <div className="relative w-full h-[320px] sm:h-[420px] rounded-3xl bg-black/90 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
          
          {/* Road Surface Texture */}
          <div className="absolute inset-0 bg-[#090b10] flex items-center justify-center">
            {/* Center Dashed Road Markings */}
            <div
              className="w-full h-[3px]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ffffff 45%, transparent 45%)',
                backgroundSize: '54px 3px',
              }}
            />
            {/* Vertical Highway Lane */}
            <div
              className="absolute h-full w-[3px]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #ffffff 45%, transparent 45%)',
                backgroundSize: '3px 54px',
              }}
            />
          </div>

          {/* Interactive Line-haul Semi-Truck (2664x614 natural aspect ratio) */}
          <div
            className="relative z-20 transition-transform duration-300 ease-out flex items-center justify-center"
            style={{
              transform: `translate(${truckX}%, ${truckY}px) rotate(${truckRotation}deg)`,
            }}
          >
            <div className="relative w-[360px] sm:w-[480px] md:w-[580px] aspect-[2664/614] drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]">
              <Image
                src="/images/truck/truck-static.avif"
                alt="United Carriers Line-Haul Truck"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Real-time Fleet Telemetry Bar */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/70 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LINE-HAUL VECTORS: 142 ACTIVE EN ROUTE</span>
            </div>
            <span className="text-[#f45300] font-bold">
              TRANSIT STATUS: ON-SCHEDULE (98.2%)
            </span>
          </div>
        </div>

        {/* 3 Milestone Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#f45300]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#f45300]/10 flex items-center justify-center">
                    {m.icon}
                  </div>
                  <span className="font-mono text-[11px] text-[#f45300] font-bold px-2.5 py-1 rounded-full bg-[#f45300]/10 border border-[#f45300]/20">
                    {m.tag}
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-4 group-hover:text-[#f45300] transition-colors">
                  {m.title}
                </h3>

                <p className="text-sm text-white/65 leading-relaxed font-light">
                  {m.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-heading font-medium text-white/80 group-hover:text-white">
                <span>View capability</span>
                <ArrowRight className="w-4 h-4 text-[#f45300] transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
