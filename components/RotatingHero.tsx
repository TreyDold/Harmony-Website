"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import images from "@/data/images.json";

type Img = { src: string; alt: string; category: string; subcategory: string };

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  // Convert "/gallery/photos/abstracts/Front_backsides.jpg" 
  // to "/images/optimized/large/photos/abstracts/Front_backsides.webp"
  const cleanPath = oldSrc
    .replace('/gallery/', '') // Remove /gallery/ prefix
    .replace(/\.(jpg|jpeg|png|webp)$/i, ''); // Remove file extension
  
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
    const allowed = images as Img[]; // Changed from 'let' to 'const'
    
    // Lightweight deterministic shuffle
    const arr = [...allowed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 9301 + 49297) % 233280 % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.max(1, Math.min(pick, arr.length)));
  }, [pick]);

  const [idx, setIdx] = useState(0);
  // Removed unused 'isLoaded' variable

  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pool.length), intervalMs);
    return () => clearInterval(t);
  }, [pool.length, intervalMs]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {pool.map((it, i) => {
        const showing = i === idx;
        return (
          <Image
            key={it.src}
            src={getOptimizedImagePath(it.src)}
            alt={it.alt}
            fill
            priority={i === 0}
            className={`object-cover transition-all duration-1000 ease-in-out will-change-opacity ${
              showing ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            sizes="100vw"
          />
        );
      })}
      
      {/* Subtle vignette effect like James Jean's site */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
    </div>
  );
}