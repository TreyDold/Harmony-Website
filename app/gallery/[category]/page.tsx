"use client";

import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { use } from "react";

// Define the image type
type ImageType = {
  category: string;
  subcategory: string;
  src: string;
  alt: string;
};

const images = imagesData as ImageType[];

interface PageProps {
  params: Promise<{ category: string }>;
}

// Helper function to convert old paths to optimized paths
const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params);
  
  if (!["photos", "drawings"].includes(category)) {
    notFound();
  }

  const categoryImages = images.filter(img => img.category === category);
  const subcategories = [...new Set(categoryImages.map(img => img.subcategory))];

  const formatSubcategoryName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 space-y-20" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        {subcategories.map((subcategory) => {
          const subcategoryImages = categoryImages.filter(img => img.subcategory === subcategory);
          
          return (
            <SubcategorySection 
              key={subcategory}
              category={category}
              subcategory={subcategory}
              images={subcategoryImages}
              formatSubcategoryName={formatSubcategoryName}
            />
          );
        })}
      </div>
    </div>
  );
}

function SubcategorySection({ 
  category, 
  subcategory, 
  images, 
  formatSubcategoryName 
}: { 
  category: string;
  subcategory: string;
  images: ImageType[];
  formatSubcategoryName: (name: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [containerBounds, setContainerBounds] = useState({ left: 0, right: 0, width: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        setContainerBounds({
          left: rect.left,
          right: rect.right,
          width: rect.width
        });
        
        // Check if content is scrollable
        const isScrollable = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
        setShowScrollbar(isScrollable);
      }
    };

    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        setScrollProgress(progress);
      }
    };

    updateBounds();

    const handleMouseMove = (e: MouseEvent) => {
      if (scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          setMouseX(e.clientX);
        } else {
          setMouseX(null);
        }
      }
    };

    const handleResize = () => {
      updateBounds();
    };

    const scrollContainer = scrollRef.current;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isInContainer = mouseX !== null;
  const containerMidpoint = containerBounds.left + (containerBounds.width / 2);
  const isLeftSide = isInContainer && mouseX < containerMidpoint;
  const isRightSide = isInContainer && mouseX >= containerMidpoint;

  // Calculate number of dots based on number of images
  const numDots = Math.min(images.length, 15); // Max 15 dots
  const activeDotIndex = Math.round(scrollProgress * (numDots - 1));

  return (
    <section>
      {/* Clickable category title */}
      <Link 
        href={`/gallery/${category}/${subcategory}`}
        className="inline-block mb-10 group"
      >
        <h2 className="text-5xl font-serif text-gray-900 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {formatSubcategoryName(subcategory)}
        </h2>
      </Link>

      {/* Container with arrows */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer ${
            isLeftSide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer ${
            isRightSide ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Horizontal scrolling images */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none pb-6 gap-6"
        >
          {images.map((image, index) => (
            <Link
              key={image.src}
              href={`/gallery/${category}/${subcategory}/${index}`}
              className="flex-shrink-0 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-64 h-80 bg-white">
                <div 
                  className="w-full h-full transform transition-transform duration-500 ease-out"
                  style={{
                    transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <ResponsiveImage
                    src={getOptimizedImagePath(image.src)}
                    alt={image.alt}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Custom scrollbar indicator */}
        {showScrollbar && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: numDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const { scrollWidth, clientWidth } = scrollRef.current;
                    const maxScroll = scrollWidth - clientWidth;
                    const targetScroll = (index / (numDots - 1)) * maxScroll;
                    scrollRef.current.scrollTo({
                      left: targetScroll,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === activeDotIndex
                    ? 'w-4 h-4 bg-teal-400'
                    : 'w-3 h-3 bg-gray-400 hover:bg-gray-500'
                }`}
                aria-label={`Scroll to position ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}