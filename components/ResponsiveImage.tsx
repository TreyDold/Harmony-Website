'use client';

import Image from 'next/image';

interface ResponsiveImageProps {
  src: string; // Just the path like "photos/abstracts/Front_backsides"
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = "", 
  priority = false
}: ResponsiveImageProps) {
  const basePath = `/images/optimized`;
  
  // Use explicit dimensions that match container aspect ratios
  // Container is w-72 h-96 (288×384px = 3:4 ratio)
  // Using 600×800 to maintain that ratio
  return (
    <Image
      src={`${basePath}/medium/${src}.webp`}
      alt={alt}
      width={600}
      height={800}
      className={className}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}