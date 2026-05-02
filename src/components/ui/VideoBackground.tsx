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
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded]   = useState(false);
  const [fadeVideo, setFadeVideo] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const onComplete = () => setIsActivated(true);
    window.addEventListener('preloaderComplete', onComplete);
    return () => window.removeEventListener('preloaderComplete', onComplete);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    let id: ReturnType<typeof setTimeout>;
    const load = () => setIsLoaded(true);
    if ('requestIdleCallback' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback(load);
      id = setTimeout(load, 1200);
    } else {
      id = setTimeout(load, 1200);
    }
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (isLoaded && isActivated && videoRef.current) {
      videoRef.current.play().catch(console.warn);
    }
  }, [isLoaded, isActivated]);

  const handleLoadedData = () => {
    onReady?.();
    setTimeout(() => setFadeVideo(true), 100);
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Poster — shows instantly, valid Tailwind duration */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_45%] transform-gpu will-change-transform"
        style={{
          opacity: fadeVideo ? 0 : 1,
          transition: 'opacity 700ms ease-in-out', // inline — no invalid Tailwind class
        }}
      />

      {/* Video — deferred, crossfades in */}
      {isLoaded && (
        <video
          ref={videoRef}
          muted playsInline loop preload="metadata"
          disablePictureInPicture
          onLoadedData={handleLoadedData}
          onPlay={() => onPlay?.()}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[center_45%] origin-center transform-gpu will-change-transform"
          style={{
            opacity: fadeVideo ? 1 : 0,
            transition: 'opacity 700ms ease-in-out',
          }}
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src}  type="video/mp4"  />
        </video>
      )}

      {/* Cinematic vignette — dark edges, not just bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 110% 100% at 50% 50%,
              transparent 40%,
              rgba(4,12,22,0.55) 100%
            )
          `,
        }}
      />
      {/* Bottom fade — text legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.7), transparent)' }}
      />
    </div>
  );
};