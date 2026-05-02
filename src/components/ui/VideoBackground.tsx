'use client';
import React, { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
  className?: string;
  onReady?: () => void;
  onPlay?: () => void;
}

export const VideoBackground = ({
  webmSrc, mp4Src, posterSrc, className = '', onReady, onPlay,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const idleRef = useRef<number>(0);          // idleCallback handle
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Wait for preloader to complete before loading video
  useEffect(() => {
    const onComplete = () => setShouldLoad(true);
    // eslint-disable-next-line no-restricted-globals
    window.addEventListener('preloaderComplete', onComplete, { once: true });
    // eslint-disable-next-line no-restricted-globals
    return () => window.removeEventListener('preloaderComplete', onComplete);
  }, []);

  // Once preloader done — schedule video load via idle callback
  useEffect(() => {
    if (!shouldLoad) return;
    // eslint-disable-next-line no-restricted-globals
    if (window.innerWidth < 768) return; // no video on mobile — saves ~5MB

    const load = () => {
      const v = videoRef.current;
      if (!v) return;
      v.load();
      v.play().catch(() => {/* autoplay blocked — poster stays */ });
    };

    // eslint-disable-next-line no-restricted-globals
    if ('requestIdleCallback' in window) {
      // eslint-disable-next-line no-restricted-globals
      idleRef.current = window.requestIdleCallback(load, { timeout: 1500 });
    } else {
      timeoutRef.current = setTimeout(load, 800);
    }

    return () => {
      // eslint-disable-next-line no-restricted-globals
      if (idleRef.current) window.cancelIdleCallback?.(idleRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldLoad]);

  const handleLoadedData = () => {
    onReady?.();
    // Crossfade poster → video
    setTimeout(() => setFadeIn(true), 80);
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Poster — visible immediately, critical for LCP */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-[center_45%]"
        style={{
          opacity: fadeIn ? 0 : 1,
          transition: 'opacity 800ms ease-in-out',
          // Promote to its own layer immediately — reduces paint cost
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      />

      {/* Video — only rendered after idle + preloader */}
      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="none"        // do NOT preload metadata — the idle callback triggers load()
          disablePictureInPicture
          onLoadedData={handleLoadedData}
          onPlay={onPlay}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_45%]"
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity 800ms ease-in-out',
            willChange: 'opacity, transform',
            transform: 'translateZ(0)',
          }}
        >
          {/* WebM first — smaller, better quality */}
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}

      {/* Cinematic edge vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 38%, rgba(4,12,22,0.5) 100%)',
        }}
      />
      {/* Bottom legibility fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.65), transparent)' }}
      />
    </div>
  );
};