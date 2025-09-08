import "./globals.css";
import { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Harmony Baker",
  description: "Photography & Drawings",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased [font-feature-settings:'cv11','ss01']">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
