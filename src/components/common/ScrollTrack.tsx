'use client';

import React from 'react';

interface ScrollTrackProps {
  progress: number; // 0 to 1
}

const CHAPTERS = [
  { id: '01', label: 'ORBITAL CORE', threshold: 0.15 },
  { id: '02', label: 'EDITORIAL VISION', threshold: 0.35 },
  { id: '03', label: 'LOGISTICS GRID', threshold: 0.60 },
  { id: '04', label: 'COMMAND MATRIX', threshold: 0.85 },
  { id: '05', label: 'HYPER ACCESS', threshold: 1.0 },
];

export const ScrollTrack: React.FC<ScrollTrackProps> = ({ progress }) => {
  // Determine active chapter
  let activeChapter = CHAPTERS[0];
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (progress <= CHAPTERS[i].threshold) {
      activeChapter = CHAPTERS[i];
      break;
    }
  }

  return (
    <aside
      aria-label="Scroll Progression Track"
      className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 pointer-events-none select-none font-mono"
    >
      {/* Chapter Indicator Label */}
      <div className="flex flex-col items-end text-right pr-2">
        <span className="text-[10px] text-cyan-400 font-semibold tracking-widest">
          {activeChapter.id} / 05
        </span>
        <span className="text-[9px] text-slate-400 tracking-wider">
          {activeChapter.label}
        </span>
      </div>

      {/* Vertical Track Line */}
      <div className="relative h-48 w-[2px] rounded-full bg-white/10 overflow-hidden">
        {/* Progress Fill */}
        <div
          className="absolute top-0 inset-x-0 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full origin-top transition-transform duration-100 ease-out"
          style={{
            height: '100%',
            transform: `scaleY(${Math.max(0, Math.min(1, progress))})`,
          }}
        />
      </div>

      {/* Numeric Percentage */}
      <span className="text-[9px] text-slate-500 font-mono">
        {Math.round(progress * 100)}%
      </span>
    </aside>
  );
};
