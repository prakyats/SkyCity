'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const mainSpecs = [
  { value: 60, suffix: '+', label: 'Floors Above Ground', desc: 'The tallest residential structure in South India.' },
  { value: 296, suffix: '', label: 'Luxury Apartments', desc: 'Every single unit faces the Arabian Sea.' },
  { value: 1, suffix: '', label: 'Iconic Tower', desc: 'A singular landmark on the Mangalore skyline.' },
];
const subSpecs = [
  { value: '10+', label: 'World-Class Amenities' },
  { value: '3+', label: 'Acres of Greenery' },
  { value: '30+', label: 'Years of Excellence' },
  { value: '4500sqft', label: 'Club House' },
];

export const Specifications = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  // Refs for each card so we never use document.querySelectorAll
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (bgTextRef.current) {
        gsap.fromTo(bgTextRef.current,
          { xPercent: -5 },
          {
            xPercent: 5, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
          }
        );
      }

      gsap.fromTo('.spec-headline',
        { x: 100, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      const origins: [number, number][] = [[-90, -70], [90, -70], [0, 90]];
      mainSpecs.forEach((spec, i) => {
        const card = cardRefs.current[i];
        const num = numRefs.current[i];
        const origin = origins[i];
        if (!card || !origin) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });

        tl.fromTo(card,
          { x: origin[0], y: origin[1], opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.95, ease: 'power3.out' }
        );

        if (num && spec.value > 1) {
          const counter = { val: 0 };
          tl.to(counter, {
            val: spec.value, duration: 1.6, ease: 'power2.out',
            onUpdate() { if (num) num.textContent = String(Math.round(counter.val)); },
          }, '-=0.75');
        }

        card.addEventListener('mouseenter', () =>
          gsap.to(card, { y: -8, scale: 1.02, duration: 0.35, ease: 'power2.out' }), { passive: true });
        card.addEventListener('mouseleave', () =>
          gsap.to(card, { y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }), { passive: true });
      });

      gsap.fromTo('.sub-spec',
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.sub-specs', start: 'top 88%', once: true }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-cream section-pad grain overflow-hidden relative" id="specifications">
      <div ref={bgTextRef} className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="font-display text-[var(--near-black)] whitespace-nowrap"
          style={{ fontSize: 'clamp(100px,18vw,240px)', fontWeight: 700, opacity: 0.025, lineHeight: 1, letterSpacing: '-0.04em' }}>
          GF+60 FLOORS
        </span>
      </div>

      <div className="section-inner relative z-10">
        <div className="mb-20 overflow-hidden">
          <span className="gold-rule" />
          <span className="label text-[var(--gold)] mb-5 block">Technical Excellence</span>
          <h2 className="spec-headline section-heading text-[var(--near-black)]"
            style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
            The Pinnacle of
            <em className="block font-display font-light italic"
              style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>
              Coastal Architecture
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" style={{ perspective: '800px' }}>
          {mainSpecs.map((spec, i) => (
            <div key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className="card-light p-10 md:p-14 flex flex-col group cursor-default relative overflow-hidden diagonal-accent"
              style={{ willChange: 'transform' }}>
              <div className="flex items-baseline gap-1 mb-5">
                <span ref={el => { numRefs.current[i] = el; }}
                  className="font-display text-[var(--near-black)]"
                  style={{ fontSize: 'clamp(3.5rem,6vw,6rem)', fontWeight: 300, lineHeight: 1 }}>
                  {spec.value <= 1 ? spec.value : 0}
                </span>
                <span className="font-display text-[var(--near-black)]"
                  style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)', fontWeight: 300 }}>
                  {spec.suffix}
                </span>
              </div>
              <span className="label text-[var(--gold)] mb-3" style={{ fontSize: '0.6rem' }}>{spec.label}</span>
              <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed">{spec.desc}</p>
              <div className="mt-auto pt-8 h-[2px] w-0 group-hover:w-full kinetic-border transition-all duration-700 rounded-full" />
            </div>
          ))}
        </div>

        <div className="sub-specs grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--sand)]"
          style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          {subSpecs.map((s, i) => (
            <div key={i} className="sub-spec bg-white flex flex-col items-center justify-center py-10 px-6 text-center
              group hover:bg-[var(--cream)] transition-colors duration-300 relative overflow-hidden">
              <span className="font-display text-[var(--near-black)] mb-2 group-hover:scale-110 transition-transform inline-block"
                style={{ fontSize: 'clamp(1.6rem,2.5vw,2.5rem)', fontWeight: 300 }}>
                {s.value}
              </span>
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.58rem' }}>{s.label}</span>
              <div className="sub-spec-line absolute bottom-0 left-0 right-0 h-px kinetic-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};