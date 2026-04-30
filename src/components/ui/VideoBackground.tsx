'use client';

import React, { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  desktopSrc: string;
  mobileSrc: string;
  posterSrc: string;
  className?: string;
}

export const VideoBackground = ({
  desktopSrc,
  mobileSrc,
  posterSrc,
  className = '',
}: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback to ensure video plays on some aggressive mobile browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn('Autoplay failed, likely due to browser policies:', error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        loop
        preload="auto"
        poster={posterSrc}
        className="w-full h-full object-cover object-[center_45%] origin-center transform-gpu will-change-transform"
        aria-hidden="true"
      >
        {/* Mobile Video Source */}
        <source src={mobileSrc} type="video/mp4" media="(max-width: 768px)" />
        {/* Desktop Video Source */}
        <source src={desktopSrc} type="video/mp4" media="(min-width: 769px)" />
        
        {/* Fallback for browsers that don't support media queries in source tags */}
        <source src={desktopSrc} type="video/mp4" />
        
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
