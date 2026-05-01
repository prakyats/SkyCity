'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const stats = [
  { value: '296', label: 'Luxury Apartments' },
  { value: 'GF+60', label: 'Floors Above Ground' },
  { value: '3+', label: 'Acres of Coastal Greenery' },
  { value: '300m', label: 'From the Arabian Sea' },
];

export const ProjectIntro = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.pi-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 0.9, delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-white section-pad" id="overview">
      <div className="section-inner">

        {/* Header */}
        <div className="pi-reveal flex flex-col items-start mb-20 md:mb-28">
          <span className="gold-rule" />
          <span className="label text-[var(--gold)] mb-5">Project Overview</span>
          <h2
            className="section-heading text-[var(--near-black)] max-w-[720px]"
            style={{ fontSize: 'clamp(2rem,4.5vw,4.5rem)' }}
          >
            South India's Tallest
            <em className="block font-display font-light italic"
              style={{ fontSize: 'clamp(2.4rem,5.5vw,5.5rem)', lineHeight: 0.9 }}>
              Sea View Tower
            </em>
          </h2>
        </div>

        {/* Body split */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 md:gap-32 items-start mb-24">
          <p className="pi-reveal font-body text-[var(--text-muted)] leading-[1.85]"
            style={{ fontSize: 'clamp(1rem,1.2vw,1.1rem)' }}>
            A landmark residential development on the NH-66 corridor of New Mangalore
            — combining scale, architectural precision, and uninterrupted sea views
            into a single iconic address. Yamuna Sky City is not just a building.
            It is a new definition of coastal luxury.
          </p>
          <p className="pi-reveal font-body text-[var(--text-subtle)] leading-[1.85]"
            style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)' }}>
            Developed by Yamuna Homes and Design Pvt. Ltd. — a trusted name in
            Karnataka real estate for over 30 years — every residence is
            positioned to face the Arabian Sea. GF+60 floors. 296 all-sea-facing
            units. One tower. No compromises.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--sand)]"
          style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i}
              className="pi-reveal bg-[var(--cream)] flex flex-col items-center justify-center text-center py-14 px-8 group hover:bg-white transition-colors duration-400">
              <span className="font-display text-[var(--near-black)] mb-2"
                style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 300, lineHeight: 1 }}>
                {s.value}
              </span>
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.6rem' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};