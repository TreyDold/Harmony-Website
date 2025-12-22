"use client";

import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { use, useState } from "react";

const images = imagesData as Array<{
  category: string;
  subcategory: string;
  src: string;
  alt: string;
}>;

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

export default function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = use(params);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  if (!["photos", "drawings"].includes(category)) {
    notFound();
  }

  const subcategoryImages = images.filter(
    img => img.category === category && img.subcategory === subcategory
  );

  if (subcategoryImages.length === 0) {
    notFound();
  }

  const formatSubcategoryName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const count = subcategoryImages.length;
  
  // Smart layout logic to avoid single images on last row
  const getLayoutClass = (count: number, index: number) => {
    // Special case: exactly 4 images → 2x2 grid
    if (count === 4) {
      return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
    }
    
    // Special case: 7 images → 3-2-2 layout
    if (count === 7) {
      if (index < 3) {
        // First 3 images: 33.333% width (3 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
      } else {
        // Last 4 images: 50% width (2 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
      }
    }
    
    // Special case: 10 images → 3-3-2-2 layout
    if (count === 10) {
      if (index < 6) {
        // First 6 images: 33.333% width (3 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
      } else {
        // Last 4 images: 50% width (2 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
      }
    }
    
    // Special case: 13 images → 3-3-3-2-2 layout
    if (count === 13) {
      if (index < 9) {
        // First 9 images: 33.333% width (3 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
      } else {
        // Last 4 images: 50% width (2 columns)
        return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
      }
    }
    
    // General rule: if count % 3 == 1, use 2-column for last 4 images
    if (count > 4 && count % 3 === 1) {
      const cutoff = count - 4; // Split point
      if (index < cutoff) {
        // First images: 3 columns
        return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
      } else {
        // Last 4 images: 2 columns
        return 'md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]';
      }
    }
    
    // Default: 3-column layout (works for 1, 2, 3, 5, 6, 8, 9, 11, 12, etc.)
    return 'md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]';
  };

  const isSpecialFourLayout = count === 4;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-6 pt-20 pb-16">
        {/* Back Navigation */}
        <Link
          href={`/gallery/${category}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-serif text-gray-900 mb-2">
            {formatSubcategoryName(subcategory)}
          </h1>
          <p className="text-base text-gray-600">
            {subcategoryImages.length} {subcategoryImages.length === 1 ? 'work' : 'works'}
          </p>
        </div>

        {/* Images - Smart flex layout with dynamic widths */}
        {isSpecialFourLayout ? (
          // Special 2x2 grid for exactly 4 images
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
            {subcategoryImages.map((image, index) => (
              <Link
                key={image.src}
                href={`/gallery/${category}/${subcategory}/${index}`}
                className="group relative overflow-hidden bg-white aspect-[3/4] w-full cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-full h-full transition-transform duration-700"
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <ResponsiveImage
                    src={getOptimizedImagePath(image.src)}
                    alt={image.alt}
                    className="object-contain w-full h-full"
                    priority={index < 6}
                  />
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Click hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    View Full Size
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Flex layout with smart width calculation for all other counts
          <div className="flex flex-wrap justify-center gap-6">
            {subcategoryImages.map((image, index) => (
              <Link
                key={image.src}
                href={`/gallery/${category}/${subcategory}/${index}`}
                className={`group relative overflow-hidden bg-white aspect-[3/4] w-full ${getLayoutClass(count, index)} max-w-[500px] cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className="w-full h-full transition-transform duration-700"
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <ResponsiveImage
                    src={getOptimizedImagePath(image.src)}
                    alt={image.alt}
                    className="object-contain w-full h-full"
                    priority={index < 6}
                  />
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Click hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    View Full Size
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-serif text-gray-900 mb-8">
            More {category}
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {[...new Set(
              images
                .filter(img => img.category === category && img.subcategory !== subcategory)
                .map(img => img.subcategory)
            )].map((otherSubcategory) => (
              <Link
                key={otherSubcategory}
                href={`/gallery/${category}/${otherSubcategory}`}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
              >
                {formatSubcategoryName(otherSubcategory)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}