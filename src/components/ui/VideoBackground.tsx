'use client';
import React, { useEffect, useRef, useState } from 'react';
import { onPreloaderComplete, whenIdle, viewportWidth } from '@/lib/browser';

interface VideoBackgroundProps {
  webmSrc: string;
  mp4Src: string;
  posterSrc: string;
  className?: string;
  onReady?: () => void;
  onPlay?: () => void;
}

/**
 * The poster is the LCP element and paints immediately; the film is fetched
 * only after the preloader has finished and the browser is idle, and never
 * on a narrow screen where it would cost far more than it adds. Both are
 * anchored to the top edge so the opening frame is never cropped there.
 */
export const VideoBackground = ({
  webmSrc, mp4Src, posterSrc, className = '', onReady, onPlay,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => onPreloaderComplete(() => setShouldLoad(true)), []);

  useEffect(() => {
    if (!shouldLoad) return;
    if (viewportWidth() < 768) return;
    return whenIdle(() => {
      const v = videoRef.current;
      if (!v) return;
      v.load();
      v.play().catch(() => {});
    });
  }, [shouldLoad]);

  const handleLoadedData = () => {
    onReady?.();
    setTimeout(() => setFadeIn(true), 80);
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{
          opacity: fadeIn ? 0 : 1,
          transition: 'opacity var(--motion-slow) var(--ease-glide)',
          willChange: 'opacity',
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
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity var(--motion-slow) var(--ease-glide)',
            willChange: 'opacity',
          }}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
