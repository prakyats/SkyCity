'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Reveal, Line } from '@/components/motion/Reveal';
import { reducedMotion, isTouch } from '@/lib/motion';
import { onResize } from '@/lib/browser';
import { showcase, media } from '@/content/project';

const TRAIL_MAX_POINTS = 64;
const TRAIL_HEAD_R = 200;
const TRAIL_NOISE_AMP = 50;
const TRAIL_BLOB_PTS = 24;
const TRAIL_FADE_SPEED = 0.95;
const TRAIL_SAMPLE_DIST = 6;

/**
 * The one place the visitor's own hand changes the image: the wave is wiped
 * away to expose the balcony plan drawn from it. Nature to geometry, made
 * literal. On touch and with reduced motion the two images cross-fade on
 * entry instead, so the idea still lands without a cursor.
 */
export const VisualShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontImgRef = useRef<HTMLImageElement>(null);
  const backImgRef = useRef<HTMLImageElement>(null);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const passive = reducedMotion() || isTouch();
    setInteractive(!passive);
    if (passive) return;

    const container = containerRef.current;
    const frontImg = frontImgRef.current;
    const backImg = backImgRef.current;
    if (!container || !frontImg || !backImg) return;

    // An offscreen canvas that is never attached to the page: it only ever
    // serialises into the CSS mask below.
    const canvas = container.ownerDocument.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // The mask is rendered at a tenth scale: cheap to serialise, and the
    // browser's upscaling gives the soft edge for free.
    const MASK_SCALE = 0.1;
    let points: { x: number; y: number; r: number; alpha: number; seed: number }[] = [];
    const mouse = { x: 0, y: 0, active: false };
    let headRadius = 0;
    let t = 0;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let visible = true;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.max(1, Math.round(width * MASK_SCALE));
      canvas.height = Math.max(1, Math.round(height * MASK_SCALE));
    };
    resize();
    const offResize = onResize(resize);

    // Don't burn frames while the section is off screen.
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; }, { threshold: 0 });
    io.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top; mouse.active = true;
    };
    const onEnter = () => { mouse.active = true; };
    const onLeave = () => { mouse.active = false; };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    const drawBlob = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number, time: number, seed: number) => {
      if (r < 2) return;
      c.beginPath();
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
        const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + time * 1.4 + seed) * 0.45;
        const n2 = Math.sin(angle * 5 - time * 0.9 + seed * 2.3) * 0.3;
        const n3 = Math.cos(angle * 2 + time * 1.8 + seed * 0.7) * 0.25;
        const fr = r + (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
        pts.push({ x: cx + Math.cos(angle) * fr, y: cy + Math.sin(angle) * fr });
      }
      const first = pts[0]!; const last = pts[pts.length - 1]!;
      c.moveTo((first.x + last.x) / 2, (first.y + last.y) / 2);
      for (let i = 0; i < pts.length; i++) {
        const p1 = pts[i]!; const p2 = pts[(i + 1) % pts.length]!;
        c.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      }
      c.closePath(); c.fill();
    };

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (!visible) return;

      t += 0.012;
      headRadius += ((mouse.active ? TRAIL_HEAD_R : 0) - headRadius) * (mouse.active ? 0.08 : 0.03);

      if (mouse.active && headRadius > 5) {
        const tail = points[points.length - 1];
        const dist = tail ? Math.hypot(mouse.x - tail.x, mouse.y - tail.y) : Infinity;
        if (dist > TRAIL_SAMPLE_DIST) {
          points.push({ x: mouse.x, y: mouse.y, r: headRadius, alpha: 1, seed: Math.random() * 100 });
          if (points.length > TRAIL_MAX_POINTS) points.shift();
        }
      }

      ctx.setTransform(MASK_SCALE, 0, 0, MASK_SCALE, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'destination-out';

      let i = points.length;
      while (i--) {
        const p = points[i];
        if (!p) continue;
        p.alpha *= TRAIL_FADE_SPEED; p.r *= 0.992;
        if (p.alpha < 0.01) { points.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        drawBlob(ctx, p.x, p.y, p.r, t, p.seed);
      }

      if (points.length > 0 || headRadius > 0.1) {
        const url = canvas.toDataURL('image/webp', 0.1);
        frontImg.style.webkitMaskImage = `url(${url})`;
        frontImg.style.maskImage = `url(${url})`;
        frontImg.style.webkitMaskSize = '100% 100%';
        frontImg.style.maskSize = '100% 100%';
        backImg.style.opacity = '1';
      } else {
        frontImg.style.webkitMaskImage = 'none';
        frontImg.style.maskImage = 'none';
        backImg.style.opacity = '0';
      }
    };
    rafId = requestAnimationFrame(render);

    return () => {
      offResize();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      io.disconnect();
      cancelAnimationFrame(rafId);
      points = [];
    };
  }, []);

  return (
    <div data-stop="bone" className="relative" style={{ height: '170vh' }}>
      <section className="sticky top-0 w-full flex items-end overflow-hidden"
        style={{ height: '100dvh' }} aria-label={showcase.kicker}>

        <div ref={containerRef} className="absolute inset-0" style={{ cursor: interactive ? 'crosshair' : 'default' }}>
          <div className="absolute inset-0" style={{ background: 'var(--black)' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={backImgRef} src={media.balconyPlan}
            alt="Technical plan of the wave-inspired balcony perimeters"
            width={1600} height={900} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: interactive ? 0 : 0.34, zIndex: 1, transition: 'opacity var(--motion-cinematic) var(--ease-glide)' }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={frontImgRef} src={media.wave}
            alt="An Arabian Sea wave, the inspiration for the balcony perimeters"
            width={1600} height={900} loading="lazy"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 2 }} />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 3, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 42%, transparent 72%)' }} />
        </div>

        <div className="wrap relative w-full z-10" style={{ paddingBottom: 'clamp(48px, 8vh, 104px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-end">
            <div className="lg:col-span-6 pointer-events-none">
              <Reveal variant="text"><p className="t-eyebrow">{showcase.kicker}</p></Reveal>
              <Reveal variant="lines" delay={0.1} className="t-display mt-3" style={{ maxWidth: '11ch' }}>
                {showcase.headline.map((l) => <Line key={l}>{l}</Line>)}
              </Reveal>
            </div>

            <Reveal variant="text" delay={0.2} className="lg:col-span-5 lg:col-start-8">
              <p className="t-body" style={{ color: 'var(--text-2)' }}>{showcase.body}</p>
              {interactive && (
                <p className="t-ui-sm mt-3" style={{ color: 'var(--text-3)' }}>{showcase.hint}</p>
              )}
              <ul className="rule-strong mt-7">
                {showcase.points.map((pt) => (
                  <li key={pt} className="rule t-ui py-3 first:border-t-0">{pt}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
