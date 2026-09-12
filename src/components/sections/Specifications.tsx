'use client';
import React from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { specifications } from '@/content/project';

/**
 * The second register.
 *
 * The headline figures were already met on the way up, so this passage
 * does not repeat them. It carries what the climb could not: the shared
 * ground at the base of the tower, and the years behind it.
 */
export const Specifications = () => {
  return (
    <CinematicSection id="specifications" tone="bone" scale="normal">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10 items-end"
          style={{ marginBottom: 'clamp(48px, 6vw, 96px)' }}>
          <div className="lg:col-span-7">
            <Reveal variant="text"><p className="t-eyebrow">{specifications.kicker}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4" style={{ maxWidth: '13ch' }}>
              <Line>{specifications.headline[0]}</Line>
              <Line><span className="t-italic">{specifications.headline[1]}</span></Line>
            </Reveal>
          </div>
          <Reveal variant="text" delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="t-body-sm muted">
              One tower, on three acres, with the whole of the shared programme
              stacked into the podium beneath the homes.
            </p>
          </Reveal>
        </div>

        <Reveal variant="stat">
          <dl className="grid grid-cols-2 lg:grid-cols-4 rule-strong">
            {specifications.sub.map((s) => (
              <div key={s.label} data-stat className="py-9 lg:pr-10">
                <dt className="t-num" style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)' }}>{s.value}</dt>
                <dd className="t-ui muted mt-3" style={{ maxWidth: '16ch' }}>{s.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </CinematicSection>
  );
};
