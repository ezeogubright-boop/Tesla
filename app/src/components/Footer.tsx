import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../orbitron.css";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth entrance animation
  useEffect(() => {
    if (!textRef.current || !isVisible) return;

    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 0.3,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          end: 'top 60%',
          scrub: true,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isVisible]);

  // Soft 3D tilt effect based on mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = textRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Gentle tilt: max 8deg
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const el = textRef.current;
    if (el) {
      el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg)";
    }
  };

  return (
    <footer ref={footerRef} className="relative w-full flex flex-col items-center justify-center py-12 bg-transparent overflow-hidden">
      <h1
        ref={textRef}
        className="font-orbitron text-[12vw] font-extrabold text-center leading-none select-none relative text-white footer-gradient transition-opacity duration-300"
        style={{
          WebkitTextStroke: "2px #222",
          textShadow: "0 10px 50px rgba(0,0,0,0.12)",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        CYBERTRUCK
      </h1>
    </footer>
  );
};

export default Footer;
