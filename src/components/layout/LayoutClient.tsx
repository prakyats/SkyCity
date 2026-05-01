'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    // Give the DOM a moment to settle after reveal, then refresh all ScrollTriggers
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 100);
  }, []);

  // Prevent scroll when loading
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
  }, [isLoading]);

  // Magnetic cursor follower
  useEffect(() => {
    if (isLoading) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.1;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.1;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      {!isLoading && <ScrollProgressBar />}

      {/* Custom cursor - outer ring */}
      {!isLoading && (
        <>
          <div
            ref={cursorRef}
            style={{
              position: 'fixed',
              width: 36,
              height: 36,
              border: '1px solid rgba(232,160,32,0.5)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9990,
              transform: 'translate(-50%, -50%)',
              transition: 'border-color 0.3s, width 0.3s, height 0.3s',
              mixBlendMode: 'difference',
            }}
          />
          <div
            ref={cursorDotRef}
            style={{
              position: 'fixed',
              width: 4,
              height: 4,
              background: 'rgba(232,160,32,0.9)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9991,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </>
      )}

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </>
  );
}
