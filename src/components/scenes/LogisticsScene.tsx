'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plane, Ship, ShieldCheck, Warehouse, Box, Truck, ArrowUpRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  specs: string[];
}

export const LogisticsScene: React.FC = () => {
  const [activeSpeed, setActiveSpeed] = useState<number>(0);
  const [activeService, setActiveService] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  // Dynamic speedometer calculation from scroll speed
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const dt = Math.max(1, now - lastTime.current);
      const dy = Math.abs(currentScrollY - lastScrollY.current);

      const calculatedSpeed = Math.min(85, Math.round((dy / dt) * 45));
      setActiveSpeed(calculatedSpeed);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const height = rect.height - window.innerHeight;
        if (height > 0) {
          const progress = Math.max(0, Math.min(1, -rect.top / height));
          setScrollProgress(progress);
        }
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = now;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setActiveSpeed(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const services: ServiceItem[] = [
    {
      id: 'air',
      title: 'Air freight',
      description:
        'Express, priority, and deferred options across global trade lanes — managed end to end for speed and schedule integrity.',
      icon: <Plane className="w-5 h-5 text-[#f45300]" />,
      specs: ['Direct Flight Charters', 'Time-Definite Express', 'APAC Trade Corridors'],
    },
    {
      id: 'ocean',
      title: 'Ocean Freight',
      description:
        'FCL, LCL, and specialised cargo movements, with structured carrier selection and routing for cost and reliability.',
      icon: <Ship className="w-5 h-5 text-[#f45300]" />,
      specs: ['FCL & LCL Consolidation', 'Vessel Tracking', 'Port Handling Authority'],
    },
    {
      id: 'customs',
      title: 'Customs Brokerage',
      description:
        'In-house licensed brokerage covering classification, compliance, and quarantine — full control, no outsourcing.',
      icon: <ShieldCheck className="w-5 h-5 text-[#f45300]" />,
      specs: ['Licensed In-House Brokers', 'Biosecurity Clearance', 'Tariff Concession Advice'],
    },
    {
      id: 'warehousing',
      title: 'Warehousing and 3PL',
      description:
        'Scalable storage, pick and pack, and distribution — fully integrated with freight and transport operations.',
      icon: <Warehouse className="w-5 h-5 text-[#f45300]" />,
      specs: ['Temperature Controlled', 'Pick, Pack & Dispatch', 'Real-Time WMS Integration'],
    },
    {
      id: 'project',
      title: 'Project Cargo',
      description:
        'Specialist handling for oversized and complex shipments — from permits to engineered load configurations.',
      icon: <Box className="w-5 h-5 text-[#f45300]" />,
      specs: ['Out-Of-Gauge (OOG)', 'Heavy Lift Engineering', 'Route Surveys & Permits'],
    },
    {
      id: 'interstate',
      title: 'Domestic & Interstate Transport',
      description:
        'Local, metro, and interstate transport managed for consistent service levels and full delivery visibility.',
      icon: <Truck className="w-5 h-5 text-[#f45300]" />,
      specs: ['Line-haul Fleet', 'Metro Scheduled Runs', 'Tail-lift & Container Sideloader'],
    },
  ];

  // Scrubbed lift height & rotation
  const liftHeight = Math.sin(scrollProgress * Math.PI) * 45;
  const armTilt = Math.sin(scrollProgress * Math.PI) * 4;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#f4f5f8] text-[#0c1017] transition-colors duration-700 py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-black/10"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-14">
        
        {/* Speedometer & Section Header Bar */}
        <div className="flex items-center justify-between border-b border-black/10 pb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f45300]" />
            <span className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-[#718096]">
              OUR SERVICES
            </span>
          </div>

          {/* Interactive Live Speedometer Badge matching United Carriers */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/10 shadow-sm font-mono text-xs">
            <span className="text-[#718096]">VELOCITY:</span>
            <span className="font-bold text-base text-[#f45300] min-w-[2.2rem] text-right">
              {String(activeSpeed).padStart(2, '0')}
            </span>
            <span className="text-[11px] text-[#718096] uppercase font-semibold">km/h</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="max-w-3xl">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0c1017] leading-[1.05] uppercase mb-6">
            Everything your freight needs. <br />
            Under one group.
          </h2>
          <p className="text-base sm:text-lg text-[#4a5568] leading-relaxed">
            From air to sea, from customs clearance to final delivery, we bring decades of expertise across every freight discipline. Our integrated service network means one partner, one point of contact, and total visibility from origin to destination.
          </p>
        </div>

        {/* Reachstacker Crane Visual Simulation Display */}
        <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] bg-gradient-to-b from-[#e8edf2] to-[#dfe5eb] rounded-3xl overflow-hidden border border-black/10 shadow-inner flex items-center justify-center p-6 select-none">
          
          {/* Logistics Yard Ground Grid & Lines */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Container Stacks in the Yard using real AVIF assets */}
          <div className="absolute left-6 md:left-14 bottom-8 flex flex-col gap-2 items-start z-10">
            <div className="relative w-28 sm:w-36 h-28 sm:h-36 drop-shadow-md">
              <Image
                src="/images/crane/container-blue.avif"
                alt="Blue Shipping Container"
                fill
                sizes="150px"
                className="object-contain"
              />
            </div>
            <div className="relative w-28 sm:w-36 h-28 sm:h-36 drop-shadow-md -mt-16 sm:-mt-20">
              <Image
                src="/images/crane/container-white.avif"
                alt="White Shipping Container"
                fill
                sizes="150px"
                className="object-contain"
              />
            </div>
            <div className="relative w-28 sm:w-36 h-28 sm:h-36 drop-shadow-md -mt-16 sm:-mt-20">
              <Image
                src="/images/crane/container-orange.avif"
                alt="Orange Shipping Container"
                fill
                sizes="150px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Layered Reachstacker Crane Unit (1016 x 720 exact aspect ratio) */}
          <div className="relative z-20 w-full max-w-2xl aspect-[1016/720] flex items-center justify-center">
            
            {/* Layer 1: Crane Body (Base vehicle) */}
            <div className="absolute inset-0 z-10">
              <Image
                src="/images/crane/crane-body.avif"
                alt="Reachstacker Crane Body"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* Layer 2: Crane Head (Spreader boom) with interactive tilt */}
            <div
              className="absolute inset-0 z-20 transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: `rotate(${armTilt}deg) translateY(${-liftHeight * 0.3}px)`,
              }}
            >
              <Image
                src="/images/crane/crane-head.avif"
                alt="Crane Spreader Boom"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>

            {/* Layer 3: Crane Container (Lifted cargo) */}
            <div
              className="absolute inset-0 z-30 transition-transform duration-300 ease-out pointer-events-none"
              style={{
                transform: `translateY(${-liftHeight}px)`,
              }}
            >
              <Image
                src="/images/crane/crane-container.avif"
                alt="Lifted Container"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain drop-shadow-xl"
              />
            </div>

          </div>

          {/* Yard Telemetry Readout */}
          <div className="absolute bottom-4 right-6 flex items-center gap-4 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-black/10 text-xs font-mono text-[#0c1017] shadow-sm z-30">
            <span>KONECRANES SMV 4531 // YARD ACTIVE</span>
            <span className="text-[#f45300] font-bold">LIFT HEIGHT: {(1.2 + scrollProgress * 2.8).toFixed(1)}M</span>
          </div>

        </div>

        {/* 6 Core Freight Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, index) => {
            const isHovered = activeService === index;
            return (
              <div
                key={svc.id}
                onMouseEnter={() => setActiveService(index)}
                className={`group p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between border cursor-pointer ${
                  isHovered
                    ? 'bg-white border-[#f45300]/40 shadow-xl -translate-y-1'
                    : 'bg-white/80 border-black/10 hover:border-black/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#f45300]/10 flex items-center justify-center">
                      {svc.icon}
                    </div>
                    <span className="font-mono text-xs text-[#718096] font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold uppercase text-[#0c1017] mb-3 group-hover:text-[#f45300] transition-colors">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-[#4a5568] leading-relaxed mb-6 font-normal">
                    {svc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/10 flex flex-col gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {svc.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2 py-1 rounded-md bg-[#f4f5f8] text-[#4a5568] border border-black/5"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-heading font-medium text-[#0c1017] mt-3 group-hover:text-[#f45300] transition-colors">
                    <span>Explore details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
