'use client';

import React, { useState, useEffect } from 'react';

export const Preloader: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 200);
          setTimeout(() => setShouldRender(false), 800);
          return 100;
        }
        const inc = Math.floor(Math.random() * 15) + 8;
        return Math.min(100, prev + inc);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out pointer-events-none ${
        isLoaded ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Pulsing Outer Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#f45300]/20 animate-ping" />
          <div
            className="absolute inset-2 rounded-full border-2 border-t-[#f45300] border-r-transparent border-b-[#f45300]/20 border-l-transparent animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
          <span className="font-heading text-xl font-bold text-white tracking-widest">
            {percent}%
          </span>
        </div>

        {/* Brand Name & Telemetry */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-bold tracking-[0.25em] text-white uppercase">
              UNITED CARRIERS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#f45300]" />
          </div>
          <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
            ONE OPERATOR &bull; EVERY LEG OF THE JOURNEY
          </span>
        </div>
      </div>
    </div>
  );
};
