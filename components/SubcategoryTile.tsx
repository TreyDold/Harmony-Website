"use client";
import Image from "next/image";
import Link from "next/link";

export default function SubcategoryTile({
  href,
  coverSrc,
  title,
}: { href: string; coverSrc: string; title: string }) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
    >
      <Image
        src={coverSrc}
        alt={title}
        width={1600}
        height={1066}
        className="w-full h-full object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
      <div className="absolute left-4 bottom-4 text-white text-xl font-semibold drop-shadow">
        {title.replaceAll("_", " ")}
      </div>
    </Link>
  );
}
