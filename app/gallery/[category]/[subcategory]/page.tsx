import images from "../../../../data/images.json"; // relative
import ArtworkCard from "../../../../components/ArtworkCard"; // relative

type Img = { category: string; subcategory: string; src: string; alt: string; title?: string; medium?: string; size?: string; year?: string; };

export default function SubcategoryPage({ params }: { params: { category: string; subcategory: string } }) {
  const { category, subcategory } = params;
  const items = (images as Img[]).filter(i => i.category === category && i.subcategory === subcategory);
  if (!items.length) return <div className="p-8">No images for “{category}/{subcategory}”.</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-5xl font-serif capitalize">{subcategory.replaceAll("_"," ")}</h1>
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {items.map(img => (
          <div key={img.src} className="mb-6">
            <ArtworkCard
              src={img.src}
              alt={img.alt}
              title={img.title}
              medium={img.medium}
              size={img.size}
              year={img.year}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
