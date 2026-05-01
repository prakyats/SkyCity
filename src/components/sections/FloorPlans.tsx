'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const plans = [
  {
    type: '2 BHK', floors: '3rd – 32nd Floor', size: '1,500 – 1,650',
    desc: 'Thoughtfully designed for families seeking panoramic sea views. All units sea-facing with private balconies and premium coastal finishes.',
    image: '/images/blueprint.png',
  },
  {
    type: '3 BHK', floors: '5th – 45th Floor', size: '1,850 – 2,100',
    desc: 'Spacious family homes with split-level living, home office nook, and uninterrupted Arabian Sea views from every room.',
    image: '/images/blueprint.png',
  },
  {
    type: '4 BHK', floors: '20th – 55th Floor', size: '2,400 – 2,850',
    desc: 'Grand residences for those who demand more. Double-height living rooms, chef\'s kitchen, and sky-terrace balconies.',
    image: '/images/blueprint.png',
  },
  {
    type: '5 BHK', floors: '45th – 60th Floor', size: '3,400 – 4,200',
    desc: 'Ultra-luxury penthouses with private plunge pools, panoramic wraparound decks, and bespoke interior finishes.',
    image: '/images/blueprint.png',
  },
];

export const FloorPlans = () => {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const hasEntered = useRef(false);

  // Section entrance
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Heading: barrel roll in
      gsap.fromTo('.fp-headline',
        { y: 70, rotateX: -30, opacity: 0 },
        {
          y: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );
      // Tabs: stagger up
      gsap.fromTo('.fp-tab',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.fp-tabs', start: 'top 84%', once: true,
            onEnter: () => { hasEntered.current = true; }
          }
        }
      );
      // Image: clips in from left
      gsap.fromTo(imageRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
        }
      );
      // Content: slides from right
      gsap.fromTo(contentRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.0, delay: 0.3, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Tab switch animation
  useEffect(() => {
    if (!hasEntered.current) return;
    if (contentRef.current) gsap.fromTo(contentRef.current,
      { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' });
    if (imageRef.current) gsap.fromTo(imageRef.current,
      { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
  }, [active]);

  return (
    <section ref={sectionRef} className="bg-section-cream section-pad relative overflow-hidden" id="floorplans">

      {/* Top connector */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(28,18,19,0.12), transparent)' }} />

      {/* Watermark */}
      <div className="absolute inset-0 flex items-end justify-end overflow-hidden pointer-events-none select-none pr-8 pb-8" style={{ zIndex: 0 }}>
        <span className="font-display text-[var(--near-black)] whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', fontWeight: 700, opacity: 0.025, lineHeight: 1 }}>
          FLOOR PLANS
        </span>
      </div>

      <div className="section-inner relative z-10">

        <div className="mb-14 overflow-hidden" style={{ perspective: '600px' }}>
          <span className="gold-rule" />
          <span className="label text-[var(--gold)] mb-5 block">Residency Options</span>
          <h2 className="fp-headline section-heading text-[var(--near-black)]"
            style={{ fontSize: 'clamp(1.8rem,4vw,4rem)', transformStyle: 'preserve-3d' }}>
            Floor Plans
            <em className="block font-display font-light italic text-[var(--text-subtle)]"
              style={{ fontSize: 'clamp(1.4rem,3vw,3rem)', lineHeight: 0.9 }}>
              Choose Your Residence
            </em>
          </h2>
        </div>

        {/* Tabs */}
        <div className="fp-tabs flex gap-0 border-b mb-16 overflow-x-auto no-scrollbar"
          style={{ borderColor: 'var(--sand)' }}>
          {plans.map((p, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="fp-tab relative pb-5 px-8 transition-colors duration-300 whitespace-nowrap group"
              style={{
                fontFamily: 'var(--font-tenor)', fontSize: '0.7rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: active === i ? 'var(--near-black)' : 'var(--text-subtle)',
              }}>
              {p.type}
              {/* Active bar */}
              <span className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
                style={{ background: 'var(--gold)', width: active === i ? '100%' : '0%' }} />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-24 items-center">

          {/* Floor plan image */}
          <div ref={imageRef}
            className="relative aspect-[4/3] bg-white flex items-center justify-center p-10 md:p-14 group"
            style={{ borderRadius: 'var(--r-2xl)', border: '1px solid var(--sand)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={plans[active].image} alt={`${plans[active].type} Floor Plan`}
              className="w-full h-full object-contain opacity-80 transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute bottom-5 left-6">
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.5rem' }}>
                Floor Plan · {plans[active].type} · {plans[active].floors}
              </span>
            </div>
            {/* Gold corner */}
            <div className="absolute top-5 right-5 w-8 h-8 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
              style={{ borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />
            <div className="absolute bottom-5 left-5 w-8 h-8 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity"
              style={{ borderBottom: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)' }} />
          </div>

          {/* Details */}
          <div ref={contentRef} className="flex flex-col">
            <span className="label text-[var(--text-subtle)] mb-3 block" style={{ fontSize: '0.6rem' }}>
              {plans[active].floors}
            </span>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-[var(--near-black)]"
                style={{ fontSize: 'clamp(2.8rem,5vw,5rem)', fontWeight: 300, lineHeight: 1 }}>
                {plans[active].size}
              </span>
              <span className="font-body text-[var(--text-subtle)]" style={{ fontSize: '1rem' }}>sq.ft</span>
            </div>

            {/* Gold divider */}
            <div className="w-full h-px mb-8" style={{ background: 'var(--sand)' }} />

            <p className="font-body text-[var(--text-muted)] leading-[1.85] mb-12"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '38ch' }}>
              {plans[active].desc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-gold">Download Brochure</button>
              <button className="btn-ghost-light">Schedule Site Visit</button>
            </div>

            {/* Type indicator dots */}
            <div className="flex gap-2 mt-10">
              {plans.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className="transition-all duration-300"
                  style={{
                    width: active === i ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: active === i ? 'var(--gold)' : 'var(--sand)',
                  }} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};