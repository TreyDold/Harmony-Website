import Image from "next/image";

export type GalleryItem = {
  id: string;
  title: string;
  src: string;
  collection: "photos" | "drawings";
  tags: string[];
};

export default function ImageCard({ item }: { item: GalleryItem }) {
  return (
    <figure className="w-56 sm:w-64 shrink-0">
      <Image
        src={item.src}
        alt={item.title}
        width={640}
        height={800}
        className="h-56 sm:h-64 w-full object-cover rounded-md shadow-sm"
      />
      <figcaption className="mt-2 text-sm text-gray-700">{item.title}</figcaption>
    </figure>
  );
}
    