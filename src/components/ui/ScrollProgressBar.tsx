'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollProgressBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    const anim = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3, // Very fast, responsive scrub
      },
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === document.documentElement) t.kill();
      });
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none origin-left"
      style={{ background: 'rgba(232,160,32,0.1)' }}
    >
      <div
        ref={barRef}
        className="w-full h-full origin-left scale-x-0"
        style={{
          background: 'linear-gradient(90deg, #B07818, #E8A020, #F5C842)',
          boxShadow: '0 0 10px rgba(232,160,32,0.4)',
        }}
      />
    </div>
  );
};
