"use client";
import { useParams } from "next/navigation";
import data from "@/data/images.json";
import { GalleryItem } from "@/components/ImageCard";
import ScrollerRow from "@/components/ScrollerRow";

export default function PhotosCategory() {
  const { category } = useParams<{ category: string }>();
  const items = (data as GalleryItem[]).filter(d => d.collection === "photos" && d.tags.includes(category));
  const title = (category ?? "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <>
      <h1 className="font-serif text-3xl mb-6">Photos · {title}</h1>
      <ScrollerRow title={title} items={items} />
    </>
  );
}
    