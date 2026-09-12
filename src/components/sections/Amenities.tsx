'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, isTouch, viewportWidth } from '@/lib/browser';
import { amenities } from '@/content/project';

/**
 * The podium walk.
 *
 * On a pointer device the vertical scroll is turned sideways: the section
 * pins and the rooms travel past you, so you are walking the podium
 * rather than paging through a carousel. Each frame counter-drifts
 * slightly against the travel, which reads as depth.
 *
 * Touch keeps its own scrolling. Turning a finger swipe into a pinned
 * horizontal rig fights the platform and always feels broken, so there it
 * is simply a swipeable rail with snap.
 *
 * Two things this layout has to get right, because a pinned section is
 * unforgiving about both:
 *
 *  - It must fit one viewport exactly. A pinned element taller than the
 *    screen has its overflow cut off with no way to scroll to it, so the
 *    cards are sized from the height left over rather than from a fixed
 *    aspect ratio that might not fit.
 *  - Its anchor must sit at the start of the pinned range. Jumping to a
 *    pinned element itself lands wherever that element happens to be
 *    parked, which is how the nav link used to drop you at room five.
 */
export const Amenities = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (reducedMotion() || isTouch()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - viewportWidth());

      const st: ScrollTrigger.Vars = {
        trigger: wrap,
        start: 'top top',
        // The scroll length is the travel, so the walk runs at the same
        // speed as the page rather than being slowed or rushed.
        end: () => `+=${distance()}`,
        scrub: 0.5,
        invalidateOnRefresh: true,
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          ...st,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          // Measured before the stage, since pinning changes page height.
          refreshPriority: 1,
        },
      });

      // Depth: the image inside each frame drifts against the travel.
      gsap.fromTo(track.querySelectorAll<HTMLElement>('[data-drift]'),
        { xPercent: -5 },
        { xPercent: 5, ease: 'none', scrollTrigger: { ...st, scrub: 0.8 } });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* The anchor sits here, ahead of the pinned block, so the nav link
          lands at the start of the walk instead of part-way along it. */}
      <span id="amenities" aria-hidden="true" className="block" style={{ scrollMarginTop: 0 }} />

      <div ref={wrapRef} data-stop="bone" className="relative">
        <section
          className="relative overflow-hidden flex flex-col"
          style={{ height: '100dvh', paddingTop: 72 }}
          aria-label="Amenities"
        >
          {/* Header: kept short, because whatever it takes comes off the
              height the rooms have to live in. */}
          <div className="wrap flex-none pb-[clamp(18px,2.4vw,34px)]">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="t-eyebrow">Crafted for an elite lifestyle</p>
                <h2 className="t-display mt-3"
                  style={{ fontSize: 'clamp(2rem, 4.6vw, 4.25rem)', maxWidth: '16ch' }}>
                  Ten floors of <span className="t-italic">everything else</span>
                </h2>
              </div>
              <p className="t-ui-sm muted-2 hidden lg:block">
                {String(amenities.length).padStart(2, '0')} of 10+ shown
              </p>
            </div>
          </div>

          {/* The rail takes the rest of the viewport, and the cards take
              the height of the rail. Nothing can be cut off. */}
          <div
            ref={trackRef}
            className="no-scrollbar flex items-stretch gap-[clamp(14px,2vw,34px)] overflow-x-auto md:overflow-visible flex-1 min-h-0 pb-[clamp(24px,4vh,56px)]"
            style={{
              width: 'max-content',
              paddingLeft: 'calc(var(--gutter) + var(--rail))',
              paddingRight: 'calc(var(--gutter) + 20vw)',
              scrollSnapType: 'x mandatory',
              willChange: 'transform',
            }}
            data-lenis-prevent
          >
            {amenities.map((item, i) => (
              <figure
                key={item.title}
                className="flex-shrink-0 flex flex-col h-full"
                style={{ width: 'clamp(248px, 27vw, 400px)', scrollSnapAlign: 'start' }}
              >
                {/* The photograph fills whatever height is left, so its
                    crop varies with the window instead of overflowing it. */}
                <div className="relative overflow-hidden flex-1 min-h-0"
                  style={{ background: 'var(--sea)' }}>
                  <div data-drift className="absolute" style={{ inset: '0 -6%', willChange: 'transform' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} width={900} height={1125} loading="lazy"
                      className="w-full h-full object-cover" />
                  </div>
                  <span className="t-num-sans absolute left-4 top-4"
                    style={{ fontSize: '0.8125rem', color: 'var(--bone)', mixBlendMode: 'difference' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <figcaption className="flex-none pt-4 mt-4 rule">
                  <h3 className="t-h3" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.4rem)' }}>{item.title}</h3>
                  <p className="t-ui-sm mt-1" style={{ color: 'var(--text-3)' }}>{item.cat}</p>
                  <p className="t-body-sm muted mt-2 hidden xl:block" style={{ maxWidth: '32ch' }}>{item.desc}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
