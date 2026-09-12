'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion } from '@/lib/browser';
import { connected, project } from '@/content/project';
import { Logo } from '@/components/ui/Logo';
import { LandmarkIcon } from '@/components/ui/LandmarkIcon';

const { viewBox, centre, rings, lineEnd, nodes } = connected;

/**
 * Positions measured off the supplied render, not assumed: the rings are
 * centred on the tower's mid height rather than its base, because its
 * base sits 77% down the frame and centring there would push the outer
 * ring off the bottom of the composition.
 */
/**
 * The dissolve applied to the render. Radii are deliberately under the
 * distance from the mask centre to the furthest frame edge, so the image
 * is fully transparent before it reaches its own boundary and no
 * rectangle can show.
 */
const FADE =
  'radial-gradient(48% 50% at 52% 47%,' +
  ' rgba(0,0,0,1) 0%, rgba(0,0,0,1) 46%,' +
  ' rgba(0,0,0,0.72) 66%, rgba(0,0,0,0.34) 84%,' +
  ' rgba(0,0,0,0) 100%)';

/** Where the tower's crown sits in the supplied render, measured off it. */
const CROWN_Y = 0.153;

/**
 * Perfectly connected — the radar.
 *
 * Follows the reference deck: the tower sits at the centre of a pale
 * aerial, concentric radar rings run out from it, and each landmark is a
 * circular icon bubble tied back to the centre by a thin line. As the
 * reader scrolls, destinations are revealed one at a time in order of
 * travel time, nearest first, so the section reads as a survey drawing
 * itself rather than a finished graphic fading in.
 *
 * The aerial is washed right back on purpose. It is context, not the
 * subject; the survey drawn over it is the subject.
 */
