'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const ProjectIntro = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left Content Reveal
      gsap.fromTo(leftContentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Right Content Reveal
      gsap.fromTo(rightContentRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-white py-[80px] md:py-[140px] px-6 md:px-12 lg:px-24 overflow-hidden z-20"
      id="overview"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-20 items-start">
        
        {/* Left Side: Primary Content */}
        <div ref={leftContentRef} className="flex flex-col items-start text-left">
          <span className="text-[12px] tracking-[0.2em] uppercase text-black/50 mb-4 font-sans">
            Project Overview
          </span>
          <h2 className="text-[clamp(32px,4vw,56px)] font-serif font-medium leading-[1.2] text-[#0a0a0a] mb-8">
            Yamuna Sky City — South India’s Tallest Sea View Residential Tower
          </h2>
          <p className="text-[16px] md:text-[18px] leading-[1.7] text-black/75 max-w-[520px] font-sans">
            A landmark residential development designed to redefine coastal living, combining scale, architecture, and uninterrupted sea views.
          </p>
        </div>

        {/* Right Side: Highlight Block */}
        <div ref={rightContentRef} className="flex flex-col items-start md:mt-12">
          <ul className="space-y-6 md:space-y-8 w-full">
            {[
              "Tallest Sea View Tower in South India",
              "Premium Leisure Residences",
              "Strategically Located Coastal Address",
              "Architectural Landmark Design"
            ].map((highlight, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] mt-2.5 opacity-30 group-hover:opacity-100 transition-opacity" />
                <span className="text-[16px] md:text-[18px] leading-snug text-[#0a0a0a]/80 font-sans tracking-wide">
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};
