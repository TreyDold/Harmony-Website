"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import imagesData from "@/data/images.json";
import { use, useEffect } from "react";

type ImageType = {
  category: string;
  subcategory: string;
  src: string;
  alt: string;
};

const images = imagesData as ImageType[];

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    imageId: string;
  }>;
}

const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

export default function ImageViewerPage({ params }: PageProps) {
  const { category, subcategory, imageId } = use(params);
  const router = useRouter();

  const subcategoryImages = images.filter(
    (img) => img.category === category && img.subcategory === subcategory
  );

  if (subcategoryImages.length === 0) {
    notFound();
  }

  const currentIndex = parseInt(imageId, 10);

  if (isNaN(currentIndex) || currentIndex < 0 || currentIndex >= subcategoryImages.length) {
    notFound();
  }

  const currentImage = subcategoryImages[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < subcategoryImages.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      router.push(`/gallery/${category}/${subcategory}/${currentIndex - 1}`);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      router.push(`/gallery/${category}/${subcategory}/${currentIndex + 1}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        goToNext();
      } else if (e.key === 'Escape') {
        router.push(`/gallery/${category}/${subcategory}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, currentIndex, category, subcategory, router]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Top bar with counter and close */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 shrink-0">
        <div className="text-white text-sm sm:text-base font-medium bg-black/50 px-3 py-1.5 rounded-full">
          {currentIndex + 1} / {subcategoryImages.length}
        </div>
        <Link
          href={`/gallery/${category}/${subcategory}`}
          className="bg-white/10 hover:bg-white/20 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
      </div>

      {/* Image area — fills remaining vertical space */}
      <div className="flex-1 relative min-h-0 px-10 sm:px-16 md:px-20 pb-4 sm:pb-6">
        {/* Previous button */}
        {hasPrevious && (
          <button
            onClick={goToPrevious}
            className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Next button */}
        {hasNext && (
          <button
            onClick={goToNext}
            className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-1.5 sm:p-2.5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Image — fills the flex area, object-contain keeps aspect ratio */}
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