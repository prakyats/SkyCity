'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, styleRoot, stageStops } from '@/lib/browser';

/**
 * The page has one ground, not thirteen.
 *
 * Every section declares a palette with `data-stop` and carries no
 * background of its own. This component owns the only background on the
 * site and interpolates it — and the text, hairline and accent tokens
 * that go with it — continuously as you scroll. Because the tokens live
 * on the root element, every component picks up the change for free.
 *
 * The effect is that the surface is always mid-transition. You never
 * cross an edge between two sections, because there is no edge: the
 * ground under the whole page is moving with you.
 */

export type StopName = 'ink' | 'bone' | 'bone-warm' | 'sea' | 'ember';

type Palette = {
  bg: string;
  fg: string;
  /** Alpha for the secondary, tertiary, hairline and strong-hairline inks. */
  soft: [number, number, number, number];
  brand: string;
};

const PALETTES: Record<StopName, Palette> = {
  ink: { bg: '#0A0C0E', fg: '#EDE9E3', soft: [0.68, 0.42, 0.15, 0.5], brand: '#D9561D' },
  bone: { bg: '#EDE9E3', fg: '#0A0C0E', soft: [0.66, 0.44, 0.14, 0.38], brand: '#C1440E' },
  'bone-warm': { bg: '#F5F2ED', fg: '#0A0C0E', soft: [0.66, 0.44, 0.13, 0.34], brand: '#C1440E' },
  sea: { bg: '#123C46', fg: '#EDE9E3', soft: [0.72, 0.46, 0.18, 0.52], brand: '#E8A07A' },
  ember: { bg: '#C1440E', fg: '#F5F2ED', soft: [0.84, 0.62, 0.3, 0.64], brand: '#F5F2ED' },
};

const toRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

/**
 * How finely a handover is stepped.
 *
 * Setting a custom property on the root invalidates style for the whole
 * document, and on a page with every passage mounted that measures at
 * roughly twenty milliseconds a time — past the frame budget on its own.
 * So a frame with nothing new to say must not write at all: the channels
 * are already whole numbers, and quantising progress as well means most
 * frames resolve to the palette already on the page and return.
 *
 * Forty-eight steps is the coarsest that still reads as continuous. The
 * widest handover on the page is ink to bone, about 227 levels, so a step
 * moves under five levels — invisible as a change over time, and it costs
 * a full document recalculation each, which is the whole point.
 */
const HANDOVER_STEPS = 48;

const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)}, ${Math.round(a[1] + (b[1] - a[1]) * t)}, ${Math.round(a[2] + (b[2] - a[2]) * t)})`;

const mixAlpha = (
  fg: [number, number, number], to: [number, number, number],
  aFrom: number, aTo: number, t: number,
) => {
  const c = [
    Math.round(fg[0] + (to[0] - fg[0]) * t),
    Math.round(fg[1] + (to[1] - fg[1]) * t),
    Math.round(fg[2] + (to[2] - fg[2]) * t),
  ];
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${(aFrom + (aTo - aFrom) * t).toFixed(3)})`;
};

export const ScrollStage = () => {
  useEffect(() => {
    const root = styleRoot();
    if (!root) return;

    const apply = (name: StopName) => {
      const p = PALETTES[name];
      const fg = toRgb(p.fg);
      root.style.setProperty('--stage-bg', p.bg);
      root.style.setProperty('--text', p.fg);
      root.style.setProperty('--text-2', `rgba(${fg[0]},${fg[1]},${fg[2]},${p.soft[0]})`);
      root.style.setProperty('--text-3', `rgba(${fg[0]},${fg[1]},${fg[2]},${p.soft[1]})`);
      root.style.setProperty('--line', `rgba(${fg[0]},${fg[1]},${fg[2]},${p.soft[2]})`);
      root.style.setProperty('--line-strong', `rgba(${fg[0]},${fg[1]},${fg[2]},${p.soft[3]})`);
      root.style.setProperty('--brand', p.brand);
    };

    const stops = stageStops();
    if (!stops.length) return;

    const nameOf = (el: HTMLElement): StopName =>
      (el.dataset.stop as StopName) in PALETTES ? (el.dataset.stop as StopName) : 'ink';

    apply(nameOf(stops[0]!));

    // With reduced motion the ground still changes, but discretely: each
    // palette is applied when its section takes the viewport.
    if (reducedMotion()) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) apply(nameOf(e.target as HTMLElement));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      stops.forEach((s) => io.observe(s));
      return () => io.disconnect();
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      stops.forEach((el, i) => {
        const from = PALETTES[nameOf(stops[i - 1] ?? el)];
        const to = PALETTES[nameOf(el)];
        if (i === 0) return;

        const bgA = toRgb(from.bg), bgB = toRgb(to.bg);
        const fgA = toRgb(from.fg), fgB = toRgb(to.fg);
        const brA = toRgb(from.brand), brB = toRgb(to.brand);
        /** The palette this passage last wrote, so it never writes it twice. */
        let written = '';

        ScrollTrigger.create({
          trigger: el,
          // A narrow, late window: the handover runs across the last
          // third of a viewport before the passage lands. Any wider and a
          // short passage's outgoing fade would begin before its own
          // colour had finished arriving, so it would never be itself.
          start: 'top 62%',
          end: 'top 22%',
          scrub: true,
          // Computed last. The pinned passages add scroll length to the
          // document, and anything measured before they do is measured
          // against a page that no longer exists.
          refreshPriority: -1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = Math.round(self.progress * HANDOVER_STEPS) / HANDOVER_STEPS;
            const bg = mix(bgA, bgB, t);
            const fg = mix(fgA, fgB, t);
            const soft2 = mixAlpha(fgA, fgB, from.soft[0], to.soft[0], t);
            const soft3 = mixAlpha(fgA, fgB, from.soft[1], to.soft[1], t);
            const line = mixAlpha(fgA, fgB, from.soft[2], to.soft[2], t);
            const lineStrong = mixAlpha(fgA, fgB, from.soft[3], to.soft[3], t);
            const brand = mix(brA, brB, t);

            const next = `${bg}|${fg}|${soft2}|${soft3}|${line}|${lineStrong}|${brand}`;
            if (next === written) return;
            written = next;

            root.style.setProperty('--stage-bg', bg);
            root.style.setProperty('--text', fg);
            root.style.setProperty('--text-2', soft2);
            root.style.setProperty('--text-3', soft3);
            root.style.setProperty('--line', line);
            root.style.setProperty('--line-strong', lineStrong);
            root.style.setProperty('--brand', brand);
          },
        });
      });
    });

    // Measure once the pins exist and the display faces have loaded,
    // otherwise every palette below the first pin fires early.
    let raf = 0;
    raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    // eslint-disable-next-line no-restricted-globals
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
      ['--stage-bg', '--text', '--text-2', '--text-3', '--line', '--line-strong', '--brand']
        .forEach((v) => root.style.removeProperty(v));
    };
  }, []);

  return null;
};
