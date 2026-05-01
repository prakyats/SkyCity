'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Track state in refs only — no useState, no re-renders, no race conditions
  const logoReady = useRef(false);
  const minTimeDone = useRef(false);
  const masterTl = useRef<gsap.core.Timeline | null>(null);
  const exitScheduled = useRef(false);

  // Called once both conditions are met — always runs logo anim fully before exit
  const scheduleExit = () => {
    if (exitScheduled.current) return;
    exitScheduled.current = true;

    const tl = masterTl.current;
    if (!tl) return;

    // If logo anim hasn't finished yet, wait for it then append exit
    // We always append — never interrupt. GSAP queues it after whatever is running.
    tl.to(progressBarRef.current, { width: '100%', duration: 0.3, ease: 'power4.out' })
      .to(logoRef.current, { scale: 1.05, filter: 'blur(4px)', opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.1')
      .to(wrapperRef.current, { opacity: 0, scale: 1.05, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
      .to(containerRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.4')
      .call(() => { if (onComplete) onComplete(); });

    // CRITICAL: Resume playing if the timeline had already finished its intro phases
    tl.play();
  };

  useEffect(() => {
    const img = logoRef.current;

    // ── Build the single master timeline ──────────────────────────────────
    const tl = gsap.timeline({ paused: true });
    masterTl.current = tl;

    // Phase 1 — logo rises in (faster entrance, less distance)
    tl.fromTo(logoRef.current,
      { opacity: 0, y: 15, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
    );

    // Phase 2 — subtext fades in
    tl.fromTo(subtextRef.current,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.3'
    );

    // Phase 2.5 — Subtle breathing animation while waiting
    tl.to(logoRef.current, {
      scale: 1.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Phase 3 — hold (3s minimum is ensured by the timer below)
    // The progress bar fills on its own independent tween (not in the master tl)
    // so it always starts at mount and is purely cosmetic.

    // ── Drifting Progress Bar: Fast to 70%, then slow drift ──────────
    const progressTl = gsap.timeline();
    progressTl.to(progressBarRef.current, { width: '70%', duration: 0.8, ease: 'power2.out' })
      .to(progressBarRef.current, { width: '95%', duration: 15, ease: 'none' }); // Drift fallback

    // ── 1.5-second minimum timer ────────────────────────────────────────────
    const minTimer = setTimeout(() => {
      minTimeDone.current = true;
      if (logoReady.current) scheduleExit();
    }, 1500);

    // ── Start Intro Animation Immediately ────────────────────────────────
    tl.play();

    // ── Logo load gate: only for the final exit trigger ───────────────────
    const onLoad = () => {
      if (logoReady.current) return; // guard double-fire
      logoReady.current = true;

      // Re-check after the intro plays (~0.6s total)
      setTimeout(() => {
        if (minTimeDone.current) scheduleExit();
      }, 650);
    };

    // Already cached? Fire immediately.
    if (img && img.complete && img.naturalWidth > 0) {
      onLoad();
    } else if (img) {
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onLoad); // fail gracefully
    }

    return () => {
      clearTimeout(minTimer);
      if (img) {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
      }
      tl.kill();
      gsap.killTweensOf(progressBarRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, #040c16 0%, #07111f 60%, #0a1a2f 100%)',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 35% at 50% 50%, rgba(232,160,32,0.07) 0%, transparent 70%)',
      }} />

      {/* Decorative rings */}
      <div style={{ position: 'absolute', width: '45vmax', height: '45vmax', borderRadius: '50%', border: '1px solid rgba(232,160,32,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '30vmax', height: '30vmax', borderRadius: '50%', border: '1px solid rgba(232,160,32,0.04)', pointerEvents: 'none' }} />

      <div
        ref={wrapperRef}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', position: 'relative', zIndex: 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/logos/yamuna_homes.png"
          alt="Yamuna Homes Logo"
          style={{
            width: 'clamp(140px, 12vw, 200px)',
            height: 'auto',
            display: 'block',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />



        {/* Progress bar — purely cosmetic, always 3s */}
        <div style={{
          width: 'clamp(100px, 12vw, 160px)', height: '1px',
          background: 'rgba(232,160,32,0.15)', borderRadius: 2, overflow: 'hidden', marginTop: '4px',
        }}>
          <div
            ref={progressBarRef}
            style={{
              height: '100%', width: '0%',
              background: 'linear-gradient(90deg, #B07818, #E8A020, #F5C842)',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};