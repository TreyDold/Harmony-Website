"use client";

import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

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

        {/* Images Grid - 3 columns, vertical scrolling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategoryImages.map((image, index) => (
            <div
              key={image.src}
              className="group relative overflow-hidden bg-gray-50 aspect-[3/4]"
            >
              <ResponsiveImage
                src={getOptimizedImagePath(image.src)}
                alt={image.alt}
                className="object-cover transition-all duration-700 group-hover:scale-105 w-full h-full"
                priority={index < 6}
              />
              
              {/* Hover overlay - hidden by default, shows on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

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