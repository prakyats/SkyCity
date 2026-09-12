'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion } from '@/lib/browser';
import { ascent, project } from '@/content/project';

const FLOORS = 60;
/** Roughly 3.3 m per floor, which is what GF+60 comes to at 200 m. */
const TOP_ALTITUDE = 200;

/**
 * The ascent. This is the page's spine, not a section.
 *
 * Scrolling here does one thing continuously: it takes you up the tower.
 * The shaft draws itself floor by floor, the altitude readout climbs, and
 * the project's four figures are annotated onto the elevation at their own
 * heights, the way a surveyor would mark them. They are not presented to
 * you; you reach them. Nothing fades in on a timer. Everything here is a
 * consequence of how far you have climbed.
 */
export const Ascent = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const floorRef = useRef<HTMLSpanElement>(null);
  const shaftRef = useRef<SVGRectElement>(null);
  const hazeRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // With reduced motion the climb is already complete: full shaft, top
    // altitude, every figure legible, and no scroll-linked movement.
    if (reducedMotion()) {
      if (altRef.current) altRef.current.textContent = String(TOP_ALTITUDE);
      if (floorRef.current) floorRef.current.textContent = String(FLOORS);
      shaftRef.current?.setAttribute('height', '100');
      markerRefs.current.forEach((m) => m && gsap.set(m, { opacity: 1, x: 0 }));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const climb = { v: 0 };

      gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
        .to(climb, {
          v: 1,
          ease: 'none',
          onUpdate: () => {
            const t = climb.v;
            if (altRef.current) altRef.current.textContent = String(Math.round(t * TOP_ALTITUDE));
            if (floorRef.current) {
              const f = Math.round(t * FLOORS);
              floorRef.current.textContent = f === 0 ? 'G' : String(f);
            }
            // The shaft is drawn from the ground up as a growing mask.
            shaftRef.current?.setAttribute('height', String(t * 100));
          },
        }, 0)
        // The haze thins and the ground falls away as you rise.
        .fromTo(hazeRef.current, { opacity: 1 }, { opacity: 0.16, ease: 'none' }, 0)
        .fromTo(groundRef.current, { yPercent: 0, opacity: 0.55 }, { yPercent: 60, opacity: 0, ease: 'none' }, 0);

      // Each figure is pinned to its altitude on the elevation.
      markerRefs.current.forEach((el, i) => {
        if (!el) return;
        const at = ascent.markers[i]!.at;
        gsap.fromTo(el,
          { opacity: 0, x: -18 },
          {
            opacity: 1, x: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrap,
              start: `top+=${at * 100}% top`,
              end: `top+=${at * 100 + 8}% top`,
              scrub: true,
            },
          });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} data-stop="bone-warm" id="overview" className="relative" style={{ height: '320vh' }}>
      <section
        className="sticky top-0 overflow-hidden grain"
        style={{ height: '100dvh' }}
        aria-label={`${project.name}: the ascent from ground level to the sixtieth floor`}
      >
        {/* Haze at ground level, thinning with altitude. Deliberately no
            hard edge: a visible line across the viewport would read as
            exactly the section seam this page is built to avoid. */}
        <div ref={hazeRef} aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: '64%', background: 'linear-gradient(to top, rgba(18,60,70,0.14), rgba(18,60,70,0.05) 44%, transparent)' }} />
        <div ref={groundRef} aria-hidden="true" className="absolute inset-x-0 pointer-events-none"
          style={{ top: '74%', height: '40vh', background: 'linear-gradient(to bottom, rgba(10,12,14,0.10), transparent)' }} />

        <div className="wrap relative h-full flex items-center" style={{ paddingTop: 72 }}>
          <div className="grid w-full grid-cols-1 lg:grid-cols-12 gap-x-10 items-center">

            {/* The readout */}
            <div className="lg:col-span-5">
              <p className="t-eyebrow">{ascent.eyebrow}</p>

              <div className="flex items-end gap-4 mt-6">
                <span className="t-num" style={{ fontSize: 'clamp(4rem, 10.5vw, 9rem)' }}>
                  <span ref={altRef}>0</span>
                </span>
                <span className="t-ui-sm muted pb-4">metres<br />above sea level</span>
              </div>

              <p className="t-ui muted mt-4">
                Level <span ref={floorRef} className="t-num-sans" style={{ fontSize: '1.15rem' }}>G</span> of {FLOORS}
              </p>

              <p className="t-quote mt-10" style={{ maxWidth: '20ch' }}>{ascent.line}</p>
            </div>

            {/* The elevation, with the figures annotated at their heights */}
            <div className="lg:col-span-6 lg:col-start-7 relative hidden lg:block" style={{ height: '66vh' }}>
              <svg viewBox="0 0 90 800" preserveAspectRatio="none"
                className="absolute inset-y-0" style={{ left: 0, width: 90 }} fill="none" aria-hidden="true">
                <defs>
                  <clipPath id="ascent-clip">
                    {/* Flipped, so the rect grows upward from the ground */}
                    <rect ref={shaftRef} x="0" y="0" width="90" height="0"
                      transform="translate(0 800) scale(1 -8)" />
                  </clipPath>
                </defs>

                <line x1="0" y1="792" x2="90" y2="792" stroke="var(--line-strong)" strokeWidth="1.2" />

                <g clipPath="url(#ascent-clip)" stroke="var(--text)">
                  <rect x="18" y="16" width="54" height="776" strokeWidth="1" opacity="0.8" />
                  {Array.from({ length: FLOORS }, (_, i) => i + 1).map((f) => {
                    const y = 792 - (f * 776) / FLOORS;
                    return (
                      <line key={f} x1="18" y1={y} x2="72" y2={y}
                        strokeWidth="0.7" opacity={f % 10 === 0 ? 0.85 : 0.26} />
                    );
                  })}
                </g>
              </svg>

              {/* Annotations, each beside the shaft at its own altitude */}
              <dl className="absolute inset-0" style={{ left: 104 }}>
                {ascent.markers.map((m, i) => (
                  <div
                    key={m.label}
                    ref={(el) => { markerRefs.current[i] = el; }}
                    className="absolute flex items-baseline gap-5 whitespace-nowrap"
                    style={{ bottom: `${m.at * 84 + 3}%`, willChange: 'transform, opacity' }}
                  >
                    {/* The leader line back to the floor it refers to */}
                    <span aria-hidden="true" style={{ width: 44, height: 1, background: 'var(--line-strong)', marginBottom: '0.55em' }} />
                    <dt className="t-num" style={{ fontSize: 'clamp(1.75rem, 2.6vw, 2.5rem)' }}>{m.value}</dt>
                    <dd className="t-ui muted">{m.label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Narrow screens read the figures as a plain list */}
            <dl className="lg:hidden mt-14 rule-strong">
              {ascent.markers.map((m) => (
                <div key={m.label} className="rule py-5 first:border-t-0 flex items-baseline justify-between gap-6">
                  <dt className="t-num" style={{ fontSize: '2rem' }}>{m.value}</dt>
                  <dd className="t-ui muted text-right">{m.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
};
