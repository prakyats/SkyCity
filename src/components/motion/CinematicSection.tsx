import React from 'react';
import type { StopName } from '@/components/motion/ScrollStage';

export type Tone = StopName;

type Props = {
  id?: string;
  tone: Tone;
  /** Vertical presence. Not every passage should carry the same weight. */
  scale?: 'tight' | 'normal' | 'tall';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
};

/**
 * A passage in the page, not a panel on it.
 *
 * It paints no background of its own. All it does is declare which palette
 * the stage should be showing while the reader is here, and how much
 * vertical room the passage deserves. ScrollStage does the rest, and
 * because it interpolates between neighbouring stops there is never an
 * edge between two passages to notice.
 */
const pad: Record<NonNullable<Props['scale']>, string> = {
  tight: 'clamp(64px, 8vw, 112px)',
  normal: 'clamp(96px, 12vw, 184px)',
  tall: 'clamp(140px, 18vw, 264px)',
};

export const CinematicSection = ({
  id, tone, scale = 'normal', className = '', style, children, ...rest
}: Props) => (
  <section
    id={id}
    data-stop={tone}
    className={`relative ${className}`}
    style={{ paddingBlock: pad[scale], ...style }}
    {...rest}
  >
    {children}
  </section>
);
