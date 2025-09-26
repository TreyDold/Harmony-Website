"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  // Home page: Minimal overlay navigation like James Jean
  if (pathname === "/") {
    return (
      <header 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 50,
          width: '100%'
        }}
      >
        <div style={{ 
          width: '100%', 
          padding: '24px 16px',
          maxWidth: '1920px',
          margin: '0 auto'
        }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Artist name - Left side, responsive sizing */}
            <Link 
              href="/" 
              className="font-serif"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                fontWeight: 'normal',
                color: 'white',
                textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              HARMONY BAKER
            </Link>

            {/* Simple navigation - Right side with responsive spacing */}
            <nav 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(16px, 3vw, 32px)',
                flexShrink: 0,
                marginLeft: 'auto',
                paddingRight: 40,
              }}
            >
              <Link
                href="/gallery/drawings"
                style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                DRAWINGS
              </Link>
              <Link
                href="/gallery/photos"
                style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                PHOTOS
              </Link>
              <Link
                href="/contact"
                style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                CONTACT
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  // Other pages: Clean, minimal header
  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        width: '100%'
      }}
    >
      <div style={{ 
        width: '100%', 
        padding: '20px 16px',
        maxWidth: '1920px',
        margin: '0 auto'
      }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {/* Logo/Name - Left side, responsive */}
          <Link 
            href="/" 
            className="font-serif"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
              color: '#1a1a1a',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            HARMONY BAKER
          </Link>

          {/* Navigation - Right side with responsive spacing */}
          <nav 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'clamp(16px, 3vw, 32px)',
              flexShrink: 0,
              marginLeft: 'auto',
	      paddingRight: 40,
            }}
          >
            <Link
              href="/gallery/drawings"
              style={{
                fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: pathname.includes("/gallery/drawings") ? '#000000' : '#666666',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              DRAWINGS
            </Link>
            <Link
              href="/gallery/photos"
              style={{
                fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: pathname.includes("/gallery/photos") ? '#000000' : '#666666',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              PHOTOS
            </Link>
            <Link
              href="/contact"
              style={{
                fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: pathname === "/contact" ? '#000000' : '#666666',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
