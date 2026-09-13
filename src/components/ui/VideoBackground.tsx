'use client';
import React, { useEffect, useRef, useState } from 'react';
import { onPreloaderComplete, whenIdle } from '@/lib/browser';

interface VideoBackgroundProps {
  src: string;
  posterSrc: string;
  /**
   * Whether to fetch the film at all. The caller decides: it is several
   * megabytes, and on a screen that will not be driving it there is
   * nothing it adds that the poster does not already say.
   */
  enabled: boolean;
  className?: string;
  /** The film is loaded, buffered and ready to be seeked. */
  // A parameter name inside a function type reads as unused to the base
  // rule, which is why `browser.ts` disables it wholesale for the same.
  // eslint-disable-next-line no-unused-vars
  onReady?: (el: HTMLVideoElement) => void;
}

/**
 * The opening frame, and the film behind it.
 *
 * The poster is the LCP element and paints immediately; the film is
 * fetched only after the title sequence has finished and the browser is
 * idle, and only when the caller says it is wanted. Both are anchored to
 * the top edge so the opening frame is never cropped there.
 *
 * The film never plays itself. It is paused from the moment it arrives
 * and the scroll seeks it, so `autoplay` and `loop` would only fight
 * whoever is driving.
 */
export const VideoBackground = ({
  src, posterSrc, enabled, className = '', onReady,
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => onPreloaderComplete(() => setShouldLoad(true)), []);

  useEffect(() => {
    if (!shouldLoad || !enabled) return;
    return whenIdle(() => videoRef.current?.load());
  }, [shouldLoad, enabled]);

  // `canplaythrough`, not `loadeddata`: a seek into a range that has not
  // arrived yet stalls, and the whole film is about to be seeked.
  const handleReady = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setFadeIn(true);
    onReady?.(v);
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
      {shouldLoad && enabled && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          onCanPlayThrough={handleReady}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: 'opacity var(--motion-slow) var(--ease-glide)',
            willChange: 'opacity',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
};
