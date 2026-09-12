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
 * pins and the rooms travel past you, so you are walking the podium rather
 * than paging through a carousel. Each frame counter-drifts slightly
 * against the travel, which reads as depth, and the caption for the room
 * nearest the centre is the one that lifts.
 *
 * Touch keeps its own scrolling. Turning a finger swipe into a pinned
 * horizontal rig fights the platform and always feels broken, so there it
 * is simply a swipeable rail with snap.
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
      const distance = () => track.scrollWidth - viewportWidth();

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          // The scroll length is the travel, so the walk runs at the same
          // speed as the page rather than being slowed or rushed.
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Measured before the stage, since pinning changes the page height.
          refreshPriority: 1,
        },
      });

      // Depth: the image inside each frame drifts against the travel.
      track.querySelectorAll<HTMLElement>('[data-drift]').forEach((img) => {
        gsap.fromTo(img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} data-stop="bone" id="amenities" className="relative">
      <section className="relative overflow-hidden" style={{ minHeight: '100dvh' }} aria-label="Amenities">
        <div className="wrap pt-[clamp(72px,10vw,140px)] pb-[clamp(32px,4vw,56px)]">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="t-eyebrow">Crafted for an elite lifestyle</p>
              <h2 className="t-display mt-4" style={{ maxWidth: '14ch' }}>
                Ten floors of <span className="t-italic">everything else</span>
              </h2>
            </div>
            <p className="t-ui-sm muted-2 hidden lg:block">
              {String(amenities.length).padStart(2, '0')} of 10+ shown
            </p>
          </div>
        </div>

        {/* The rail. Pinned and dragged sideways on pointer devices;
            a native snap scroller on touch. */}
        <div
          ref={trackRef}
          className="no-scrollbar flex items-stretch gap-[clamp(16px,2.4vw,40px)] pb-[clamp(48px,7vw,110px)] overflow-x-auto md:overflow-visible"
          style={{
            width: 'max-content',
            paddingLeft: 'calc(var(--gutter) + var(--rail))',
            paddingRight: 'calc(var(--gutter) + 24vw)',
            scrollSnapType: 'x mandatory',
            willChange: 'transform',
          }}
          data-lenis-prevent
        >
          {amenities.map((item, i) => (
            <figure
              key={item.title}
              className="flex-shrink-0"
              style={{ width: 'clamp(272px, 33vw, 470px)', scrollSnapAlign: 'start' }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5', background: 'var(--sea)' }}>
                <div data-drift className="absolute" style={{ inset: '0 -7%', willChange: 'transform' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} width={900} height={1125} loading="lazy"
                    className="w-full h-full object-cover" />
                </div>
                <span className="t-num-sans absolute left-4 top-4" style={{ fontSize: '0.8125rem', color: 'var(--bone)', mixBlendMode: 'difference' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <figcaption className="pt-5 mt-5 rule">
                <h3 className="t-h3">{item.title}</h3>
                <p className="t-ui-sm mt-1" style={{ color: 'var(--text-3)' }}>{item.cat}</p>
                <p className="t-body-sm muted mt-3" style={{ maxWidth: '34ch' }}>{item.desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};
