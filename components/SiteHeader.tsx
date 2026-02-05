"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  // Home page: Overlay navigation on hero
  if (pathname === "/") {
    return (
      <header className="absolute top-0 left-0 right-0 z-50 w-full">
        <div className="w-full px-4 py-6 max-w-[1920px] mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            {/* Artist name */}
            <Link
              href="/"
              className="font-serif shrink-0"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                fontWeight: 'normal',
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
              }}
            >
              HARMONY BAKER
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-4 sm:gap-[clamp(16px,3vw,32px)] sm:ml-auto sm:pr-10">
              {["drawings", "photos", "contact"].map((item) => (
                <Link
                  key={item}
                  href={item === "contact" ? "/contact" : `/gallery/${item}`}
                  className="text-white whitespace-nowrap py-1.5"
                  style={{
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textShadow: '0 3px 10px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)',
                    textDecoration: 'none',
                  }}
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Other pages: Fixed minimal header
  const navItems = [
    { label: "DRAWINGS", href: "/gallery/drawings", active: pathname.includes("/gallery/drawings") },
    { label: "PHOTOS", href: "/gallery/photos", active: pathname.includes("/gallery/photos") },
    { label: "CONTACT", href: "/contact", active: pathname === "/contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="w-full px-4 py-4 max-w-[1920px] mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          {/* Logo/Name */}
          <Link
            href="/"
            className="font-serif shrink-0"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
              color: '#1a1a1a',
              letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            HARMONY BAKER
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-[clamp(16px,3vw,32px)] sm:ml-auto sm:pr-10">
            {navItems.map(({ label, href, active }) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap"
                style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: active ? '#000000' : '#666666',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}