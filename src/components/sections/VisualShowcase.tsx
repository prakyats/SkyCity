'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const VisualShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Media Reveal (Scale down effect)
      gsap.fromTo(mediaRef.current,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );

      // Content Reveal (Y slide)
      gsap.fromTo(contentRef.current,
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
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center bg-white overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)] w-full py-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-12 md:gap-20 items-center">
          
          {/* Left Side: Dominant Visual */}
          <div 
            ref={mediaRef}
            className="relative w-full h-[320px] md:h-[520px] rounded-[20px] overflow-hidden bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/visual_showcase_main.png" 
              alt="Living Above the Coastline" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Minimal Content */}
          <div 
            ref={contentRef}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <span className="text-[12px] tracking-[0.2em] uppercase text-black/50 mb-4 block">
              The Experience
            </span>
            <h2 className="text-[clamp(36px,4vw,52px)] font-serif font-medium leading-[1.2] text-[#0a0a0a] mb-6">
              Living Above the Coastline
            </h2>
            <p className="text-[16px] leading-[1.7] text-black/70 max-w-[420px]">
              An elevated lifestyle defined by expansive views, refined architecture, and seamless integration with the coastal environment.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
