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
      // Main Reveal Sequence with Breathing Delay (0.2s)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        }
      });

      // Left Block Reveal (Directional First)
      tl.fromTo(leftContentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2, // breathing room after hero
          ease: 'power3.out',
        }
      );

      // Right Block & Staggered Highlights (Directional Second)
      tl.fromTo(rightContentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        "-=0.7"
      );

      tl.fromTo(highlightItemsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power2.out',
        },
        "-=0.6"
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
      className="relative w-full z-20 -mt-[100px] overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0A1A2F 0%, #0A1A2F 20%, #FFFFFF 60%)',
        paddingTop: '180px',
        paddingBottom: '140px',
      }}
      id="overview"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-[100px] items-start">
          
          {/* Left Block: Primary Narrative */}
          <div 
            ref={leftContentRef} 
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <span className="text-[12px] tracking-[0.22em] uppercase text-black/45 mb-4">
              Project Overview
            </span>
            <h2 
              className="text-[clamp(28px,4.5vw,64px)] font-serif font-medium leading-[1.15] text-[#0a0a0a] mb-8"
              style={{ letterSpacing: '-0.005em' }}
            >
              Yamuna Sky City — South India’s Tallest Sea View Residential Tower
            </h2>
            <p className="text-[16px] leading-[1.7] text-black/70 max-w-[520px]">
              A landmark residential development designed to redefine coastal living, combining scale, architecture, and uninterrupted sea views.
            </p>
          </div>

          {/* Right Block: Highlights Structure (Asymmetric Offset) */}
          <div 
            ref={rightContentRef} 
            className="flex flex-col items-center md:items-start md:mt-[68px]" // 20px additional offset from previous mt-12
          >
            <ul className="flex flex-col w-full max-w-[320px] md:max-w-none">
              {highlights.map((highlight, index) => (
                <li 
                  key={index}
                  ref={el => { highlightItemsRef.current[index] = el; }}
                  className="flex flex-col items-center md:items-start py-4 border-b border-black/10 last:border-0 hover:opacity-80 transition-opacity cursor-default group"
                >
                  <span className="text-[11px] opacity-40 tracking-[0.15em] mb-2 font-medium">
                    0{index + 1}
                  </span>
                  <span className="text-[18px] md:text-[20px] font-medium leading-[1.4] text-[#0a0a0a] group-hover:translate-x-1 transition-transform duration-300">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};
