'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const WaveToArchitecture = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile Safety: Disable animation on small screens
    if (window.innerWidth < 768) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        }
      });

      // STAGE 1 (0 -> 0.2): Pure waves zoom
      tl.fromTo(".wave-base", 
        { scale: 1 },
        { scale: 1.05, ease: "none", duration: 0.2 }
      );

      // STAGE 2 (0.2 -> 0.4): Introduce architectural intent (opacity)
      tl.to(".wave-outline", {
        opacity: 1,
        duration: 0.2
      }, 0.2);

      // STAGE 3 (0.4 -> 0.6): Key illusion moment — waves become structure (clip-path reveal)
      tl.to(".wave-outline", {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.3,
        ease: "power2.out"
      }, 0.4);

      // STAGE 4 (0.6 -> 0.8): Reveal balcony plan
      tl.to(".balcony-plan", {
        opacity: 1,
        scale: 1.03,
        duration: 0.3
      }, 0.6);

      // STAGE 5 (0.8 -> 1): Transition out (move upward)
      tl.to([".wave-base", ".wave-outline", ".balcony-plan"], {
        yPercent: -20,
        opacity: 0.95,
        duration: 0.2
      }, 0.8);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-[300vh] bg-[#0A1A2F]"
      id="architecture-transformation"
    >
      <div 
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Layer 1 — Base Waves */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/frames/wave-start.png" 
          alt="Coastal Waves"
          className="layer wave-base" 
        />

        {/* Layer 2 — Outline Transition */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/frames/wave-outline.png" 
          alt="Architectural Outline"
          className="layer wave-outline"
          style={{ opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
        />

        {/* Layer 3 — Balcony Plan */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/frames/balcony-plan.png" 
          alt="Balcony Floor Plan"
          className="layer balcony-plan" 
          style={{ opacity: 0, transform: 'scale(0.98)' }}
        />

        {/* Mobile Fallback Label - hidden on desktop */}
        <div className="md:hidden absolute inset-0 flex items-center justify-center p-10 text-center">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
              src="/frames/balcony-plan.png" 
              alt="Balcony Floor Plan"
              className="w-full h-auto object-contain opacity-80"
           />
        </div>
      </div>

      <style jsx>{`
        .layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform, opacity, clip-path;
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};
