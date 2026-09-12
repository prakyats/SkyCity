'use client';
import React from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { scrollToTarget } from '@/lib/browser';
import { viewing } from '@/content/project';

/**
 * A held breath between the gallery and the drawings. Nothing here but a
 * statement, a line of prose and one action — the pause is the point.
 */
export const Viewing = () => {
  return (
    <CinematicSection tone="ember" scale="tall" aria-label="Private viewing"
      className="flex items-center" style={{ minHeight: '100dvh' }}>
      <div className="wrap">
        <Reveal variant="text"><p className="t-eyebrow">{viewing.kicker}</p></Reveal>

        <Reveal variant="lines" delay={0.12} className="t-display mt-6" style={{ maxWidth: '14ch' }}>
          {viewing.statement.map((l) => <Line key={l}>{l}</Line>)}
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 mt-14">
          <Reveal variant="text" delay={0.24} className="lg:col-span-5 lg:col-start-8">
            <p className="t-body" style={{ color: 'var(--text-2)' }}>{viewing.body}</p>
            <button
              className="btn btn-primary mt-9"
              onClick={() => scrollToTarget('#contact')}
            >
              {viewing.cta}
            </button>
          </Reveal>
        </div>
      </div>
    </CinematicSection>
  );
};
