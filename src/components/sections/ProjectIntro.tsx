'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const ProjectIntro = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const highlightItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Left Block Reveal
      gsap.fromTo(leftContentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true,
          }
        }
      );

      // 2. Right Block Reveal
      gsap.fromTo(rightContentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true,
          }
        }
      );

      // 3. Highlight Items
      gsap.fromTo(highlightItemsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: 0.35,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
            invalidateOnRefresh: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    "Tallest Sea View Tower in South India",
    "Premium Leisure Residences",
    "Strategically Located Coastal Address",
    "Architectural Landmark Design"
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full z-20 -mt-[100px] overflow-hidden antialiased subpixel-antialiased"
      style={{
        backgroundColor: '#0A1A2F', // Hard fallback
        background: 'linear-gradient(to bottom, #0A1A2F 0%, #0A1A2F 18%, rgba(10, 26, 47, 0.85) 28%, rgba(255, 255, 255, 0.6) 48%, #FFFFFF 65%)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        paddingTop: '180px',
        paddingBottom: '140px',
      }}
      id="overview"
    >
      {/* EDGE BLEND SAFETY: Pointer-events: none is mandatory */}
      <div 
        className="absolute top-0 left-0 w-full h-[120px] pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #0A1A2F, transparent)'
        }}
      />

      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)] relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-[100px] items-start">
          
          {/* Left Block: Primary Narrative */}
          <div 
            ref={leftContentRef} 
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <span className="text-[12px] tracking-[0.22em] uppercase text-black/45 mb-4 block select-none">
              Project Overview
            </span>
            <h2 
              className="text-[clamp(28px,4.5vw,64px)] font-serif font-medium leading-[1.15] text-[#0a0a0a] mb-8"
              style={{ 
                letterSpacing: '-0.005em',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              Yamuna Sky City — South India’s Tallest Sea View Residential Tower
            </h2>
            <p className="text-[16px] leading-[1.7] text-black/70 max-w-[520px]">
              A landmark residential development designed to redefine coastal living, combining scale, architecture, and uninterrupted sea views.
            </p>
          </div>

          {/* Right Block: Highlights Structure (Optimized with will-change) */}
          <div 
            ref={rightContentRef} 
            className="flex flex-col items-center md:items-start w-full will-change-transform"
            style={{ 
              transform: 'translateY(clamp(12px, 2vw, 28px))' 
            }}
          >
            <ul className="flex flex-col w-full max-w-[320px] md:max-w-none">
              {highlights.map((highlight, index) => (
                <li 
                  key={index}
                  ref={el => { highlightItemsRef.current[index] = el; }}
                  className="flex flex-col items-center md:items-start py-[18px] border-b border-black/10 last:border-0 hover:opacity-75 transition-opacity duration-300 cursor-default"
                >
                  <span className="text-[11px] opacity-40 tracking-[0.15em] mb-2 font-medium">
                    0{index + 1}
                  </span>
                  <div className="relative w-full text-center md:text-left">
                    <span className="text-[18px] md:text-[20px] font-medium leading-[1.4] text-[#0a0a0a]">
                      {highlight}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};
