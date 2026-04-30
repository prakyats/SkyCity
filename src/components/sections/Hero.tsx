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
  const [narrativePhase, setNarrativePhase] = useState(1); // 1: Branding, 2: Identity, 3: Action
  
  // Guard Refs
  const hasTriggered = useRef(false);
  const hasAnimatedPhase2 = useRef(false);
  const hasAnimatedPhase3 = useRef(false);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fallback Logic: Guarantee text visibility even if video fails
  useEffect(() => {
    // Immediate reveal on mobile
    if (window.innerWidth < 768) {
      setNarrativePhase(3);
      hasTriggered.current = true;
      return;
    }

    // Start 2s fallback timer on mount
    fallbackTimerRef.current = setTimeout(() => {
      if (!hasTriggered.current) {
        setNarrativePhase(3);
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

      // Phase 2 at 6s mark
      const t2 = setTimeout(() => {
        setNarrativePhase(2);
      }, 6000);

      // Phase 3 at 9s mark
      const t3 = setTimeout(() => {
        setNarrativePhase(3);
        hasTriggered.current = true;
      }, 9000);

      return () => {
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isReady, isPlaying]);

  // 3. GSAP Narrative Entrance (Phase-Aware)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (narrativePhase === 2 && !hasAnimatedPhase2.current) {
        // Identity Reveal (Phase 2)
        gsap.fromTo(leftContentRef.current, 
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
        );
        gsap.fromTo(rightContentRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
        );
        hasAnimatedPhase2.current = true;
      }

      if (narrativePhase === 3 && !hasAnimatedPhase3.current) {
        // Details & Action Reveal (Phase 3)
        // Note: Micro-tag and CTA refs will be added in UI refactor
        const details = document.querySelectorAll('.phase-3-content');
        gsap.fromTo(details,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, stagger: 0.2, ease: 'power2.out' }
        );
        hasAnimatedPhase3.current = true;
      }
    });

    return () => ctx.revert();
  }, [narrativePhase]);

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
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A2F]/55 via-[#0A1A2F]/35 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_60%,rgba(0,0,0,0.25)_100%)]" />
      </div>

      {/* 3. Branding Layer (z-30) - Phase 1+ */}
      <div className="absolute top-0 inset-x-0 z-30 p-[clamp(16px,3vw,40px)] flex justify-between items-start pointer-events-none">
        <div className="text-white font-serif tracking-[0.2em] text-xs md:text-lg opacity-75">YAMUNA SKY CITY</div>
      </div>

      {/* 4. Content Layer (z-20) */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-[6vw] w-full h-full pointer-events-none gap-8 md:gap-0">
          
          {/* Phase 2: Main Headings Reveal */}
          {narrativePhase >= 2 && (
            <>
              {/* Left Block: Identity Part 1 */}
              <div ref={leftContentRef} className="flex flex-col items-center md:items-end w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] md:ml-[clamp(24px,6vw,80px)] text-center md:text-right">
                 {/* Phase 3: Micro Tag */}
                 {narrativePhase >= 3 && (
                   <span className="phase-3-content text-white/60 font-light tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4">
                     A New Landmark in South India
                   </span>
                 )}
                 
                 <h1 className="text-white text-4xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.1] tracking-tight">
                   Yamuna
                 </h1>

                 {/* Phase 3: CTA */}
                 {narrativePhase >= 3 && (
                   <div className="phase-3-content mt-12">
                     <button className="pointer-events-auto border border-white/20 hover:border-white/60 px-10 py-3 text-white/80 text-[10px] tracking-[0.2em] uppercase transition-all backdrop-blur-sm">
                       Explore More
                     </button>
                   </div>
                 )}
              </div>

              {/* Center Protection Zone (Implicit in md:justify-between) */}

              {/* Right Block: Identity Part 2 */}
              <div ref={rightContentRef} className="flex flex-col items-center md:items-start w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] md:mr-[clamp(24px,6vw,80px)] text-center md:text-left">
                 <h1 className="text-white text-4xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.1] italic tracking-tight">
                   Sky City
                 </h1>

                 {/* Phase 3: Support Text */}
                 {narrativePhase >= 3 && (
                   <p className="phase-3-content text-white/50 font-light tracking-wide text-sm md:text-base max-w-[280px] mt-8 leading-relaxed">
                     South India’s Tallest Sea View Residential Tower
                   </p>
                 )}
              </div>
            </>
          )}
      </div>

      {/* RERA info anchor - Phase 3+ */}
      {narrativePhase >= 3 && (
        <div className="phase-3-content absolute bottom-6 left-6 md:left-12 lg:left-20 z-20 opacity-30">
          <p className="text-white text-[10px] tracking-widest uppercase font-light">
            RERA NO. UPRERAPRJ123456
          </p>
        </div>
      )}

    </section>
  );
};
