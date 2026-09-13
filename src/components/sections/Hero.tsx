'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';
import { DUR, EASE, reducedMotion } from '@/lib/motion';
import { onPreloaderComplete, viewportWidth } from '@/lib/browser';
import { project, media } from '@/content/project';
import { Logo } from '@/components/ui/Logo';

/**
 * Below this the film is not fetched at all: several megabytes, on a
 * screen too small to read the frame and usually on a metered connection,
 * to replace a poster that says the same thing.
 */
const FILM_MIN_WIDTH = 1024;

/** How much scroll the film is given to play across. */
const SCRUB_VH = 300;

/**
 * Half a frame at 24fps. A target this close to where the film already
 * sits has no new frame to show, so seeking to it is work for a picture
 * nobody would see change.
 */
const HALF_FRAME = 1 / 48;

/**
 * The opening shot, played by the scroll.
 *
 * The film carries its own titles, so nothing is written across it: only
 * the two marks that identify who is speaking, a scroll cue, and the
 * registration line the listing is required to show.
 *
 * Scrolling here seeks the film rather than the page. The passage is
 * given three viewports of room, the reader moves through twelve seconds
 * of footage by scrolling it, and then the frame pushes in and loses its
 * light as the next surface arrives over it.
 *
 * Two things make that viable, and without them it should not be
 * attempted. The film is re-encoded with a keyframe every fifth of a
 * second, because seeking the original measured at 793ms a time and no
 * amount of careful driving recovers from that. And only ever one seek is
 * in flight: asking for another while the last is still working queues
 * them, and the film then falls further behind the scroll with every
 * frame instead of catching up.
 *
 * If the film is not wanted or never arrives, the passage stays one
 * viewport tall and holds the poster. Nothing here is load-bearing.
 */
