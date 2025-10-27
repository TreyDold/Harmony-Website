"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import images from "@/data/images.json";

type Img = { src: string; alt: string; category: string; subcategory: string };

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  const cleanPath = oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  return `/images/optimized/large/${cleanPath}.webp`;
};

export default function RotatingHero({
  intervalMs = 8000,
  pick = 8,
}: {
  intervalMs?: number;
  pick?: number;
}) {
  // Choose a curated set on first render (stable order)
  const pool = useMemo(() => {
    const allowed = images as Img[];
    
    // Lightweight deterministic shuffle
    const arr = [...allowed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 9301 + 49297) % 233280 % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.max(1, Math.min(pick, arr.length)));
  }, [pick]);

  const [idx, setIdx] = useState(0);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pool.length), intervalMs);
    return () => clearInterval(t);
  }, [pool.length, intervalMs]);

  useEffect(() => {
    // Set initial window width
    const updateWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWidth();

    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
    };

    const handleMouseLeave = () => {
      setMouseX(null);
    };

    const handleResize = () => {
      updateWidth();
    };

    // Listen to window, not container
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToPrevious = () => {
    setIdx((i) => (i - 1 + pool.length) % pool.length);
  };

  const goToNext = () => {
    setIdx((i) => (i + 1) % pool.length);
  };

  // Determine which side of the screen the cursor is on
  const isLeftSide = mouseX !== null && windowWidth > 0 && mouseX < windowWidth / 2;
  const isRightSide = mouseX !== null && windowWidth > 0 && mouseX >= windowWidth / 2;

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {pool.map((it, i) => {
        const showing = i === idx;
        return (
          <Image
            key={it.src}
            src={getOptimizedImagePath(it.src)}
            alt={it.alt}
            fill
            priority={i === 0}
            className={`object-cover transition-all duration-[2000ms] ease-in-out will-change-opacity ${
              showing ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            sizes="100vw"
          />
        );
      })}
      
      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />

      {/* Navigation arrows - appear based on cursor position */}
      {pool.length > 1 && (
        <>
          {/* Left arrow - shows when cursor is on left half */}
          <button
            onClick={goToPrevious}
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 ${
              isLeftSide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Right arrow - shows when cursor is on right half */}
          <button
            onClick={goToNext}
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 ${
              isRightSide ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </div>
  );
}