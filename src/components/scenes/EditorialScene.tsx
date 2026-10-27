'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const EditorialScene: React.FC = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById('about');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75) {
        setInView(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="about"
      className="relative z-10 w-full bg-[#f4f5f8] text-[#0c1017] transition-colors duration-700 py-28 md:py-36 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Top Editorial Statement */}
        <div className="max-w-4xl">
          <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0c1017] leading-[1.02] uppercase mb-8">
            We move freight. <br />
            We own the outcome.
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-[#4a5568] font-normal leading-relaxed max-w-3xl mb-8">
            With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses. That means no finger-pointing between vendors. No delays lost in handoffs. Just one team, accountable from origin to destination.
          </p>

          <a
            href="#why-us"
            className="inline-flex items-center gap-2 font-heading font-medium text-base text-[#0c1017] hover:text-[#f45300] transition-colors group"
          >
            <span>Learn more about us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#f45300]" />
          </a>
        </div>

        {/* Section Transition Header */}
        <div className="pt-12 border-t border-black/10">
          <p className="font-heading text-xs uppercase tracking-[0.2em] text-[#718096] mb-12">
            From countless journeys, clarity emerges
          </p>

          {/* Three Live Stats Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Stat 1 */}
            <div className="flex flex-col border-l-2 border-black/10 pl-6 py-2">
              <span className="font-heading text-6xl sm:text-7xl font-bold text-[#0c1017] tracking-tight">
                2,500 <span className="text-[#f45300]">+</span>
              </span>
              <span className="font-heading text-sm uppercase tracking-wider text-[#718096] mt-3">
                Shipments per month
              </span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col border-l-2 border-black/10 pl-6 py-2">
              <span className="font-heading text-6xl sm:text-7xl font-bold text-[#0c1017] tracking-tight">
                98.2 <span className="text-[#f45300]">%</span>
              </span>
              <span className="font-heading text-sm uppercase tracking-wider text-[#718096] mt-3">
                On-time delivery rate
              </span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col border-l-2 border-black/10 pl-6 py-2">
              <span className="font-heading text-6xl sm:text-7xl font-bold text-[#0c1017] tracking-tight">
                8 <span className="text-[#f45300]">+</span>
              </span>
              <span className="font-heading text-sm uppercase tracking-wider text-[#718096] mt-3">
                Years in operation
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
