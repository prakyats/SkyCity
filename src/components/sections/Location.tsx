'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const connectivity = [
  { label: 'Kulai, New Mangalore',        sub: 'Prime coastal address',        icon: 'loc' },
  { label: '~300m from Arabian Sea',       sub: 'Every residence faces the sea', icon: 'sea' },
  { label: '~12km Mangalore Airport',      sub: 'Via NH-66 corridor',            icon: 'air' },
  { label: 'Surathkal Railway ~4km',       sub: 'Direct national rail access',   icon: 'rly' },
];

const IconSVG = ({ type }: { type: string }) => {
  const style = { stroke: 'var(--gold)', strokeWidth: 1.5, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'loc') return <svg width="18" height="18" viewBox="0 0 24 24" {...style}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  if (type === 'sea') return <svg width="18" height="18" viewBox="0 0 24 24" {...style}><path d="M2 12s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4"/><path d="M2 17s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4"/></svg>;
  if (type === 'air') return <svg width="18" height="18" viewBox="0 0 24 24" {...style}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>;
  return <svg width="18" height="18" viewBox="0 0 24 24" {...style}><path d="M4 17l4-4m2.5-2.5L14 7m3.5 3.5L21 7"/><rect x="2" y="17" width="20" height="3" rx="1"/></svg>;
};

