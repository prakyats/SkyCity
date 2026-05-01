'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const amenities = [
  {
    title: 'Kawaki Forest Trails', cat: 'Nature',
    image: '/images/amenity_forest.png',
    desc: 'A landscaped green corridor for morning runs and evening strolls, woven into the coastal ecosystem.',
    index: '01',
  },
  {
    title: 'Yoga & Wellness Studio', cat: 'Energy',
    image: '/images/amenity_wellness.png',
    desc: 'Ocean-facing studio designed for mindfulness and peak performance, bathed in natural light.',
    index: '02',
  },
  {
    title: 'Podium Infinity Pool', cat: 'Serenity',
    image: '/images/amenity_pool.png',
    desc: 'An architectural marvel where the pool edge meets the Arabian Sea on the horizon.',
    index: '03',
  },
];

export const Amenities = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADER: split chars fly in from random angles ──
      gsap.fromTo('.amen-title-char',
        { opacity: 0, y: () => gsap.utils.random(-60, 60), x: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-15, 15) },
        {
          opacity: 1, y: 0, x: 0, rotate: 0,
          duration: 0.8, stagger: 0.03, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // ── CARDS: pinwheel/fan entrance ──
      const cards = gsap.utils.toArray<HTMLElement>('.amen-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 120,
            rotate: i === 0 ? -6 : i === 1 ? 0 : 6,
            scale: 0.85,
          },
          {
            opacity: 1, y: 0, rotate: 0, scale: 1,
            duration: 1.1, delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.amen-grid', start: 'top 85%', once: true }
          }
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const titleChars = 'Unmatched'.split('');
  const titleChars2 = 'Amenities'.split('');

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden relative" id="amenities">

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,160,32,0.04) 0%, transparent 70%)' }} />

      <div className="section-inner relative z-10">

        <div className="amen-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">Crafted for an Elite Lifestyle</span>
            <h2 className="section-heading text-white" style={{ fontSize: 'clamp(1.8rem,4vw,4rem)', lineHeight: 1 }}>
              <span>
                {titleChars.map((c, i) => (
                  <span key={i} className="amen-title-char inline-block"
                    style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
                ))}
              </span>
              <em className="block font-display font-light italic text-white/60"
                style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>
                {titleChars2.map((c, i) => (
                  <span key={i} className="amen-title-char inline-block">{c}</span>
                ))}
              </em>
            </h2>
          </div>
          <button className="btn-ghost-dark self-start md:self-auto">View All 10+ Amenities</button>
        </div>

        {/* Cards */}
        <div className="amen-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {amenities.map((item, i) => (
            <div key={i}
              className="amen-card group relative aspect-[3/4] overflow-hidden cursor-pointer"
              style={{ borderRadius: 'var(--r-2xl)' }}>

              {/* Image with scale */}
              <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-110">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              {/* Gradient */}
              <div className="absolute inset-0 transition-opacity duration-500"
                style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.95) 0%, rgba(4,12,22,0.2) 50%, transparent 100%)' }} />

              {/* Index number — large background */}
              <div className="absolute top-6 left-6 font-display text-white/10 group-hover:text-white/20 transition-colors duration-500 select-none pointer-events-none"
                style={{ fontSize: '5rem', fontWeight: 300, lineHeight: 1 }}>
                {item.index}
              </div>

              {/* Gold top-right accent */}
              <div className="absolute top-6 right-6 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
                style={{ borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="label text-[var(--gold)] mb-3 block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0"
                  style={{ fontSize: '0.58rem' }}>
                  {item.cat}
                </span>
                <h3 className="section-heading text-white mb-4 group-hover:translate-y-0 translate-y-1 transition-transform duration-500"
                  style={{ fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}>
                  {item.title}
                </h3>
                <div className="overflow-hidden h-0 group-hover:h-20 transition-all duration-500">
                  <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>

              {/* Border rim */}
              <div className="absolute inset-0 pointer-events-none border border-white/10 group-hover:border-[var(--gold)]/30 transition-colors duration-500"
                style={{ borderRadius: 'var(--r-2xl)' }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};