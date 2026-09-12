'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, scrollToTarget, isNarrowViewport } from '@/lib/browser';
import {
  plans, media, brochureHref, floorZones, flatRegister, flatRegisterIsPartial, towerElevation,
  liftCar,
} from '@/content/project';

const FLOORS = 60;

/**
 * The tallest schedule any level can show.
 *
 * The right-hand column swaps between a unit register, the published
 * bands, and a line of copy, and those are different heights — so the
 * column used to resize on every level and, because the row is centred,
 * drag the drawing and the left column with it. Every level now reserves
 * the tallest case, so nothing moves as the climb passes a boundary.
 */
const SCHEDULE_ROWS = Math.max(
  1,
  ...Object.values(flatRegister).map((rows) => rows.length),
  ...floorZones.map((z) => z.types.length),
);
/**
 * Header, plus a row of `py-4` around a single line of `t-ui` and its
 * border. Measured, not estimated: the tallest schedule renders at 200px
 * and this reserves 204, so the slot is never the thing that grows.
 */
const SCHEDULE_MIN = `calc(2.1rem + ${SCHEDULE_ROWS} * 3.55rem)`;

/**
 * Maps linear scroll to a floor, with a dwell at every zone boundary.
 *
 * Each zone gets an equal share of the climb, and within that share the
 * first part holds on the zone's first floor while the reader takes in
 * the schedule, and the rest glides up to its last floor. That is the
 * deck's "settle at floors with unique layouts, glide through identical
 * floors" without hijacking the scroll to do it: ScrollTrigger's own
 * `snap` drives the scroller directly and fights Lenis for it, which
 * makes the readout oscillate.
 */
const DWELL = 0.45;

/**
 * A floor's position on the elevation artwork, as a fraction of the
 * image height from the top. Ground and the top of the habitable body
 * are measured off the drawing itself.
 */
const yOf = (f: number) =>
  towerElevation.groundAt -
  (f / FLOORS) * (towerElevation.groundAt - towerElevation.topAt);

/**
 * The named levels, exactly the set page 8 marks: Terrace, 33, the
 * typical band, Podium, Ground.
 *
 * Every one is keyed to where it actually sits on the artwork. Mixing
 * floor-derived positions with artwork-derived ones put the typical-floor
 * label below the podium, because the drawing gives the podium real
 * height that a floor number knows nothing about.
 */
const TICKS: { y: number; label: string }[] = [
  { y: towerElevation.topAt + 0.012, label: 'Terrace' },
  { y: yOf(33), label: '33' },
  { y: yOf(18), label: '4 – 32 typical floors' },
  { y: towerElevation.podiumAt, label: 'Podium' },
  { y: towerElevation.groundAt, label: 'Ground' },
];

/**
 * The car sprite, in fractions of the artwork so it rides the shaft at
 * whatever size the elevation is drawn. The sprite includes the hanger
 * above the car, so the floor being reported is the car's own centre
 * rather than the middle of the artwork.
 */
const SPRITE = {
  w: liftCar.width / towerElevation.width,
  h: (liftCar.height + liftCar.yoke) / towerElevation.height,
  carMid: (liftCar.yoke + liftCar.height / 2) / (liftCar.height + liftCar.yoke),
};

const floorAtProgress = (p: number) => {
  const n = floorZones.length;
  const share = 1 / n;
  const i = Math.min(n - 1, Math.floor(p / share));
  const zone = floorZones[i]!;
  const local = (p - i * share) / share;
  if (local <= DWELL) return zone.from;
  const glide = (local - DWELL) / (1 - DWELL);
  return Math.round(zone.from + (zone.to - zone.from) * glide);
};

/**
 * The building climb.
 *
 * Scrolling here is the lift. A marker travels up a wireframe elevation
 * and the page reports what is actually built at the level you are
 * standing on: the zone's name, what it is for, and which residences
 * occupy it.
 *
 * The climb settles on the floors where the mix changes and glides
 * through the identical floors between them, which is the behaviour the
 * reference deck describes. Snapping uses the real zone boundaries
 * rather than even intervals, so a stop always means something.
 *
 * The deck also shows a per-flat register with unit numbers. Those
 * numbers and their areas are unconfirmed and disagree with the band
 * sizes this site publishes, so the schedule below reports the verified
 * bands instead of inventing a register.
 */
