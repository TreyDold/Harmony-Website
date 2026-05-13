"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import imagesData from "@/data/images.json";
import { use, useEffect } from "react";

type ImageType = {
  category: string;
  subcategory: string;
  subsubcategory?: string;
  src: string;
  alt: string;
};

const images = imagesData as ImageType[];

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    imageId: string;      // acts as subsubcategory at this level
    nestedImageId: string;
  }>;
}

const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

export default function NestedImageViewerPage({ params }: PageProps) {
  const { category, subcategory, imageId: subsubcategory, nestedImageId } = use(params);
  const router = useRouter();

  if (!["photos", "drawings"].includes(category)) notFound();

  const subsubcategoryImages = images.filter(
    img =>
      img.category === category &&
      img.subcategory === subcategory &&
      img.subsubcategory === subsubcategory
  );

  if (subsubcategoryImages.length === 0) notFound();

  const currentIndex = parseInt(nestedImageId, 10);
  if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= subsubcategoryImages.length) {
    notFound();
  }

  const currentImage = subsubcategoryImages[currentIndex];
  const hasPrevious  = currentIndex > 0;
  const hasNext      = currentIndex < subsubcategoryImages.length - 1;

  const basePath = `/gallery/${category}/${subcategory}/${subsubcategory}`;

  const goToPrevious = () => { if (hasPrevious) router.replace(`${basePath}/${currentIndex - 1}`); };
  const goToNext     = () => { if (hasNext) router.replace(`${basePath}/${currentIndex + 1}`); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) goToPrevious();
      else if (e.key === 'ArrowRight' && hasNext) goToNext();
      else if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, currentIndex]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 shrink-0">
        <div className="text-white text-sm sm:text-base font-medium bg-black/50 px-3 py-1.5 rounded-full">
          {currentIndex + 1} / {subsubcategoryImages.length}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-white/10 hover:bg-white/20 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
          aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
      </div>

      {/* Image area */}
      <div className="flex-1 relative min-h-0 px-10 sm:px-16 md:px-20 pb-4 sm:pb-6">
        {hasPrevious && (
          <button
            onClick={goToPrevious}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={goToNext}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Next image"
          >
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