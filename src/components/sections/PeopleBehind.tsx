'use client';
import React from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { people } from '@/content/project';

/**
 * Who built it.
 *
 * A credit roll, set as one: discipline, firm, city, on hairlines, in the
 * order the brochure prints them. There are no portraits and no logos
 * because none were supplied, and inventing either would misrepresent a
 * real company. Twelve verified lines are more convincing than twelve
 * placeholder cards.
 */
export const PeopleBehind = () => {
  return (
    <CinematicSection id="people" tone="bone" scale="normal" aria-label="The people behind the project">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-8 items-end"
          style={{ marginBottom: 'clamp(48px, 6vw, 96px)' }}>
          <div className="lg:col-span-7">
            <Reveal variant="text"><p className="t-eyebrow">{people.eyebrow}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4" style={{ maxWidth: '13ch' }}>
              <Line>{people.headline[0]}</Line>
              <Line><span className="t-italic">{people.headline[1]}</span></Line>
            </Reveal>
          </div>
          <Reveal variant="text" delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <p className="t-body-sm muted">{people.body}</p>
          </Reveal>
        </div>

        <Reveal variant="stat">
          <dl className="rule-strong">
            {people.contributors.map((c) => (
              <div
                key={`${c.role}-${c.name}`}
                data-stat
                className="rule grid grid-cols-1 sm:grid-cols-12 gap-x-8 gap-y-1 py-5 first:border-t-0"
              >
                <dt className="sm:col-span-4 t-ui-sm muted-2">{c.role}</dt>
                <dd className="sm:col-span-6 t-h3">{c.name}</dd>
                <dd className="sm:col-span-2 t-ui-sm muted sm:text-right">{c.place}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </CinematicSection>
  );
};
