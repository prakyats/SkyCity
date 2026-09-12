'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  scrollToTarget, scrollToTop, onViewportChange, onKeyDown,
  lockScroll, scrollMetrics, viewportHeight, toneUnderHeader,
} from '@/lib/browser';
import { navLinks, project } from '@/content/project';
import { Logo } from '@/components/ui/Logo';

type Tone = 'ink' | 'bone' | 'bone-warm' | 'sea' | 'ember';

const BAR_HEIGHT = 64;

/**
 * The header stays out of the film. It appears only once the hero has been
 * left behind, and takes its colour from whichever surface is under it, so
 * it reads as part of that layer rather than a bar riding on top.
 */
export const Header = () => {
  const [shown, setShown] = useState(false);
  const [tone, setTone] = useState<Tone>('ink');
  const [open, setOpen] = useState(false);

  /** Where the tone was last sampled, so it is not sampled per frame. */
  const probedAt = useRef(-1e9);

  useEffect(() => onViewportChange(() => {
    const { y } = scrollMetrics();
    setShown(y > viewportHeight() * 0.85);
    // The hit test forces style and layout. The surface under the bar
    // only changes at a passage boundary, so a few pixels of travel is
    // the right granularity to ask at.
    if (Math.abs(y - probedAt.current) < 12) return;
    probedAt.current = y;
    setTone(toneUnderHeader(BAR_HEIGHT) as Tone);
  }), []);

  // Close the panel on Escape, and don't leave the page locked behind it.
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const off = onKeyDown((e) => { if (e.key === 'Escape') setOpen(false); });
    return () => { off(); lockScroll(false); };
  }, [open]);

  // An open panel is always the light treatment, whatever is behind it.
  const readTone: Tone = open ? 'bone' : tone;
  const dark = readTone === 'ink' || readTone === 'sea' || readTone === 'ember';
  const fg = dark ? 'var(--bone)' : 'var(--ink)';
  // The bar borrows the stage's own colour, so it never reads as a
  // separate object floating over the page.
  const bg = dark ? 'rgba(10,12,14,0.72)' : 'rgba(237,233,227,0.78)';
  const line = dark ? 'rgba(237,233,227,0.16)' : 'rgba(10,12,14,0.12)';

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[95]"
        style={{
          background: bg,
          borderBottom: `1px solid ${line}`,
          color: fg,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          transform: shown ? 'translateY(0)' : 'translateY(-101%)',
          opacity: shown ? 1 : 0,
          pointerEvents: shown ? 'auto' : 'none',
          // Off screen means out of the tab order too: nobody should land
          // focus on a control they cannot see.
          visibility: shown ? 'visible' : 'hidden',
          transition:
            'transform var(--motion-standard) var(--ease-settle),' +
            'opacity var(--motion-standard) var(--ease-settle),' +
            'background var(--motion-slow) var(--ease-glide),' +
            'color var(--motion-slow) var(--ease-glide),' +
            'border-color var(--motion-slow) var(--ease-glide)',
        }}
      >
        <div className="wrap flex items-center justify-between" style={{ height: 64 }}>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3"
            aria-label={`${project.name}, back to top`}
          >
            {/* The lockup carries the name, so the name is not also set
                as type beside it. Its colourway follows the surface the
                bar is over. */}
            <Logo type="lockup" variant={dark ? 'dark' : 'primary'} height={30} priority />
          </button>

          <nav aria-label="Sections" className="hidden rail:flex items-center gap-8">
            {navLinks.map((l) => (
              <button key={l.href} onClick={() => go(l.href)} className="t-ui link-u" style={{ opacity: 0.72 }}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="btn"
              style={{
                minHeight: 40,
                // The header sits outside any surface, so it can't inherit
                // the tone tokens — state the colours from the read tone.
                color: fg,
                borderColor: dark ? 'rgba(237,233,227,0.45)' : 'rgba(10,12,14,0.34)',
              }}
              onClick={() => go('#contact')}
            >
              Enquire
            </button>
            <button
              className="rail:hidden flex flex-col justify-center gap-[5px]"
              style={{ width: 40, height: 40, alignItems: 'flex-end' }}
              aria-expanded={open}
              aria-controls="header-panel"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span style={{ width: 22, height: 1, background: fg, transition: 'transform var(--motion-fast) var(--ease-settle)', transform: open ? 'translateY(3px) rotate(45deg)' : 'none' }} />
              <span style={{ width: 22, height: 1, background: fg, transition: 'transform var(--motion-fast) var(--ease-settle)', transform: open ? 'translateY(-3px) rotate(-45deg)' : 'none' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile panel */}
      <div
        id="header-panel"
        data-chrome
        className="fixed inset-0 z-[94] rail:hidden flex flex-col justify-center"
        hidden={!open}
        style={{
          background: 'var(--ink)',
          color: 'var(--bone)',
          // Keyframed, not transitioned: the panel arrives from
          // `display: none`, and a transition has no start frame to run
          // from. Pointer events are refused outright when closed, so
          // the overlay can never take a tap meant for the page.
          animation: open ? 'panelIn var(--motion-standard) var(--ease-settle)' : undefined,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav aria-label="Sections" className="wrap grid gap-1">
          {navLinks.map((l) => (
            <button key={l.href} onClick={() => go(l.href)} className="t-display-lg text-left py-2"
              style={{ fontSize: 'clamp(2.2rem, 9vw, 3.4rem)' }}>
              {l.label}
            </button>
          ))}
          <button onClick={() => go('#contact')} className="btn btn-primary mt-8 justify-self-start">
            Book a site visit
          </button>
        </nav>
      </div>
    </>
  );
};
