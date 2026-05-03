'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';
import { cld } from '@/lib/cloudinary';

export const Hero = () => {
  const sectionRef      = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const animStarted     = useRef(false);
  const fallbackTimer   = useRef<ReturnType<typeof setTimeout>>();

  const leftTitleRef  = useRef<HTMLHeadingElement>(null);
  const rightTitleRef = useRef<HTMLDivElement>(null);
  const leftVlineRef  = useRef<HTMLDivElement>(null);
  const rightVlineRef = useRef<HTMLDivElement>(null);
  const eyebrowRef    = useRef<HTMLDivElement>(null);
  const ctaRef        = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);
  const statLeftRef   = useRef<HTMLDivElement>(null);
  const statRightRef  = useRef<HTMLDivElement>(null);
  const bottomBarRef  = useRef<HTMLDivElement>(null);

  const runEntrance = () => {
    if (animStarted.current) return;
    animStarted.current = true;
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);

    gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(leftTitleRef.current,
        { x: 0, opacity: 1, clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.3, ease: 'power3.out' }, 0
      );
      tl.to(rightTitleRef.current,
        { x: 0, opacity: 1, clipPath: 'inset(-20% 0% -20% 0%)', duration: 1.3, ease: 'power3.out' }, 0.08
      );
      tl.fromTo([leftVlineRef.current, rightVlineRef.current],
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 1.0, stagger: 0.15, ease: 'power2.inOut' }, 0.3
      );

      // Cinematic hold
      tl.to({}, { duration: 0.7 });

      const d = 0.6, e = 'power2.out';
      tl.fromTo(eyebrowRef.current,  { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: e }, '>');
      tl.fromTo(ctaRef.current,      { y:  16, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: e }, '<0.12');
      tl.fromTo(taglineRef.current,  { y:  16, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: e }, '<0.1');

      tl.fromTo([statLeftRef.current, statRightRef.current],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: d, stagger: 0.1, ease: e }, '<0.15');
      tl.fromTo(bottomBarRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.5 }, '<0.2');
    }, sectionRef);
  };

  // Hide titles after first paint so GSAP can animate them in
  // (LCP element is visible during HTML parse — hidden only after JS runs)
  useEffect(() => {
    if (leftTitleRef.current) {
      gsap.set(leftTitleRef.current,  { x: -60, opacity: 0, clipPath: 'inset(-20% 100% -20% 0%)' });
    }
    if (rightTitleRef.current) {
      gsap.set(rightTitleRef.current, { x:  60, opacity: 0, clipPath: 'inset(-20% 0% -20% 100%)' });
    }
  }, []);

  useEffect(() => {
    const onPreloaderDone = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 768) { runEntrance(); return; }
      fallbackTimer.current = setTimeout(runEntrance, 2400);
    };
    window.addEventListener('preloaderComplete', onPreloaderDone, { once: true });
    return () => {
      window.removeEventListener('preloaderComplete', onPreloaderDone);
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const anim = initHeroAnimations(null, null, videoWrapperRef);
    return () => { if (anim) anim.kill(); };
  }, []);

  const handleVideoReady = () => {
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  };
  const handleVideoPlay = () => setTimeout(runEntrance, 300);

  const lbl = (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: 'var(--font-tenor), Arial, sans-serif',
    fontSize: 'clamp(9px, 0.7vw, 11px)',
    letterSpacing: '0.36em',
    textTransform: 'uppercase',
    ...extra,
  });

  const PAD = 'clamp(28px, 5vw, 72px)';
  const TOP  = 'clamp(28px, 3.5vw, 48px)';

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh' }}
      aria-label="Yamuna Sky City — South India's Tallest Sea View Residential Tower"
    >
      {/* VIDEO */}
      <div ref={videoWrapperRef} className="absolute inset-0 z-0">
        <VideoBackground
          webmSrc="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554895/hero_b0imcd.webm"
          mp4Src="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554838/hero_gxnqcd.mp4"
          posterSrc={cld('v1777554903/hero-poster_emnfvb.jpg', 1920)}
          onReady={handleVideoReady}
          onPlay={handleVideoPlay}
        />
      </div>

      {/* Atmospheric fogs */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: '34%', background: 'linear-gradient(to right, rgba(3,8,18,0.59) 0%, rgba(3,8,18,0.32) 52%, transparent 100%)' }} />
      <div className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width: '34%', background: 'linear-gradient(to left, rgba(3,8,18,0.55) 0%, rgba(3,8,18,0.27) 52%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: 180, background: 'linear-gradient(to bottom, rgba(3,8,18,0.50) 0%, transparent 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: 220, background: 'linear-gradient(to top, rgba(3,8,18,0.52) 0%, transparent 100%)' }} />

      {/* ── TOP LEFT: Sky City favicon ────────────────────────────────── */}
      {/* Favicon sits alone at top-left — compact, not oversized */}
      <div className="absolute z-30 pointer-events-none"
        style={{ top: TOP, left: PAD }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cld('v1777699538/skyfavicon_1_tufy14.png', 120)}
          alt="Yamuna Sky City"
          width={48} height={48}
          style={{ height: 'clamp(40px, 4.2vw, 56px)', width: 'auto', display: 'block' }}
        />
      </div>

      {/* ── TOP LEFT: Eyebrow text — independently positioned below favicon ── */}
      {/* Separated from favicon so it can animate independently */}
      <div
        ref={eyebrowRef}
        className="absolute z-30 hidden md:flex flex-col gap-[8px]"
        style={{ top: 'clamp(88px, 9.5vw, 126px)', left: PAD, opacity: 0 }}
      >
        <span style={lbl({ color: 'rgba(255,255,255,0.45)' })}>
          A New Landmark in South India
        </span>
        <div style={{ width: 28, height: 1, background: 'var(--gold)', opacity: 0.6 }} />
      </div>

      {/* ── TOP RIGHT: Yamuna Homes logo ─────────────────────────────── */}
      <div className="absolute z-30 pointer-events-none"
        style={{ top: TOP, right: PAD }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cld('v1777696301/yamuna_homes_z4hnie.png', 220)}
          alt="Yamuna Homes and Design Private Limited"
          width={220} height={215}
          style={{ height: 'clamp(56px, 5.8vw, 82px)', width: 'auto', display: 'block' }}
        />
      </div>

      {/* ── CENTRE TITLES ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-between pointer-events-none"
        style={{ padding: `0 ${PAD}`, transform: 'translateY(-5vh)' }}
      >
        {/* LEFT: Yamuna */}
        <div className="flex items-center gap-4 flex-shrink-0" style={{ maxWidth: '44%' }}>
          <div ref={leftVlineRef} style={{
            width: 1,
            height: 'clamp(44px, 5.5vw, 74px)',
            flexShrink: 0,
            background: 'linear-gradient(to bottom, transparent, var(--gold) 35%, var(--gold) 65%, transparent)',
            opacity: 0.8,
          }} />
          <h1
            ref={leftTitleRef}
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              fontSize: 'clamp(54px, 9.2vw, 150px)',
              fontWeight: 400,
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Yamuna
          </h1>
        </div>

        {/* RIGHT: Sky City */}
        <div className="flex items-center gap-4 flex-shrink-0 justify-end" style={{ maxWidth: '44%' }}>
          <div
            ref={rightTitleRef}
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(54px, 9.2vw, 150px)',
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Sky City
          </div>
          <div ref={rightVlineRef} style={{
            width: 1,
            height: 'clamp(44px, 5.5vw, 74px)',
            flexShrink: 0,
            background: 'linear-gradient(to bottom, transparent, var(--gold) 35%, var(--gold) 65%, transparent)',
            opacity: 0.8,
          }} />
        </div>
      </div>

      {/* ── CTA + Tagline ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 z-30 flex items-start justify-between pointer-events-none"
        style={{ top: '57%', padding: `0 ${PAD}` }}
      >
        <div ref={ctaRef} style={{ opacity: 0 }} className="pointer-events-auto">
          <button
            aria-label="Explore Yamuna Sky City project overview"
            onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '14px 26px',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 9999,
              background: 'rgba(3,8,18,0.42)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              cursor: 'pointer',
              transition: 'border-color 0.28s, background 0.28s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(232,160,32,0.55)';
              e.currentTarget.style.background  = 'rgba(232,160,32,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)';
              e.currentTarget.style.background  = 'rgba(3,8,18,0.42)';
            }}
          >
            <span style={lbl({ color: 'rgba(255,255,255,0.80)' })}>Explore More</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
              <path d="M1 6h10M7 2l4 4-4 4" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div
          ref={taglineRef}
          style={{ opacity: 0, textAlign: 'right', maxWidth: 248 }}
          className="hidden md:block"
        >
          <p style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(12px, 1.05vw, 15px)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.48)',
            fontWeight: 300,
          }}>
            South India&apos;s Tallest<br />Sea View Residential Tower
          </p>
        </div>
      </div>


      {/* ── Bottom stat strip ─────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 z-30 flex items-end justify-between pointer-events-none"
        style={{ bottom: 'clamp(68px, 10vh, 108px)', padding: `0 ${PAD}` }}
      >
        <div ref={statLeftRef} style={{ opacity: 0 }} className="flex flex-col gap-[4px]">
          <span style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 2.8vw, 44px)',
            fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1,
          }}>
            296
          </span>
          <span style={lbl({ color: 'rgba(255,255,255,0.30)' })}>Sea-Facing Units</span>
        </div>

        <div ref={statRightRef} style={{ opacity: 0 }} className="flex flex-col items-end gap-[4px]">
          <span style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(28px, 2.8vw, 44px)',
            fontWeight: 300, color: 'rgba(255,255,255,0.88)', lineHeight: 1,
          }}>
            300m
          </span>
          <span style={lbl({ color: 'rgba(255,255,255,0.30)' })}>From the Arabian Sea</span>
        </div>
      </div>

      {/* ── Bottom bar: RERA + scroll cue ────────────────────────────── */}
      <div
        ref={bottomBarRef}
        className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between pointer-events-none"
        style={{ padding: `0 ${PAD} clamp(18px, 2.5vh, 30px)`, opacity: 0 }}
      >
        <p style={lbl({ color: 'rgba(255,255,255,0.18)', fontSize: '8.5px' })}>
          RERA: PRM/KA/RERA/1257/334/PR/171023/006331
        </p>

        {/* Scroll cue — centred */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px]"
          style={{ bottom: 'clamp(18px, 2.5vh, 30px)' }}
        >
          <div
            className="relative overflow-hidden rounded-full"
            style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.08)' }}
          >
            <div style={{
              width: 1, height: '40%',
              background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
              animation: 'heroScrollDrop 2.2s cubic-bezier(0.76, 0, 0.24, 1) infinite',
            }} />
          </div>
          <span style={lbl({ color: 'rgba(255,255,255,0.35)', fontSize: '8px', letterSpacing: '0.18em' })}>SCROLL</span>
        </div>

        <div style={{ width: 80 }} />
      </div>

      <style>{`
        @keyframes heroScrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          70%  { opacity: 1; }
          90%  { transform: translateY(250%); opacity: 0; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
    </section>
  );
};