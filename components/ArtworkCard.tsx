"use client";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  title?: string;
  medium?: string;
  size?: string;
  year?: string;
};

export default function ArtworkCard({ src, alt, title, medium, size, year }: Props) {
  return (
    <figure className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm bg-white">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1066}
        className="w-full h-auto object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <figcaption className="p-3 text-sm leading-5 text-gray-700">
        <div className="font-medium">{title || alt}</div>
        <div className="text-gray-500">
          {[medium, size, year].filter(Boolean).join(" · ")}
        </div>
      </figcaption>
    </figure>
  );
}
