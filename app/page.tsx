import RotatingHero from "@/components/RotatingHero";

export default function Home() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-black">
      {/* Full-screen rotating hero */}
      <RotatingHero
        intervalMs={8000}  // Slower transitions like James Jean
        pick={8}
      />

      {/* Minimal overlay - just the header handles navigation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
    </div>
  );
}