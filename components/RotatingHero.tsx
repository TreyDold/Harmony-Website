"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import images from "@/data/images.json";

type Img = { src: string; alt: string; category: string; subcategory: string };

export default function RotatingHero({
  intervalMs = 6000,
  pick = 8,                // how many images to rotate through
  filter = (i: Img) => true, // customize which images are allowed
}: {
  intervalMs?: number;
  pick?: number;
  filter?: (i: Img) => boolean;
}) {
  // choose a fixed set on first render (stable order)
  const pool = useMemo(() => {
    const allowed = (images as Img[]).filter(filter);
    // lightweight deterministic shuffle
    const arr = [...allowed];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 9301 + 49297) % 233280 % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.max(1, Math.min(pick, arr.length)));
  }, [pick, filter]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pool.length), intervalMs);
    return () => clearInterval(t);
  }, [pool.length, intervalMs]);

  return (
    <div className="relative h-[70vh] rounded-3xl overflow-hidden bg-black/5">
      {pool.map((it, i) => {
        const showing = i === idx;
        return (
          <Image
            key={it.src}
            src={it.src}
            alt={it.alt}
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-700 will-change-opacity
                       ${showing ? "opacity-100" : "opacity-0"}`
            }
            sizes="100vw"
          />
        );
      })}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.35),transparent_40%)]" />
    </div>
  );
}
