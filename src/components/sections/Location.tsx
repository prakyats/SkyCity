'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const connectivity = [
  { icon: "📍", label: "Kulai, New Mangalore", sub: "Prime coastal address" },
  { icon: "🌊", label: "~300m from Arabian Sea", sub: "Every residence faces the ocean" },
  { icon: "✈️", label: "~12km Mangalore Airport", sub: "NH-66 Corridor access" },
  { icon: "🚂", label: "Surathkal Railway ~4km", sub: "Connected to the nation" }
];

export const Location = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Info Block Reveal
      gsap.fromTo(infoRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );

      // Map Reveal
      gsap.fromTo(mapRef.current,
        { opacity: 0, x: 30, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
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
      id="location"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24 items-center">
          
          {/* Info Side */}
          <div ref={infoRef} className="flex flex-col">
            <span className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-4 block">
              Where Connectivity Meets Serenity
            </span>
            <h2 className="text-[clamp(32px,4vw,56px)] font-serif font-medium text-white leading-tight mb-10">
              Prime Coastal<br />Address
            </h2>

            <div className="flex flex-col gap-4 mb-12">
              {connectivity.map((item, i) => (
                <div 
                  key={i}
                  className="group flex items-start gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <span className="text-[20px] filter grayscale group-hover:grayscale-0 transition-all">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-serif font-medium text-white tracking-wide">
                      {item.label}
                    </h3>
                    <p className="text-[12px] text-white/40 mt-1 uppercase tracking-widest">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <blockquote className="border-l-2 border-white/20 pl-8 italic">
              <p className="text-[16px] leading-relaxed text-white/60 font-serif">
                "Yamuna Sky City sits at the heart of New Mangalore — 300 metres from the Arabian Sea, perfectly positioned between serenity and connectivity."
              </p>
            </blockquote>
          </div>

          {/* Stylized Map Side */}
          <div 
            ref={mapRef}
            className="relative aspect-square md:aspect-auto md:h-[600px] rounded-[32px] overflow-hidden bg-[#0A1A2F]/40 border border-white/10"
          >
            {/* Map Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} 
            />

            {/* Stylized Coastal Line (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 600">
              <path 
                d="M50,0 Q120,150 80,300 T100,600" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray="10 15"
              />
            </svg>

            {/* Central Pin */}
            <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-white shadow-[0_0_20px_white/50]" />
              </div>
              <div className="mt-4 px-4 py-2 bg-white rounded-lg shadow-2xl">
                <span className="text-[10px] font-serif font-bold text-black uppercase tracking-tighter">Yamuna Sky City</span>
              </div>
            </div>

            {/* Region Label */}
            <div className="absolute top-10 right-10 text-right">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 block mb-1">Region</span>
              <span className="text-[12px] font-serif text-white/60">Kulai · Mangalore</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
