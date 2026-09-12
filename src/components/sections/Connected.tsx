'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, isTouch } from '@/lib/browser';
import { connected } from '@/content/project';

const { viewBox, centre, rings, lineEnd, nodes } = connected;

/**
 * Where the tower sits in the world.
 *
 * The aerial photograph is the section, not an illustration inside it. It
 * pins and pushes in slowly while the survey draws itself over the top:
 * rings expand from the tower, lines reach out to each landmark, and the
 * travel times arrive in order of distance, nearest first. Nothing is
 * decorative. Every ring is a radius and every line ends on a real place.
 */
export const Connected = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);

  const byDistance = [...nodes].sort((a, b) => a.minutes - b.minutes);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = overlayRef.current;
    if (!wrap || !svg) return;

    if (reducedMotion()) {
      svg.querySelectorAll<SVGElement>('[data-draw]').forEach((el) => {
        el.style.strokeDashoffset = '0';
        el.style.opacity = '1';
      });
      wrap.querySelectorAll<HTMLElement>('[data-chip]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // The camera pushes in on the photograph for the whole passage.
      if (photoRef.current && !isTouch()) {
        gsap.fromTo(photoRef.current,
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.1 },
          });
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 62%', once: true },
      });

      // Rings expand from the tower.
      tl.fromTo(svg.querySelectorAll('[data-ring]'),
        { scale: 0.55, opacity: 0, transformOrigin: `${centre.x}px ${centre.y}px` },
        { scale: 1, opacity: 1, duration: 1.5, stagger: 0.22, ease: 'power3.out' }, 0.1);

      // Lines reach out, each one drawing along its own length.
      svg.querySelectorAll<SVGPathElement>('[data-draw]').forEach((line, i) => {
        const len = line.getTotalLength?.() ?? 220;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        tl.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.95 + i * 0.1);
      });

      // Then the places themselves, nearest first.
      tl.fromTo(wrap.querySelectorAll('[data-chip]'),
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.11, ease: 'power3.out' }, 1.35);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} data-stop="sea" id="location" className="relative">
      <section className="relative overflow-hidden grain" aria-label="Location and connectivity">
        <div className="wrap pt-[clamp(72px,10vw,150px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end">
            <div className="lg:col-span-7">
              <p className="t-eyebrow">{connected.eyebrow}</p>
              <h2 className="t-display mt-4" style={{ maxWidth: '11ch' }}>
                {connected.headline[0]} <span className="t-italic">{connected.headline[1]}</span>
              </h2>
            </div>
            <p className="lg:col-span-5 t-body muted">{connected.body}</p>
          </div>
        </div>

        {/* The photograph, with the survey drawn over it */}
        <div className="relative mt-[clamp(40px,6vw,88px)]">
          <div className="relative overflow-hidden" style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}`, minHeight: '52vh' }}>
            <div ref={photoRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={connected.aerial} alt={connected.aerialAlt}
                width={1672} height={941} loading="lazy"
                className="w-full h-full object-cover" />
            </div>

            {/* Grade, so the drawn survey and the labels stay legible */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(75% 65% at 53% 45%, rgba(10,12,14,0.12) 0%, rgba(10,12,14,0.52) 100%)' }} />

            {/* The survey */}
            <svg
              ref={overlayRef}
              viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
              fill="none"
            >
              {rings.map((r) => (
                <circle key={r} data-ring cx={centre.x} cy={centre.y} r={r}
                  stroke="rgba(237,233,227,0.3)" strokeWidth="1" />
              ))}

              {nodes.map((n) => {
                // Stop each line short of the centre so the tower stays clear.
                const dx = n.x - centre.x, dy = n.y - centre.y;
                const d = Math.hypot(dx, dy) || 1;
                const x1 = centre.x + (dx / d) * lineEnd;
                const y1 = centre.y + (dy / d) * lineEnd;
                return (
                  <line key={n.label} data-draw x1={x1} y1={y1} x2={n.x} y2={n.y}
                    stroke="rgba(237,233,227,0.55)" strokeWidth="1.2" opacity="0" />
                );
              })}

              {/* The tower */}
              <circle cx={centre.x} cy={centre.y} r="5" fill="var(--ember)" />
              <circle data-ring cx={centre.x} cy={centre.y} r="16" stroke="var(--ember)" strokeWidth="1" opacity="0.7" />
            </svg>

            {/* Travel times, positioned in the photograph's own coordinates */}
            {nodes.map((n) => (
              <div
                key={n.label}
                data-chip
                className="absolute -translate-x-1/2 -translate-y-1/2 hidden md:block"
                style={{
                  left: `${(n.x / viewBox.w) * 100}%`,
                  top: `${(n.y / viewBox.h) * 100}%`,
                  opacity: 0,
                  willChange: 'transform, opacity',
                }}
              >
                <div
                  className="flex items-baseline gap-2 whitespace-nowrap px-3 py-2"
                  style={{
                    background: 'rgba(10,12,14,0.42)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(237,233,227,0.22)',
                    color: 'var(--bone)',
                  }}
                >
                  <span className="t-num-sans" style={{ fontSize: '0.9375rem' }}>{n.minutes}</span>
                  <span className="t-ui-sm" style={{ opacity: 0.7 }}>min</span>
                  <span className="t-ui-sm" style={{ opacity: 0.9 }}>{n.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest first, and the only reading on touch */}
        <div className="wrap pt-[clamp(32px,4vw,56px)] pb-[clamp(72px,10vw,150px)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
            <ul className="lg:col-span-7 rule-strong md:hidden lg:block">
              {byDistance.map((n) => (
                <li key={n.label} data-chip className="rule flex items-baseline justify-between gap-6 py-4 first:border-t-0"
                  style={{ opacity: 0 }}>
                  <span className="t-ui">{n.label}</span>
                  <span className="t-ui-sm" style={{ color: 'var(--text-3)' }}>{n.minutes} min</span>
                </li>
              ))}
            </ul>

            <ul className="lg:col-span-4 lg:col-start-9 grid gap-4 content-start">
              {connected.highlights.map((h) => (
                <li key={h} className="t-h3">{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
