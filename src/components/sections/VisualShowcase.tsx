'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const VisualShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // ── MAIN TIMELINE: Scroll-synchronized transition ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      });

      // State 1 to 2: wave-start -> balcony-plan
      tl.to('.vs-state-1', { opacity: 0, duration: 1 }, 0)
        .fromTo('.vs-state-2', { opacity: 0 }, { opacity: 1, duration: 1 }, 0);

      // ── TEXT REVEALS: Staggered with the states ──
      const lines = gsap.utils.toArray<HTMLElement>('.vs-line');
      lines.forEach((line) => {
        gsap.fromTo(line,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: triggerRef.current,
              start: 'top 30%',
              once: true
            }
          }
        );
      });

      // Bullet animations
      gsap.fromTo('.vs-bullet',
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.vs-bullets',
            start: 'top 80%',
            once: true
          }
        }
      );

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative h-[300vh] bg-section-dark">
      <section ref={sectionRef} className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* Full-Screen Visual Stack */}
        <div className="absolute inset-0 w-full h-full">
          <div className="vs-img-container relative w-full h-full">
            {/* State 1: The Inspiration */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/frames/wave-start.png" 
              alt="Organic wave inspiration" 
              className="vs-state-1 absolute inset-0 w-full h-full object-cover object-center" 
            />
            
            {/* State 2: The Plan */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/frames/balcony-plan.png" 
              alt="Technical architectural plan" 
              className="vs-state-2 absolute inset-0 w-full h-full object-cover object-center opacity-0" 
            />

            {/* Dark Vignet Overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" 
              style={{ background: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.6) 0%, transparent 70%)' }} />
          </div>

          {/* Decorative Overlays */}
          <div className="absolute top-12 left-12 w-20 h-20 pointer-events-none opacity-40"
            style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)' }} />
          <div className="absolute bottom-12 right-12 w-20 h-20 pointer-events-none opacity-40"
            style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)' }} />
        </div>

        {/* Narrative Text Overlay */}
        <div className="section-inner relative w-full z-10 px-6 md:px-20">
          <div className="max-w-2xl vs-text flex flex-col">
            <span className="gold-rule mb-8" />
            <span className="label text-[var(--gold)] mb-6 tracking-[0.3em] uppercase text-xs">Architectural Narrative</span>

            <h2 className="section-heading text-white mb-10 leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              <span className="reveal-line overflow-hidden block">
                <span className="vs-line block">Nature Transcribed</span>
              </span>
              <span className="reveal-line overflow-hidden block">
                <em className="vs-line block font-display font-light italic text-white/70"
                  style={{ fontSize: '1.1em', lineHeight: 0.88 }}>
                  Into Geometry
                </em>
              </span>
            </h2>

            <p className="font-body text-white/70 leading-[1.8] mb-12 vs-line max-w-lg"
              style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)' }}>
              The architecture of Yamuna Sky City is a direct extension of the coastline. 
              The organic rhythm of the Arabian Sea waves is distilled into rigid, 
              high-performance structural perimeters, creating a seamless synthesis 
              of nature and engineering.
            </p>

            <div className="vs-bullets flex flex-col gap-6">
              {[
                'Wave-inspired balcony perimeters',
                'Biophilic structural engineering',
                'Seamless sea-to-home transition'
              ].map((pt, i) => (
                <div key={i} className="vs-bullet flex items-center gap-6">
                  <div className="w-8 h-px flex-shrink-0" style={{ background: 'var(--gold)' }} />
                  <span className="font-body text-white/60 tracking-wider text-sm uppercase">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};