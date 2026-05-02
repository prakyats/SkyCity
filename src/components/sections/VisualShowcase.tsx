'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cld } from '@/lib/cloudinary';

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
          scrub: 1.5, // Smoother scrub
        }
      });

      // Cinematic transition with holds
      tl.to({}, { duration: 1.5 }) // Initial hold on the inspiration image
        .to('.vs-state-1', { opacity: 0, duration: 2, ease: 'power2.inOut' })
        .to('.vs-state-2', { opacity: 1, duration: 2, ease: 'power2.inOut' }, '<')
        .to({}, { duration: 0.4 }); // Reduced final hold after the reveal

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
    <div ref={triggerRef} className="relative h-[250vh] bg-section-dark">
      <section ref={sectionRef} className="sticky top-0 h-screen h-[100dvh] w-full flex items-center overflow-hidden">

        {/* Full-Screen Visual Stack */}
        <div className="absolute inset-0 w-full h-full">
          <div className="vs-img-container relative w-full h-full">
            {/* State 1: The Inspiration */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cld("v1777698110/wave-start_lp5h52.png", 2000)}
              alt="Organic wave inspiration"
              className="vs-state-1 absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* State 2: The Plan */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cld("v1777698109/balcony-plan_ob6gd2.jpg", 2000)}
              alt="Technical architectural plan"
              className="vs-state-2 absolute inset-0 w-full h-full object-cover object-center opacity-0"
            />

            {/* Left-aligned Gradient Overlay for text legibility - Subtler Intensity */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.32) 30%, transparent 70%)',
              }} />
          </div>

          {/* Decorative Overlays - Scaled for Mobile */}
          <div className="absolute top-6 left-6 md:top-12 md:left-12 w-10 h-10 md:w-20 md:h-20 pointer-events-none opacity-40"
            style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)' }} />
          <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-10 h-10 md:w-20 md:h-20 pointer-events-none opacity-40"
            style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />

          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] md:opacity-[0.05]"
            style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 3px)' }} />
        </div>

        {/* Narrative Text Overlay */}
        <div className="section-inner relative w-full z-10 px-6 md:px-20 mt-10 md:mt-0">
          <div className="max-w-2xl vs-text flex flex-col items-start text-left">
            <span className="gold-rule mb-6 md:mb-8" />
            <span className="label text-[var(--gold)] mb-4 md:mb-6 tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-xs">
              Architectural Narrative
            </span>

            <h2 className="section-heading text-white mb-6 md:mb-10 leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)' }}>
              <span className="reveal-line overflow-hidden block">
                <span className="vs-line block">Nature Transcribed</span>
              </span>
              <span className="reveal-line overflow-hidden block">
                <em className="vs-line block font-display font-light italic text-white/70"
                  style={{ fontSize: '1em', lineHeight: 0.9 }}>
                  Into Geometry
                </em>
              </span>
            </h2>

            <p className="font-body text-white/80 md:text-white/70 leading-relaxed md:leading-[1.8] mb-8 md:mb-12 vs-line max-w-lg"
              style={{ fontSize: 'clamp(0.85rem, 4vw, 1.15rem)' }}>
              The architecture of Yamuna Sky City is a direct extension of the coastline.
              The organic rhythm of the Arabian Sea waves is distilled into rigid,
              high-performance structural perimeters.
            </p>

            <div className="vs-bullets flex flex-col gap-4 md:gap-6 w-full">
              {[
                'Wave-inspired balcony perimeters',
                'Biophilic structural engineering',
                'Seamless sea-to-home transition'
              ].map((pt, i) => (
                <div key={i} className="vs-bullet flex items-center gap-4 md:gap-6">
                  <div className="w-6 h-px flex-shrink-0" style={{ background: 'var(--gold)' }} />
                  <span className="font-body text-white/60 tracking-wider text-[10px] md:text-sm uppercase">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};