'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Reveal, Line } from '@/components/motion/Reveal';
import { reducedMotion } from '@/lib/motion';
import { showcase, media, balconyPerimeter as P } from '@/content/project';

/**
 * Everything on the plate is plotted in the plan drawing's own pixel
 * space, so the survey and the drawing register on each other exactly.
 */
const PLAN = P.plan;

const LINES = 9;
const PTS = 64;
/** The plate that is the building's own edge. */
const KEY_LINE = 6;
/** Spacing between plates while they are still swells, in drawing units. */
const GAP_WET = 42;
/** Spacing once they have resolved onto the perimeter. */
const GAP_BUILT = 30;
/**
 * How far the straightening trails behind itself across the plate. Above
 * 1 the front has room to cross the full width during the morph instead
 * of snapping through the middle of it.
 */
const SPREAD = 1.2;

/**
 * The survey is struck in bone while it is drawn over the photograph and
 * inks up as the plan appears. A dark hairline over dark water cannot be
 * seen at all, which is the only reason this changes colour rather than
 * holding one weight throughout.
 *
 * Concrete values rather than tokens: GSAP has to interpolate the
 * colour, and `var()` is not interpolable. The section sits on the bone
 * stop for its whole length, so the resolved ink is stable.
 */
const SURVEY_WET = 'rgb(247, 240, 230)';
const SURVEY_INK = 'rgb(10, 12, 14)';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) =>
  (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * An asymmetric swell rather than one sine, so the crest sits off centre
 * the way a foam line actually does and no two contours agree. Their
 * disagreement is the point: it is what the building resolves.
 */
const swell = (u: number, phase: number) =>
  0.62 * Math.sin(u * Math.PI * 2 + phase)
  + 0.26 * Math.sin(u * Math.PI * 4.6 - phase * 1.7)
  + 0.12 * Math.sin(u * Math.PI * 7.4 + phase * 0.6);

/** The traced perimeter, read continuously rather than at its samples. */
const perimAt = (u: number) => {
  const n = P.y.length;
  const t = clamp01(u) * (n - 1);
  const i = Math.min(n - 2, Math.floor(t));
  const a = P.y[i] ?? P.meanY;
  const b = P.y[i + 1] ?? P.meanY;
  return a + (b - a) * (t - i);
};

const xAt = (u: number) => P.from + u * (P.to - P.from);

/** Centred on the plate while the survey is still being taken. */
const wetOffsetOf = (i: number) => (i - (LINES - 1) / 2) * GAP_WET;
/**
 * Stacked above the building's edge once resolved, rather than centred
 * on it. Centred, four of the nine plates crossed the plan's interior
 * and read as noise over the rooms; above it they read as the floors
 * they are, carried out over the water.
 */
const builtOffsetOf = (i: number) => (i - KEY_LINE) * GAP_BUILT;
const ampOf = (i: number) => 95 * (1 - (i / (LINES - 1)) * 0.2);
const phaseOf = (i: number) => i * 0.62;

/**
 * One contour, at a given straightness, as an SVG points list.
 *
 * At 0 it is a swell of its own. At 1 it is the building's real balcony
 * perimeter, offset by its floor. In between, each point resolves
 * according to how far along the plate it sits, so the drawing comes
 * good left to right under a moving front rather than easing into place
 * all at once.
 */
const pointsFor = (i: number, morph: number) => {
  const amp = ampOf(i);
  const phase = phaseOf(i);
  const wet = P.meanY + wetOffsetOf(i);
  const built0 = builtOffsetOf(i);
  let out = '';
  for (let p = 0; p < PTS; p++) {
    const u = p / (PTS - 1);
    const wave = wet + amp * swell(u, phase);
    const built = perimAt(u) + built0;
    const k = easeInOut(clamp01(morph * (1 + SPREAD) - u * SPREAD));
    out += `${xAt(u).toFixed(1)},${(wave + (built - wave) * k).toFixed(1)} `;
  }
  return out;
};

/** Where the resolving front has reached, as a fraction of the width. */
const frontAt = (morph: number) => clamp01((morph * (1 + SPREAD) - 0.5) / SPREAD);

/**
 * The architectural narrative, performed rather than described.
 *
 * The section claims the building's geometry is transcribed from the
 * coastline, so scrolling it does exactly that. A survey of contours is
 * struck across a wave front; the contours then resolve — not into lines
 * invented for the effect, but into the project's real balcony
 * perimeter, traced off the plan drawing itself — while the photograph
 * recedes to a ghost and the actual plan rises underneath them. The
 * middle contour is the building's own edge, so the claim is checkable
 * on the plate rather than merely asserted beside it.
 *
 * Two things this replaces, deliberately:
 *
 *  - The type used to be set over the photograph. On a light stage
 *    `--text` is dark ink, so it was dark type on mid-tone sand and
 *    could not be read. Copy now sits on the stage and the image is a
 *    contained plate, so legibility is structural, not a scrim.
 *  - The transition used to need a cursor, announced by a line of
 *    instructions, and did nothing at all on touch. It is now driven by
 *    the scroll everyone is already doing.
 *
 * Markup is authored in the resolved state: perimeters traced, drawing
 * struck, plan present, photograph graded back. Reduced motion and a
 * failed script both land on a complete plate that still states the idea.
 */
export const VisualShowcase = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const seaRef = useRef<HTMLImageElement>(null);
  const planRef = useRef<HTMLImageElement>(null);
  const scanRef = useRef<SVGLineElement>(null);
  const observedRef = useRef<HTMLParagraphElement>(null);
  const transcribedRef = useRef<HTMLParagraphElement>(null);
  const pointsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg || reducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const contours = Array.from(
        svg.querySelectorAll<SVGPolylineElement>('[data-contour]'),
      );
      const grey = contours.filter((_, i) => i !== KEY_LINE);
      const pts = pointsRef.current?.querySelectorAll<HTMLElement>('[data-point]');

      const state = { draw: 0, morph: 0 };

      const render = () => {
        contours.forEach((el, i) => {
          el.setAttribute('points', pointsFor(i, state.morph));
          // Struck on with a stagger down the stack. pathLength is
          // normalised to 1, so the dash survives the geometry changing
          // underneath it every frame.
          const local = clamp01(state.draw * 1.6 - (i / (LINES - 1)) * 0.6);
          el.style.strokeDashoffset = String(1 - local);
        });

        const scan = scanRef.current;
        if (scan) {
          const x = xAt(frontAt(state.morph));
          scan.setAttribute('x1', String(x));
          scan.setAttribute('x2', String(x));
          scan.style.opacity = String(Math.sin(Math.PI * state.morph) * 0.9);
        }
      };

      // The "from" state. Authored markup is the resolved plate, so the
      // unresolved one is set here, where it belongs to the animation.
      gsap.set(contours, { strokeDashoffset: 1 });
      gsap.set(grey, { stroke: SURVEY_WET, opacity: 0.85 });
      gsap.set(seaRef.current, { opacity: 1, filter: 'saturate(1) contrast(1)' });
      gsap.set(planRef.current, { opacity: 0 });
      gsap.set(observedRef.current, { opacity: 1 });
      gsap.set(transcribedRef.current, { opacity: 0 });
      if (pts?.length) gsap.set(pts, { opacity: 0, y: 16 });
      render();

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
        onUpdate: render,
      });

      tl
        // The survey is taken off the water.
        .to(state, { draw: 1, duration: 1 }, 0)
        // The swells agree, and become the building's own edge.
        .to(state, { morph: 1, duration: 1.8, ease: 'power1.inOut' }, 1.1)
        .to(seaRef.current, {
          opacity: 0.34, filter: 'saturate(0.22) contrast(1.1)', duration: 1.8,
        }, 1.1)
        .to(grey, { stroke: SURVEY_INK, opacity: 0.4, duration: 1.6 }, 1.2)
        // Handed over rather than cross-faded through a gap.
        .to(observedRef.current, { opacity: 0, duration: 0.4 }, 1.5)
        .to(transcribedRef.current, { opacity: 1, duration: 0.5 }, 1.85)
        // What was read off the water, stated once it has been read.
        .to(pts ?? [], { opacity: 1, y: 0, duration: 0.7, stagger: 0.5 }, 1.5)
        // The drawing it was read into.
        .to(planRef.current, { opacity: 0.95, duration: 1.3 }, 1.9);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} data-stop="bone" id="narrative" className="relative" style={{ height: '300vh' }}>
      <section
        className="sticky top-0 overflow-hidden"
        style={{ height: '100dvh' }}
        aria-label={showcase.kicker}
      >
        {/* The coast, filling the frame. It is not a picture placed in the
            section, it is the section's ground: it reaches every edge of
            the viewport, so there is no rectangle left to notice. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={seaRef}
          src={media.wave}
          alt="An Arabian Sea wave front, the source of the balcony geometry"
          width={1600} height={900} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            opacity: 0.34,
            filter: 'saturate(0.22) contrast(1.1)',
            // Pushed in on the foam line, which is the part being read.
            transform: 'scale(1.2)',
            transformOrigin: '50% 34%',
          }}
        />

        {/* The drawing and the survey over it, in the plan's own box so the
            middle contour sits on the real perimeter rather than near it.
            The sheet's empty lower margin runs off the bottom. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-1/2 top-[30%] w-[96%] lg:top-[15%] lg:w-[94%]"
            style={{
              aspectRatio: `${PLAN.width} / ${PLAN.height}`,
              transform: 'translateX(-50%)',
            }}
          >
            {/* The sheet is keyed out of the asset itself rather than
                blended away at runtime. `mix-blend-mode: multiply` looked
                equivalent but is not: any ancestor that makes a stacking
                context — a transform is enough — isolates the blending
                group, and the drawing then paints its paper over the sea
                as flat white. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={planRef}
              src={P.keyed}
              alt="Typical floor plan, showing the wave-derived balcony perimeter"
              width={PLAN.width} height={PLAN.height} loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ opacity: 0.95 }}
            />

            <svg
              ref={svgRef}
              viewBox={`0 0 ${PLAN.width} ${PLAN.height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              {Array.from({ length: LINES }, (_, i) => (
                <polyline
                  key={i}
                  data-contour
                  points={pointsFor(i, 1)}
                  fill="none"
                  stroke={i === KEY_LINE ? 'var(--brand)' : SURVEY_INK}
                  strokeWidth={i === KEY_LINE ? 2.8 : 1.7}
                  opacity={i === KEY_LINE ? 0.95 : 0.4}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeLinecap="round"
                />
              ))}

              {/* The pen, visible only while it is working */}
              <line ref={scanRef} x1={P.from} x2={P.from} y1={0} y2={PLAN.height}
                stroke="var(--brand)" strokeWidth={2} strokeDasharray="10 14"
                style={{ opacity: 0 }} />
            </svg>
          </div>
        </div>

        {/* The page closing back over the image, top and bottom. This is
            what lets type sit on the photograph and still be read: the
            ground beneath it is the stage's own colour, arriving as a
            gradient rather than as a panel with an edge. */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: '46%',
            background: 'linear-gradient(to bottom, var(--stage-bg) 0%,'
              + ' var(--stage-bg) 19%, transparent 100%)',
          }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '34%',
            background: 'linear-gradient(to top, var(--stage-bg) 0%,'
              + ' var(--stage-bg) 21%, transparent 100%)',
          }} />
        {/* And a narrow one down the left, because the floor rail lives
            there and has to stay readable over the water. */}
        <div aria-hidden="true"
          className="absolute inset-y-0 left-0 pointer-events-none hidden rail:block"
          style={{
            width: 'calc(var(--rail) + 2vw)',
            background: 'linear-gradient(to right, var(--stage-bg) 0%, transparent 100%)',
          }} />

        {/* The claim, over the water */}
        <div className="wrap absolute inset-x-0 top-0"
          style={{ paddingTop: 'clamp(76px, 9vh, 108px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6 items-end">
            <div className="lg:col-span-6">
              <Reveal variant="text"><p className="t-eyebrow">{showcase.kicker}</p></Reveal>
              <Reveal variant="lines" delay={0.1} className="t-display mt-3"
                style={{ fontSize: 'clamp(2rem, 4.4vw, 4rem)', maxWidth: '13ch' }}>
                {showcase.headline.map((l, i) => (
                  <Line key={l}>{i === 1 ? <span className="t-italic">{l}</span> : l}</Line>
                ))}
              </Reveal>
            </div>
            <Reveal variant="text" delay={0.2} className="lg:col-span-5 lg:col-start-8">
              <p className="t-body" style={{ color: 'var(--text-2)', maxWidth: '42ch' }}>
                {showcase.body}
              </p>
            </Reveal>
          </div>
        </div>

        {/* The plate's label, and what was read off the water */}
        <div className="wrap absolute inset-x-0 bottom-0"
          style={{ paddingBottom: 'clamp(18px, 3vh, 40px)' }}>
          <div className="relative" style={{ height: '1.2em' }}>
            <p ref={observedRef} className="t-ui-sm absolute left-0 top-0 whitespace-nowrap"
              style={{ color: 'var(--text-3)', opacity: 0 }}>
              {showcase.states[0]}
            </p>
            <p ref={transcribedRef} className="t-ui-sm absolute left-0 top-0 whitespace-nowrap"
              style={{ color: 'var(--text-3)' }}>
              {showcase.states[1]}
            </p>
          </div>

          <ul ref={pointsRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-3 mt-[clamp(10px,1.6vh,20px)]">
            {showcase.points.map((pt, i) => (
              <li key={pt} data-point className="rule-strong pt-3 flex items-baseline gap-3">
                <span className="t-num-sans flex-none"
                  style={{ fontSize: '0.75rem', color: 'var(--brand)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="t-ui" style={{ color: 'var(--text-2)' }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
