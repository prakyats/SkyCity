'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { VideoBackground } from '@/components/ui/VideoBackground';
import { initHeroAnimations } from '@/lib/animations/heroAnimation';

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  
  // Narrative State
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  
  // Guard Refs
  const hasTriggered = useRef(false);
  const hasAnimated = useRef(false);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fallback Logic: Guarantee text visibility even if video fails
  useEffect(() => {
    // Immediate reveal on mobile
    if (window.innerWidth < 768) {
      setShowText(true);
      hasTriggered.current = true;
      return;
    }

    // Start 2s fallback timer on mount
    fallbackTimerRef.current = setTimeout(() => {
      if (!hasTriggered.current) {
        setShowText(true);
        hasTriggered.current = true;
        console.log('Hero: Fallback triggered');
      }
    }, 2000);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // 2. Narrative Timing: Wait for isReady AND isPlaying
  useEffect(() => {
    if (isReady && isPlaying && !hasTriggered.current) {
      // Clear fallback timer as video is success
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

      // Start the 6-second cinematic delay
      const narrativeTimer = setTimeout(() => {
        setShowText(true);
        hasTriggered.current = true;
      }, 6000);

      return () => clearTimeout(narrativeTimer);
    }
  }, [isReady, isPlaying]);

  // 3. GSAP Narrative Entrance
  useEffect(() => {
    if (showText && !hasAnimated.current) {
      const ctx = gsap.context(() => {
        // Left Entrance
        gsap.fromTo(leftContentRef.current, 
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );

        // Right Entrance
        gsap.fromTo(rightContentRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );
      });

      hasAnimated.current = true;
      return () => ctx.revert();
    }
  }, [showText]);

  // 4. Global Motion (Camera Zoom)
  useEffect(() => {
    const animation = initHeroAnimations(null, null, videoWrapperRef);
    return () => {
      if (animation) animation.kill();
    };
  }, []);

  const handleVideoReady = () => setIsReady(true);
  const handleVideoPlay = () => setIsPlaying(true);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
      aria-label="Hero Section"
    >
      {/* 1. Video Layer (z-0) */}
      <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <VideoBackground
          webmSrc="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554895/hero_b0imcd.webm"
          mp4Src="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554838/hero_gxnqcd.mp4"
          posterSrc="https://res.cloudinary.com/drzbbbncs/image/upload/v1777554903/hero-poster_emnfvb.jpg"
          onReady={handleVideoReady}
          onPlay={handleVideoPlay}
        />
      </div>

      {/* 2. Cinematic Overlay (z-10) */}
      {/* Directional Falloff + Subtle Vignette to Lock Focus on Building */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Layer 1: Directional Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A2F]/55 via-[#0A1A2F]/35 to-transparent mix-blend-multiply" />
        {/* Layer 2: Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_60%,rgba(0,0,0,0.25)_100%)]" />
      </div>

      {/* 3. Branding Layer (z-30) */}
      <div className="absolute top-0 inset-x-0 z-30 p-[clamp(16px,3vw,40px)] flex justify-between items-start pointer-events-none">
        <div className="text-white font-serif tracking-[0.2em] text-sm md:text-lg opacity-80">YAMUNA SKY CITY</div>
        <div className="flex flex-col items-end gap-2 opacity-60">
           <div className="w-8 h-[1px] bg-white" />
           <div className="w-5 h-[1px] bg-white" />
        </div>
      </div>

      {/* 4. Content Layer (z-20) */}
      {showText && (
        <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-[6vw] w-full h-full pointer-events-none gap-8 md:gap-0">
          
          {/* Left Block: Right-aligned Editorial Framing */}
          <div ref={leftContentRef} className="flex flex-col items-center md:items-end w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] md:ml-[clamp(24px,6vw,80px)] text-center md:text-right">
             <h1 className="text-white text-4xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.1] tracking-tight">
               Sky City
             </h1>
             <div className="hidden md:flex flex-col items-end gap-4 mt-8">
                <span className="text-[#D4AF37]/90 font-medium tracking-[0.3em] uppercase text-[10px]">
                  A New Legacy
                </span>
                <button className="pointer-events-auto border border-white/20 hover:border-white/60 px-6 py-2 text-white/80 text-[10px] tracking-[0.2em] uppercase transition-all backdrop-blur-sm">
                  Discover
                </button>
             </div>
          </div>

          {/* Center Protection Zone (Implicit in md:justify-between) */}

          {/* Right Block: Left-aligned Editorial Framing */}
          <div ref={rightContentRef} className="flex flex-col items-center md:items-start w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] md:mr-[clamp(24px,6vw,80px)] text-center md:text-left">
             <h1 className="text-white text-4xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.1] italic tracking-tight">
               Sea View
             </h1>
             <p className="hidden md:block text-white/50 font-light tracking-wide text-sm md:text-base max-w-[300px] mt-8 leading-relaxed">
               Where architectural brilliance meets the infinite horizon.
             </p>
             <button className="md:hidden mt-8 pointer-events-auto bg-[#D4AF37] px-10 py-3 text-white text-[10px] tracking-[0.2em] uppercase font-bold shadow-xl">
               Explore
             </button>
          </div>
        </div>
      )}

      {/* RERA info anchor */}
      <div className="absolute bottom-6 left-6 md:left-12 lg:left-20 z-20 opacity-30">
        <p className="text-white text-[10px] tracking-widest uppercase font-light">
          RERA NO. UPRERAPRJ123456
        </p>
      </div>

    </section>
  );
};
