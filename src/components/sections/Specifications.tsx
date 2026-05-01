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
  { value: 10, suffix: '+', label: 'World-Class Amenities' },
  { value: 3, suffix: '+', label: 'Acres of Greenery' },
  { value: 30, suffix: '+', label: 'Years of Excellence' },
  { value: 4500, suffix: ' sqft', label: 'Club House' },
];

export const Specifications = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADLINE: slide in from right, masked ──
      gsap.fromTo('.spec-headline',
        { x: 120, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // ── SPEC CARDS: explode in from corners, each different direction ──
      const origins = [[-100, -80], [100, -80], [0, 100]];
      mainSpecs.forEach((spec, i) => {
        const card = document.querySelectorAll<HTMLElement>('.spec-card')[i];
        if (!card) return;
        const num = card.querySelector<HTMLElement>('.spec-num');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });

        tl.fromTo(card,
          { x: origins[i][0], y: origins[i][1], opacity: 0, rotate: i === 1 ? 3 : i === 0 ? -2 : 1 },
          { x: 0, y: 0, opacity: 1, rotate: 0, duration: 1, ease: 'power3.out' }
        );

        // Odometer number count-up with scale pulse
        if (num) {
          const counter = { val: 0 };
          tl.to(counter,
            {
              val: spec.value,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate() { if (num) num.textContent = String(Math.round(counter.val)); },
            },
            '-=0.8'
          );
          tl.fromTo(num, { scale: 1.3 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');
        }
      });

      // ── SUB SPECS: stagger up with gold line draw ──
      gsap.fromTo('.sub-spec',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.sub-specs', start: 'top 88%', once: true }
        }
      );

      // Horizontal gold line between sub-specs
      gsap.fromTo('.sub-spec-line',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.sub-specs', start: 'top 88%', once: true }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-cream section-pad grain overflow-hidden relative" id="specifications">
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

        {/* Main specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" style={{ perspective: '800px' }}>
          {mainSpecs.map((spec, i) => (
            <div key={i} className="spec-card card-light p-10 md:p-14 flex flex-col group
              hover:-translate-y-2 transition-transform duration-500 cursor-default">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="spec-num font-display text-[var(--near-black)]"
                  style={{ fontSize: 'clamp(3.5rem,6vw,6rem)', fontWeight: 300, lineHeight: 1 }}>
                  0
                </span>
                <span className="font-display text-[var(--near-black)]"
                  style={{ fontSize: 'clamp(2rem,3.5vw,3.5rem)', fontWeight: 300 }}>
                  {spec.suffix}
                </span>
              </div>
              <span className="label text-[var(--gold)] mb-3" style={{ fontSize: '0.6rem' }}>
                {spec.label}
              </span>
              <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed">{spec.desc}</p>
              {/* kinetic bottom border on hover */}
              <div className="mt-auto pt-8 h-[2px] w-0 group-hover:w-full kinetic-border transition-all duration-700 rounded-full" />
            </div>
          ))}
        </div>

        {/* Sub specs */}
        <div className="sub-specs grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--sand)]"
          style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          {subSpecs.map((s, i) => (
            <div key={i} className="sub-spec bg-white flex flex-col items-center justify-center py-10 px-6 text-center
              group hover:bg-[var(--cream)] transition-colors duration-300 relative overflow-hidden">
              <span className="font-display text-[var(--near-black)] mb-2 group-hover:scale-110 transition-transform inline-block"
                style={{ fontSize: 'clamp(1.6rem,2.5vw,2.5rem)', fontWeight: 300 }}>
                {s.value}{s.suffix}
              </span>
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.58rem' }}>{s.label}</span>
              <div className="sub-spec-line absolute bottom-0 left-0 right-0 h-px kinetic-border opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

      </div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <span key={i} className="particle" style={{
          left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%`,
          '--dur': `${5 + i * 1.2}s`,
          '--delay': `${i * 0.7}s`,
        } as React.CSSProperties} />
      ))}
    </section>
  );
};