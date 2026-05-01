'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const checklist = ['Superior Spaces', 'Innovative Designs', 'Timely Delivery', 'Client Relationships'];
const values = [
  'Quality Commitment', 'Innovative Practices',
  'Customer Satisfaction', 'Sustainable Solutions',
  'Integrity & Transparency', 'Excellence in Craft',
];

export const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── LEFT COL: slides in from left with clip-path wipe ──
      gsap.fromTo('.jrn-left',
        { x: -100, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );

      // ── RIGHT COL: slides in from right ──
      gsap.fromTo('.jrn-right',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true } }
      );

      // ── CHECKLIST: items drop in with SVG checkmark draw ──
      const items = gsap.utils.toArray<HTMLElement>('.jrn-check-item');
      items.forEach((item, i) => {
        gsap.fromTo(item,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, delay: 0.8 + i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '.jrn-checklist', start: 'top 85%', once: true } }
        );
        // SVG path draw
        const path = item.querySelector<SVGPathElement>('.check-path');
        if (path) {
          const len = path.getTotalLength?.() ?? 14;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0, duration: 0.5, delay: 1.1 + i * 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: '.jrn-checklist', start: 'top 85%', once: true }
          });
        }
      });

      // ── VALUE TAGS: stagger scale-in from center ──
      gsap.fromTo('.jrn-tag',
        { scale: 0.7, opacity: 0, rotate: () => gsap.utils.random(-3, 3) },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: '.jrn-tags', start: 'top 84%', once: true } }
      );

      // ── LEGACY CARD: rises up from below with glow ──
      gsap.fromTo('.jrn-legacy',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.jrn-legacy', start: 'top 88%', once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pad overflow-hidden relative"
      style={{ background: 'var(--warm-dark)' }} id="journey">

      {/* Subtle warm radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 30% 50%, rgba(232,160,32,0.04) 0%, transparent 70%)' }} />

      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28">

          {/* Left */}
          <div className="jrn-left flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">What Drives Us</span>
            <h2 className="section-heading text-white mb-8"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,3.5rem)' }}>
              Our Journey &<br />Commitment
            </h2>
            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-12"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '44ch' }}>
              For over three decades, Yamuna Homes and Design Pvt. Ltd. has been shaping
              skylines across Karnataka — where trust is our foundation and quality is our
              enduring signature.
            </p>
            <div className="jrn-checklist flex flex-col gap-5">
              {checklist.map((item, i) => (
                <div key={i} className="jrn-check-item flex items-center gap-5">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center"
                    style={{ borderColor: 'var(--gold)' }}>
                    <svg width="10" height="10" viewBox="0 0 12 9" fill="none">
                      <path className="check-path" d="M1 4.5L4.5 8L11 1"
                        stroke="#E8A020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-body text-[var(--text-white-70)] text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="jrn-right flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">What We Stand For</span>
            <h2 className="section-heading text-white mb-10"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,3.5rem)' }}>
              Core Values
            </h2>
            <div className="jrn-tags grid grid-cols-2 gap-3 mb-12">
              {values.map((v, i) => (
                <div key={i} className="jrn-tag card-dark p-5 hover:border-[var(--gold)]/40
                  hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <span className="font-body text-[var(--text-white-70)] text-sm leading-snug">{v}</span>
                </div>
              ))}
            </div>

            {/* Legacy card */}
            <div className="jrn-legacy p-10 flex flex-col relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
                borderRadius: 'var(--r-2xl)',
                border: '1px solid rgba(232,160,32,0.2)',
              }}>
              {/* Floating particles inside card */}
              {[...Array(4)].map((_, i) => (
                <span key={i} className="particle" style={{
                  left: `${20 + i * 20}%`, top: `${30 + (i%2)*30}%`,
                  '--dur': `${4 + i}s`, '--delay': `${i * 0.5}s`,
                } as React.CSSProperties} />
              ))}
              <span className="gold-rule relative z-10" />
              <span className="label text-[var(--gold)] mb-4 block relative z-10" style={{ fontSize: '0.58rem' }}>
                The Milestone
              </span>
              <h3 className="font-display text-white mb-4 relative z-10"
                style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300 }}>
                30+ Years of Excellence
              </h3>
              <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed relative z-10">
                A legacy of delivering premium living spaces that stand the test of time,
                trends, and architectural ambition.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};