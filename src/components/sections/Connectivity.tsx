'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const landmarks = [
  { name: 'Ryan Intl School', dist: '0.5 km', angle: -135, time: '2 min' },
  { name: 'NITK Campus',      dist: '4 km',   angle: -45,  time: '8 min' },
  { name: 'Surathkal Rly',    dist: '4 km',   angle: 180,  time: '10 min' },
  { name: 'Panambur Beach',   dist: '5 km',   angle: 0,    time: '12 min' },
  { name: 'MRPL',             dist: '6 km',   angle: 135,  time: '14 min' },
  { name: 'MIA Airport',      dist: '12 km',  angle: 45,   time: '20 min' },
];

export const Connectivity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef   = useRef<(SVGLineElement|null)[]>([]);
  const nodesRef   = useRef<(HTMLDivElement|null)[]>([]);
  const centerRef  = useRef<HTMLDivElement>(null);
  const orbRef     = useRef<HTMLDivElement>(null);
  const bgGlowRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── BACKGROUND GLOW: pulses in ──
      gsap.fromTo(bgGlowRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );

      // ── HEADLINE: text scatters then re-assembles ──
      const words = gsap.utils.toArray<HTMLElement>('.conn-word');
      gsap.set(words, {
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-100, 100),
        opacity: 0, rotate: () => gsap.utils.random(-20, 20),
      });
      gsap.to(words, {
        x: 0, y: 0, opacity: 1, rotate: 0,
        duration: 1, stagger: 0.06, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }
      });

      // ── CENTER NODE: bouncy scale-in ──
      gsap.fromTo(centerRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1.2, 0.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true } }
      );

      // ── SPOKES: draw in sequence ──
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true }
      });
      tl.to({}, { duration: 0.6 });

      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const len = line.getTotalLength?.() ?? 220;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(line,
          { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' },
          i === 0 ? '>' : '-=0.5'
        );
        const node = nodesRef.current[i];
        if (node) {
          tl.fromTo(node,
            { scale: 0, opacity: 0, rotate: 180 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' },
            '-=0.3'
          );
        }
      });

      // ── ORBITAL RING: slow rotation ──
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          rotate: 360, duration: 30, repeat: -1, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
        });
      }

      // ── NODE HOVER: pulse glow ──
      nodesRef.current.forEach((node) => {
        if (!node) return;
        node.addEventListener('mouseenter', () => {
          gsap.to(node, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
        });
        node.addEventListener('mouseleave', () => {
          gsap.to(node, { scale: 1, duration: 0.4, ease: 'power2.out' });
        });
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const headlineWords = ['Prime', 'Proximity', 'to', 'Landmarks'];

  return (
    <section ref={sectionRef}
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-24 overflow-hidden"
      style={{ background: 'var(--navy-deep)' }} id="connectivity">

      {/* Animated radial background glow */}
      <div ref={bgGlowRef} className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(15,32,53,0.8) 0%, transparent 70%)' }} />

      {/* Extra atmospheric gold glow at center */}
      <div className="absolute pointer-events-none"
        style={{
          left: '50%', top: '55%', transform: 'translate(-50%, -50%)',
          width: '40vmin', height: '40vmin',
          background: 'radial-gradient(circle, rgba(232,160,32,0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'breathe 4s ease-in-out infinite',
        }} />

      {/* Horizontal separator at top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.2), transparent)' }} />

      <div className="relative z-10 text-center mb-16 px-6">
        <span className="label text-[var(--gold)] mb-4 block" style={{ fontSize: '0.65rem' }}>
          Gracefully Connected
        </span>
        <h2 className="section-heading text-white" style={{ fontSize: 'clamp(2rem,4vw,4rem)' }}>
          {headlineWords.map((w, i) => (
            <span key={i} className="conn-word inline-block mr-3">{w}</span>
          ))}
        </h2>
      </div>

      {/* Radial diagram */}
      <div className="relative w-full max-w-[560px] aspect-square mx-auto">

        {/* Outer orbital ring */}
        <div ref={orbRef} className="absolute inset-[-20px]"
          style={{ border: '1px dashed rgba(232,160,32,0.12)', borderRadius: '50%' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--gold)', boxShadow: '0 0 6px var(--gold)' }} />
        </div>

        {/* Second ring */}
        <div className="absolute drift-rotate-slow"
          style={{ inset: '-50px', border: '1px dashed rgba(232,160,32,0.05)', borderRadius: '50%' }} />

        {/* SVG spokes */}
        <svg viewBox="0 0 540 540" className="absolute inset-0 w-full h-full pointer-events-none">
          {landmarks.map((lm, i) => {
            const r = (lm.angle * Math.PI) / 180;
            return (
              <line key={i} ref={el => { linesRef.current[i] = el; }}
                x1="270" y1="270"
                x2={270 + Math.cos(r) * 200} y2={270 + Math.sin(r) * 200}
                stroke="rgba(232,160,32,0.25)" strokeWidth="1"
              />
            );
          })}
          {[80, 140, 200].map((r, i) => (
            <circle key={i} cx="270" cy="270" r={r}
              stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
          ))}
        </svg>

        {/* Center node */}
        <div ref={centerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full z-20 flex flex-col items-center justify-center"
          style={{ background: 'var(--navy-mid)', border: '1px solid rgba(232,160,32,0.3)', boxShadow: '0 0 40px rgba(232,160,32,0.1)' }}>
          <span className="label text-[var(--gold)]" style={{ fontSize: '0.5rem' }}>Sky City</span>
          <span className="font-display text-white" style={{ fontSize: '0.85rem', fontWeight: 300 }}>Yamuna</span>
          <div className="absolute inset-[-10px] rounded-full border border-[var(--gold)]/10 animate-ping-slow" />
        </div>

        {/* Landmark nodes */}
        {landmarks.map((item, i) => {
          const r = (item.angle * Math.PI) / 180;
          return (
            <div key={i} ref={el => { nodesRef.current[i] = el; }}
              className="absolute w-28 text-center -translate-x-1/2 -translate-y-1/2 group cursor-default"
              style={{ left: `${50 + Math.cos(r) * 38}%`, top: `${50 + Math.sin(r) * 38}%` }}>
              <div className="w-2 h-2 rounded-full mx-auto mb-2 transition-all duration-300 group-hover:scale-150"
                style={{ background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
              <h3 className="font-body text-white/80 text-xs leading-tight mb-1 group-hover:text-white transition-colors">
                {item.name}
              </h3>
              <span className="label text-[var(--gold)]" style={{ fontSize: '0.52rem' }}>{item.dist}</span>
              <p className="font-body text-white/30 text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                ~{item.time}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.15), transparent)' }} />
    </section>
  );
};
