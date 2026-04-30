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
          delay: 0.1,
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

      // 3. Highlight Items (Editorial Flow: First immediate, then stagger)
      const highlights = highlightItemsRef.current;
      if (highlights[0]) {
        gsap.fromTo(highlights[0],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      if (highlights.length > 1) {
        gsap.fromTo(highlights.slice(1),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.4, // 0.2 + 0.2 delay
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const highlights = [
    { title: "Tallest Sea View Tower in South India", desc: "A feat of engineering and coastal luxury." },
    { title: "Premium Leisure Residences", desc: "Designed for world-class living." },
    { title: "Strategically Located Coastal Address", desc: "Connected to the pulse of the ocean." },
    { title: "Architectural Landmark Design", desc: "A silhouette that redefines the skyline." }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-white z-[5] overflow-hidden antialiased subpixel-antialiased"
      style={{
        paddingTop: '120px',
        paddingBottom: '140px',
      }}
      id="overview"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)] relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-[100px] items-start">
          
          {/* Left Block: Primary Narrative */}
          <div 
            ref={leftContentRef} 
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <span className="text-[12px] tracking-[0.22em] uppercase text-black/45 mb-4 block select-none">
              Project Overview
            </span>
            <h2 
              className="text-[clamp(32px,4.5vw,64px)] font-serif font-medium leading-[1.1] text-[#0a0a0a] mb-8"
              style={{ 
                letterSpacing: '-0.01em',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              Yamuna Sky City — South India’s Tallest Sea View Residential Tower
            </h2>
            <p className="text-[16px] leading-[1.7] text-black/65 max-w-[500px]">
              A landmark residential development designed to redefine coastal living, combining scale, architecture, and uninterrupted sea views.
            </p>
          </div>

          {/* Right Block: Highlights Structure (Editorial Upgrade) */}
          <div 
            ref={rightContentRef} 
            className="flex flex-col w-full relative"
            style={{ 
              transform: 'translateY(clamp(12px, 2vw, 28px))' 
            }}
          >
            {/* Vertical Line Connector (Option A) */}
            <div className="absolute left-[5.5px] top-[10px] bottom-[40px] w-[1px] bg-black/5 hidden md:block" />

            <ul className="flex flex-col w-full gap-6">
              {highlights.map((item, index) => (
                <li 
                  key={index}
                  ref={el => { highlightItemsRef.current[index] = el; }}
                  className={`flex items-start gap-8 py-10 group transition-all duration-300 ${index === 0 ? '' : 'border-t border-black/[0.06]'}`}
                >
                  {/* Detached Index */}
                  <span 
                    className="text-[10px] opacity-40 tracking-[0.15em] font-medium min-w-[12px] pt-[6px] select-none z-10 bg-white"
                    style={{ transform: 'translateY(6px)' }}
                  >
                    0{index + 1}
                  </span>

                  {/* Content Block */}
                  <div className="flex flex-col gap-2">
                    <h3 
                      className={`font-medium leading-[1.3] text-[#0a0a0a] transition-colors group-hover:text-black ${index === 0 ? 'text-[26px]' : 'text-[22px]'}`}
                      style={{ letterSpacing: '-0.005em' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed text-black/60 max-w-[320px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.desc}
                    </p>
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
