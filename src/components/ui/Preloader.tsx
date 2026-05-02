'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cld } from '@/lib/cloudinary';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // All mutable state in refs — no React re-renders during animation
    let logoReady = false;
    let minTimeDone = false;
    let exitStarted = false;

    // ── Cosmetic progress bar — purely visual, GPU-composited via scaleX ─
    const progressTl = gsap.timeline();
    progressTl
      .fromTo(progressBarRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 0.72, duration: 0.85, ease: 'power2.out' }
      )
      .to(progressBarRef.current,
        { scaleX: 0.93, duration: 2.8, ease: 'sine.inOut' }
      );

    // ── Intro timeline — plays once when logo is painted ─────────────────
    const introTl = gsap.timeline({ paused: true });
    introTl
      .to(logoRef.current, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.1, ease: 'power2.out',
      })
      .to(glowRef.current, {
        opacity: 1, scale: 1,
        duration: 0.9, ease: 'power2.out',
      }, '-=0.85')
      .to(progressTrackRef.current, {
        opacity: 1,
        duration: 0.4, ease: 'power2.out',
      }, '-=0.5');

    // ── Exit — runs once both conditions met ──────────────────────────────
    const runExit = () => {
      if (exitStarted) return;
      exitStarted = true;
      progressTl.kill();

      gsap.timeline({
        onComplete: () => { if (onComplete) onComplete(); },
      })
        .to(progressBarRef.current,
          { scaleX: 1, duration: 0.35, ease: 'power3.out' })
        .to({}, { duration: 0.3 })
        .to(progressTrackRef.current,
          { opacity: 0, y: 5, duration: 0.3, ease: 'power2.in' })
        .to(logoRef.current,
          {
            opacity: 0, scale: 1.04, filter: 'blur(6px)',
            duration: 0.65, ease: 'power2.in'
          }, '-=0.15')
        .to(glowRef.current,
          { opacity: 0, scale: 0.85, duration: 0.45, ease: 'power2.in' }, '-=0.55')
        .to(containerRef.current,
          { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, '-=0.3');
    };

    // ── Gate: both conditions must pass ──────────────────────────────────
    introTl.eventCallback('onComplete', () => {
      if (minTimeDone) runExit();
      // else: minTimer will trigger runExit
    });

    const minTimer = setTimeout(() => {
      minTimeDone = true;
      // introTl done AND image loaded: exit immediately
      if (logoReady && introTl.progress() >= 1) runExit();
      // else: introTl's onComplete handles it
    }, 1800);

    // ── Image load gate ───────────────────────────────────────────────────
    const img = logoRef.current;
    const onLoad = () => {
      if (logoReady) return;
      logoReady = true;
      introTl.play();
    };

    // Already cached
    if (img?.complete && (img.naturalWidth ?? 0) > 0) {
      onLoad();
    } else {
      img?.addEventListener('load', onLoad);
      img?.addEventListener('error', onLoad); // fail-safe: always proceed
    }

    return () => {
      clearTimeout(minTimer);
      img?.removeEventListener('load', onLoad);
      img?.removeEventListener('error', onLoad);
      introTl.kill();
      progressTl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#050d1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #071428 0%, #050d1a 60%, #030810 100%)',
      }} />

      {/* Rotating rings — CSS animation, compositor-only */}
      <div style={{
        position: 'absolute', width: '52vmax', height: '52vmax',
        borderRadius: '50%', border: '1px solid rgba(232,160,32,0.05)',
        pointerEvents: 'none',
        animation: 'plSpin 22s linear infinite',
      }} />
      <div style={{
        position: 'absolute', width: '38vmax', height: '38vmax',
        borderRadius: '50%', border: '1px solid rgba(232,160,32,0.04)',
        pointerEvents: 'none',
        animation: 'plSpinRev 30s linear infinite',
      }} />
      <div style={{
        position: 'absolute', width: '26vmax', height: '26vmax',
        borderRadius: '50%', border: '1px solid rgba(232,160,32,0.03)',
        pointerEvents: 'none',
      }} />

      {/* Corner accents */}
      {([
        { top: 28, left: 28, borderTop: '1px solid rgba(232,160,32,0.2)', borderLeft: '1px solid rgba(232,160,32,0.2)' },
        { top: 28, right: 28, borderTop: '1px solid rgba(232,160,32,0.2)', borderRight: '1px solid rgba(232,160,32,0.2)' },
        { bottom: 28, left: 28, borderBottom: '1px solid rgba(232,160,32,0.2)', borderLeft: '1px solid rgba(232,160,32,0.2)' },
        { bottom: 28, right: 28, borderBottom: '1px solid rgba(232,160,32,0.2)', borderRight: '1px solid rgba(232,160,32,0.2)' },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: 32, height: 32, pointerEvents: 'none', ...s }} />
      ))}

      {/* Ambient glow bloom — starts invisible */}
      <div ref={glowRef} style={{
        position: 'absolute',
        width: 'clamp(200px,30vw,420px)', height: 'clamp(200px,30vw,420px)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,160,32,0.07) 0%, rgba(232,160,32,0.03) 40%, transparent 70%)',
        pointerEvents: 'none',
        opacity: 0, scale: '0.7',
        willChange: 'opacity, transform',
      }} />

      {/* Centre content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {/*
          Logo initial state is set in CSS style (not a GSAP from-value).
          This is the key fix: GSAP only animates *away from* this state
          via .to() — never sets it mid-frame, so there is zero snap.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src={cld('v1777696301/yamuna_homes_z4hnie.png', 400)}
          alt="Yamuna Homes"
          style={{
            width: 'clamp(160px,14vw,220px)', height: 'auto', display: 'block',
            // Initial state baked into CSS — never set by GSAP
            opacity: 0,
            transform: 'translateY(18px)',
            filter: 'blur(8px)',
            willChange: 'transform, opacity, filter',
          }}
        />

        {/* Progress track */}
        <div ref={progressTrackRef} style={{
          marginTop: 40, opacity: 0,
          width: 'clamp(100px,12vw,160px)', height: '1px',
          background: 'rgba(232,160,32,0.1)', borderRadius: 1, overflow: 'hidden', position: 'relative',
        }}>
          <div ref={progressBarRef} style={{
            position: 'absolute', top: 0, left: 0, height: '100%', width: '100%',
            background: 'linear-gradient(90deg, #7a4d0a, #c88018, #E8A020, #F5C842, #E8A020, #c88018)',
            backgroundSize: '300% 100%',
            borderRadius: 1,
            transformOrigin: 'left',
            willChange: 'transform',
            // Shimmer via background-position on a gradient is not composited.
            // Use a translateX pseudo-shimmer instead.
            animation: 'plShimmer 2s linear infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes plSpin    { to { transform: rotate(360deg);  } }
        @keyframes plSpinRev { to { transform: rotate(-360deg); } }
        @keyframes plShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};