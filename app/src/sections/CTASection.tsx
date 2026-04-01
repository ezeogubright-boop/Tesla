import { useEffect, useRef, useState } from 'react';

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black px-4 sm:px-8"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`particle ${i % 2 === 0 ? 'particle-1' : 'particle-2'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-6 py-16 sm:py-24">
        {/* Subtitle */}
        <p
          className={`text-white/60 text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 transition-all duration-700 text-center ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          The Power of Innovation
        </p>

        {/* Main Title */}
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.05em] text-white mb-12 text-center transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          EXPERIENCE THE FUTURE<br />OF DRIVING
        </h2>

        {/* Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center gap-4 mb-16 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button className="btn-primary flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            Reserve Now
          </button>
          <button className="btn-outline">
            $9,990 $
          </button>
        </div>

        {/* Cybertruck Image with Video Thumbnail */}
        <div
          className={`relative w-full max-w-6xl mx-auto transition-all duration-1000 delay-600 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Main Image */}
          <div className="relative">
            <img
              src="/cybertruck-front.png"
              alt="Tesla Cybertruck Front"
              className="w-full h-auto object-contain"
            />
            
            {/* Tesla Logo Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                src="/Logo.png"
                alt="Tesla Logo"
                className="w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 drop-shadow-lg"
              />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent blur-3xl -z-10" />
          </div>

          {/* Video Thumbnail */}
          <div
            className={`absolute w-32 sm:w-40 md:w-48 lg:w-64 aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-white/20 transition-all duration-1000 delay-800 bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <video
              src="/trace.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              poster="/cybertruck-video-thumb.jpg"
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className={`absolute bottom-8 left-0 right-0 text-center transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/30 text-xs">
            © 2024 Tesla Motors. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-12 w-2 h-2 bg-white/20 rounded-full hidden lg:block" />
      <div className="absolute top-1/3 right-24 w-3 h-3 bg-white/10 rounded-full hidden lg:block" />
      <div className="absolute bottom-1/4 left-24 w-2 h-2 bg-white/15 rounded-full hidden lg:block" />
    </section>
  );
}