export const Connected = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const towerRef = useRef<HTMLImageElement>(null);

  /** Nearest first, which is the order the deck reveals them in. */
  const order = useMemo(() => [...nodes].sort((a, b) => a.minutes - b.minutes), []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    const showAll = () => {
      svg.querySelectorAll<SVGElement>('[data-draw], [data-ring]').forEach((el) => {
        el.style.strokeDashoffset = '0';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      wrap.querySelectorAll<HTMLElement>('[data-bubble], [data-row]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      if (towerRef.current) towerRef.current.style.opacity = '1';
    };

    if (reducedMotion()) { showAll(); return; }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top 58%', once: true },
      });

      // The tower stands up first. Everything else is measured from it,
      // so it should already be there when the survey starts drawing.
      tl.fromTo(towerRef.current,
        { opacity: 0, scaleY: 0.94, transformOrigin: 'bottom center' },
        { opacity: 1, scaleY: 1, duration: 1.5, ease: 'power3.out' }, 0);

      // The rings run out from the tower.
      tl.fromTo(svg.querySelectorAll('[data-ring]'),
        { scale: 0.5, opacity: 0, transformOrigin: `${centre.x}px ${centre.y}px` },
        { scale: 1, opacity: 1, duration: 1.6, stagger: 0.2, ease: 'power3.out' }, 0.5);

      // Then each destination in turn: its line draws, its bubble lands,
      // and its row in the list arrives with it.
      order.forEach((n, i) => {
        const at = 0.9 + i * 0.26;
        const line = svg.querySelector<SVGPathElement>(`[data-draw="${n.icon}"]`);
        if (line) {
          const len = line.getTotalLength?.() ?? 240;
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
          tl.to(line, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, at);
        }
        const bubble = wrap.querySelector<HTMLElement>(`[data-bubble="${n.icon}"]`);
        if (bubble) {
          tl.fromTo(bubble,
            { opacity: 0, scale: 0.78 },
            { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, at + 0.32);
        }
        const row = wrap.querySelector<HTMLElement>(`[data-row="${n.icon}"]`);
        if (row) {
          tl.fromTo(row, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5 }, at + 0.32);
        }
      });

      // A slow push-in on the whole composition, so it is never static.
      gsap.fromTo(stageRef.current,
        { scale: 1.06 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
    }, wrap);

    return () => ctx.revert();
  }, [order]);

  return (
    <div ref={wrapRef} data-stop="bone-warm" id="location" className="relative">
      <section className="relative overflow-hidden" aria-label="Location and connectivity">
        <p className="t-ui-sm muted-2 text-center pt-[clamp(56px,7vw,104px)]">Scroll to discover</p>
        <span aria-hidden="true" className="block mx-auto mt-3"
          style={{ width: 1, height: 34, background: 'var(--line-strong)' }} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 items-center">
          {/* The written side */}
          <div className="lg:col-span-3 wrap lg:pr-0" style={{ paddingTop: 'clamp(32px,4vw,56px)' }}>
            <p className="t-eyebrow">{connected.eyebrow}</p>
            <h2 className="t-display-sm mt-4" style={{ maxWidth: '12ch' }}>
              {connected.headline[0]} <span className="t-italic">{connected.headline[1]}</span>
            </h2>
            <span aria-hidden="true" className="block mt-8 mb-7"
              style={{ width: 56, height: 1, background: 'var(--brand)' }} />
            <p className="t-body-sm muted" style={{ maxWidth: '30ch' }}>{connected.body}</p>

            {/* The same data as a list: the only reading on a phone, and
                the accessible reading everywhere. */}
            <ul className="mt-10 lg:hidden rule-strong">
              {order.map((n) => (
                <li key={n.label} data-row={n.icon} style={{ opacity: 0 }}
                  className="rule flex items-center gap-4 py-4 first:border-t-0">
                  <span style={{ color: 'var(--brand)' }}><LandmarkIcon name={n.icon} size={18} /></span>
                  <span className="t-ui flex-1">{n.label}</span>
                  <span className="t-num-sans" style={{ color: 'var(--brand)' }}>{n.minutes} min</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The radar */}
          <div ref={stageRef} className="lg:col-span-9 relative" style={{ willChange: 'transform' }}>
            <div className="relative" style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}` }}>
              {/* The supplied render: the tower and its setting, already
                  faded to white at the edges. Multiplied onto the stage so
                  that white surround becomes the page rather than a
                  lighter rectangle sitting on it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={towerRef}
                src={connected.aerial}
                alt={connected.aerialAlt}
                width={1671}
                height={941}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  mixBlendMode: 'multiply',
                  // The render's periphery is pale haze, not pure white, so
                  // its frame would read as a rectangle. The mask has to
                  // reach full transparency INSIDE the box to prevent that:
                  // the centre sits at 52%/47%, so the furthest edge is 52%
                  // of the width and 53% of the height away, and radii must
                  // stay under those or the fade never finishes.
                  maskImage: FADE,
                  WebkitMaskImage: FADE,
                  // A little blur on the outer reaches so the dissolve is
                  // soft rather than a visible gradient band.
                  filter: 'blur(0.4px)',
                }}
              />

              {/* Rings and connector lines */}
              <svg ref={svgRef} viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
                className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" fill="none">
                {rings.map((r) => (
                  <circle key={r} data-ring cx={centre.x} cy={centre.y} r={r}
                    stroke="var(--brand)" strokeOpacity="0.26" strokeWidth="1" />
                ))}
                {[74, 108].map((r) => (
                  <circle key={`d${r}`} data-ring cx={centre.x} cy={centre.y} r={r}
                    stroke="var(--brand)" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 5" />
                ))}

                {nodes.map((n) => {
                  // Stop each line short of the centre and short of the
                  // bubble, so neither is crossed by its own connector.
                  const dx = n.x - centre.x, dy = n.y - centre.y;
                  const d = Math.hypot(dx, dy) || 1;
                  const sx = centre.x + (dx / d) * lineEnd;
                  const sy = centre.y + (dy / d) * lineEnd;
                  return (
                    <g key={n.label}>
                      <line data-draw={n.icon}
                        x1={sx} y1={sy}
                        x2={n.x - (dx / d) * 34} y2={n.y - (dy / d) * 34}
                        stroke="var(--brand)" strokeOpacity="0.55" strokeWidth="1" opacity="0" />
                      <circle cx={sx} cy={sy} r="2.6" fill="var(--brand)" />
                    </g>
                  );
                })}
              </svg>

              {/* Its name, above the crown */}
              <div className="absolute -translate-x-1/2 -translate-y-full text-center whitespace-nowrap hidden md:block"
                style={{
                  left: `${(centre.x / viewBox.w) * 100}%`,
                  top: `${CROWN_Y * 100 - 1.5}%`,
                }}>
                {/* The supplied lockup rather than the name set as type:
                    this is the project identifying itself, and the render
                    behind it is pale, so the ember artwork is the one. */}
                <Logo
                  type="lockup"
                  variant="primary"
                  cssHeight="clamp(44px, 4.4vw, 74px)"
                  className="mx-auto"
                  label={project.name}
                />
              </div>

              {/* The point the survey is measured from */}
              <span aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${(centre.x / viewBox.w) * 100}%`, top: `${(centre.y / viewBox.h) * 100}%`,
                  width: 9, height: 9, background: 'var(--brand)',
                  boxShadow: '0 0 0 4px color-mix(in srgb, var(--brand) 20%, transparent)',
                }} />

              {/* Icon bubbles */}
              {nodes.map((n) => (
                <div
                  key={n.label}
                  data-bubble={n.icon}
                  className="absolute -translate-x-1/2 -translate-y-1/2 hidden md:block text-center"
                  style={{
                    left: `${(n.x / viewBox.w) * 100}%`,
                    top: `${(n.y / viewBox.h) * 100}%`,
                    opacity: 0,
                    willChange: 'transform, opacity',
                  }}
                >
                  <span
                    className="mx-auto flex items-center justify-center rounded-full"
                    style={{
                      width: 'clamp(44px, 4.4vw, 62px)',
                      height: 'clamp(44px, 4.4vw, 62px)',
                      background: 'var(--stage-bg)',
                      border: '1px solid var(--line)',
                      color: 'var(--text-2)',
                      boxShadow: '0 6px 22px rgba(10,12,14,0.07)',
                    }}
                  >
                    <LandmarkIcon name={n.icon} />
                  </span>
                  <span className="t-ui-sm block mt-2 whitespace-nowrap"
                    style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {n.label}
                  </span>
                  <span className="t-num-sans block"
                    style={{ color: 'var(--brand)', fontSize: '0.9375rem', marginTop: 2, textTransform: 'uppercase' }}>
                    {n.minutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wrap pb-[clamp(64px,8vw,120px)]">
          <ul className="hidden lg:grid grid-cols-3 gap-x-10 rule-strong pt-8">
            {connected.highlights.map((h) => (
              <li key={h} className="t-h3">{h}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