export const Location = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef     = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const pinRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── HEADING: chars scatter in ──
      const words = gsap.utils.toArray<HTMLElement>('.loc-word');
      gsap.fromTo(words,
        { y: 60, opacity: 0, rotateX: -30 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 82%', once: true } }
      );

      // ── INFO CARDS: stagger in from left ──
      gsap.fromTo('.loc-card',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: '.loc-cards', start: 'top 84%', once: true } }
      );

      // ── MAP: slides in from right + scale ──
      gsap.fromTo(mapRef.current,
        { x: 80, opacity: 0, scale: 0.94 },
        { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true } }
      );

      // ── PIN: elastic bounce in ──
      gsap.fromTo(pinRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.0, delay: 0.8, ease: 'elastic.out(1.3, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true } }
      );

      // ── MAP GRID PARALLAX ──
      gsap.to('.loc-map-grid',
        { yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
      );

      // ── GOLD RULE DRAW ──
      gsap.fromTo('.loc-rule',
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: infoRef.current, start: 'top 86%', once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}
      className="relative w-full section-pad overflow-hidden"
      style={{ background: 'var(--navy-deep)' }}
      id="location">

      {/* Atmospheric top divider */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.25), transparent)' }} />

      {/* Radial glow */}
      <div className="absolute pointer-events-none"
        style={{ right: '15%', top: '30%', width: '50vw', height: '50vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11,32,58,0.8) 0%, transparent 70%)',
          filter: 'blur(60px)' }} />

      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24 items-center">

          {/* Info side */}
          <div ref={infoRef} className="flex flex-col">
            <span className="loc-rule gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block" style={{ fontSize: '0.65rem' }}>
              Where Connectivity Meets Serenity
            </span>

            <h2 className="section-heading text-white mb-12"
              style={{ fontSize: 'clamp(1.8rem,4vw,4rem)', perspective: '600px' }}>
              {['Prime', 'Coastal', 'Address'].map((w, i) => (
                <span key={i} className="loc-word inline-block mr-3">{w}{i < 2 ? '' : ''}</span>
              ))}
            </h2>

            <div className="loc-cards flex flex-col gap-4 mb-12">
              {connectivity.map((item, i) => (
                <div key={i}
                  className="loc-card group flex items-center gap-6 px-6 py-5 transition-all duration-400 cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--r-xl)',
                  }}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[rgba(232,160,32,0.1)]"
                    style={{ border: '1px solid rgba(232,160,32,0.2)' }}>
                    <IconSVG type={item.icon} />
                  </div>
                  <div>
                    <p className="font-body text-white/75 text-sm tracking-wide group-hover:text-white transition-colors">
                      {item.label}
                    </p>
                    <p className="label text-[var(--text-white-28)] mt-1" style={{ fontSize: '0.52rem' }}>
                      {item.sub}
                    </p>
                  </div>
                  {/* Kinetic right border on hover */}
                  <div className="ml-auto h-4 w-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 kinetic-border" />
                </div>
              ))}
            </div>

            <blockquote className="pl-6 italic"
              style={{ borderLeft: '1px solid rgba(232,160,32,0.3)' }}>
              <p className="font-display text-white/45 leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem,1.2vw,1.1rem)', fontWeight: 300 }}>
                &quot;300 metres from the Arabian Sea, perfectly positioned between
                serenity and connectivity.&quot;
              </p>
            </blockquote>
          </div>

          {/* Map side */}
          <div ref={mapRef}
            className="relative aspect-[4/5] md:aspect-auto md:h-[600px] overflow-hidden"
            style={{ borderRadius: 'var(--r-2xl)', border: '1px solid rgba(255,255,255,0.07)' }}>

            {/* Deep navy base */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #040c18 0%, #07111f 50%, #0a1a2f 100%)' }} />

            {/* Animated dot grid */}
            <div className="loc-map-grid absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(232,160,32,0.5) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }} />

            {/* Coastal line SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="coastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(232,160,32,0.15)" />
                  <stop offset="100%" stopColor="rgba(232,160,32,0.05)" />
                </linearGradient>
              </defs>
              {/* NH-66 highway */}
              <path d="M 340 0 L 330 500" stroke="rgba(232,160,32,0.2)" strokeWidth="2" fill="none" strokeDasharray="8 8" />
              {/* Coastline */}
              <path d="M 60 0 Q 80 100 65 200 T 80 400 T 55 500"
                stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />
              {/* Sea fill */}
              <path d="M 0 0 Q 30 80 20 200 T 30 400 T 0 500 L 0 0"
                fill="rgba(11,40,80,0.4)" />
              {/* Concentric distance rings around pin */}
              {[40, 70, 100].map((r, i) => (
                <circle key={i} cx="220" cy="250" r={r}
                  stroke={`rgba(232,160,32,${0.08 - i * 0.02})`} strokeWidth="1" fill="none" strokeDasharray="4 6" />
              ))}
            </svg>

            {/* Sea label */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <span className="label text-[var(--text-white-28)] block" style={{ fontSize: '0.48rem', writingMode: 'vertical-rl', letterSpacing: '0.4em' }}>
                Arabian Sea
              </span>
            </div>

            {/* NH-66 label */}
            <div className="absolute right-8 top-8">
              <span className="label text-[var(--text-white-28)]" style={{ fontSize: '0.52rem' }}>NH-66</span>
            </div>

            {/* Central pin */}
            <div ref={pinRef}
              className="absolute flex flex-col items-center"
              style={{ top: '48%', left: '54%', transform: 'translate(-50%,-50%)' }}>
              {/* Ping rings */}
              <div className="absolute w-16 h-16 rounded-full animate-ping-slow"
                style={{ border: '1px solid rgba(232,160,32,0.2)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
              <div className="absolute w-24 h-24 rounded-full animate-ping-slow"
                style={{ border: '1px solid rgba(232,160,32,0.08)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '0.5s' }} />
              {/* Pin circle */}
              <div className="relative z-10 w-4 h-4 rounded-full mb-2"
                style={{ background: 'var(--gold)', boxShadow: '0 0 16px var(--gold), 0 0 32px rgba(232,160,32,0.4)' }} />
              {/* Label */}
              <div className="px-4 py-2 whitespace-nowrap"
                style={{ background: 'rgba(4,12,22,0.95)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 'var(--r-sm)' }}>
                <span className="label text-white" style={{ fontSize: '0.55rem', letterSpacing: '0.2em' }}>
                  Yamuna Sky City
                </span>
              </div>
            </div>

            {/* Gold corner accents */}
            <div className="absolute top-5 left-5 w-8 h-8 pointer-events-none"
              style={{ borderTop: '1px solid rgba(232,160,32,0.3)', borderLeft: '1px solid rgba(232,160,32,0.3)' }} />
            <div className="absolute bottom-5 right-5 w-8 h-8 pointer-events-none"
              style={{ borderBottom: '1px solid rgba(232,160,32,0.3)', borderRight: '1px solid rgba(232,160,32,0.3)' }} />

            {/* Region label */}
            <div className="absolute bottom-6 left-6">
              <span className="label text-[var(--text-white-28)]" style={{ fontSize: '0.52rem' }}>
                Kulai · New Mangalore · Karnataka
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Atmospheric bottom divider */}
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.15), transparent)' }} />
    </section>
  );
};