'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let logoReady = false;
    let minTimeDone = false;
    let exitStarted = false;

    // ── Two independent timelines, no shared state ────────────────────────
    const introTl = gsap.timeline({ paused: true });
    const progressTl = gsap.timeline();

    // ── INTRO: pure opacity + Y rise — NO blur animation ─────────────────
    // The logo starts with blur(8px) baked into its CSS style (below).
    // GSAP never animates blur during the entrance — only clears it.
    // This prevents the "snap to blur then unblur" flash.
    introTl
      // 1. Logo rises in — opacity + gentle upward drift, filter already clears in CSS
      .to(logoRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out',
      })
      // 2. Ambient glow pulses into existence behind logo
      .to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.9')
      // 3. Progress track fades in below logo
      .to(progressTrackRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.5');

    // ── PROGRESS BAR: cosmetic fill, purely visual ────────────────────────
    // Quick rush to 70%, then slow crawl to 92%. Never reaches 100% here —
    // the exit sequence takes it there.
    progressTl
      .fromTo(progressBarRef.current,
        { width: '0%' },
        { width: '70%', duration: 0.9, ease: 'power2.out' }
      )
      .to(progressBarRef.current,
        { width: '92%', duration: 2.5, ease: 'sine.inOut' }
      );

    // ── EXIT ──────────────────────────────────────────────────────────────
    const runExit = () => {
      if (exitStarted) return;
      exitStarted = true;

      progressTl.kill();

      const exitTl = gsap.timeline({
        onComplete: () => { if (onComplete) onComplete(); },
      });

      exitTl
        // Fill bar to 100%
        .to(progressBarRef.current, {
          width: '100%', duration: 0.4, ease: 'power3.out',
        })
        // Hold a beat — let the eye register completion
        .to({}, { duration: 0.35 })
        // Progress track fades away
        .to(progressTrackRef.current, {
          opacity: 0, y: 6, duration: 0.35, ease: 'power2.in',
        })
        // Logo: gentle scale-up + re-blur as it dissolves — the reverse of the entrance
        .to(logoRef.current, {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(8px)',
          duration: 0.7,
          ease: 'power2.in',
        }, '-=0.2')
        // Glow fades with logo
        .to(glowRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: 'power2.in',
        }, '-=0.6')
        // Whole screen fades to deep navy
        .to(containerRef.current, {
          opacity: 0, duration: 0.65, ease: 'power2.inOut',
        }, '-=0.35');
    };

    // ── Gate callbacks ────────────────────────────────────────────────────
    introTl.eventCallback('onComplete', () => {
      if (minTimeDone) runExit();
    });

    const minTimer = setTimeout(() => {
      minTimeDone = true;
      if (logoReady && introTl.progress() >= 1) runExit();
    }, 2000);

    const onLoad = () => {
      if (logoReady) return;
      logoReady = true;
      introTl.play();
    };

    const img = logoRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      onLoad();
    } else if (img) {
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onLoad);
    }

    return () => {
      clearTimeout(minTimer);
      if (img) {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
      }
      introTl.kill();
      progressTl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0,
        background: '#050d1a',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Deep background gradient ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #071428 0%, #050d1a 60%, #030810 100%)',
      }} />

      {/* ── Slow-rotating outer ring ──────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        width: '52vmax', height: '52vmax',
        borderRadius: '50%',
        border: '1px solid rgba(232,160,32,0.05)',
        pointerEvents: 'none',
        animation: 'plSpin 22s linear infinite',
      }} />

      {/* ── Counter-rotating middle ring ──────────────────────────────── */}
      <div style={{
        position: 'absolute',
        width: '38vmax', height: '38vmax',
        borderRadius: '50%',
        border: '1px solid rgba(232,160,32,0.04)',
        pointerEvents: 'none',
        animation: 'plSpinReverse 30s linear infinite',
      }} />

      {/* ── Static inner ring ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        width: '26vmax', height: '26vmax',
        borderRadius: '50%',
        border: '1px solid rgba(232,160,32,0.03)',
        pointerEvents: 'none',
      }} />

      {/* ── Four corner gold accents ──────────────────────────────────── */}
      {([
        { top: 28, left: 28, borderTop: '1px solid rgba(232,160,32,0.2)', borderLeft: '1px solid rgba(232,160,32,0.2)' },
        { top: 28, right: 28, borderTop: '1px solid rgba(232,160,32,0.2)', borderRight: '1px solid rgba(232,160,32,0.2)' },
        { bottom: 28, left: 28, borderBottom: '1px solid rgba(232,160,32,0.2)', borderLeft: '1px solid rgba(232,160,32,0.2)' },
        { bottom: 28, right: 28, borderBottom: '1px solid rgba(232,160,32,0.2)', borderRight: '1px solid rgba(232,160,32,0.2)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 32, height: 32, pointerEvents: 'none', ...s }} />
      ))}

      {/* ── Ambient glow bloom behind logo ────────────────────────────── */}
      {/* Starts invisible + small — introTl animates it into view */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          width: 'clamp(200px, 30vw, 420px)',
          height: 'clamp(200px, 30vw, 420px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,160,32,0.07) 0%, rgba(232,160,32,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0,
          scale: 0.7,
          willChange: 'opacity, transform',
        }}
      />

      {/* ── Centre content ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        position: 'relative', zIndex: 1,
        gap: 0,
      }}>

        {/* Logo
            KEY FIX: filter + opacity are set here in CSS as the starting state.
            GSAP only ever animates them *forward* (to clear/visible) —
            it never sets them as a fromTo start-value after paint,
            so there is zero frame where the element looks wrong. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="/logos/yamuna_homes.png"
          alt="Yamuna Homes"
          style={{
            width: 'clamp(160px, 14vw, 220px)',
            height: 'auto',
            display: 'block',
            /* ─ Starting state baked into CSS — GSAP animates away from this ─ */
            opacity: 0,
            transform: 'translateY(18px)',
            filter: 'blur(8px)',
            willChange: 'transform, opacity, filter',
          }}
        />

        {/* Progress track — starts hidden, introTl fades it in */}
        <div
          ref={progressTrackRef}
          style={{
            marginTop: 40,
            width: 'clamp(100px, 12vw, 160px)',
            height: '1px',
            background: 'rgba(232,160,32,0.1)',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
            opacity: 0,
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              height: '100%', width: '0%',
              background: 'linear-gradient(90deg, #7a4d0a, #c88018, #E8A020, #F5C842, #E8A020, #c88018)',
              backgroundSize: '300% 100%',
              borderRadius: 1,
              animation: 'plShimmer 2.4s linear infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes plSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes plSpinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes plShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
