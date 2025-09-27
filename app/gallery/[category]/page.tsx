// app/gallery/[category]/page.tsx - PRODUCTION VERSION
import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import images from "@/data/images.json";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ category: string }>;
}

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  // Convert "/gallery/photos/abstracts/Front_backsides.jpg" 
  // to "photos/abstracts/Front_backsides"
  return oldSrc
    .replace('/gallery/', '') // Remove /gallery/ prefix
    .replace(/\.(jpg|jpeg|png|webp)$/i, ''); // Remove file extension
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  
  // Validate category
  if (!["photos", "drawings"].includes(category)) {
    notFound();
  }

  // Get all images for this category
  const categoryImages = images.filter(img => img.category === category);
  
  // Get unique subcategories for this category
  const subcategories = [...new Set(categoryImages.map(img => img.subcategory))];

  // Format subcategory names for display
  const formatSubcategoryName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 space-y-16" style={{ paddingTop: '70px' }}> {/* FIXED: 160px top padding */}
        {subcategories.map((subcategory) => {
          const subcategoryImages = categoryImages.filter(img => img.subcategory === subcategory);
          
          return (
            <section key={subcategory}>
              <h2 className="text-3xl font-serif text-gray-900 mb-8 tracking-wide">
                {formatSubcategoryName(subcategory)}
              </h2>

              {/* Horizontal Scrolling Images - Now using optimized images */}
              <div className="flex overflow-x-auto scrollbar-none pb-4 max-w-[95%] mx-auto">
                {subcategoryImages.map((image, index) => (
                  <Link
                    key={image.src}
                    href={`/gallery/${category}/${subcategory}`}
                    className="flex-shrink-0 group"
                    style={{ marginRight: '32px' }}
                  >
                    <div className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-72 h-96">
                      <ResponsiveImage
                        src={getOptimizedImagePath(image.src)}
                        alt={image.alt}
                        className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}