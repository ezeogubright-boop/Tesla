import { useEffect, useRef, useState } from 'react';
import { CybertruckViewer } from '../components/CybertruckViewer';

export function StatsSection() {
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Cybertruck 3D Model */}
        <div
          className={`relative w-full max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <CybertruckViewer />
        </div>

        {/* Tagline */}
        <div
          className={`text-center mt-12 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-white text-lg md:text-xl uppercase tracking-[0.15em] leading-relaxed">
            Go Farther.<br />
            Tow Heavier.<br />
            Conquer Every Terrain.
          </p>
          
          <button className="mt-8 px-8 py-3 border border-white/30 text-white text-sm uppercase tracking-wider rounded-full hover:bg-white/5 hover:border-white/50 transition-all duration-300">
            Experience
          </button>
        </div>
      </div>

      {/* Scroll indicator line */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </div>
    </section>
  );
}
