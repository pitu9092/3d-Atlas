'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Anchor, Eye, FileCheck, DollarSign, Clock, ArrowRight } from 'lucide-react';

export const OceanScene: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [bobOffset, setBobOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Bobbing animation for the container ship on the ocean
  useEffect(() => {
    let frameId: number;
    let startTime = performance.now();

    const animateBob = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // Gentle ocean swell motion
      const x = Math.sin(elapsed * 0.8) * 4;
      const y = Math.cos(elapsed * 1.1) * 7;
      setBobOffset({ x, y });
      frameId = requestAnimationFrame(animateBob);
    };

    frameId = requestAnimationFrame(animateBob);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Track scroll inside the Why Us / Ocean section
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

  // Dynamic Ocean Wake Canvas Shader Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', onResize);

    let t = 0;
    const renderWake = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Deep Ocean Base Gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, '#041738');
      oceanGrad.addColorStop(0.5, '#02102b');
      oceanGrad.addColorStop(1, '#010a1c');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient ocean surface waves
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 1.5;
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 15) {
          const wave = Math.sin(x * 0.015 + t + y * 0.05) * 4;
          if (x === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

      // V-shaped ship wake and foam trails
      const centerX = width / 2;
      const bowY = height * 0.28;

      ctx.save();
      // Left wake flank
      const leftGrad = ctx.createLinearGradient(centerX, bowY, centerX - 180, height);
      leftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      leftGrad.addColorStop(0.2, 'rgba(180, 225, 255, 0.4)');
      leftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = leftGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 10, bowY + 20);
      for (let y = bowY + 20; y < height; y += 10) {
        const progress = (y - bowY) / (height - bowY);
        const spread = progress * 140 + Math.sin(y * 0.05 - t * 3) * 6;
        ctx.lineTo(centerX - spread, y);
      }
      ctx.stroke();

      // Right wake flank
      const rightGrad = ctx.createLinearGradient(centerX, bowY, centerX + 180, height);
      rightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      rightGrad.addColorStop(0.2, 'rgba(180, 225, 255, 0.4)');
      rightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = rightGrad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + 10, bowY + 20);
      for (let y = bowY + 20; y < height; y += 10) {
        const progress = (y - bowY) / (height - bowY);
        const spread = progress * 140 + Math.cos(y * 0.05 - t * 3) * 6;
        ctx.lineTo(centerX + spread, y);
      }
      ctx.stroke();

      // Turbulent foam wash directly behind stern
      for (let i = 0; i < 28; i++) {
        const py = bowY + 120 + ((i * 18 + t * 45) % (height - bowY - 120));
        const progress = (py - bowY) / (height - bowY);
        const spread = (Math.random() - 0.5) * progress * 90;
        const radius = 2 + progress * 5;
        const alpha = Math.max(0, 0.6 - progress * 0.5);

        ctx.fillStyle = `rgba(220, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(centerX + spread, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(renderWake);
    };

    animId = requestAnimationFrame(renderWake);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const whyPillars = [
    {
      id: 'single-contact',
      title: 'One Point of Contact',
      description:
        'No more chasing multiple vendors. One team manages your entire shipment from origin to destination.',
      icon: <Anchor className="w-5 h-5 text-[#f45300]" />,
    },
    {
      id: 'visibility',
      title: 'Full Supply Chain Visibility',
      description:
        'Track your freight in real time and get proactive updates before issues become delays.',
      icon: <Eye className="w-5 h-5 text-[#f45300]" />,
    },
    {
      id: 'compliance',
      title: 'Compliance You Can Trust',
      description:
        'Our licensed customs brokers keep your shipments moving within every regulatory requirement across APAC.',
      icon: <FileCheck className="w-5 h-5 text-[#f45300]" />,
    },
    {
      id: 'pricing',
      title: 'Competitive, Transparent Pricing',
      description:
        'No hidden fees. Clear, competitive pricing backed by responsive sales support throughout the shipment.',
      icon: <DollarSign className="w-5 h-5 text-[#f45300]" />,
    },
    {
      id: 'resolution',
      title: 'Fast Issue Resolution',
      description:
        'When something unexpected happens, we do not point fingers — we solve it. Our team acts immediately to protect your timeline.',
      icon: <Clock className="w-5 h-5 text-[#f45300]" />,
    },
  ];

  // Ship smooth scaling on scroll scrub (from 1.0 to 0.72)
  const shipScale = 1.0 - scrollProgress * 0.28;

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="relative z-10 w-full bg-[#021028] text-white py-32 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Deep Ocean WebGL / 2D Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f45300] font-semibold mb-4 block">
            WHY US
          </span>
          <h2 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-[0.96] mb-8">
            Logistics that works <br />
            as hard as you do.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl">
            From first-time importers to high-volume commercial shippers, our APAC operational backbone provides seamless reliability across every ocean corridor.
          </p>
        </div>

        {/* Central Ocean Vessel Display */}
        <div className="relative w-full h-[400px] sm:h-[520px] rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-8 bg-black/30 backdrop-blur-sm shadow-2xl">
          
          {/* Animated Container Ship Vessel Asset */}
          <div
            className="relative z-20 flex flex-col items-center justify-center transition-transform duration-200 ease-out"
            style={{
              transform: `translate(${bobOffset.x}px, ${bobOffset.y}px) scale(${shipScale})`,
            }}
          >
            {/* Aerial Ship Loaded with Container Racks */}
            <div className="relative w-[180px] sm:w-[240px] md:w-[280px] h-[360px] sm:h-[460px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]">
              <Image
                src="/images/ship/home-ship.avif"
                alt="United Carriers Ocean Container Vessel"
                fill
                sizes="(max-width: 768px) 300px, 400px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Telemetry Vessel HUD Overlay */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/70 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f45300] animate-pulse" />
              <span>VESSEL: APAC CARRIER PACIFIC V</span>
            </div>
            <span className="text-cyan-400 font-semibold">SPEED: 19.4 KNOTS // SWELL 1.2M</span>
          </div>
        </div>

        {/* 5 Why Us Value Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyPillars.map((p, idx) => (
            <div
              key={p.id}
              className={`p-8 rounded-3xl bg-white/[0.04] border border-white/10 hover:border-[#f45300]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f45300]/10 flex items-center justify-center mb-6">
                  {p.icon}
                </div>

                <h3 className="font-heading text-2xl font-bold uppercase text-white mb-4 group-hover:text-[#f45300] transition-colors">
                  {p.title}
                </h3>

                <p className="text-sm text-white/70 leading-relaxed font-light">
                  {p.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-heading font-medium text-white/80 group-hover:text-white">
                <span>Accountable standard</span>
                <ArrowRight className="w-4 h-4 text-[#f45300] transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
