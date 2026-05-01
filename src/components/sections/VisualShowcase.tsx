'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const VisualShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── IMAGE: pin + horizontal slide in from right while scrolling ──
      gsap.fromTo('.vs-img',
        { xPercent: 30, opacity: 0, scale: 1.1 },
        {
          xPercent: 0, opacity: 1, scale: 1,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
        }
      );

      // ── TEXT LINES: reveal one by one with sliding mask ──
      const lines = gsap.utils.toArray<HTMLElement>('.vs-line');
      lines.forEach((line, i) => {
        gsap.fromTo(line,
          { yPercent: 100 },
          {
            yPercent: 0, duration: 0.9, delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.vs-text', start: 'top 82%', once: true }
          }
        );
      });

      // ── BULLET POINTS: fly in from left ──
      gsap.fromTo('.vs-bullet',
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.vs-bullets', start: 'top 85%', once: true }
        }
      );

      // ── PARALLAX: image drifts upward while scrolling past ──
      gsap.to('.vs-img-inner',
        {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 1.5,
          }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden">
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-[1.35fr_0.65fr] gap-10 md:gap-20 items-center">

          {/* Image */}
          <div className="vs-img relative w-full aspect-[16/10] overflow-hidden"
            style={{ borderRadius: 'var(--r-2xl)' }}>
            <div className="vs-img-inner w-full h-[120%] -top-[10%] absolute">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/visual_showcase_main.png"
                alt="Yamuna Sky City — Living Above the Coastline"
                className="w-full h-full object-cover" />
            </div>
            {/* Gold corners */}
            <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none"
              style={{ borderTop: '1px solid var(--gold)', borderLeft: '1px solid var(--gold)', opacity: 0.7 }} />
            <div className="absolute bottom-6 right-6 w-10 h-10 pointer-events-none"
              style={{ borderBottom: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.7 }} />
            {/* Overlay shimmer */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.06) 0%, transparent 60%)' }} />
          </div>

          {/* Text */}
          <div className="vs-text flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-6">The Experience</span>

            <h2 className="section-heading text-white mb-8"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,3.2rem)' }}>
              <span className="reveal-line">
                <span className="vs-line reveal-line-inner block">Living Above</span>
              </span>
              <span className="reveal-line">
                <em className="vs-line reveal-line-inner block font-display font-light italic text-white/60"
                  style={{ fontSize: 'clamp(2rem,4vw,4rem)', lineHeight: 0.88 }}>
                  the Coastline
                </em>
              </span>
            </h2>

            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-10 vs-line"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)' }}>
              An elevated lifestyle defined by expansive sea views, refined
              architecture, and seamless integration with the coastal
              environment of New Mangalore.
            </p>

            <div className="vs-bullets flex flex-col gap-4">
              {['All residences are sea-facing', 'Private balconies on every floor', 'Premium coastal finishes throughout'].map((pt, i) => (
                <div key={i} className="vs-bullet flex items-center gap-4">
                  <div className="w-4 h-px flex-shrink-0" style={{ background: 'var(--gold)' }} />
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