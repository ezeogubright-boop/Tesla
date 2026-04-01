import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import gsap from 'gsap';

export function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Create floating particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = `particle ${Math.random() > 0.5 ? 'particle-1' : 'particle-2'}`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  // Blur to clarity animation on page load
  useEffect(() => {
    if (!sectionRef.current) return;

    // Start with blur
    sectionRef.current.style.filter = 'blur(15px)';
    sectionRef.current.style.opacity = '0.8';

    // Animate to clarity
    gsap.to(sectionRef.current, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut',
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-black"
      style={{
        backgroundImage: 'url(/cybertruck-hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      {/* Smoke effect */}
      <div className="absolute bottom-0 left-0 right-0 h-64">
        <div className="smoke-effect" style={{ animationDelay: '0s' }} />
        <div className="smoke-effect" style={{ animationDelay: '10s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 md:px-16 pt-20 md:pt-32">
        {/* Subtitle */}
        <p className="text-white/60 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 animate-fade-in text-center">
          The Power of Innovation
        </p>

        {/* Main Title */}
        <h1 className="w-full font-orbitron text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.1em] text-white mb-8 animate-reveal-up glow-text text-center">
          CYBERTRUCK
        </h1>

        {/* Cybertruck Image removed, now background */}
        {/* Glow effect behind truck removed, now handled by background */}

        {/* Bottom Info Bar */}
        <div className="absolute bottom-6 sm:bottom-10 md:bottom-12 left-0 right-0 px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Left - 30X */}
            <div className="flex items-center gap-2 sm:gap-3 animate-reveal-up delay-300">
              <span className="text-2xl sm:text-4xl md:text-5xl font-light text-white">30X</span>
              <span className="text-white/60 text-xs sm:text-sm uppercase tracking-wider leading-tight">
                Ultra-Hard<br />Stainless Steel
              </span>
            </div>

            {/* Center - CTA */}
            <div className="flex flex-col items-center gap-2 sm:gap-3 animate-reveal-up delay-400">
              <button className="flex items-center gap-2 sm:gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white/60 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                <span className="text-xs sm:text-sm uppercase tracking-wider text-center">See the Cybertruck in Action</span>
              </button>
            </div>

            {/* Right - Tagline */}
            <div className="text-center md:text-right animate-reveal-up delay-500">
              <p className="text-white text-xs sm:text-sm uppercase tracking-[0.2em] leading-relaxed">
                Unbreakable.<br />
                Unstoppable.<br />
                Unrivaled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side decorative elements */}
      <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 lg:gap-4">
        <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-white/40 rounded-full" />
        </div>
        <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-white/40 rotate-45" />
        </div>
        <div className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center">
          <div className="w-2 h-2 border border-white/40 rounded-full" />
        </div>
      </div>
    </section>
  );
}
