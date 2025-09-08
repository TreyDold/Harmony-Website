"use client";

import Image from "next/image";
import Link from "next/link";

export default function ScrollerRow({
  items,
}: {
  items: { src: string; alt: string; href: string }[];
}) {
  return (
    <div className="flex gap-6 overflow-x-auto scrollbar-none pb-4">
      {items.map((item) => (
        <Link
          key={item.src}
          href={item.href}
          className="relative flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="300px"
          />
        </Link>
      ))}
    </div>
  );
}
