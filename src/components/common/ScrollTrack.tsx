'use client';

import React from 'react';

interface ScrollTrackProps {
  progress: number;
}

const CHAPTERS = [
  { id: '01', label: 'HERO GLOBE', threshold: 0.14 },
  { id: '02', label: 'OUTCOME', threshold: 0.28 },
  { id: '03', label: 'SERVICES & CRANE', threshold: 0.44 },
  { id: '04', label: 'MILESTONE ROAD', threshold: 0.60 },
  { id: '05', label: 'OCEAN VESSEL', threshold: 0.76 },
  { id: '06', label: 'APAC REVIEWS', threshold: 0.88 },
  { id: '07', label: 'FAQ & CLIMAX', threshold: 1.0 },
];

export const ScrollTrack: React.FC<ScrollTrackProps> = ({ progress }) => {
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
      className={`fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 pointer-events-none select-none font-mono transition-opacity duration-500 ${
        progress < 0.05 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Chapter Indicator Label */}
      <div className="flex flex-col items-end text-right pr-2">
        <span className="text-[10px] text-[#f45300] font-bold tracking-widest">
          {activeChapter.id} / 07
        </span>
        <span className="text-[9px] text-white/50 tracking-wider font-semibold">
          {activeChapter.label}
        </span>
      </div>

      {/* Vertical Track Line */}
      <div className="relative h-44 w-[2px] rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute top-0 inset-x-0 bg-[#f45300] rounded-full origin-top transition-transform duration-100 ease-out shadow-[0_0_8px_#f45300]"
          style={{
            height: '100%',
            transform: `scaleY(${Math.max(0, Math.min(1, progress))})`,
          }}
        />
      </div>

      {/* Numeric Percentage */}
      <span className="text-[9px] text-white/40 font-mono">
        {Math.round(progress * 100)}%
      </span>
    </aside>
  );
};
