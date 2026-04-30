'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const values = [
  "Quality Commitment",
  "Innovative Practices",
  "Customer Satisfaction",
  "Sustainable Solutions",
  "Integrity & Transparency",
  "Excellence in Craft"
];

const checklist = [
  "Superior Spaces",
  "Innovative Designs",
  "Timely Delivery",
  "Client Relationships"
];

export const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Reveal Both Sides
      gsap.fromTo([leftRef.current, rightRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
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
      className="relative w-full py-32 bg-white"
      id="journey"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32">
          
          {/* Left: Our Journey */}
          <div ref={leftRef} className="flex flex-col">
            <span className="text-[12px] tracking-[0.25em] uppercase text-black/40 mb-4 block">
              What Drives Us
            </span>
            <h2 className="text-[clamp(32px,4vw,52px)] font-serif font-medium text-[#0a0a0a] leading-tight mb-10">
              Our Journey &<br />Commitment
            </h2>
            <p className="text-[16px] leading-[1.8] text-black/60 mb-10 max-w-[480px]">
              For over three decades, Yamuna Homes and Design Pvt. Ltd. has been shaping skylines across Karnataka — where trust is our foundation and quality is our signature.
            </p>
            
            <div className="flex flex-col gap-6">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center text-[10px] text-black/40">
                    ✓
                  </div>
                  <span className="text-[14px] font-serif tracking-wide text-black/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Our Values */}
          <div ref={rightRef} className="flex flex-col">
            <span className="text-[12px] tracking-[0.25em] uppercase text-black/40 mb-4 block">
              What We Stand For
            </span>
            <h2 className="text-[clamp(32px,4vw,52px)] font-serif font-medium text-[#0a0a0a] leading-tight mb-10">
              Core Values
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, i) => (
                <div 
                  key={i}
                  className="p-6 rounded-xl border border-black/[0.06] bg-[#FAFAF8] hover:border-black/20 hover:bg-white transition-all duration-300"
                >
                  <span className="text-[13px] font-serif text-black/80">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-10 rounded-2xl bg-[#0A1A2F] text-white">
              <span className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2 block">The Milestone</span>
              <h3 className="text-[28px] font-serif mb-4 leading-tight">30+ Years of Excellence</h3>
              <p className="text-[14px] opacity-70 leading-relaxed">
                A legacy of delivering premium living spaces that stand the test of time and architectural trends.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
