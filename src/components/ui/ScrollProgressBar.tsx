'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const ScrollProgressBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Register inside effect — safe for SSR/Next.js
    gsap.registerPlugin(ScrollTrigger);
    if (!barRef.current) return;

    // eslint-disable-next-line no-restricted-globals
    const trigger = document.documentElement;
    const anim = gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === trigger) t.kill();
      });
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[2px] z-[9999] pointer-events-none origin-left"
      style={{ background: 'rgba(232,160,32,0.08)' }}
    >
      <div
        ref={barRef}
        className="w-full h-full origin-left scale-x-0"
        style={{
          background: 'linear-gradient(90deg, #B07818, #E8A020, #F5C842)',
          boxShadow: '0 0 8px rgba(232,160,32,0.5)',
        }}
      />
    </div>
  );
};