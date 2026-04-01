import { useEffect, useRef, useState } from 'react';

export function UnbreakableSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / windowHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black px-4 sm:px-8"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Subtitle */}
        <p
          className={`text-white/60 text-xs tracking-[0.3em] uppercase mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          The Power of Innovation
        </p>

        {/* Large Title */}
        <h2
          className={`text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.05em] text-white mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translateY(${(1 - scrollProgress) * 30}px)`,
          }}
        >
          UNBREAKABLE
        </h2>

        {/* Cybertruck Image with Number Overlay */}
        <div
          className={`relative w-full max-w-6xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <img
            src="/cybertruck-rear.png"
            alt="Tesla Cybertruck Rear"
            className="w-full h-auto object-contain rounded-[30px]"
          />
          
          {/* Red glow effect */}
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-500/20 blur-3xl -z-10" />

          {/* Large Number */}
          <div
            className="absolute bottom-12 right-12 md:right-24"
            style={{
              transform: `translateY(${scrollProgress * -20}px)`,
            }}
          >
            <span className="text-8xl md:text-9xl font-extralight text-white/90">01</span>
          </div>

          {/* Description Text */}
          <div
            className={`absolute bottom-12 right-12 md:right-48 max-w-xs text-right transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <p className="text-white/60 text-sm leading-relaxed">
              The Tesla Cybertruck redefines what a truck can be, combining cutting-edge design, exceptional durability, and unmatched performance.
            </p>
          </div>
        </div>

        {/* Bottom Label */}
        <div
          className={`absolute bottom-12 left-6 lg:left-12 flex items-center gap-3 transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/40 rounded-full" />
          </div>
          <span className="text-white/40 text-xs uppercase tracking-wider">
            The Power of Innovation
          </span>
        </div>
      </div>

      {/* Side gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
    </section>
  );
}
