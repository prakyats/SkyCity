'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const milestones = [
  {
    date: 'March 2023', title: 'Site Establishment',
    desc: 'Site clearing, boundary establishment, and foundation survey completed.',
    // PLACEHOLDER: add image path when construction photo is available
    image: null,
  },
  {
    date: 'January 2024', title: 'Piling & Batching Plant',
    desc: 'Inauguration of site batching plant and commencement of structural piling.',
    // PLACEHOLDER: add image path when construction photo is available
    image: null,
  },
  {
    date: 'March 2024', title: 'Concrete Quality Assurance',
    desc: 'Cube casting and rigorous quality checks ensuring structural integrity.',
    // PLACEHOLDER: add image path when construction photo is available
    image: null,
  },
  {
    date: 'Ongoing 2025', title: 'Superstructure Rising',
    desc: 'MFE Aluminium Formwork technology driving vertical growth at pace.',
    // PLACEHOLDER: add image path when construction photo is available
    image: null,
  },
];

export const Progress = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleX: 0 },
        { scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current,
            start: 'top 70%', end: 'bottom 80%', scrub: 1.2 } });
      gsap.fromTo('.milestone-card', { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.16, ease: 'power3.out',
          scrollTrigger: { trigger: '.milestone-grid', start: 'top 82%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-navy section-pad overflow-hidden" id="progress">
      <div className="section-inner">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">Construction Update</span>
            <h2 className="section-heading text-white" style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
              Site Progress
            </h2>
          </div>
          <span className="label text-white/30" style={{ fontSize: '0.6rem' }}>
            RERA No. PRM/KA/RERA/1452/584/PR/260322/004257
          </span>
        </div>

        {/* Animated progress line */}
        <div className="relative w-full h-px mb-20" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div ref={lineRef} className="absolute inset-0 origin-left"
            style={{ background: 'var(--gold)', transform: 'scaleX(0)' }} />
          {/* Progress dots */}
          {milestones.map((_, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{ left: `${(i / (milestones.length - 1)) * 100}%`, background: 'var(--gold)',
                transform: 'translate(-50%,-50%)', boxShadow: '0 0 8px var(--gold)' }} />
          ))}
        </div>

        {/* Milestone grid */}
        <div className="milestone-grid grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="milestone-card card-dark p-8 flex flex-col group cursor-default">

              {/* Image placeholder — shown when photo available */}
              {m.image ? (
                <div className="img-zoom w-full aspect-[4/3] mb-8 overflow-hidden"
                  style={{ borderRadius: 'var(--r-lg)' }}>
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                /* PLACEHOLDER: replace with actual construction photo */
                <div className="w-full aspect-[4/3] mb-8 flex items-center justify-center"
                  style={{ borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.03)',
                    border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span className="label text-white/20" style={{ fontSize: '0.52rem' }}>
                    Photo Placeholder
                  </span>
                </div>
              )}

              <span className="label text-[var(--gold)] mb-3 block" style={{ fontSize: '0.58rem' }}>
                {m.date}
              </span>
              <h3 className="section-heading text-white mb-4" style={{ fontSize: '1rem' }}>
                {m.title}
              </h3>
              <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};