export const FloorPlans = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const [floor, setFloor] = useState(0);

  const zone = useMemo(
    () => floorZones.find((z) => floor >= z.from && floor <= z.to) ?? floorZones[0]!,
    [floor],
  );
  /** A transcribed unit register for this exact floor, where one exists. */
  const register = flatRegister[floor] ?? null;

  /**
   * The plan drawn is the largest residence on this level. A register
   * takes precedence over the published bands: the deck records flats on
   * the ground floor that the bands say start on the third, and showing
   * "no residences" above a table of three of them would be incoherent.
   * The contradiction itself is surfaced in the note below, not hidden.
   */
  const shown = register
    ? plans.find((pl) => pl.type === register[register.length - 1]!.type) ?? null
    : zone.types.length ? plans[zone.types[zone.types.length - 1]!]! : null;

  useEffect(() => {
    const wrap = wrapRef.current;
    // Unpinned, a scroll-driven readout would rewrite the level while it
    // is being read. Narrow screens hold at the ground floor instead.
    if (!wrap || reducedMotion() || isNarrowViewport()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lift = { v: 0 };
      /** The last floor written to the page. */
      let reported = -1;
      gsap.to(lift, {
        v: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: () => {
          const f = floorAtProgress(lift.v);
          // A scrubbed tween keeps reporting long after the reader has
          // left, easing towards a value it has already reached. The
          // floor is a whole number, so an unchanged one has nothing to
          // say and must not touch the DOM.
          if (f === reported) return;
          reported = f;
          setFloor(f);
          // The marker sits on the floor being reported, so it visibly
          // holds still through a dwell and travels through a glide.
          markerRef.current?.style.setProperty('--at', `${yOf(f) * 100}%`);
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} data-stop="bone" id="floorplans"
      className="relative h-auto lg:h-[420vh]">
      {/* The climb is a desktop set piece. Stacked into one column there
          is far more here than a locked viewport can hold, and pinning it
          only cut the bottom off, so below the breakpoint the section is
          an ordinary one of its natural height. */}
      <section
        className="relative flex items-center h-auto lg:sticky lg:top-0 lg:h-[100dvh]"
        style={{
          // The header is fixed and 64px tall, so the grid is centred in
          // what is left rather than in the whole viewport.
          // The floor of each clamp is what a 600px-tall window gets:
          // just clear of the 64px header, and no more.
          paddingTop: 'clamp(66px, 9vh, 104px)',
          paddingBottom: 'clamp(12px, 2.2vh, 40px)',
        }}
        aria-label="Residences, floor by floor">
        <div className="wrap w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 items-center">

            {/* Where you are, and the plan for it */}
            <div className="lg:col-span-4">
              <p className="t-eyebrow">Current level</p>

              <h2 className="t-display mt-3" style={{ fontSize: 'clamp(2.25rem, 4.4vw, 4rem)' }}>
                {floor === 0 ? 'Ground' : floor === 60 ? 'Terrace' : `Level ${floor}`}
              </h2>
              {/* Two lines reserved: the notes run to one or two, and the
                  column should not shuffle when they change. */}
              <p className="t-ui muted mt-2"
                style={{ maxWidth: '30ch', minHeight: 'calc(2 * 1.5 * 0.9375rem)' }}>
                {zone.note}
              </p>

              <div className="relative overflow-hidden mt-8"
                style={{ aspectRatio: '4 / 3', border: '1px solid var(--line)' }}>
                {shown ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img key={shown.type} src={media.blueprint} alt={`${shown.type} floor plan`}
                      width={1200} height={900} loading="lazy"
                      className="w-full h-full object-contain p-5 md:p-8"
                      style={{ animation: 'planIn var(--motion-slow) var(--ease-settle)' }} />
                    <span className="t-ui-sm absolute left-4 bottom-3 muted-2">
                      {shown.type} · largest plan on this level
                    </span>
                  </>
                ) : (
                  // The ground and podium carry no residences, so there is
                  // no plan to draw. Saying so beats showing the wrong one.
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="t-ui-sm muted-2 text-center" style={{ maxWidth: '22ch' }}>
                      No residences on this level
                    </p>
                  </div>
                )}
              </div>

              {/* The slot is kept whether or not the level has a plan, so
                  the levels that do not are not shorter by a button. */}
              <div className="mt-5" style={{ minHeight: 50 }}>
                {shown && <a className="btn" href={brochureHref} download>View full plan</a>}
              </div>
            </div>

            {/* The building itself, with the lift riding it.

                This is the deck's own wireframe elevation, cleaned so the
                page can drive the highlight. Overlays are positioned with
                fractions measured off the artwork, so the lift lands on
                the real ground line and the real top of the body. */}
            <div className="lg:col-span-3 hidden lg:block relative"
              style={{ height: 'min(74vh, 640px)' }}>
              <div className="relative h-full mx-auto" style={{ width: 'fit-content' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={towerElevation.src}
                  alt=""
                  width={towerElevation.width}
                  height={towerElevation.height}
                  className="h-full w-auto"
                  style={{ opacity: 0.88 }}
                />

                {/* The floors this residence occupies, lit on the building */}
                <span aria-hidden="true" className="absolute pointer-events-none" style={{
                  left: `${towerElevation.shaftLeft * 100}%`,
                  right: `${(1 - towerElevation.shaftRight) * 100}%`,
                  top: `${yOf(zone.to) * 100}%`,
                  height: `${Math.max((yOf(zone.from) - yOf(zone.to)) * 100, 0.7)}%`,
                  background: 'var(--brand)',
                  opacity: 0.24,
                  transition: 'top var(--motion-standard) var(--ease-settle), height var(--motion-standard) var(--ease-settle)',
                }} />

                {/* The lift car itself, hung on the core at the level being
                    reported. This is the drawing's own car, redrawn as vector
                    and lifted out of the base of the shaft. */}
                <div ref={markerRef} aria-hidden="true" className="absolute pointer-events-none"
                  style={{
                    top: 'var(--at, 98%)',
                    left: `${towerElevation.coreAt * 100}%`,
                    width: `${SPRITE.w * 100}%`,
                    height: `${SPRITE.h * 100}%`,
                    transform: `translate(-50%, -${SPRITE.carMid * 100}%)`,
                    transition: 'top var(--motion-standard) var(--ease-settle)',
                  }}>
                  <svg viewBox={`0 0 ${liftCar.width} ${liftCar.height + liftCar.yoke}`}
                    className="w-full h-full overflow-visible" aria-hidden="true">
                    {/* Hoist rope and hanger */}
                    <path d={`M${liftCar.doorSplit} 0 V${liftCar.yoke * 0.45}`}
                      stroke="var(--brand)" strokeWidth={1.4} />
                    <path d={`M${liftCar.doorSplit - 5} ${liftCar.yoke}
                              L${liftCar.doorSplit} ${liftCar.yoke * 0.38}
                              L${liftCar.doorSplit + 5} ${liftCar.yoke} Z`}
                      fill="var(--brand)" />
                    {/* The car, with its two doors left open to the page, so
                        the mark reads as a lift and not as a block. */}
                    <rect x={0} y={liftCar.yoke} width={liftCar.width} height={liftCar.height}
                      rx={1.4} fill="var(--brand)" />
                    {[0, 1].map((d) => (
                      <rect key={d}
                        x={d === 0
                          ? liftCar.frameInset
                          : liftCar.doorSplit + 1.5}
                        y={liftCar.yoke + 8}
                        width={liftCar.doorSplit - liftCar.frameInset - 1.5}
                        height={liftCar.height - 16}
                        rx={0.8}
                        fill="var(--stage-bg)" opacity={0.92} />
                    ))}
                  </svg>

                  {/* Its reading, held clear of the drawing */}
                  <span className="t-num-sans absolute whitespace-nowrap"
                    style={{
                      left: '100%', marginLeft: 12,
                      top: `${SPRITE.carMid * 100}%`, transform: 'translateY(-50%)',
                      fontSize: '0.875rem', color: 'var(--text)',
                    }}>
                    {floor === 0 ? 'G' : floor}
                  </span>
                </div>

                {/* Named levels, keyed to the drawing */}
                {TICKS.map((t) => (
                  <span key={t.label} aria-hidden="true"
                    className="absolute t-ui-sm muted-2 whitespace-nowrap flex items-center gap-2"
                    style={{ top: `${t.y * 100}%`, right: '100%', transform: 'translateY(-50%)' }}>
                    {t.label}
                    <span style={{ width: 14, height: 1, background: 'var(--line-strong)' }} />
                  </span>
                ))}
              </div>
            </div>

            {/* Flat details and key plan, as laid out in the deck */}
            <div className="lg:col-span-5">
              <h3 className="t-h3">Flat details</h3>
              <span aria-hidden="true" className="block mt-3"
                style={{ width: 34, height: 2, background: 'var(--brand)' }} />

              <div className="mt-6" style={{ minHeight: SCHEDULE_MIN }}>
              {register ? (
                // The floor has a transcribed register, so show the deck's
                // own Flat no / Type / Sq ft table.
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <caption className="sr-only">Flats on level {floor}</caption>
                  <thead>
                    <tr className="t-ui-sm muted-2">
                      <th scope="col" className="text-left font-normal pb-3">Flat no.</th>
                      <th scope="col" className="text-left font-normal pb-3">Type</th>
                      <th scope="col" className="text-right font-normal pb-3">Sq. ft.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {register.map((r, i) => {
                      const on = i === 0;
                      return (
                        <tr key={r.unit} style={{ border: '1px solid var(--line)' }}>
                          <td className="py-4 px-4 t-ui"
                            style={on ? { background: 'var(--brand)', color: 'var(--stage-bg)' } : undefined}>
                            {r.unit}
                          </td>
                          <td className="py-4 px-4 t-ui">{r.type}</td>
                          <td className="py-4 px-4 t-ui text-right">{r.area}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : zone.types.length ? (
                // No register for this floor yet, so report the published
                // bands rather than guessing unit numbers.
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <caption className="sr-only">Residences available on level {floor}</caption>
                  <thead>
                    <tr className="t-ui-sm muted-2">
                      <th scope="col" className="text-left font-normal pb-3">Type</th>
                      <th scope="col" className="text-left font-normal pb-3">Floors</th>
                      <th scope="col" className="text-right font-normal pb-3">Sq. ft.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zone.types.map((ti, i) => {
                      const p = plans[ti]!;
                      const on = i === zone.types.length - 1;
                      return (
                        <tr key={p.type} style={{ border: '1px solid var(--line)' }}>
                          <td className="py-4 px-4 t-ui"
                            style={on ? { background: 'var(--brand)', color: 'var(--stage-bg)' } : undefined}>
                            {p.type}
                          </td>
                          <td className="py-4 px-4 t-ui-sm muted">{p.floors}</td>
                          <td className="py-4 px-4 t-ui text-right">{p.size}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="t-body-sm muted" style={{ maxWidth: '34ch' }}>
                  Keep climbing. The homes begin on the third floor, above the
                  shared podium.
                </p>
              )}
              </div>

              {/* Key plan */}
              <h3 className="t-h3 mt-[clamp(20px,3.4vh,44px)]">Key floor plan</h3>
              <span aria-hidden="true" className="block mt-3"
                style={{ width: 34, height: 2, background: 'var(--brand)' }} />

              <div className="flex items-start gap-6 mt-[clamp(14px,2.2vh,26px)]">
                {/* Sized by height, not width: height is what the section
                    is short of, and the aspect then gives the width. */}
                <div className="relative overflow-hidden flex-none"
                  style={{
                    height: 'clamp(106px, 19vh, 190px)',
                    aspectRatio: '3 / 2',
                    border: '1px solid var(--line)',
                  }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={media.blueprint} alt=""
                    width={600} height={400} loading="lazy"
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(1)', opacity: 0.3 }} />
                  {/* The deck keys each unit's position on the plate. That
                      needs the keyed plan artwork per floor, which has not
                      been supplied, so the slot is labelled rather than
                      filled with invented outlines. */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="t-ui-sm muted-2 text-center px-4" style={{ maxWidth: '24ch' }}>
                      Keyed plan artwork required
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex-1">
                  <p className="t-ui-sm muted" style={{ maxWidth: '24ch' }}>
                    Shows where each flat sits on the plate.
                  </p>
                  {/* North */}
                  <svg width="26" height="26" viewBox="0 0 30 30" className="mt-3" aria-hidden="true"
                    fill="none" stroke="var(--brand)" strokeWidth="1">
                    <circle cx="15" cy="18" r="7.5" />
                    <path d="M15 3v22M11.5 8 15 3l3.5 5" />
                  </svg>

                  {/* Shown only where there is room for it. It is a
                      provenance note rather than part of the schedule,
                      and on a short window it is the difference between
                      the section fitting and being cut. */}
                  {flatRegisterIsPartial && (
                    <p className="t-ui-sm muted-2 mt-4 hidden [@media(min-width:1280px)_and_(min-height:760px)]:block"
                      style={{ maxWidth: '30ch' }}>
                      Ground-floor flat numbers are as printed in the
                      reference deck. Other levels show published floor
                      bands until the full register is confirmed.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-[clamp(16px,2.6vh,32px)]">
                <a className="btn btn-primary" href={brochureHref} download>Download brochure</a>
                <button className="btn" onClick={() => scrollToTarget('#contact')}>Schedule a visit</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
