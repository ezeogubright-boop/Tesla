import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function UnbreakableSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

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

  // Smooth entrance animations
  useEffect(() => {
    if (!contentRef.current || !isVisible) return;

    const elements = [
      { ref: subtitleRef, delay: 0 },
      { ref: titleRef, delay: 0.15 },
      { ref: imageRef, delay: 0.3 },
      { ref: descRef, delay: 0.45 },
      { ref: labelRef, delay: 0.6 },
    ];

    elements.forEach(({ ref, delay }) => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 50%',
            scrub: true,
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isVisible]);

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
      <div ref={contentRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-white/60 text-xs tracking-[0.3em] uppercase mb-8"
        >
          The Power of Innovation
        </p>

        {/* Large Title */}
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.05em] text-white mb-12"
          style={{
            transform: `translateY(${(1 - scrollProgress) * 30}px)`,
          }}
        >
          UNBREAKABLE
        </h2>

        {/* Cybertruck Image with Number Overlay */}
        <div
          ref={imageRef}
          className="relative w-full max-w-6xl mx-auto"
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
            ref={descRef}
            className="absolute bottom-12 right-12 md:right-48 max-w-xs text-right"
          >
            <p className="text-white/60 text-sm leading-relaxed">
              The Tesla Cybertruck redefines what a truck can be, combining cutting-edge design, exceptional durability, and unmatched performance.
            </p>
          </div>
        </div>

        {/* Bottom Label */}
        <div
          ref={labelRef}
          className="absolute bottom-12 left-6 lg:left-12 flex items-center gap-3"
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