export const Hero = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const entered = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout>>();

  /** Whether this screen should fetch the film. Decided after mount. */
  const [wantsFilm, setWantsFilm] = useState(false);
  /** Whether the film has arrived and the scroll is driving it. */
  const [scrubbing, setScrubbing] = useState(false);

  // The marks and the cue settle in once, after the film is up.
  const runEntrance = () => {
    if (entered.current) return;
    entered.current = true;
    if (fallback.current) clearTimeout(fallback.current);

    if (reducedMotion()) {
      gsap.set([marksRef.current, cueRef.current], { opacity: 1, y: 0 });
      return;
    }

    gsap.context(() => {
      gsap.timeline()
        .to(marksRef.current, { opacity: 1, y: 0, duration: DUR.cinematic, ease: EASE.settle }, 0)
        .to(cueRef.current, { opacity: 1, duration: DUR.slow, ease: EASE.glide }, 0.7);
    }, sectionRef);
  };

  useEffect(() => {
    if (reducedMotion()) return;
    gsap.set(marksRef.current, { opacity: 0, y: -10 });
    gsap.set(cueRef.current, { opacity: 0 });
  }, []);

  // Read after mount, so the server and the client render the same thing.
  useEffect(() => {
    setWantsFilm(!reducedMotion() && viewportWidth() >= FILM_MIN_WIDTH);
  }, []);

  useEffect(() => {
    const off = onPreloaderComplete(() => {
      // A screen that never loads the film should not be made to wait.
      if (!wantsFilm) { runEntrance(); return; }
      fallback.current = setTimeout(runEntrance, 1600);
    });
    return () => {
      off();
      if (fallback.current) clearTimeout(fallback.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantsFilm]);

  // The passage takes its height from the decision, so the exit is
  // measured again when that is made and not again after.
  useEffect(() => {
    const anim = initHeroAnimations(wrapRef, videoWrapperRef, scrimRef);
    return () => { anim?.kill(); };
  }, [wantsFilm]);

  const handleFilmReady = (el: HTMLVideoElement) => {
    filmRef.current = el;
    setScrubbing(true);
    runEntrance();
  };

  // The scroll, driving the film.
  useEffect(() => {
    const wrap = wrapRef.current;
    const film = filmRef.current;
    if (!scrubbing || !wrap || !film) return;

    gsap.registerPlugin(ScrollTrigger);

    let target = 0;
    let raf = 0;

    /**
     * The last frame, never the duration itself: no frame begins at the
     * end of a file, so a seek there lands on whatever came before and
     * the film appears to stop short of its own ending.
     */
    const clamp = (t: number) =>
      Math.max(0, Math.min(t, film.duration - HALF_FRAME));

    const tick = () => {
      raf = requestAnimationFrame(tick);
      // One seek in flight at a time, and never for a frame already shown.
      if (!film.duration || film.seeking) return;
      const t = clamp(target);
      if (Math.abs(t - film.currentTime) < HALF_FRAME) return;
      film.currentTime = t;
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => { target = self.progress * (film.duration || 0); },
      onToggle: (self) => {
        // Off screen there is no film to drive and no reason to be asking.
        if (self.isActive) { start(); return; }
        stop();
        // Land on the boundary frame before the loop goes. Stopping on
        // the toggle alone left whatever seek was in flight as the last
        // word, so the film finished a second and a bit short.
        if (film.duration) film.currentTime = clamp(self.progress * film.duration);
      },
    });
    if (st.isActive) start();

    ScrollTrigger.refresh();

    return () => { stop(); st.kill(); };
  }, [scrubbing]);

  // Height comes from whether the film is wanted, not from whether it has
  // arrived. Growing the passage on arrival would move the whole page
  // under the reader, and would do it after the scroll position had
  // already been restored — putting them somewhere they had never been. A
  // film that never loads holds the poster for the same distance instead.
  return (
    <div ref={wrapRef} data-opening
      style={{ height: wantsFilm ? `${SCRUB_VH}vh` : '100dvh' }}>
      <section
        ref={sectionRef}
        data-stop="ink"
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100dvh' }}
        aria-label={`${project.name} — South India's tallest sea view residential tower`}
      >
        {/* The film carries its own titles and nothing is written across
            it, so the document's one heading is set for assistive
            technology and search rather than for the screen. */}
        <h1 className="sr-only">
          {project.name} — South India&apos;s tallest sea view residential tower
        </h1>

        <div ref={videoWrapperRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
          <VideoBackground
            src={media.heroScrub}
            posterSrc={media.heroPoster}
            enabled={wantsFilm}
            onReady={handleFilmReady}
          />
        </div>

        {/* The light leaving the shot on exit */}
        <div ref={scrimRef} aria-hidden="true" className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'var(--ink)', opacity: 0 }} />

        {/* Just enough grade at the edges to hold the marks and the cue */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 pointer-events-none"
          style={{ height: 200, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)' }} />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
          style={{ height: 220, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

        {/* Who is speaking */}
        <div ref={marksRef} className="wrap absolute inset-x-0 top-0 z-30 flex items-start justify-between"
          style={{ paddingTop: 'clamp(20px, 3vw, 36px)' }}>
          {/* White artwork, because this sits on the film */}
          <Logo type="lockup" variant="dark" cssHeight="clamp(34px, 3.6vw, 52px)"
            label={project.name} priority />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media.yamunaMark} alt={project.developer} width={240} height={234}
            style={{ height: 'clamp(46px, 4.8vw, 68px)', width: 'auto' }} />
        </div>

        {/* Scroll cue and registration */}
        <div ref={cueRef} className="absolute inset-x-0 bottom-0 z-30"
          style={{ paddingBottom: 'clamp(16px, 2.4vh, 28px)' }}>
          <div className="flex flex-col items-center gap-3" aria-hidden="true">
            <span className="relative block overflow-hidden" style={{ width: 1, height: 52, background: 'rgba(247,240,230,0.2)' }}>
              <span className="absolute inset-x-0 top-0" data-autopause style={{
                height: '42%',
                background: 'linear-gradient(to bottom, transparent, rgba(247,240,230,0.85), transparent)',
                animation: 'cueDrop 2.8s var(--ease-glide) infinite',
              }} />
            </span>
            <span className="t-ui-sm" style={{ color: 'rgba(247,240,230,0.5)', fontSize: '0.7rem' }}>Scroll</span>
          </div>

          <p className="wrap t-ui-sm mt-4" style={{ color: 'rgba(247,240,230,0.38)', fontSize: '0.66rem' }}>
            RERA: {project.rera}
          </p>
        </div>
      </section>
    </div>
  );
};
