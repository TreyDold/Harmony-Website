// app/gallery/[category]/[subcategory]/page.tsx
import Link from "next/link";
import Image from "next/image";
import images from "@/data/images.json";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  
  // Validate category
  if (!["photos", "drawings"].includes(category)) {
    notFound();
  }

  // Get images for this specific subcategory
  const subcategoryImages = images.filter(
    img => img.category === category && img.subcategory === subcategory
  );

  // If no images found, 404
  if (subcategoryImages.length === 0) {
    notFound();
  }

  // Format subcategory name for display
  const formatSubcategoryName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        {/* Back Navigation */}
        <Link
          href={`/gallery/${category}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-amber-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 mb-2">
            {formatSubcategoryName(subcategory)}
          </h1>
          <p className="text-lg text-gray-600">
            {subcategoryImages.length} {subcategoryImages.length === 1 ? 'work' : 'works'} 
            {' '}in {category.slice(0, -1)}
          </p>
        </div>

        {/* Images Grid - James Jean style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {subcategoryImages.map((image, index) => {
            // Vary the aspect ratios for visual interest
            const aspectRatios = [
              "aspect-[3/4]",   // Portrait
              "aspect-[4/3]",   // Landscape  
              "aspect-[1/1]",   // Square
              "aspect-[5/4]",   // Slightly wide
            ];
            const aspectRatio = aspectRatios[index % aspectRatios.length];

            return (
              <div
                key={image.src}
                className={`group ${aspectRatio} relative overflow-hidden rounded-lg bg-gray-100`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                
                {/* Image title on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">
                    {image.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Related Categories */}
        <div className="mt-16 pt-16 border-t border-gray-100">
          <h2 className="text-2xl font-serif text-gray-900 mb-8">
            More {category}
          </h2>
          
          <div className="flex flex-wrap gap-4">
            {/* Get other subcategories in this category */}
            {[...new Set(
              images
                .filter(img => img.category === category && img.subcategory !== subcategory)
                .map(img => img.subcategory)
            )].map((otherSubcategory) => (
              <Link
                key={otherSubcategory}
                href={`/gallery/${category}/${otherSubcategory}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
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