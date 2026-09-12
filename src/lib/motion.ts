/**
 * GLOBAL MOTION SYSTEM — the one vocabulary every animated element on the
 * site speaks. The values are deliberately few; consistency is the point.
 *
 *   duration  fast      UI feedback (hover, focus, header tone)
 *             standard  small reveals
 *             slow      editorial reveals (text lines, stats)
 *             cinematic image and atmosphere reveals, the hero handoff
 *   ease      one "settle" curve for entrances, with a long tail,
 *             one "glide" curve for scrubbed or continuous motion
 *   distance  reveal travel — small: things settle, they do not fly
 *   parallax  percentage of element height; single digits only
 *
 * Narrow screens use the same curves with shorter travel, via travel().
 * Reduced motion disables everything: see components/motion/Reveal.tsx.
 */
export const DUR = {
  fast: 0.45,
  standard: 0.9,
  slow: 1.35,
  cinematic: 2.0,
} as const;

export const EASE = {
  /** Entrances. Long, settling tail. */
  settle: 'power4.out',
  /** Continuous and scrubbed motion. */
  glide: 'power2.out',
  inOut: 'power2.inOut',
} as const;

export const REVEAL = {
  /** Travel in px for copy, and for a whole block. */
  text: 28,
  block: 40,
  /** Masked headline lines travel as a percentage of their own height. */
  line: 110,
  stagger: { lines: 0.09, items: 0.11 },
  /** Image entrance zoom, and the resting breathe. A few percent only. */
  imageScaleFrom: 1.08,
  parallax: { subtle: 3, standard: 6 },
  /** Where a reveal fires. Late variant for things that should wait. */
  trigger: { start: 'top 88%', startLate: 'top 75%' },
} as const;

export { reducedMotion, isTouch, isNarrowViewport } from '@/lib/browser';

import { isNarrowViewport } from '@/lib/browser';

/** Reveal travel distance, shortened on small screens. */
export function travel(px: number) {
  return isNarrowViewport() ? Math.round(px * 0.55) : px;
}
