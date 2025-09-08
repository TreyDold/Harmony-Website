import Link from "next/link";
import images from "@/data/images.json";
import ScrollerRow from "@/components/ScrollerRow";

type Img = {
  category: string;
  subcategory: string;
  src: string;
  alt: string;
};

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category;
  const imgs = (images as Img[]).filter((i) => i.category === category);

  const subcats = Array.from(new Set(imgs.map((i) => i.subcategory)));

  const bySub: Record<string, Img[]> = {};
  subcats.forEach((sc) => {
    bySub[sc] = imgs.filter((i) => i.subcategory === sc);
  });

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-baseline justify-between">
        <h1 className="text-5xl font-serif capitalize">{category}</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Back to Gallery
        </Link>
      </div>

      {subcats.map((sc) => (
        <section key={sc} className="mt-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[32px] leading-none font-serif capitalize">
              {sc.replaceAll("_", " ")}
            </h2>
            <Link
              href={`/gallery/${category}/${sc}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              View all
            </Link>
          </div>

          <ScrollerRow
            items={bySub[sc].map((img) => ({
              src: img.src,
              alt: img.alt,
              href: `/gallery/${category}/${sc}`,
            }))}
          />
        </section>
      ))}
    </main>
  );
}
