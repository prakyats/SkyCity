'use client';
import React from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { legacy } from '@/content/project';

/**
 * The legacy layer: dark, wide, and deliberately unhurried. The content is
 * sparse by intent, so the space is used as composition rather than padded
 * out with filler.
 */
export const Journey = () => {
  return (
    <CinematicSection id="journey" tone="bone-warm" scale="tall">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-20">
          <div className="lg:col-span-6">
            <Reveal variant="text"><p className="t-eyebrow">{legacy.kicker}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4" style={{ maxWidth: '10ch' }}>
              {legacy.headline.map((l) => <Line key={l}>{l}</Line>)}
            </Reveal>
            <Reveal variant="text" delay={0.2}>
              <p className="t-body mt-10" style={{ color: 'var(--text-2)', maxWidth: '44ch' }}>{legacy.body}</p>
            </Reveal>
            <Reveal variant="stat" delay={0.1}>
              <ul className="rule-strong mt-12" style={{ maxWidth: 420 }}>
                {legacy.checklist.map((item) => (
                  <li key={item} data-stat className="rule flex items-center gap-4 py-4 first:border-t-0 t-ui">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 7.5L5.5 11L12 3" stroke="var(--brand)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal variant="text"><p className="t-eyebrow">{legacy.valuesKicker}</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display mt-4">
              <Line>Core values</Line>
            </Reveal>
            <Reveal variant="stat" delay={0.1}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 rule-strong mt-10">
                {legacy.values.map((v, i) => (
                  <li key={v} data-stat className={`rule py-4 t-ui ${i < 2 ? 'sm:border-t-0' : ''} first:border-t-0`}>{v}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="text" delay={0.15}>
              <div className="mt-20 pt-10 rule-strong">
                <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>{legacy.milestoneLabel}</p>
                <div className="t-num mt-3" style={{ fontSize: 'clamp(4.5rem, 9vw, 9rem)' }}>{legacy.milestoneValue}</div>
                <h3 className="t-h3 mt-3">{legacy.milestoneTitle}</h3>
                <p className="t-body-sm mt-4" style={{ color: 'var(--text-2)', maxWidth: '40ch' }}>{legacy.milestoneBody}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </CinematicSection>
  );
};
