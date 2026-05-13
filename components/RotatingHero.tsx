"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import imagesData from "@/data/images.json";

type Img = { src: string; alt: string; category: string; subcategory: string };

const getOptimizedImagePath = (oldSrc: string) => {
  const cleanPath = oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
  return `/images/optimized/large/${cleanPath}.webp`;
};

const ALL_IMAGES = imagesData as Array<Img & { subsubcategory?: string }>;

export default function RotatingHero({ intervalMs = 8000 }: { intervalMs?: number }) {
  const [mounted, setMounted]         = useState(false);
  const [pool, setPool]               = useState<Img[]>([]);
  const [idx, setIdx]                 = useState(0);
  const [mouseX, setMouseX]           = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  const [slotA, setSlotA]           = useState('');
  const [slotB, setSlotB]           = useState('');
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');

  const touchStartX  = useRef<number | null>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const poolLengthRef = useRef(0);

  useEffect(() => {
    const arr = [...ALL_IMAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    poolLengthRef.current = arr.length;
    setPool(arr);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pool.length === 0) return;
    setSlotA(getOptimizedImagePath(pool[0].src));
    setSlotB(pool.length > 1 ? getOptimizedImagePath(pool[1].src) : '');
    setActiveSlot('A');
  }, [pool]);

  useEffect(() => {
    if (pool.length < 2) return;
    const preloadSrc = getOptimizedImagePath(pool[(idx + 1) % pool.length].src);
    if (activeSlot === 'A') setSlotB(preloadSrc);
    else setSlotA(preloadSrc);
  }, [idx, activeSlot, pool]);

  const advance = useCallback(() => {
    setIdx(i => (i + 1) % poolLengthRef.current);
    setActiveSlot(s => s === 'A' ? 'B' : 'A');
  }, []);

  const retreat = useCallback(() => {
    setIdx(i => (i - 1 + poolLengthRef.current) % poolLengthRef.current);
    setActiveSlot(s => s === 'A' ? 'B' : 'A');
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(advance, intervalMs);
  }, [advance, intervalMs]);

  useEffect(() => {
    if (pool.length < 2) return;
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [pool.length, startInterval]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    const onMouseMove  = (e: MouseEvent) => setMouseX(e.clientX);
    const onMouseLeave = () => setMouseX(null);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const navigate = (direction: 'prev' | 'next') => {
    direction === 'prev' ? retreat() : advance();
    startInterval();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent browser navigation gesture on horizontal swipe
    e.preventDefault();
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 'next' : 'prev');
    touchStartX.current = null;
  };

  const isLeftSide  = mouseX !== null && windowWidth > 0 && mouseX < windowWidth / 2;
  const isRightSide = mouseX !== null && windowWidth > 0 && mouseX >= windowWidth / 2;

  if (!mounted || pool.length === 0) {
    return <div className="relative h-screen w-full overflow-hidden bg-black" />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {slotA && (
        <Image
          src={slotA}
          alt=""
          fill
          priority={activeSlot === 'A'}
          className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${activeSlot === 'A' ? 'opacity-100' : 'opacity-0'}`}
          sizes="100vw"
        />
      )}
      {slotB && (
        <Image
          src={slotB}
          alt=""
          fill
          priority={activeSlot === 'B'}
          className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${activeSlot === 'B' ? 'opacity-100' : 'opacity-0'}`}
          sizes="100vw"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />

      {/* Touch layer — touchAction:none prevents Android navigation gesture */}
      <div
        className="absolute inset-0 z-40 sm:pointer-events-none"
        style={{ touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {pool.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/60 text-xs tracking-widest">
          {idx + 1} / {pool.length}
        </div>
      )}

      {pool.length > 1 && (
        <>
          <button
            onClick={() => navigate('prev')}
            className={`absolute left-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 cursor-pointer hidden sm:block ${isLeftSide ? 'sm:opacity-100' : 'sm:opacity-0'}`}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => navigate('next')}
            className={`absolute right-8 top-1/2 -translate-y-1/2 z-50 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 cursor-pointer hidden sm:block ${isRightSide ? 'sm:opacity-100' : 'sm:opacity-0'}`}
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </div>
  );
}