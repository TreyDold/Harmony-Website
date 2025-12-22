"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import imagesData from "@/data/images.json";
import { use } from "react";

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

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

export default function ImageViewerPage({ params }: PageProps) {
  const { category, subcategory, imageId } = use(params);
  const router = useRouter();

  // Get all images in this subcategory
  const subcategoryImages = images.filter(
    (img) => img.category === category && img.subcategory === subcategory
  );

  if (subcategoryImages.length === 0) {
    notFound();
  }

  // Parse the index from the imageId
  const currentIndex = parseInt(imageId, 10);

  // Check if index is valid
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

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && hasPrevious) {
      goToPrevious();
    } else if (e.key === 'ArrowRight' && hasNext) {
      goToNext();
    } else if (e.key === 'Escape') {
      router.push(`/gallery/${category}`);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <Link
        href={`/gallery/${category}`}
        className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </Link>

      {/* Image counter */}
      <div className="absolute top-6 left-6 z-50 text-white text-lg font-medium bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {subcategoryImages.length}
      </div>

      {/* Previous button */}
      {hasPrevious && (
        <button
          onClick={goToPrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={goToNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all duration-300 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center p-12">
        <Image
          src={`/images/optimized/large/${getOptimizedImagePath(currentImage.src)}.webp`}
          alt={currentImage.alt}
          fill
          className="object-contain"
          priority
          sizes="100vw"
        />
      </div>

      {/* Image title/alt text */}
      {currentImage.alt && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white text-center bg-black/50 px-6 py-3 rounded-full max-w-2xl">
          {currentImage.alt}
        </div>
      )}

      {/* Navigation hint */}
      <div className="absolute bottom-6 right-6 z-50 text-white/70 text-sm bg-black/30 px-4 py-2 rounded-full">
        Use ← → keys to navigate
      </div>
    </div>
  );
}