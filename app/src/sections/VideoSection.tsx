import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function VideoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!videoContainerRef.current) return;

    gsap.fromTo(
      videoContainerRef.current,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: videoContainerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black px-2 sm:px-4 md:px-8 py-8 sm:py-12"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
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
      <div className="relative z-10 flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 max-w-6xl mx-auto">
        {/* Car Features Video */}
        <div
          ref={videoContainerRef}
          className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <video
            src="/car features.mp4"
            autoPlay
            loop
            muted
            className="w-full h-auto object-cover"
          />

          {/* Stats Badges Overlay */}
          <div className="absolute inset-0 flex items-start justify-start p-2 sm:p-4 md:p-8 lg:p-12 pointer-events-none">
            <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
              {/* Stat Badge 1 */}
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2 sm:px-3 md:px-4 lg:px-5 py-0.5 sm:py-1 md:py-2 hover:bg-white/15 transition-all duration-300">
                <div>
                  <div className="text-xs sm:text-sm md:text-lg lg:text-lg font-light text-white">0-60mph</div>
                  <div className="text-[7px] sm:text-[9px] md:text-xs lg:text-xs text-white/70 uppercase tracking-wider">2.9 Sec</div>
                  <div className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[10px] text-white/50 uppercase tracking-wider">Accel</div>
                </div>
              </div>

              {/* Stat Badge 2 */}
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2 sm:px-3 md:px-4 lg:px-5 py-0.5 sm:py-1 md:py-2 hover:bg-white/15 transition-all duration-300">
                <div>
                  <div className="text-xs sm:text-sm md:text-lg lg:text-lg font-light text-white">500HP</div>
                  <div className="text-[7px] sm:text-[9px] md:text-xs lg:text-xs text-white/70 uppercase tracking-wider">Range</div>
                  <div className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[10px] text-white/50 uppercase tracking-wider">1 Charge</div>
                </div>
              </div>

              {/* Stat Badge 3 */}
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-2 sm:px-3 md:px-4 lg:px-5 py-0.5 sm:py-1 md:py-2 hover:bg-white/15 transition-all duration-300">
                <div>
                  <div className="text-xs sm:text-sm md:text-lg lg:text-lg font-light text-white">+10K</div>
                  <div className="text-[7px] sm:text-[9px] md:text-xs lg:text-xs text-white/70 uppercase tracking-wider">Towing</div>
                  <div className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[10px] text-white/50 uppercase tracking-wider">Capacity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
