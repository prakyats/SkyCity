'use client';
import { useEffect, useState } from 'react';
import { onViewportChange, scrollMetrics, toneAtPoint, viewportHeight } from '@/lib/browser';
import { project } from '@/content/project';

const FLOORS = project.floors;
const TICKS = [0, 10, 20, 30, 40, 50, 60];
const RAIL_X = 36;

/**
 * The page is the tower, so the page's own depth is read as a floor number:
 * level 60 at the sky view, ground at the footer.
 *
 * The rail takes its colour from the surface behind it rather than using
 * difference blending. Blending looks clever on black and white but turns
 * a bright cyan over the Ember block, which is not a colour in the brand.
 */
export const FloorRail = () => {
  const [progress, setProgress] = useState(0);
  const [stop, setStop] = useState('ink');

  useEffect(() => onViewportChange(() => {
    setProgress(scrollMetrics().progress);
    setStop(toneAtPoint(RAIL_X, viewportHeight() / 2));
  }), []);

  const onDark = stop === 'ink' || stop === 'sea' || stop === 'ember';
  const fg = onDark ? 'var(--bone)' : 'var(--ink)';
  const track = onDark ? 'rgba(237,233,227,0.28)' : 'rgba(10,12,14,0.18)';
  const tick = onDark ? 'rgba(237,233,227,0.5)' : 'rgba(10,12,14,0.32)';

  const floor = Math.round(FLOORS - progress * FLOORS);
  const label = floor <= 0 ? 'G' : String(floor);

  return (
    <aside
      aria-hidden="true"
      data-chrome
      className="fixed left-0 top-0 bottom-0 z-[80] hidden rail:flex flex-col items-center pointer-events-none"
      style={{
        width: 72,
        color: fg,
        transition: 'color var(--motion-slow) var(--ease-glide)',
      }}
    >
      {/* Clears the header band, so the reading is never half-hidden by it */}
      <div className="t-num" style={{ fontSize: '2.25rem', lineHeight: 1, paddingTop: 84 }}>{label}</div>
      <div className="t-ui-sm" style={{ opacity: 0.62, marginTop: 2 }}>of {FLOORS}</div>

      <div className="relative flex-1 my-6" style={{ width: 1, background: track }}>
        {TICKS.map((f) => (
          <span key={f} className="absolute" style={{
            top: `${((FLOORS - f) / FLOORS) * 100}%`, left: -4, width: 9, height: 1, background: tick,
          }} />
        ))}
        <span className="absolute" style={{
          top: `${progress * 100}%`, left: -8, width: 17, height: 1, background: fg,
        }} />
      </div>

      <div className="t-ui-sm pb-7" style={{ opacity: 0.62 }}>G</div>
    </aside>
  );
};
