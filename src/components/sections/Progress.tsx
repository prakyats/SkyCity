'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const milestones = [
  { date: 'March 2023',   title: 'Site Establishment',    desc: 'Site clearing, boundary establishment, and foundation survey completed.', image: null },
  { date: 'January 2024', title: 'Piling & Batching Plant',desc: 'Inauguration of site batching plant and commencement of structural piling.', image: null },
  { date: 'March 2024',   title: 'Quality Assurance',     desc: 'Cube casting and rigorous concrete quality checks ensuring structural integrity.', image: null },
  { date: 'Ongoing 2025', title: 'Superstructure Rising', desc: 'MFE Aluminium Formwork technology driving vertical growth at pace.', image: null },
];

export const Progress = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADLINE: big text slides up, cuts through center ──
      gsap.fromTo('.prog-headline',
        { y: 80, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );

      // ── TIMELINE LINE: scrub-driven fill ──
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%', end: 'bottom 80%',
            scrub: 1.5,
          }
        }
      );

      // ── CARDS: slide in from alternating sides, staggered ──
      const cards = gsap.utils.toArray<HTMLElement>('.milestone-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -80 : 80, opacity: 0, scale: 0.9 },
          {
            x: 0, opacity: 1, scale: 1,
            duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }
          }
        );
      });

      // ── DATE LABELS: stagger reveal ──
      gsap.fromTo('.prog-date',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.2,
          scrollTrigger: { trigger: '.milestone-grid', start: 'top 85%', once: true }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-navy section-pad overflow-hidden relative" id="progress">

      {/* Grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }} />

      <div className="section-inner relative z-10">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div className="overflow-hidden">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">Construction Update</span>
            <h2 className="prog-headline section-heading text-white" style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
              Site Progress
            </h2>
          </div>
          <span className="label text-white/25" style={{ fontSize: '0.58rem' }}>
            RERA No. PRM/KA/RERA/1452/584/PR
          </span>
        </div>

        {/* Timeline */}
        <div className="relative w-full h-px mb-20" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div ref={lineRef} className="absolute inset-0 origin-left"
            style={{ background: 'linear-gradient(to right, var(--gold-dark), var(--gold), var(--gold-bright))', transform: 'scaleX(0)' }} />
          {milestones.map((_, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
              style={{ left: `${(i / (milestones.length - 1)) * 100}%`, background: 'var(--gold)',
                transform: 'translate(-50%,-50%)', boxShadow: '0 0 12px var(--gold), 0 0 24px rgba(232,160,32,0.3)' }} />
          ))}
        </div>

        {/* Cards */}
        <div className="milestone-grid grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, i) => (
            <div key={i} className="milestone-card card-dark p-8 flex flex-col group hover:-translate-y-2 transition-all duration-500">

              {/* Placeholder / real image */}
              {m.image ? (
                <div className="img-zoom w-full aspect-[4/3] mb-8 overflow-hidden" style={{ borderRadius: 'var(--r-lg)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-[4/3] mb-8 flex items-center justify-center relative overflow-hidden"
                  style={{ borderRadius: 'var(--r-lg)', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                  <span className="label text-white/15" style={{ fontSize: '0.5rem' }}>Photo Coming Soon</span>
                  {/* Animated corner accent */}
                  <div className="absolute top-3 left-3 w-6 h-6 opacity-30"
                    style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)' }} />
                  <div className="absolute bottom-3 right-3 w-6 h-6 opacity-30"
                    style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)' }} />
                </div>
              )}

              <span className="prog-date label text-[var(--gold)] mb-3 block" style={{ fontSize: '0.58rem' }}>{m.date}</span>
              <h3 className="section-heading text-white mb-4" style={{ fontSize: '1rem' }}>{m.title}</h3>
              <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed">{m.desc}</p>

              {/* Hover gold underline */}
              <div className="mt-auto pt-6 h-px w-0 group-hover:w-full transition-all duration-700 kinetic-border" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};