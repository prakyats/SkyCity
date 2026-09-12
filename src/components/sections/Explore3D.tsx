'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { reducedMotion, isTouch } from '@/lib/browser';
import { explore3d } from '@/content/project';

/**
 * The doorway out.
 *
 * The preview opens from a slot and keeps pushing in for as long as the
 * passage is on screen, so it reads as a view you are moving towards
 * rather than a thumbnail with a button under it. The whole frame is the
 * link, and it says where it goes before you click it.
 */
export const Explore3D = () => {
  const frameRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    if (reducedMotion() || isTouch()) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(img,
        { scale: 1.16 },
        {
          scale: 1.02,
          ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
    }, frame);
    return () => ctx.revert();
  }, []);

  return (
    <CinematicSection tone="bone-warm" scale="normal" aria-label="3D experience">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end"
          style={{ marginBottom: 'clamp(40px, 5vw, 72px)' }}>
          <div className="lg:col-span-7">
            <Reveal variant="text"><p className="t-eyebrow">{explore3d.eyebrow}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4" style={{ maxWidth: '12ch' }}>
              <Line>{explore3d.headline[0]}</Line>
              <Line><span className="t-italic">{explore3d.headline[1]}</span></Line>
            </Reveal>
          </div>
          <Reveal variant="text" delay={0.2} className="lg:col-span-5">
            <p className="t-body muted">{explore3d.body}</p>
          </Reveal>
        </div>

        <Reveal variant="image">
          <a
            ref={frameRef}
            href={explore3d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden"
            style={{ aspectRatio: '16 / 9' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={explore3d.preview}
              alt={explore3d.previewAlt}
              width={1600}
              height={900}
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ willChange: 'transform' }}
            />

            <span aria-hidden="true" className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(10,12,14,0.7) 0%, rgba(10,12,14,0.15) 45%, transparent 75%)' }} />

            <span className="absolute inset-x-0 bottom-0 p-[clamp(20px,3vw,44px)] flex flex-wrap items-end justify-between gap-5"
              style={{ color: 'var(--bone)' }}>
              <span className="t-display-sm">{explore3d.cta}</span>
              <span className="t-ui-sm" style={{ opacity: 0.72 }}>{explore3d.note}</span>
            </span>

            {/* A hairline frame that closes in on hover */}
            <span aria-hidden="true" className="absolute pointer-events-none"
              style={{
                inset: 14,
                border: '1px solid rgba(237,233,227,0.34)',
                transition: 'inset var(--motion-standard) var(--ease-settle), border-color var(--motion-standard) var(--ease-settle)',
              }}
            />
          </a>
        </Reveal>
      </div>

      <style>{`
        .group:hover > span[aria-hidden="true"]:last-child { inset: 24px; border-color: rgba(237,233,227,0.7); }
      `}</style>
    </CinematicSection>
  );
};
