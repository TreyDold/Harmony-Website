"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={clsx(
        "px-4 py-1.5 rounded-full text-sm sm:text-base transition",
        active
          ? "bg-amber-300/80 text-amber-950 shadow"
          : "text-gray-700 hover:bg-amber-100"
      )}
    >
      {children}
    </Link>
  );
};

export default function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl hover:opacity-80">
          Harmony Baker
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink href="/">Gallery</NavLink>
          <NavLink href="/gallery/photos">Photos</NavLink>
          <NavLink href="/gallery/drawings">Drawings</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
