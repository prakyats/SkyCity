'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, scrollToTarget } from '@/lib/browser';
import { plans, media, brochureHref } from '@/content/project';

const FLOORS = 60;

/**
 * Choosing a home by going up to it.
 *
 * The section pins and the scroll becomes a lift: a marker climbs the
 * elevation floor by floor, and the residence on show is whichever one
 * occupies the floor you are standing on. You do not pick from a tab
 * strip, you arrive at a level and find what is built there.
 *
 * The tabs stay, because a scroll rig is no substitute for jumping
 * straight to the penthouse, and because keyboard users need a real
 * control. Using one stops the scroll from overriding the choice.
 */
export const FloorPlans = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const pinned = useRef(false);

  const plan = plans[active] ?? plans[0]!;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lift = { v: 0 };
      gsap.to(lift, {
        v: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        onUpdate: () => {
          const floor = Math.max(1, Math.round(lift.v * FLOORS));
          if (floorRef.current) floorRef.current.textContent = String(floor);
          markerRef.current?.style.setProperty('--at', `${(1 - lift.v) * 100}%`);
          if (pinned.current) return;
          // The highest residence whose band contains this floor.
          let next = 0;
          plans.forEach((p, i) => { if (floor >= p.from) next = i; });
          setActive((cur) => (cur === next ? cur : next));
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const choose = (i: number) => { pinned.current = true; setActive(i); };

  return (
    <div ref={wrapRef} data-stop="bone" id="floorplans" className="relative" style={{ height: '280vh' }}>
      <section className="sticky top-0 overflow-hidden flex items-center" style={{ height: '100dvh' }}
        aria-label="Floor plans">
        <div className="wrap w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 items-center">

            {/* The lift: a marker climbing the elevation */}
            <div className="lg:col-span-2 hidden lg:block" style={{ height: '64vh' }} aria-hidden="true">
              <div className="relative h-full ml-10" style={{ width: 1, background: 'var(--line)' }}>
                {[10, 20, 30, 40, 50, 60].map((f) => (
                  <span key={f} className="absolute t-ui-sm muted-2"
                    style={{ top: `${(1 - f / FLOORS) * 100}%`, left: 10, transform: 'translateY(-50%)' }}>
                    {f}
                  </span>
                ))}
                {/* The band this residence occupies */}
                <span
                  className="absolute"
                  style={{
                    left: -3, width: 7,
                    top: `${(1 - plan.to / FLOORS) * 100}%`,
                    height: `${((plan.to - plan.from) / FLOORS) * 100}%`,
                    background: 'var(--brand)',
                    transition: 'top var(--motion-standard) var(--ease-settle), height var(--motion-standard) var(--ease-settle)',
                  }}
                />
                {/* Where you are standing */}
                <div ref={markerRef} className="absolute"
                  style={{ top: 'var(--at, 100%)', left: -26, width: 46, height: 1, background: 'var(--text)' }}>
                  <span className="t-num-sans absolute" style={{ right: 52, top: -7, fontSize: '0.875rem' }}>
                    <span ref={floorRef}>1</span>
                  </span>
                </div>
              </div>
            </div>

            {/* The plan */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 3', border: '1px solid var(--line)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={plan.type} src={media.blueprint} alt={`${plan.type} floor plan`}
                  width={1200} height={900} loading="lazy"
                  className="w-full h-full object-contain p-6 md:p-10"
                  style={{ animation: 'planIn var(--motion-slow) var(--ease-settle)' }} />
                <span className="t-ui-sm absolute left-4 bottom-3 muted-2">
                  {plan.type} · {plan.floors}
                </span>
              </div>
            </div>

            {/* What is built at this level */}
            <div className="lg:col-span-4">
              <p className="t-eyebrow">Residences</p>

              <h2 className="t-display mt-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>{plan.type}</h2>
              <p className="t-ui muted mt-1">{plan.floors}</p>

              <div className="flex items-baseline gap-3 mt-8">
                <span className="t-num" style={{ fontSize: 'clamp(2rem, 3.4vw, 3rem)' }}>{plan.size}</span>
                <span className="t-ui-sm muted">sq ft</span>
              </div>

              <p className="t-body-sm muted mt-5" style={{ maxWidth: '38ch' }}>{plan.desc}</p>

              <div role="tablist" aria-label="Residence types" className="flex flex-wrap gap-2 mt-9">
                {plans.map((p, i) => (
                  <button
                    key={p.type}
                    role="tab"
                    aria-selected={i === active}
                    onClick={() => choose(i)}
                    className="t-ui-sm px-4 py-2"
                    style={{
                      border: '1px solid',
                      borderColor: i === active ? 'var(--brand)' : 'var(--line-strong)',
                      color: i === active ? 'var(--brand)' : 'var(--text-2)',
                      transition: 'color var(--motion-fast) var(--ease-glide), border-color var(--motion-fast) var(--ease-glide)',
                    }}
                  >
                    {p.type}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-7">
                <a className="btn btn-primary" href={brochureHref} download>Download brochure</a>
                <button className="btn" onClick={() => scrollToTarget('#contact')}>Schedule a visit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
