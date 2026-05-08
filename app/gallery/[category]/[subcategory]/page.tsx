"use client";

import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import imagesData from "@/data/images.json";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { use, useState, useEffect, useRef } from "react";

type ImageType = {
  category: string;
  subcategory: string;
  subsubcategory?: string;
  src: string;
  alt: string;
};

const allImages = imagesData as ImageType[];

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

const getOptimizedImagePath = (oldSrc: string) => {
  return oldSrc
    .replace('/gallery/', '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '');
};

const formatName = (name: string) =>
  name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export default function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = use(params);

  if (!["photos", "drawings"].includes(category)) notFound();

  const subcategoryImages = allImages.filter(
    img => img.category === category && img.subcategory === subcategory
  );

  if (subcategoryImages.length === 0) notFound();

  const hasSubsubcategories = subcategoryImages.some(img => img.subsubcategory);

  if (hasSubsubcategories) {
    return (
      <SubsubcategoryBrowsePage
        category={category}
        subcategory={subcategory}
        images={subcategoryImages}
      />
    );
  }

  return (
    <FlatSubcategoryPage
      category={category}
      subcategory={subcategory}
      images={subcategoryImages}
    />
  );
}

// ── Sub-subcategory browse: horizontal scroll per subsubcategory ──────────────

function SubsubcategoryBrowsePage({
  category,
  subcategory,
  images,
}: {
  category: string;
  subcategory: string;
  images: ImageType[];
}) {
  const subsubcats = [...new Set(images.map(img => img.subsubcategory).filter(Boolean))] as string[];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 space-y-14 sm:space-y-20 pt-28 sm:pt-36 pb-12 sm:pb-16">
        <div>
          <Link
            href={`/gallery/${category}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 sm:mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {formatName(category)}
          </Link>

          <h1 className="text-4xl sm:text-6xl font-serif text-gray-900 tracking-wide">
            {formatName(subcategory)}
          </h1>
        </div>

        {subsubcats.map((subsubcat) => {
          const subsubcatImages = images.filter(img => img.subsubcategory === subsubcat);
          return (
            <SubsubcategoryScrollSection
              key={subsubcat}
              category={category}
              subcategory={subcategory}
              subsubcategory={subsubcat}
              images={subsubcatImages}
            />
          );
        })}
      </div>
    </div>
  );
}

function SubsubcategoryScrollSection({
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [containerBounds, setContainerBounds] = useState({ left: 0, width: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateBounds = () => {
      if (scrollRef.current) {
        const rect = scrollRef.current.getBoundingClientRect();
        setContainerBounds({ left: rect.left, width: rect.width });
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
    const el = scrollRef.current;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateBounds);
    el?.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateBounds);
      el?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  const midpoint    = containerBounds.left + containerBounds.width / 2;
  const isLeftSide  = mouseX !== null && mouseX < midpoint;
  const isRightSide = mouseX !== null && mouseX >= midpoint;
  const numDots     = Math.min(images.length, 15);
  const activeDot   = Math.round(scrollProgress * (numDots - 1));

  return (
    <section>
      <Link
        href={`/gallery/${category}/${subcategory}/${subsubcategory}`}
        className="inline-block mb-6 sm:mb-10 group"
      >
        <h2 className="text-3xl sm:text-5xl font-serif text-gray-900 tracking-wide transition-colors duration-300 group-hover:text-gray-600">
          {formatName(subsubcategory)}
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
              href={`/gallery/${category}/${subcategory}/${subsubcategory}/${index}`}
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
                className={`transition-all duration-300 rounded-full cursor-pointer ${index === activeDot ? 'w-4 h-4 bg-teal-400' : 'w-3 h-3 bg-gray-400 hover:bg-gray-500'}`}
                aria-label={`Scroll to position ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Flat subcategory: grid layout ─────────────────────────────────────────────

function FlatSubcategoryPage({
  category,
  subcategory,
  images,
}: {
  category: string;
  subcategory: string;
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

  // Use full dataset for related categories — not the filtered prop
  const relatedSubcategories = [...new Set(
    allImages
      .filter(img => img.category === category && img.subcategory !== subcategory && !img.subsubcategory)
      .map(img => img.subcategory)
  )];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 pt-28 sm:pt-24 pb-12 sm:pb-16">
        <Link
          href={`/gallery/${category}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {formatName(category)}
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-2">
            {formatName(subcategory)}
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
                href={`/gallery/${category}/${subcategory}/${index}`}
                className="group relative overflow-hidden bg-white aspect-[3/4] w-full cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <FlatImageCard image={image} index={index} hoveredIndex={hoveredIndex} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
            {images.map((image, index) => (
              <Link
                key={image.src}
                href={`/gallery/${category}/${subcategory}/${index}`}
                className={`group relative overflow-hidden bg-white aspect-[3/4] w-[calc(50%-6px)] ${getLayoutClass(count, index)} max-w-[500px] cursor-pointer`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <FlatImageCard image={image} index={index} hoveredIndex={hoveredIndex} />
              </Link>
            ))}
          </div>
        )}

        {relatedSubcategories.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-6 sm:mb-8">
              More {formatName(category)}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedSubcategories.map((other) => (
                <Link
                  key={other}
                  href={`/gallery/${category}/${other}`}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                >
                  {formatName(other)}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlatImageCard({
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