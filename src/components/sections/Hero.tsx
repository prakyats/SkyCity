'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';
import { DUR, EASE, reducedMotion } from '@/lib/motion';
import { onPreloaderComplete, viewportWidth } from '@/lib/browser';
import { project, media } from '@/content/project';
import { Logo } from '@/components/ui/Logo';

/**
 * The opening shot. The film carries its own titles, so nothing is written
 * across it: only the two marks that identify who is speaking, a scroll cue,
 * and the registration line the listing is required to show.
 *
 * The section is sticky inside a container one viewport tall, so the surface
 * below rides up over the frame instead of replacing it.
 */
export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout>>();

  // The marks and the cue settle in once, after the film is running.
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

  useEffect(() => {
    const off = onPreloaderComplete(() => {
      // Narrow screens never load the film; don't make them wait for it.
      if (viewportWidth() < 768) { runEntrance(); return; }
      fallback.current = setTimeout(runEntrance, 1600);
    });
    return () => {
      off();
      if (fallback.current) clearTimeout(fallback.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const anim = initHeroAnimations(null, null, videoWrapperRef, scrimRef);
    return () => { anim?.kill(); };
  }, []);

  const handleVideoReady = () => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  };

  return (
    <div style={{ height: '100dvh' }}>
      <section
        ref={sectionRef}
        data-stop="ink"
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100dvh' }}
        aria-label={`${project.name} — South India's tallest sea view residential tower`}
      >
        <div ref={videoWrapperRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
          <VideoBackground
            webmSrc={media.heroWebm}
            mp4Src={media.heroMp4}
            posterSrc={media.heroPoster}
            onReady={handleVideoReady}
            onPlay={() => setTimeout(runEntrance, 200)}
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
              <span className="absolute inset-x-0 top-0" style={{
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
