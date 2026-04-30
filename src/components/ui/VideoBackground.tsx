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
  webmSrc,
  mp4Src,
  posterSrc,
  className = '',
  onReady,
  onPlay,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeVideo, setFadeVideo] = useState(false);

  useEffect(() => {
    // Mobile Strategy: Block video load entirely below 768px to save bandwidth
    if (window.innerWidth < 768) return;

    let timeoutId: NodeJS.Timeout;
    const loadVideo = () => setIsLoaded(true);

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadVideo);
      // Fallback if the main thread is slammed and never idles
      timeoutId = setTimeout(loadVideo, 1200);
    } else {
      timeoutId = setTimeout(loadVideo, 1200);
    }

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // If video becomes loaded and starts playing, we ensure play happens
    if (isLoaded && videoRef.current) {
      videoRef.current.play().catch(console.warn);
    }
  }, [isLoaded]);

  const handleLoadedData = () => {
    onReady?.();
    // 100ms micro-delay for perceived smoothness before fading
    setTimeout(() => {
      setFadeVideo(true);
    }, 100);
  };

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0A1A2F] ${className}`}>
      {/* 1. Poster Image (Loads instantly, blocks layout shift) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover object-[center_45%] transform-gpu will-change-transform transition-opacity duration-600 ease-in-out ${fadeVideo ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />

      {/* 2. Video Component (Deferred load, crossfades in) */}
      {isLoaded && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="metadata"
          disablePictureInPicture
          onLoadedData={handleLoadedData}
          onPlay={() => onPlay?.()}
          className={`absolute inset-0 w-full h-full object-cover object-[center_45%] origin-center transform-gpu will-change-transform transition-opacity duration-600 ease-in-out ${fadeVideo ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        >
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
