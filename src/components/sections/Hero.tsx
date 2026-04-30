'use client';

import React, { useEffect, useRef } from 'react';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animation = initHeroAnimations(overlayRef, contentRef, videoWrapperRef);
    
    return () => {
      // Cleanup GSAP animations on unmount
      if (animation) {
        animation.kill();
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero Section"
    >
      {/* 1. Background Video Layer (z-0) */}
      <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <VideoBackground
          desktopSrc="/videos/hero/hero-desktop.mp4" 
          mobileSrc="/videos/hero/hero-mobile.mp4"
          posterSrc="/images/hero/hero-poster.jpg"
        />
      </div>

      {/* 2. Dark Gradient Overlay (z-10) */}
      {/* Left to right gradient for text readability */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0A1A2F]/95 to-transparent md:bg-none md:bg-[linear-gradient(to_right,#0A1A2F_15%,rgba(10,26,47,0.6)_55%,transparent_85%)]"
        aria-hidden="true"
      />

      {/* 3. Content Layer (z-20) */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row justify-between items-center px-6 md:px-[6vw] w-full h-full">
        
        <div ref={contentRef} className="flex flex-col items-start gap-8 w-full max-w-[420px] md:ml-[clamp(24px,6vw,80px)] mt-24 md:mt-0">
          
          {/* Tagline */}
          <span className="text-[#D4AF37]/80 font-medium tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-sm mb-2">
            Where every day feels like a holiday —
          </span>

          {/* Main Heading */}
          {/* Using a serif font stack, usually applied via Tailwind theme configuration, but applied inline/class here for demonstration */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.1] md:leading-[1.1] font-serif tracking-tight">
            Sky City
            <br />
            <span className="italic text-white/95">Sea View </span> 
            Homes.
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <button 
              className="bg-[#D4AF37] hover:bg-[#C5A030] text-white px-8 py-4 rounded-full font-semibold transition-colors duration-300 shadow-lg shadow-[#D4AF37]/20"
              aria-label="Explore More"
            >
              Explore More
            </button>
            
            <button 
              className="border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
              aria-label="Book a Visit"
            >
              Book a Visit
            </button>
          </div>
          
        </div>
      </div>

      {/* Optional Micro Text */}
      <div className="absolute bottom-6 left-6 md:left-12 lg:left-20 z-20 opacity-40 hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-xs tracking-wider uppercase font-light">
          RERA NO. UPRERAPRJ123456
        </p>
      </div>

    </section>
  );
};
