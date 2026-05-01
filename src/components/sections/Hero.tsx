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
  
  // Narrative State (Locked to Plan 6.3)
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [narrativePhase, setNarrativePhase] = useState(1); // 1: Branding, 2: Headline, 3: Details
  
  // Guard Refs
  const hasTriggered = useRef(false);
  const hasAnimatedPhase2 = useRef(false);
  const hasAnimatedPhase3 = useRef(false);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fallback Logic: Guarantee visibility on failure/mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setNarrativePhase(3);
      hasTriggered.current = true;
      return;
    }

    fallbackTimerRef.current = setTimeout(() => {
      if (!hasTriggered.current) {
        setNarrativePhase(3);
        hasTriggered.current = true;
      }
    }, 2000);

    return () => {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  // 2. Exact Content Timeline (0s -> 6s -> 9s)
  useEffect(() => {
    if (isReady && isPlaying && !hasTriggered.current) {
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

      // Phase 2 at 6000ms
      const t2 = setTimeout(() => {
        setNarrativePhase(2);
      }, 6000);

      // Phase 3 at 9000ms (3s after Phase 2)
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

  // 3. GSAP Scoped Transitions
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (narrativePhase === 2 && !hasAnimatedPhase2.current) {
        // Identity Reveal
        gsap.fromTo(leftContentRef.current, 
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
        gsap.fromTo(rightContentRef.current,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
        hasAnimatedPhase2.current = true;
      }

      if (narrativePhase === 3 && !hasAnimatedPhase3.current) {
        // Details & Action Reveal (Phase 3)
        const tag = document.querySelector('.phase-3-tag');
        const cta = document.querySelector('.phase-3-cta');
        const support = document.querySelector('.phase-3-support');

        const tl = gsap.timeline();

        // Tag + CTA: y: 20 -> 0
        tl.fromTo([tag, cta],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
          0
        );

        // Support: y: 10 -> 0
        tl.fromTo(support,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          0.15
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
      className="relative w-full h-[100vh] overflow-hidden font-serif antialiased"
      aria-label="Hero Section"
    >
      {/* TASK 1 & 2 — Video Layer (z-0) */}
      <div ref={videoWrapperRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <VideoBackground
          webmSrc="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554895/hero_b0imcd.webm"
          mp4Src="https://res.cloudinary.com/drzbbbncs/video/upload/v1777554838/hero_gxnqcd.mp4"
          posterSrc="https://res.cloudinary.com/drzbbbncs/image/upload/v1777554903/hero-poster_emnfvb.jpg"
          onReady={handleVideoReady}
          onPlay={handleVideoPlay}
        />
      </div>

      {/* TASK 4 — Brand Anchor (z-30) - Persistent Top Left */}
      <div 
        className="absolute z-30 pointer-events-none"
        style={{
          top: 'clamp(20px, 3vw, 40px)',
          left: 'clamp(20px, 4vw, 80px)'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/logos/skyfavicon.png" 
          alt="Sky City Logo" 
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Developer Logo (z-30) - Persistent Top Right */}
      <div 
        className="absolute z-30 pointer-events-none"
        style={{
          top: 'clamp(20px, 3vw, 40px)',
          right: 'clamp(20px, 4vw, 80px)'
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/logos/yamuna_homes.png" 
          alt="Yamuna Homes Logo" 
          className="h-14 md:h-20 w-auto object-contain opacity-100"
        />
      </div>

      {/* TASK 7 — Split Composition Container (z-20) */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-center md:justify-between px-[clamp(24px,6vw,80px)] w-full h-full pointer-events-none gap-8 md:gap-0">
          
          {/* TASK 8 & 12 — Left Block (Primary) */}
          <div 
            ref={leftContentRef} 
            className={`flex flex-col items-center md:items-end w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] text-center md:text-right transition-opacity duration-700 ${narrativePhase >= 2 ? 'opacity-100' : 'opacity-0'}`}
          >
             <h1 
               className="text-white leading-[0.95] tracking-tight font-semibold"
               style={{ fontSize: 'clamp(42px, 9vw, 140px)' }}
             >
               Yamuna
             </h1>

             {/* TASK 12 — CTA Button (Phase 3) - Space Reserved */}
             <div className={`phase-3-cta mt-[clamp(32px,10vw,80px)] transition-opacity duration-500 ${narrativePhase >= 3 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
               <button className="pointer-events-auto border border-white/30 hover:border-white/60 px-10 py-3.5 md:py-4 text-white/80 text-[12px] md:text-[14px] tracking-[0.2em] uppercase rounded-full transition-all backdrop-blur-sm shadow-2xl">
                 Explore More
               </button>
             </div>
          </div>

          {/* TASK 7 — Center Protection Zone (Implicit in md:justify-between) */}

          {/* TASK 9 & 11 — Right Block (Secondary) */}
          <div 
            ref={rightContentRef} 
            className={`flex flex-col items-center md:items-start w-full max-w-[320px] md:max-w-[420px] md:w-[min(420px,35vw)] text-center md:text-left transition-opacity duration-700 ${narrativePhase >= 2 ? 'opacity-100' : 'opacity-0'}`}
          >
             <h1 
               className="text-white leading-[0.95] tracking-tight font-normal italic"
               style={{ fontSize: 'clamp(42px, 9vw, 140px)' }}
             >
               Sky City
             </h1>

             {/* TASK 11 — Support Text (Phase 3) - Space Reserved */}
             <p className={`phase-3-support text-white/65 font-light tracking-wide text-sm md:text-base max-w-[280px] mt-10 leading-relaxed transition-opacity duration-500 ${narrativePhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
               South India’s Tallest Sea View Residential Tower
             </p>
          </div>
      </div>

      {/* TASK 10 — Micro Tag (Phase 3) - Detached */}
      <div 
        className={`phase-3-tag absolute z-20 pointer-events-none hidden md:block transition-opacity duration-500 ${narrativePhase >= 3 ? 'opacity-100' : 'opacity-0'}`}
        style={{
          top: '30%',
          left: 'clamp(24px, 6vw, 80px)'
        }}
      >
         <span className="text-white/60 font-light tracking-[0.18em] uppercase text-[12px] md:text-[14px]">
           A New Landmark in South India
         </span>
      </div>

      {/* RERA info anchor - Space Reserved */}
      <div className={`absolute bottom-10 left-6 md:left-12 lg:left-20 z-20 opacity-0 transition-opacity duration-500 ${narrativePhase >= 3 ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}>
        <p className="text-white text-[10px] tracking-widest uppercase font-light">
          RERA NO.  PRM/KA/RERA/1257/334/PR/171023/006331
        </p>
      </div>

    </section>
  );
};
