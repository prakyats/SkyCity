'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';

export const Hero = () => {
  const sectionRef      = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  const [isReady,   setIsReady]   = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [phase,     setPhase]     = useState(0); // 0=hidden 1=titles 2=details

  const hasTriggered = useRef(false);
  const fallbackRef  = useRef<NodeJS.Timeout | null>(null);

  // ── Wait for preloader ────────────────────────────────────────────────
  useEffect(() => {
    const onComplete = () => setIsActivated(true);
    window.addEventListener('preloaderComplete', onComplete);
    return () => window.removeEventListener('preloaderComplete', onComplete);
  }, []);

  // ── Fallback: guarantee content shows even if video never plays ────────
  useEffect(() => {
    if (window.innerWidth < 768) { setPhase(2); hasTriggered.current = true; return; }
    fallbackRef.current = setTimeout(() => {
      if (!hasTriggered.current) { setPhase(2); hasTriggered.current = true; }
    }, 2200);
    return () => { if (fallbackRef.current) clearTimeout(fallbackRef.current); };
  }, []);

  // ── Cinematic phase timeline (video-driven) ────────────────────────────
  useEffect(() => {
    if (!isReady || !isPlaying || !isActivated || hasTriggered.current) return;
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
    const t1 = setTimeout(() => setPhase(1), 2000);   // titles immediately
    const t2 = setTimeout(() => setPhase(2), 3800);  // details after 2.4s
    hasTriggered.current = true;
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isReady, isPlaying, isActivated]);

  // ── GSAP entrance animations per phase ────────────────────────────────
  useEffect(() => {
    if (phase < 1) return;
    const ctx = gsap.context(() => {

      if (phase === 1) {
        // LEFT: "Yamuna" — slides in from left with clip reveal
        gsap.fromTo('.hero-left-title',
          { x: -60, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)',
            duration: 1.4, ease: 'power3.out' }
        );
        // RIGHT: "Sky City" — slides in from right with clip reveal
        gsap.fromTo('.hero-right-title',
          { x: 60, opacity: 0, clipPath: 'inset(0 0 0 100%)' },
          { x: 0, opacity: 1, clipPath: 'inset(0 0 0 0%)',
            duration: 1.4, ease: 'power3.out' }
        );
        // Left vertical line draws down
        gsap.fromTo('.hero-left-vline',
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 1.0, ease: 'power2.inOut', delay: 0.3 }
        );
        // Right vertical line draws down
        gsap.fromTo('.hero-right-vline',
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 1.0, ease: 'power2.inOut', delay: 0.5 }
        );
      }

      if (phase === 2) {
        const tl = gsap.timeline();

        // Left column details stagger up
        tl.fromTo('.hero-left-detail',
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.15, ease: 'power3.out' }
        );
        // Right column details stagger up
        tl.fromTo('.hero-right-detail',
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.15, ease: 'power3.out' },
          '-=0.6'
        );
        // Horizontal gold rules draw in from center
        tl.fromTo('.hero-hrule',
          { scaleX: 0, transformOrigin: 'center' },
          { scaleX: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out' },
          '-=0.7'
        );
        // RERA + bottom items
        tl.fromTo('.hero-bottom',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.3'
        );
      }

    }, sectionRef);
    return () => ctx.revert();
  }, [phase]);

  // ── Global camera zoom on scroll ──────────────────────────────────────
  useEffect(() => {
    const anim = initHeroAnimations(null, null, videoWrapperRef);
    return () => { if (anim) anim.kill(); };
  }, []);

  const handleVideoReady = () => {
    setIsReady(true);
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  };
  const handleVideoPlay = () => setIsPlaying(true);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh' }}
      aria-label="Hero"
    >
      {/* ── VIDEO LAYER ─────────────────────────────────────────────────── */}
      <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-0">
        <VideoBackground
          webmSrc="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554895/hero_b0imcd.webm"
          mp4Src="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554838/hero_gxnqcd.mp4"
          posterSrc="https://res.cloudinary.com/drzbbbncs/image/upload/v1777554903/hero-poster_emnfvb.jpg"
          onReady={handleVideoReady}
          onPlay={handleVideoPlay}
        />
      </div>

      {/* ── CINEMATIC GRADIENT OVERLAYS ──────────────────────────────────── */}
      {/* Left column fog — gives the left panel atmospheric depth */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{
          width: '34%',
          background: 'linear-gradient(to right, rgba(4,10,20,0.72) 0%, rgba(4,10,20,0.35) 65%, transparent 100%)',
        }}
      />
      {/* Right column fog — mirrors left */}
      <div className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{
          width: '32%',
          background: 'linear-gradient(to left, rgba(4,10,20,0.68) 0%, rgba(4,10,20,0.30) 65%, transparent 100%)',
        }}
      />
      {/* Bottom legibility fade */}
      <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{ height: 80, background: 'linear-gradient(to top, rgba(4,10,20,0.7) 0%, transparent 100%)' }}
      />
      {/* Top fade for logos */}
      <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(to bottom, rgba(4,10,20,0.55) 0%, transparent 100%)' }}
      />

      {/* ── TOP: LOGOS ───────────────────────────────────────────────────── */}
      {/* Sky City favicon — top left */}
      <div className="absolute z-30 pointer-events-none"
        style={{ top: 'clamp(22px,3vw,40px)', left: 'clamp(22px,4vw,56px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/skyfavicon.png" alt="Sky City" className="h-9 md:h-12 w-auto object-contain" />
      </div>
      {/* Yamuna Homes logo — top right */}
      <div className="absolute z-30 pointer-events-none"
        style={{ top: 'clamp(22px,3vw,40px)', right: 'clamp(22px,4vw,56px)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logos/yamuna_homes.png" alt="Yamuna Homes" className="h-12 md:h-16 w-auto object-contain" />
      </div>

      {/* ── MAIN SPLIT LAYOUT ────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-20 flex items-stretch justify-between pointer-events-none"
        style={{ padding: '0 clamp(24px, 5vw, 72px)' }}>

        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <div className="flex flex-col justify-between py-[clamp(90px,10vh,130px)] items-start"
          style={{ width: 'clamp(220px, 30vw, 400px)' }}>

          {/* — Top: Eyebrow tag — */}
          <div className={`hero-left-detail flex flex-col gap-3 ${phase >= 2 ? '' : 'opacity-0'}`}>
            <span style={{
              fontFamily: 'var(--font-tenor), Arial, sans-serif',
              fontSize: 'clamp(9px, 0.75vw, 11px)',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}>
              A New Landmark in South India
            </span>
            {/* Gold rule */}
            <div className="hero-hrule h-px w-10"
              style={{ background: 'linear-gradient(90deg, var(--gold), transparent)' }} />
          </div>

          {/* — Middle: "Yamuna" — */}
          <div className="flex flex-col items-start gap-6">
            {/* Vertical accent line left of title */}
            <div className="flex items-center gap-5">
              <div className="hero-left-vline w-px"
                style={{
                  height: 'clamp(50px, 6vw, 80px)',
                  background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
                  opacity: 0.7,
                }} />
              <h1 className="hero-left-title text-white text-left"
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  fontSize: 'clamp(52px, 8.5vw, 136px)',
                  fontWeight: 400,
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                  opacity: phase >= 1 ? 1 : 0,
                }}>
                Yamuna
              </h1>
            </div>

            {/* — CTA button — */}
            <div className={`hero-left-detail pointer-events-auto ${phase >= 2 ? '' : 'opacity-0'}`}>
              <button
                onClick={() => {
                  document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 28px',
                  border: '1px solid rgba(255,255,255,0.22)',
                  borderRadius: 9999,
                  background: 'rgba(4,10,20,0.35)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s, background 0.3s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232,160,32,0.6)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,160,32,0.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.22)';
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(4,10,20,0.35)';
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-tenor), Arial, sans-serif',
                  fontSize: 'clamp(9px, 0.75vw, 11px)',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.8)',
                }}>
                  Explore More
                </span>
                {/* Arrow */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ opacity: 0.6, flexShrink: 0 }}>
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* — Bottom: Left stat strip — */}
          <div className={`hero-left-detail flex flex-col gap-4 ${phase >= 2 ? '' : 'opacity-0'}`}>
            <div className="hero-hrule h-px w-8"
              style={{ background: 'rgba(232,160,32,0.5)' }} />
            <div className="flex flex-col gap-1">
              <span style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(24px, 2.5vw, 36px)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1,
              }}>
                296
              </span>
              <span style={{
                fontFamily: 'var(--font-tenor), Arial, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                Sea-Facing Units
              </span>
            </div>
          </div>

        </div>

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <div className="flex flex-col justify-between py-[clamp(90px,10vh,130px)] items-end"
          style={{ width: 'clamp(220px, 30vw, 400px)' }}>

          {/* — Top: Phase indicator — */}
          <div className={`hero-right-detail flex flex-col items-end gap-3 ${phase >= 2 ? '' : 'opacity-0'}`}>
            <div className="flex items-center gap-3">
              <span style={{
                fontFamily: 'var(--font-tenor), Arial, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(232,160,32,0.8)',
              }}>
                GF + 60 Floors
              </span>
              <div className="hero-hrule h-px w-6"
                style={{ background: 'var(--gold)', opacity: 0.6 }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-tenor), Arial, sans-serif',
              fontSize: '9px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
            }}>
              NH-66, Mangalore
            </span>
          </div>

          {/* — Middle: "Sky City" — */}
          <div className="flex flex-col items-end gap-6">
            <div className="flex items-center gap-5">
              <h1 className="hero-right-title text-white text-right"
                style={{
                  fontFamily: 'var(--font-cormorant), Georgia, serif',
                  fontSize: 'clamp(52px, 8.5vw, 136px)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  lineHeight: 0.92,
                  letterSpacing: '-0.01em',
                  opacity: phase >= 1 ? 1 : 0,
                }}>
                Sky City
              </h1>
              {/* Vertical accent line right of title */}
              <div className="hero-right-vline w-px"
                style={{
                  height: 'clamp(50px, 6vw, 80px)',
                  background: 'linear-gradient(to bottom, transparent, var(--gold), transparent)',
                  opacity: 0.7,
                }} />
            </div>

            {/* — Tagline — */}
            <div className={`hero-right-detail text-right ${phase >= 2 ? '' : 'opacity-0'}`}
              style={{ maxWidth: 260 }}>
              <p style={{
                fontFamily: 'var(--font-dm-sans), sans-serif',
                fontSize: 'clamp(12px, 1.1vw, 15px)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 300,
                letterSpacing: '0.02em',
              }}>
                South India's Tallest<br />Sea View Residential Tower
              </p>
            </div>
          </div>

          {/* — Bottom: Right stat strip — */}
          <div className={`hero-right-detail flex flex-col items-end gap-4 ${phase >= 2 ? '' : 'opacity-0'}`}>
            <div className="flex flex-col items-end gap-1">
              <span style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(24px, 2.5vw, 36px)',
                fontWeight: 300,
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1,
              }}>
                300m
              </span>
              <span style={{
                fontFamily: 'var(--font-tenor), Arial, sans-serif',
                fontSize: '9px',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                From the Arabian Sea
              </span>
            </div>
            <div className="hero-hrule h-px w-8"
              style={{ background: 'rgba(232,160,32,0.5)' }} />
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR: RERA + scroll indicator ─────────────────────────── */}
      <div className={`hero-bottom absolute bottom-0 inset-x-0 z-30 pointer-events-none
        flex items-end justify-between
        pb-[clamp(20px,3vh,36px)] px-[clamp(22px,5vw,72px)]
        ${phase >= 2 ? '' : 'opacity-0'}`}>

        {/* RERA */}
        <p style={{
          fontFamily: 'var(--font-tenor), Arial, sans-serif',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)',
        }}>
          RERA: PRM/KA/RERA/1257/334/PR/171023/006331
        </p>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-2">
          <div style={{
            width: 1, height: 36,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
            animation: 'heroScrollPulse 2.2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-tenor), Arial, sans-serif',
            fontSize: '8px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>
            Scroll
          </span>
        </div>

        {/* Right pad: keeps RERA centred against scroll cue */}
        <div style={{ width: 60 }} />
      </div>


      <style>{`
        @keyframes heroScrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 0.9; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
};
