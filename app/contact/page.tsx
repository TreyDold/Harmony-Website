// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-8 pt-24 pb-16">
      <div className="max-w-xl mx-auto w-full">

        <p
          className="mb-16"
          style={{
            fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#666666',
          }}
        >
          Contact
        </p>

        <h1
          className="font-serif mb-16 leading-tight"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#1a1a1a', fontWeight: 'normal' }}
        >
          Let&apos;s work<br />together.
        </h1>

        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '2rem' }}>
          <a
            href="mailto:curlyharmony@gmail.com"
            className="font-serif block mb-4 hover:opacity-50"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: '#1a1a1a', textDecoration: 'none' }}
          >
            curlyharmony@gmail.com
          </a>
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.05em', color: '#666666' }}>
            Bay Area, California
          </p>
        </div>

      </div>
    </div>
  );
}