'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const stats = [
  { value: '296', label: 'Luxury Apartments' },
  { value: 'GF+60', label: 'Floors Above Ground' },
  { value: '3+', label: 'Acres of Greenery' },
  { value: '300m', label: 'From the Arabian Sea' },
];

export const ProjectIntro = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADLINE: each word barrel-rolls in from bottom, staggered ──
      const words = gsap.utils.toArray<HTMLElement>('.pi-word');
      gsap.fromTo(words,
        { yPercent: 110, rotateX: -45, opacity: 0 },
        {
          yPercent: 0, rotateX: 0, opacity: 1,
          duration: 1.1, stagger: 0.07,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.pi-headline', start: 'top 85%', once: true },
        }
      );

      // ── BODY TEXT: clip-path curtain wipe left-to-right ──
      gsap.fromTo('.pi-body-1',
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.pi-body-1', start: 'top 88%', once: true } }
      );
      gsap.fromTo('.pi-body-2',
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, delay: 0.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.pi-body-2', start: 'top 88%', once: true } }
      );

      // ── STAT CARDS: 3D flip in from different directions ──
      const cards = gsap.utils.toArray<HTMLElement>('.pi-stat');
      cards.forEach((card, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        gsap.fromTo(card,
          { rotateY: dir * 90, opacity: 0, transformOrigin: 'center center', scale: 0.8 },
          {
            rotateY: 0, opacity: 1, scale: 1,
            duration: 0.9, delay: i * 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: '.pi-stats', start: 'top 86%', once: true }
          }
        );
      });

      // ── GOLD RULE: draw left to right via scaleX ──
      gsap.fromTo('.pi-gold-rule',
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.pi-gold-rule', start: 'top 90%', once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headlineWords = ["South India's", "Tallest", "Sea View", "Tower"];

  return (
    <section ref={sectionRef} className="bg-section-white section-pad perspective-container" id="overview">
      <div className="section-inner">

        {/* Header */}
        <div className="flex flex-col items-start mb-20 md:mb-28">
          <span className="pi-gold-rule gold-rule" />
          <span className="label text-[var(--gold)] mb-6">Project Overview</span>
          <div className="pi-headline" style={{ perspective: '1000px' }}>
            <h2 className="section-heading text-[var(--near-black)]"
              style={{ fontSize: 'clamp(2rem,5vw,5rem)', lineHeight: 0.95 }}>
              {headlineWords.map((w, i) => (
                <span key={i} className="pi-word inline-block mr-[0.2em]"
                  style={{ transformStyle: 'preserve-3d' }}>
                  {i === 2
                    ? <em className="font-display font-light italic"
                        style={{ fontSize: 'clamp(2.4rem,6vw,6rem)', lineHeight: 0.88 }}>{w}</em>
                    : w}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Body split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start mb-24">
          <p className="pi-body-1 font-body text-[var(--text-muted)] leading-[1.85]"
            style={{ fontSize: 'clamp(1rem,1.2vw,1.1rem)' }}>
            A landmark residential development on the NH-66 corridor of New Mangalore
            — combining scale, architectural precision, and uninterrupted sea views
            into a single iconic address. Yamuna Sky City is not just a building.
            It is a new definition of coastal luxury.
          </p>
          <p className="pi-body-2 font-body text-[var(--text-subtle)] leading-[1.85]"
            style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)' }}>
            Developed by Yamuna Homes and Design Pvt. Ltd. — a trusted name in
            Karnataka real estate for over 30 years. GF+60 floors. 296 all-sea-facing
            units. One tower. No compromises.
          </p>
        </div>

        {/* Stats */}
        <div className="pi-stats grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--sand)]"
          style={{ borderRadius: 'var(--r-2xl)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i} className="pi-stat bg-[var(--cream)] flex flex-col items-center justify-center
              text-center py-14 px-8 group hover:bg-white transition-colors duration-500 cursor-default">
              <span className="font-display text-[var(--near-black)] mb-2 group-hover:text-gold transition-colors"
                style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', fontWeight: 300, lineHeight: 1 }}>
                {s.value}
              </span>
              <span className="label text-[var(--text-subtle)] group-hover:text-[var(--gold)] transition-colors"
                style={{ fontSize: '0.6rem' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};