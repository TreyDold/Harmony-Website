"use client";

import Link from "next/link";
import Image from "next/image";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { use, useState, useEffect, useRef } from "react";

type ImageType = {
  category: string;
  subcategory: string;
  subsubcategory?: string;
  src: string;
  alt: string;
};

const images = imagesData as ImageType[];

interface PageProps {
  params: Promise<{ category: string; subcategory: string; imageId: string }>;
}

const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

const formatName = (name: string) =>
  name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function SubcategoryOrImagePage({ params }: PageProps) {
  const { category, subcategory, imageId } = use(params);

  if (!["photos", "drawings"].includes(category)) notFound();

  const subcategoryImages = images.filter(
    img => img.category === category && img.subcategory === subcategory
  );

  if (subcategoryImages.length === 0) notFound();

  const isSubsubcategory = subcategoryImages.some(img => img.subsubcategory === imageId);

  if (isSubsubcategory) {
    return (
      <SubsubcategoryGrid
        category={category}
        subcategory={subcategory}
        subsubcategory={imageId}
        images={subcategoryImages.filter(img => img.subsubcategory === imageId)}
      />
    );
  }

  return (
    <ImageViewer
      category={category}
      subcategory={subcategory}
      imageId={imageId}
      subcategoryImages={subcategoryImages.filter(img => !img.subsubcategory)}
    />
  );
}

// ── Sub-subcategory image grid ────────────────────────────────────────────────

function SubsubcategoryGrid({
  category,
  subcategory,
  subsubcategory,
  images,
}: {
  category: string;
  subcategory: string;
  subsubcategory: string;
  images: ImageType[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const count = images.length;

  const getLayoutClass = (count: number, index: number) => {
    if (count === 4) return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
    if (count === 7) {
      return index < 3
        ? 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
        : 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
    }
    if (count > 4 && count % 3 === 1) {
      const cutoff = count - 4;
      return index < cutoff
        ? 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
        : 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
    }
    return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 pt-28 sm:pt-24 pb-12 sm:pb-16">
        <Link
          href={`/gallery/${category}/${subcategory}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {formatName(subcategory)}
        </Link>

        <div className="mb-8 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">
            {formatName(subcategory)}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-2">
            {formatName(subsubcategory)}
          </h1>
          <p className="text-base text-gray-600">
            {count} {count === 1 ? 'work' : 'works'}
          </p>
        </div>

        {count === 4 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-[1200px] mx-auto">
            {images.map((image, index) => (
              <Link
                key={image.src}
                href={`/gallery/${category}/${subcategory}/${subsubcategory}/${index}`}
                className="group relative overflow-hidden bg-white aspect-[3/4] w-full cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <GridImageCard image={image} index={index} hoveredIndex={hoveredIndex} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {images.map((image, index) => (
              <Link
                key={image.src}
                href={`/gallery/${category}/${subcategory}/${subsubcategory}/${index}`}
                className={`group relative overflow-hidden bg-white aspect-[3/4] w-[calc(50%-6px)] ${getLayoutClass(count, index)} max-w-[500px] cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <GridImageCard image={image} index={index} hoveredIndex={hoveredIndex} />
              </Link>
            ))}
          </div>
        )}

        <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-200">
          <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-6 sm:mb-8">
            More {formatName(subcategory)}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[...new Set(
              (imagesData as ImageType[])
                .filter(img => img.category === category && img.subcategory === subcategory && img.subsubcategory !== subsubcategory)
                .map(img => img.subsubcategory)
                .filter(Boolean)
            )].map((other) => (
              <Link
                key={other}
                href={`/gallery/${category}/${subcategory}/${other}`}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                {formatName(other!)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GridImageCard({
  image,
  index,
  hoveredIndex,
}: {
  image: ImageType;
  index: number;
  hoveredIndex: number | null;
}) {
  return (
    <>
      <div
        className="w-full h-full transition-transform duration-700"
        style={{ transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)' }}
      >
        <ResponsiveImage
          src={getOptimizedImagePath(image.src)}
          alt={image.alt}
          className="object-contain w-full h-full"
          priority={index < 6}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
          View Full Size
        </span>
      </div>
    </>
  );
}

// ── Flat subcategory image viewer ─────────────────────────────────────────────

function ImageViewer({
  category,
  subcategory,
  imageId,
  subcategoryImages,
}: {
  category: string;
  subcategory: string;
  imageId: string;
  subcategoryImages: ImageType[];
}) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);

  if (subcategoryImages.length === 0) notFound();

  const currentIndex = parseInt(imageId, 10);
  if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= subcategoryImages.length) {
    notFound();
  }

  const currentImage = subcategoryImages[currentIndex];
  const hasPrevious  = currentIndex > 0;
  const hasNext      = currentIndex < subcategoryImages.length - 1;

  const goToPrevious = () => { if (hasPrevious) router.replace(`/gallery/${category}/${subcategory}/${currentIndex - 1}`); };
  const goToNext     = () => { if (hasNext) router.replace(`/gallery/${category}/${subcategory}/${currentIndex + 1}`); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) goToPrevious();
      else if (e.key === 'ArrowRight' && hasNext) goToNext();
      else if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, currentIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) goToNext();
      else if (diff < 0 && hasPrevious) goToPrevious();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      style={{ touchAction: 'pan-y' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 shrink-0">
        <div className="text-white text-sm sm:text-base font-medium bg-black/50 px-3 py-1.5 rounded-full">
          {currentIndex + 1} / {subcategoryImages.length}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-white/10 hover:bg-white/20 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="flex-1 relative min-h-0 px-10 sm:px-16 md:px-20 pb-4 sm:pb-6">
        {hasPrevious && (
          <button onClick={goToPrevious} className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer" aria-label="Previous image">
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
        {hasNext && (
          <button onClick={goToNext} className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer" aria-label="Next image">
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
        <div className="relative w-full h-full">
          <Image
            src={`/images/optimized/large/${getOptimizedImagePath(currentImage.src)}.webp`}
            alt={currentImage.alt}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}