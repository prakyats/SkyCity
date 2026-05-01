'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let ctx: gsap.Context;
    
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });

        // Phase 1: Logo Rise Reveal
        tl.fromTo(logoRef.current,
          { 
            opacity: 0, 
            y: 20, 
            scale: 0.95,
            clipPath: 'inset(100% 0 0 0)' 
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.2 
          }
        );

        // Phase 2: Subtext Entry
        tl.fromTo(subtextRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );

        // Phase 3: Hold
        tl.to({}, { duration: 0.4 });

        // Phase 4: Exit
        tl.to(wrapperRef.current, {
          opacity: 0,
          scale: 1.02,
          duration: 0.6,
          ease: "power3.inOut"
        });

      }, containerRef);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0A1A2F',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={wrapperRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px'
        }}
      >
        <div style={{ overflow: 'hidden', display: 'inline-block' }}>
          <img 
            ref={logoRef}
            src="/logos/yamuna_homes.png"
            alt="Yamuna Homes Logo"
            style={{
              width: 'clamp(140px, 12vw, 200px)',
              height: 'auto',
              display: 'block',
              opacity: 0,
              transform: 'translateY(20px) scale(0.95)',
              clipPath: 'inset(100% 0 0 0)',
              willChange: 'transform, opacity'
            }}
          />
        </div>
        
        <p 
          ref={subtextRef}
          style={{
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#EAEAEA',
            margin: 0,
            fontWeight: 400,
            fontFamily: 'var(--font-tenor), sans-serif',
            opacity: 0,
            transform: 'translateY(10px)'
          }}
        >
          HOMES AND DESIGN PRIVATE LIMITED
        </p>
      </div>
    </div>
  );
};