'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const partners = [
  {
    name: "CPP Wind Engineering",
    role: "Wind Engineering",
    desc: "Global leaders with advanced labs in USA, Australia, and Malaysia, ensuring structural stability under all coastal conditions.",
    icon: "🌬"
  },
  {
    name: "Shanghvi & Associates",
    role: "Structural Consultant",
    desc: "With over 50 years of excellence, they provide the structural backbone for India's most ambitious residential skyscrapers.",
    icon: "🏗"
  },
  {
    name: "MFE Formwork Technology",
    role: "Aluminium Formwork",
    desc: "A global leader in 50+ countries since 1991, delivering precision and speed through world-class formwork systems.",
    icon: "⚙️"
  }
];

export const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
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
      id="partners"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="text-center mb-20">
          <span className="text-[12px] tracking-[0.25em] uppercase text-black/40 mb-4 block">
            World-Class Expertise
          </span>
          <h2 className="text-[clamp(32px,4vw,52px)] font-serif font-medium text-[#0a0a0a] leading-tight">
            Our Project Partners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partners.map((partner, i) => (
            <div 
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className="group p-12 rounded-[24px] border border-black/[0.06] bg-[#FAFAF8] hover:bg-white hover:border-black/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                {partner.icon}
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-3 block">
                {partner.role}
              </span>
              <h3 className="text-[20px] font-serif font-medium text-[#0a0a0a] mb-6">
                {partner.name}
              </h3>
              <p className="text-[14px] leading-relaxed text-black/50">
                {partner.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
