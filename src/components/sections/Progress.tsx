'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const milestones = [
  { date: "March 2023", title: "Initial Site Work", desc: "Site clearing and boundary establishment completed.", icon: "🏕" },
  { date: "January 2024", title: "Piling & Batching Plant", desc: "Inauguration of site batching plant and start of piling.", icon: "⚙️" },
  { date: "March 2024", title: "Quality Assurance", desc: "Cube casting and rigorous concrete quality checks.", icon: "🧱" },
  { date: "Ongoing", title: "Superstructure Rising", desc: "MFE Formwork technology in action for vertical growth.", icon: "🏗" }
];

export const Progress = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Progress Line Fill
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1,
          }
        }
      );

      // Cards Stagger
      gsap.fromTo(cardRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
      id="progress"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="mb-20">
          <span className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-4 block">
            Construction Update
          </span>
          <h2 className="text-[clamp(32px,4vw,56px)] font-serif font-medium text-white leading-tight">
            Site Progress Timeline
          </h2>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-[2px] bg-white/10 mb-20">
          <div 
            ref={lineRef}
            className="absolute inset-0 bg-white origin-left scale-x-0"
          />
        </div>

        {/* Milestone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {milestones.map((item, i) => (
            <div 
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className="group flex flex-col"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xl mb-6 group-hover:bg-white group-hover:text-black transition-all duration-500">
                {item.icon}
              </div>
              <span className="text-[14px] font-serif font-medium text-white/90 mb-2">
                {item.date}
              </span>
              <h3 className="text-[16px] text-white tracking-wide mb-3">
                {item.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-white/40">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
