'use client';
import React from 'react';
import { CinematicSection } from '@/components/motion/CinematicSection';
import { Reveal, Line } from '@/components/motion/Reveal';
import { milestones, project } from '@/content/project';
import { cld } from '@/lib/cloudinary';

/**
 * A dated construction log. Numbered because it genuinely is a sequence,
 * and the empty photo slots are left as marked gaps rather than filled in.
 */
export const Progress = () => {
  return (
    <CinematicSection id="progress" tone="bone-warm" scale="normal">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-baseline" style={{ marginBottom: 'clamp(48px, 6vw, 88px)' }}>
          <div className="grid gap-5">
            <Reveal variant="text"><p className="t-eyebrow">Construction update</p></Reveal>
            <Reveal variant="lines" delay={0.1} className="t-display" style={{ maxWidth: '10ch' }}>
              <Line>Site progress</Line>
            </Reveal>
          </div>
          <Reveal variant="text" delay={0.2}>
            <p className="t-ui-sm muted md:text-right">RERA NO.: {project.rera}</p>
          </Reveal>
        </div>

        <Reveal variant="stat">
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 rule-strong pt-10">
            {milestones.map((m, i) => (
              <li key={m.title} data-stat className="grid gap-5">
                <div className="flex items-baseline justify-between">
                  <span className="t-num" style={{ fontSize: '1.5rem', fontWeight: 300 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-ui-sm muted">{m.date}</span>
                </div>

                {m.image ? (
                  <div className="overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cld(m.image, 1000)} alt={m.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center"
                    style={{ aspectRatio: '4 / 3', border: '1px dashed var(--line-strong)' }}>
                    <span className="t-ui-sm muted-2">Photo coming soon</span>
                  </div>
                )}

                <div>
                  <h3 className="t-h3">{m.title}</h3>
                  <p className="t-body-sm muted mt-2">{m.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </CinematicSection>
  );
};
