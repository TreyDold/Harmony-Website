"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  pick = 50,
}: {
  intervalMs?: number;
  pick?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [pool, setPool] = useState<Img[]>([]);
  const [idx, setIdx] = useState(0);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Only shuffle images after component mounts on client
  useEffect(() => {
    const allowed = images as Img[];
    
    // Truly random shuffle
    const arr = [...allowed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    setPool(arr.slice(0, Math.max(1, Math.min(pick, arr.length))));
    setMounted(true);
  }, [pick]);

  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pool.length), intervalMs);
    return () => clearInterval(t);
  }, [pool.length, intervalMs]);

  useEffect(() => {
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

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50; // minimum swipe distance in px
    if (diff > threshold) {
      goToNext();
    } else if (diff < -threshold) {
      goToPrevious();
    }
    touchStartX.current = null;
  };

  // Determine which side of the screen the cursor is on
  const isLeftSide = mouseX !== null && windowWidth > 0 && mouseX < windowWidth / 2;
  const isRightSide = mouseX !== null && windowWidth > 0 && mouseX >= windowWidth / 2;

  // Don't render anything until mounted on client
  if (!mounted) {
    return <div className="relative h-screen w-full overflow-hidden bg-black" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Navigation arrows — hidden on mobile (sm:block), cursor-based on desktop */}
      {pool.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 cursor-pointer hidden sm:block ${
              isLeftSide ? 'sm:opacity-100' : 'sm:opacity-0'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={goToNext}
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 cursor-pointer hidden sm:block ${
              isRightSide ? 'sm:opacity-100' : 'sm:opacity-0'
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