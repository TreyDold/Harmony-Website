import Link from "next/link";
import RotatingHero from "@/components/RotatingHero";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Rotating full-bleed hero */}
      <RotatingHero
        intervalMs={6000}
        pick={10}
        // example: use everything. To limit: (i)=> i.category==="photos"
        filter={(i) => true}
      />

      {/* Overlay content area */}
      <section className="-mt-28 relative z-10 px-6">
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-8 sm:p-10">
          <h1 className="text-5xl sm:text-6xl font-serif">Harmony Baker</h1>
          <p className="mt-3 text-lg text-gray-700">
            Selected works in photography and drawing.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/gallery/photos"
              className="rounded-full px-5 py-2.5 bg-amber-300/80 hover:bg-amber-400 text-amber-950 font-medium shadow-sm transition"
            >
              View Photos
            </Link>
            <Link
              href="/gallery/drawings"
              className="rounded-full px-5 py-2.5 bg-white hover:bg-amber-100 text-gray-800 border border-amber-200 transition"
            >
              View Drawings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
