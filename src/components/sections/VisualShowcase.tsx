'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const VisualShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('.vs-img', { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
      gsap.fromTo('.vs-text', { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden">
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_0.65fr] gap-10 md:gap-20 items-center">

          {/* Image placeholder — replace src with real asset */}
          <div className="vs-img img-zoom relative w-full aspect-[16/10] bg-[var(--navy-mid)]"
            style={{ borderRadius: 'var(--r-2xl)' }}>
            <img
              src="/images/visual_showcase_main.png"
              alt="Yamuna Sky City — Living Above the Coastline"
              className="w-full h-full object-cover"
              style={{ borderRadius: 'var(--r-2xl)' }}
            />
            {/* Gold corner accent */}
            <div className="absolute top-8 left-8 w-12 h-12 pointer-events-none"
              style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.6 }} />
            <div className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none"
              style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.6 }} />
          </div>

          {/* Text */}
          <div className="vs-text flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-6">The Experience</span>
            <h2 className="section-heading text-white mb-8"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,3.2rem)' }}>
              Living Above
              <em className="block font-display font-light italic text-white/70"
                style={{ fontSize: 'clamp(2rem,4vw,4rem)', lineHeight: 0.9 }}>
                the Coastline
              </em>
            </h2>
            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-10"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)' }}>
              An elevated lifestyle defined by expansive sea views, refined
              architecture, and seamless integration with the coastal
              environment of New Mangalore.
            </p>
            <div className="flex flex-col gap-4">
              {['All residences are sea-facing', 'Private balconies on every floor', 'Premium coastal finishes throughout'].map((pt, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-4 h-px" style={{ background: 'var(--gold)', flexShrink: 0 }} />
                  <span className="font-body text-[var(--text-white-45)] text-sm">{pt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};