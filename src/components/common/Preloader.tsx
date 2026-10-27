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
          setTimeout(() => setShouldRender(false), 900);
          return 100;
        }
        // Rapid randomized increments simulating shader compilation
        const inc = Math.floor(Math.random() * 12) + 6;
        return Math.min(100, prev + inc);
      });
    }, 60);

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
        {/* Pulsing Outer Rings */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
          <div
            className="absolute inset-2 rounded-full border border-t-cyan-400 border-r-transparent border-b-cyan-500/30 border-l-transparent animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
          <span className="font-mono text-xl font-bold text-white tracking-widest">
            {percent}%
          </span>
        </div>

        {/* Status Text */}
        <div className="flex flex-col items-center gap-1.5 text-center font-mono">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-cyan-400 uppercase">
            3D ATLAS ENGINE
          </span>
          <span className="text-[10px] tracking-widest text-slate-500">
            WARMING GLSL SHADERS &bull; MAPPING HUBS
          </span>
        </div>
      </div>
    </div>
  );
};
