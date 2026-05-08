"use client";

import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { use } from "react";

type ImageType = {
  category: string;
  subcategory: string;
  subsubcategory?: string;
  src: string;
  alt: string;
};

const images = imagesData as ImageType[];

interface PageProps {
  params: Promise<{ category: string }>;
}

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

  // Get unique subcategories, preserving order
  const subcategories = [...new Set(categoryImages.map(img => img.subcategory))];

  const formatName = (name: string) =>
    name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 space-y-14 sm:space-y-20 pt-28 sm:pt-36 pb-12 sm:pb-16">
        {subcategories.map((subcategory) => {
          const subcategoryImages = categoryImages.filter(img => img.subcategory === subcategory);
          const hasSubsubcategories = subcategoryImages.some(img => img.subsubcategory);

          if (hasSubsubcategories) {
            return (
              <SubsubcategoryPreviewSection
                key={subcategory}
                category={category}
                subcategory={subcategory}
                images={subcategoryImages}
                formatName={formatName}
              />
            );
          }

          return (
            <SubcategorySection
              key={subcategory}
              category={category}
              subcategory={subcategory}
              images={subcategoryImages}
              formatName={formatName}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Subcategory with sub-subcategories: shows preview cards ──────────────────

function SubsubcategoryPreviewSection({
  category,
  subcategory,
  images,
  formatName,
}: {
  category: string;
  subcategory: string;
  images: ImageType[];
  formatName: (name: string) => string;
}) {
  const subsubcats = [...new Set(images.map(img => img.subsubcategory).filter(Boolean))] as string[];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section>
      <Link
        href={`/gallery/${category}/${subcategory}`}
        className="inline-block mb-6 sm:mb-10 group"
      >
        <h2 className="text-3xl sm:text-5xl font-serif text-gray-900 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {formatName(subcategory)}
        </h2>
      </Link>

      <div className="flex gap-4 sm:gap-6 flex-wrap">
        {subsubcats.map((subsubcat, index) => {
          const firstImage = images.find(img => img.subsubcategory === subsubcat);
          const count = images.filter(img => img.subsubcategory === subsubcat).length;

          return (
            <Link
              key={subsubcat}
              href={`/gallery/${category}/${subcategory}/${subsubcat}`}
              className="flex-shrink-0 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-52 h-72 sm:w-64 sm:h-80 bg-white">
                {firstImage && (
                  <div
                    className="w-full h-full transform transition-transform duration-500 ease-out"
                    style={{ transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)' }}
                  >
                    <ResponsiveImage
                      src={getOptimizedImagePath(firstImage.src)}
                      alt={firstImage.alt}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
                {/* Label overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-serif text-lg">{formatName(subsubcat)}</p>
                  <p className="text-white/70 text-sm">{count} works</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Standard subcategory: horizontal scroll of images ────────────────────────

function SubcategorySection({
  category,
  subcategory,
  images,
  formatName,
}: {
  category: string;
  subcategory: string;
  images: ImageType[];
  formatName: (name: string) => string;
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
        setContainerBounds({ left: rect.left, right: rect.right, width: rect.width });
        setShowScrollbar(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };

    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        setMouseX(e.clientY >= rect.top && e.clientY <= rect.bottom ? e.clientX : null);
      }
    };

    updateBounds();
    const scrollContainer = scrollRef.current;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateBounds);
    if (scrollContainer) scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateBounds);
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  const isInContainer = mouseX !== null;
  const containerMidpoint = containerBounds.left + containerBounds.width / 2;
  const isLeftSide  = isInContainer && mouseX < containerMidpoint;
  const isRightSide = isInContainer && mouseX >= containerMidpoint;

  const numDots = Math.min(images.length, 15);
  const activeDotIndex = Math.round(scrollProgress * (numDots - 1));

  return (
    <section>
      <Link
        href={`/gallery/${category}/${subcategory}`}
        className="inline-block mb-6 sm:mb-10 group"
      >
        <h2 className="text-3xl sm:text-5xl font-serif text-gray-900 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {formatName(subcategory)}
        </h2>
      </Link>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer hidden sm:block ${isLeftSide ? 'sm:opacity-100' : 'sm:opacity-0'}`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-opacity duration-300 cursor-pointer hidden sm:block ${isRightSide ? 'sm:opacity-100' : 'sm:opacity-0'}`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-none pb-6 gap-4 sm:gap-6 snap-x snap-mandatory sm:snap-none"
        >
          {images.map((image, index) => (
            <Link
              key={image.src}
              href={`/gallery/${category}/${subcategory}/${index}`}
              className="flex-shrink-0 cursor-pointer snap-start"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-52 h-72 sm:w-64 sm:h-80 bg-white">
                <div
                  className="w-full h-full transform transition-transform duration-500 ease-out"
                  style={{ transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)' }}
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

        {showScrollbar && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {Array.from({ length: numDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    const { scrollWidth, clientWidth } = scrollRef.current;
                    const maxScroll = scrollWidth - clientWidth;
                    scrollRef.current.scrollTo({ left: (index / (numDots - 1)) * maxScroll, behavior: 'smooth' });
                  }
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${index === activeDotIndex ? 'w-4 h-4 bg-teal-400' : 'w-3 h-3 bg-gray-400 hover:bg-gray-500'}`}
                aria-label={`Scroll to position ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}