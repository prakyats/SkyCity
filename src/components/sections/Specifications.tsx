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
  { value: '4,500', label: 'sq.ft Club House' },
];

export const Specifications = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.spec-card').forEach((card, i) => {
        const num = card.querySelector<HTMLElement>('.spec-num');
        const target = mainSpecs[i]?.value ?? 0;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 88%', once: true }
        });
        tl.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        if (num) tl.fromTo(num, { innerText: 0 },
          { innerText: target, duration: 1.6, snap: { innerText: 1 }, ease: 'power2.out' }, '-=0.5');
      });
      gsap.fromTo('.sub-spec', { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: '.sub-specs', start: 'top 88%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-cream section-pad overflow-hidden" id="specifications">
      <div className="section-inner">

        <div className="mb-20">
          <span className="gold-rule" />
          <span className="label text-[var(--gold)] mb-5 block">Technical Excellence</span>
          <h2 className="section-heading text-[var(--near-black)]"
            style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
            The Pinnacle of
            <em className="block font-display font-light italic"
              style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>
              Coastal Architecture
            </em>
          </h2>
        </div>

        {/* Main specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {mainSpecs.map((spec, i) => (
            <div key={i} className="spec-card card-light p-10 md:p-14 flex flex-col">
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
              <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Sub specs */}
        <div className="sub-specs grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--sand)]"
          style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden' }}>
          {subSpecs.map((s, i) => (
            <div key={i} className="sub-spec bg-white flex flex-col items-center justify-center py-10 px-6 text-center">
              <span className="font-display text-[var(--near-black)] mb-2"
                style={{ fontSize: 'clamp(1.6rem,2.5vw,2.5rem)', fontWeight: 300 }}>
                {s.value}
              </span>
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.58rem' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};