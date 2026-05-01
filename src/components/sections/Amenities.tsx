'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const amenities = [
  {
    title: 'Kawaki Forest Trails',
    cat: 'Nature',
    image: '/images/amenity_forest.png',
    // PLACEHOLDER: replace with actual forest trail image
    desc: 'A landscaped green corridor for morning runs and evening strolls, woven into the coastal ecosystem.',
  },
  {
    title: 'Yoga & Wellness Studio',
    cat: 'Energy',
    image: '/images/amenity_wellness.png',
    // PLACEHOLDER: replace with actual wellness studio image
    desc: 'Ocean-facing studio designed for mindfulness and peak performance, bathed in natural light.',
  },
  {
    title: 'Podium Infinity Pool',
    cat: 'Serenity',
    image: '/images/amenity_pool.png',
    // PLACEHOLDER: replace with actual pool image
    desc: 'An architectural marvel where the pool edge meets the Arabian Sea on the horizon.',
  },
];

export const Amenities = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('.amen-header', { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
      gsap.fromTo('.amen-card', { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: '.amen-grid', start: 'top 82%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden" id="amenities">
      <div className="section-inner">

        <div className="amen-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">Crafted for an Elite Lifestyle</span>
            <h2 className="section-heading text-white" style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
              Unmatched
              <em className="block font-display font-light italic text-white/70"
                style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>
                Amenities
              </em>
            </h2>
          </div>
          <button className="btn-ghost-dark self-start md:self-auto whitespace-nowrap">
            View All 10+ Amenities
          </button>
        </div>

        <div className="amen-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {amenities.map((item, i) => (
            <div key={i} className="amen-card group relative aspect-[3/4] overflow-hidden cursor-pointer"
              style={{ borderRadius: 'var(--r-2xl)' }}>
              {/* Image — PLACEHOLDER: swap src */}
              <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-110">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#040c16] via-[#040c16]/30 to-transparent" />
              {/* Gold top-right accent */}
              <div className="absolute top-6 right-6 w-8 h-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />
              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="label text-[var(--gold)] mb-3 block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0"
                  style={{ fontSize: '0.58rem' }}>
                  {item.cat}
                </span>
                <h3 className="section-heading text-white mb-4" style={{ fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}>
                  {item.title}
                </h3>
                <div className="overflow-hidden h-0 group-hover:h-16 transition-all duration-500">
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