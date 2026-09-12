'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { DUR, EASE, REVEAL, reducedMotion, travel } from '@/lib/motion';

/**
 * Scroll reveal — the site's single entrance primitive, with a small
 * vocabulary instead of one generic fade for everything:
 *
 *   text       quiet blocks of copy: opacity and a short settle upward
 *   lines      editorial headlines: each [data-line] rises out of a
 *              clipped wrapper, the masked reveal (see Line below)
 *   image      photography and drawings: a soft inset mask opens while
 *              the media breathes from a slight zoom to rest
 *   stat       facts and rows: [data-stat] children settle one by one
 *   atmosphere surfaces and washes: opacity only, slowest
 *
 * Markup is authored in its FINISHED state; the hidden "from" state is
 * applied by GSAP only when it runs. Reduced motion, a failed script and
 * crawlers therefore all see the completed layout. Each instance plays once.
 */
type Variant = 'lines' | 'text' | 'stat' | 'image' | 'atmosphere';

type Props = {
  variant?: Variant;
  /** Seconds to hold before starting, so a group arrives in order. */
  delay?: number;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const Reveal = ({
  variant = 'text',
  delay = 0,
  as: Tag = 'div',
  className = '',
  style,
  children,
}: Props) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const scrollTrigger = { trigger: el, start: REVEAL.trigger.start, once: true } as const;

      if (variant === 'lines') {
        const lines = el.querySelectorAll<HTMLElement>('[data-line]');
        if (lines.length) {
          gsap.set(lines, { yPercent: REVEAL.line });
          gsap.to(lines, {
            yPercent: 0,
            duration: DUR.slow, ease: EASE.settle,
            stagger: REVEAL.stagger.lines, delay, scrollTrigger,
          });
          return;
        }
      }

      if (variant === 'image') {
        const media = el.querySelector<HTMLElement>('img, video, svg') ?? el;
        gsap.set(el, { clipPath: 'inset(10% 3% 10% 3%)' });
        gsap.set(media, { scale: REVEAL.imageScaleFrom });
        gsap.to(el, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: DUR.cinematic, ease: EASE.settle, delay, scrollTrigger,
        });
        gsap.to(media, {
          scale: 1,
          duration: DUR.cinematic * 1.2, ease: EASE.glide, delay, scrollTrigger,
        });
        return;
      }

      if (variant === 'stat') {
        const items = el.querySelectorAll<HTMLElement>('[data-stat]');
        if (items.length) {
          gsap.set(items, { opacity: 0, y: travel(REVEAL.text) });
          gsap.to(items, {
            opacity: 1, y: 0,
            duration: DUR.slow, ease: EASE.settle,
            stagger: REVEAL.stagger.items, delay, scrollTrigger,
          });
          return;
        }
      }

      if (variant === 'atmosphere') {
        gsap.set(el, { opacity: 0 });
        gsap.to(el, { opacity: 1, duration: DUR.cinematic, ease: EASE.glide, delay, scrollTrigger });
        return;
      }

      // "text", and the fallback for variants whose markers are absent
      gsap.set(el, { opacity: 0, y: travel(REVEAL.text) });
      gsap.to(el, {
        opacity: 1, y: 0,
        duration: DUR.slow, ease: EASE.settle, delay, scrollTrigger,
      });
    }, ref);

    return () => ctx.revert();
  }, [variant, delay]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
};

/**
 * One line inside a `lines` Reveal. The wrapper is the mask; the inner
 * span travels. The padding and negative margin give descenders room
 * inside the clip without changing the layout.
 */
export const Line = ({ children, className = '', style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) => (
  <span className={`block overflow-hidden ${className}`} style={{ paddingBottom: '0.08em', marginBottom: '-0.08em', ...style }}>
    <span data-line className="block" style={{ willChange: 'transform' }}>{children}</span>
  </span>
);
