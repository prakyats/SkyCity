'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const partners = [
  {
    name: 'CPP Wind Engineering',
    role: 'Wind Engineering Consultants',
    desc: 'Global leaders with advanced labs in USA, Australia and Malaysia, ensuring structural stability under all coastal wind conditions.',
    // PLACEHOLDER: replace with actual CPP logo
    logo: null,
    detail: 'USA · Australia · Malaysia',
  },
  {
    name: 'Shanghvi & Associates',
    role: 'Structural Consultant',
    desc: 'Over 50 years of excellence providing the structural backbone for India\'s most ambitious residential skyscrapers.',
    // PLACEHOLDER: replace with actual SACPL logo
    logo: null,
    detail: '50+ Years Excellence',
  },
  {
    name: 'MFE Formwork Technology',
    role: 'Aluminium Formwork',
    desc: 'Global leader in 50+ countries since 1991, delivering precision and speed through world-class formwork systems.',
    // PLACEHOLDER: replace with actual MFE logo
    logo: null,
    detail: '50+ Countries · Est. 1991',
  },
];

export const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('.partner-card', { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-white section-pad" id="partners">
      <div className="section-inner">

        <div className="mb-20 text-center">
          <span className="gold-rule mx-auto" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
          <span className="label text-[var(--gold)] mb-5 block">World-Class Expertise</span>
          <h2 className="section-heading text-[var(--near-black)]"
            style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
            Who Are Involved
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((p, i) => (
            <div key={i} className="partner-card card-light p-12 flex flex-col group">

              {/* Logo placeholder */}
              <div className="w-full h-20 mb-10 flex items-center justify-start">
                {p.logo
                  ? <img src={p.logo} alt={p.name} className="max-h-12 object-contain" />
                  : (
                    /* PLACEHOLDER: replace this div with <img src={partner_logo} /> */
                    <div className="h-10 flex items-center">
                      <span className="font-display text-[var(--near-black)] opacity-60"
                        style={{ fontSize: '1.1rem', fontWeight: 400 }}>
                        {p.name}
                      </span>
                    </div>
                  )
                }
              </div>

              <span className="label text-[var(--gold)] mb-3 block" style={{ fontSize: '0.56rem' }}>
                {p.role}
              </span>
              <p className="font-body text-[var(--text-muted)] text-sm leading-relaxed mb-8 flex-1">
                {p.desc}
              </p>
              <div className="pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--sand)' }}>
                <span className="font-body text-[var(--text-subtle)] text-xs tracking-wide">{p.detail}</span>
                <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ border: '1px solid var(--gold)', borderRadius: '50%' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};