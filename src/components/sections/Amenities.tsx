'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const amenities = [
  {
    title: "Kawaki Forest Trails",
    cat: "Nature & Wellness",
    image: "/images/amenity_forest.png",
    desc: "A meticulously landscaped green corridor for morning runs and evening strolls."
  },
  {
    title: "Yoga & Wellness Studio",
    cat: "Energy & Flow",
    image: "/images/amenity_wellness.png",
    desc: "Ocean-facing studio designed for mindfulness and peak physical performance."
  },
  {
    title: "Podium Infinity Pool",
    cat: "Serenity & Sky",
    image: "/images/amenity_pool.png",
    desc: "An architectural marvel where the pool edge seamlessly meets the Arabian Sea."
  }
];

export const Amenities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRefs.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
      className="relative w-full py-32 bg-[#050505] overflow-hidden"
      id="amenities"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-[#0A1A2F]/30 to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)] relative z-10">
        
        <div className="text-center mb-20">
          <span className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-4 block">
            Crafted for an Elite Lifestyle
          </span>
          <h2 className="text-[clamp(32px,4.5vw,56px)] font-serif font-medium text-white leading-tight">
            Unmatched Amenities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {amenities.map((item, i) => (
            <div 
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className="group relative aspect-[3/4] rounded-[24px] overflow-hidden bg-white/5 cursor-pointer"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

              {/* Content Block */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2 block transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.cat}
                </span>
                <h3 className="text-[24px] font-serif font-medium text-white mb-4">
                  {item.title}
                </h3>
                <div className="h-0 overflow-hidden transition-all duration-500 group-hover:h-20">
                  <p className="text-[14px] leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Glass Rim Light */}
              <div className="absolute inset-0 border border-white/10 rounded-[24px] pointer-events-none group-hover:border-white/30 transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="px-10 py-4 rounded-full border border-white/20 text-white text-[12px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            View All 10+ Amenities
          </button>
        </div>

      </div>
    </section>
  );
};
