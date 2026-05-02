'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cld } from '@/lib/cloudinary';

const partners = [
  {
    name: 'CPP Wind Engineering', role: 'Wind Engineering Consultants',
    desc: 'Global leaders with advanced labs in USA, Australia and Malaysia, ensuring structural stability under all coastal wind conditions.',
    logo: null, detail: 'USA · Australia · Malaysia', index: '01',
  },
  {
    name: 'Shanghvi & Associates', role: 'Structural Consultant',
    desc: 'Over 50 years of excellence providing the structural backbone for India\'s most ambitious residential skyscrapers.',
    logo: null, detail: '50+ Years Excellence', index: '02',
  },
  {
    name: 'MFE Formwork Technology', role: 'Aluminium Formwork',
    desc: 'Global leader in 50+ countries since 1991, delivering precision and speed through world-class formwork systems.',
    logo: null, detail: '50+ Countries · Est. 1991', index: '03',
  },
];

export const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADING: big type slides from bottom + skew ──
      gsap.fromTo('.prt-headline',
        { y: 80, skewY: 4, opacity: 0 },
        {
          y: 0, skewY: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // ── MARQUEE STRIP: slides in from right ──
      gsap.fromTo('.prt-marquee',
        { x: 80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, delay: 0.3, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // ── CARDS: 3D perspective flip-in from different angles ──
      const cards = gsap.utils.toArray<HTMLElement>('.partner-card');
      const rotations = [[-12, 0, -2], [0, -10, 2], [12, 0, -1]];
      cards.forEach((card, i) => {
        const rotation = rotations[i];
        if (!rotation) return;
        
        gsap.fromTo(card,
          {
            rotateY: rotation[0],
            rotateX: rotation[1],
            rotate: rotation[2],
            opacity: 0, scale: 0.88, transformOrigin: 'center center',
          },
          {
            rotateY: 0, rotateX: 0, rotate: 0,
            opacity: 1, scale: 1, duration: 1.0, delay: i * 0.18,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.prt-grid', start: 'top 85%', once: true }
          }
        );
        // Hover 3D tilt
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -10, scale: 1.02, rotateX: 2, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, rotateX: 0, duration: 0.5, ease: 'power2.out' });
        });
      });

      // ── GOLD RULE ──
      gsap.fromTo('.prt-rule',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const marqueeText = '· CPP Wind Engineering · Shanghvi & Associates · MFE Formwork Technology · World-Class Expertise · Trusted Partners ·';

  return (
    <section ref={sectionRef} className="bg-section-white section-pad relative overflow-hidden" id="partners">

      {/* Watermark bg text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none" style={{ zIndex: 0 }}>
        <span className="font-display text-[var(--near-black)] whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', fontWeight: 700, opacity: 0.022, lineHeight: 1 }}>
          TRUSTED PARTNERS
        </span>
      </div>

      <div className="section-inner relative z-10">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-6">
          <div>
            <span className="prt-rule gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">World-Class Expertise</span>
            <h2 className="prt-headline section-heading text-[var(--near-black)]"
              style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
              Who Are
              <em className="block font-display font-light italic"
                style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>Involved</em>
            </h2>
          </div>
          <span className="label text-[var(--text-subtle)] hidden md:block" style={{ fontSize: '0.58rem', maxWidth: '20ch', textAlign: 'right' }}>
            Global consultants. India&apos;s tallest coastal tower.
          </span>
        </div>

        {/* Scrolling marquee strip */}
        <div className="prt-marquee overflow-hidden mb-16"
          style={{ borderTop: '1px solid var(--sand)', borderBottom: '1px solid var(--sand)', padding: '14px 0' }}>
          <div className="marquee-track-l marquee-fade-left">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="label text-[var(--text-subtle)] whitespace-nowrap px-8" style={{ fontSize: '0.6rem' }}>
                {marqueeText}
              </span>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="prt-grid grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {partners.map((p, i) => (
            <div key={i}
              className="partner-card card-light p-10 md:p-12 flex flex-col group relative overflow-hidden cursor-default diagonal-accent"
              style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>

              {/* Background index number */}
              <div className="absolute top-4 right-6 font-display text-[var(--near-black)] opacity-[0.04] pointer-events-none select-none"
                style={{ fontSize: '5rem', fontWeight: 700, lineHeight: 1 }}>
                {p.index}
              </div>

              {/* Logo / name */}
              <div className="h-16 mb-8 flex items-center">
                {p.logo
                  ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={cld(p.logo, 400)} alt={p.name} className="max-h-10 object-contain" loading="lazy" />
                  )
                  : <span className="font-display text-[var(--near-black)] opacity-55"
                    style={{ fontSize: '1.05rem', fontWeight: 400, lineHeight: 1.2 }}>
                    {p.name}
                  </span>
                }
              </div>

              <span className="label text-[var(--gold)] mb-3 block" style={{ fontSize: '0.56rem' }}>{p.role}</span>

              <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed mb-8 flex-1">{p.desc}</p>

              <div className="pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--sand)' }}>
                <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.55rem' }}>{p.detail}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 group-hover:scale-110"
                  style={{ border: '1px solid var(--gold)', color: 'var(--gold)', fontSize: '0.65rem' }}>
                  →
                </div>
              </div>

              {/* Kinetic bottom border */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 kinetic-border" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};