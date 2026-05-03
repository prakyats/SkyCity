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
  const videoRef    = useRef<HTMLVideoElement>(null);
  const idleRef     = useRef<number>(0);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>>();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fadeIn,     setFadeIn]     = useState(false);

  useEffect(() => {
    const onComplete = () => setShouldLoad(true);
    window.addEventListener('preloaderComplete', onComplete, { once: true });
    return () => window.removeEventListener('preloaderComplete', onComplete);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    if (window.innerWidth < 768) return;

    const load = () => {
      const v = videoRef.current;
      if (!v) return;
      v.load();
      v.play().catch(() => {});
    };

    if ('requestIdleCallback' in window) {
      idleRef.current = window.requestIdleCallback(load, { timeout: 1500 });
    } else {
      timeoutRef.current = setTimeout(load, 800);
    }

    return () => {
      if (idleRef.current) window.cancelIdleCallback?.(idleRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldLoad]);

  const handleLoadedData = () => {
    onReady?.();
    setTimeout(() => setFadeIn(true), 80);
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Poster — LCP element. width+height set to avoid unsized-image warning.
          Actual display size is controlled by object-cover + absolute positioning. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover object-[center_45%]"
        style={{
          opacity: fadeIn ? 0 : 1,
          transition: 'opacity 800ms ease-in-out',
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
      />

      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="none"
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
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src}  type="video/mp4"  />
        </video>
      )}

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 38%, rgba(4,12,22,0.5) 100%)' }} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.65), transparent)' }} />
    </div>
  );
};
