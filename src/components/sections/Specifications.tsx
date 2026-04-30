'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const mainSpecs = [
  { value: 60, suffix: "+", label: "Floors Above Ground", desc: "The tallest residential structure in the region." },
  { value: 296, suffix: "", label: "Luxury Apartments", desc: "Exclusively designed for coastal serenity." },
  { value: 1, suffix: "", label: "Iconic Tower", desc: "A singular landmark on the Mangalore skyline." }
];

const subSpecs = [
  { value: 10, suffix: "+", label: "World-Class Amenities" },
  { value: 3, suffix: "+", label: "Acres of Greenery" },
  { value: 30, suffix: "+", label: "Years of Excellence" },
];

export const Specifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mainItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const subItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Main Specs Animation
      mainItemsRef.current.forEach((item, i) => {
        if (!item) return;
        const num = item.querySelector('.spec-num');
        const target = mainSpecs[i].value;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          }
        });

        tl.fromTo(item,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        if (num) {
          tl.fromTo(num,
            { innerText: 0 },
            {
              innerText: target,
              duration: 1.5,
              snap: { innerText: 1 },
              ease: 'power2.out',
            },
            '-=0.6'
          );
        }
      });

      // Sub Specs Animation
      gsap.fromTo(subItemsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current?.querySelector('.sub-specs-grid'),
            start: 'top 90%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-32 bg-white overflow-hidden"
      id="specifications"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="mb-20 text-center md:text-left">
          <span className="text-[12px] tracking-[0.2em] uppercase text-black/40 mb-4 block">
            Technical Excellence
          </span>
          <h2 className="text-[clamp(32px,4vw,52px)] font-serif font-medium text-[#0a0a0a] leading-tight max-w-[600px]">
            The Pinnacle of Coastal Architecture
          </h2>
        </div>

        {/* Main Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24">
          {mainSpecs.map((spec, i) => (
            <div 
              key={i}
              ref={el => { mainItemsRef.current[i] = el; }}
              className="flex flex-col p-8 rounded-2xl border border-black/[0.04] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-transform hover:translate-y-[-5px] duration-500"
            >
              <div className="flex items-baseline mb-4">
                <span className="spec-num text-[clamp(56px,6vw,84px)] font-serif font-light leading-none text-[#0a0a0a]">
                  0
                </span>
                <span className="text-[clamp(32px,3vw,42px)] font-serif font-light text-[#0a0a0a]">
                  {spec.suffix}
                </span>
              </div>
              <h3 className="text-[14px] tracking-[0.1em] uppercase font-medium text-black/80 mb-3">
                {spec.label}
              </h3>
              <p className="text-[14px] leading-relaxed text-black/50">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sub Specs Grid */}
        <div className="sub-specs-grid grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-black/[0.08] pt-16">
          {subSpecs.map((spec, i) => (
            <div 
              key={i}
              ref={el => { subItemsRef.current[i] = el; }}
              className="flex items-center gap-6"
            >
              <span className="text-[32px] font-serif font-light text-black/90">
                {spec.value}{spec.suffix}
              </span>
              <span className="text-[12px] tracking-wider uppercase text-black/40 leading-tight">
                {spec.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
