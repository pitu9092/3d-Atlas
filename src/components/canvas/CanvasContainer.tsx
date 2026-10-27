'use client';

import React, { useEffect, useRef } from 'react';
import { SceneManager } from '@/three/SceneManager';

interface CanvasContainerProps {
  scrollProgress: number;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sceneManager = new SceneManager(containerRef.current);
    sceneManagerRef.current = sceneManager;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      sceneManager.setMousePosition(normX, normY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      sceneManager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.setScrollProgress(scrollProgress);
    }
  }, [scrollProgress]);

  // Fade out 3D globe as user scrolls past the Hero into Section 02
  const globeOpacity = Math.max(0, 1 - scrollProgress * 4.5);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden transition-opacity duration-300"
      style={{
        touchAction: 'none',
        opacity: globeOpacity,
      }}
    />
  );
};
