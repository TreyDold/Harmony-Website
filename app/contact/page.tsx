// app/contact/page.tsx
export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-serif text-gray-900 mb-8">
          Contact
        </h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="text-xl leading-relaxed mb-8">
            Thank you for your interest in my work. I'm always excited to connect 
            with fellow artists, collectors, and anyone passionate about visual storytelling.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                For inquiries about prints or originals:
              </h3>
              <p>
                <a 
                  href="mailto:harmony@example.com" 
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  curlyharmony@gmail.com 
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Follow my work:
              </h3>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Instagram
                </a>
                <a 
                  href="#" 
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Behance
                </a>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Currently based in San Francisco, California. 
                Available for commissions and collaborations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}