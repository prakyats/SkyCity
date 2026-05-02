'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const cursorPos = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);
  const isVisible = useRef(true);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    // Dispatch global signal for other components to start
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
    
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 120);
  }, []);

  // Lock scroll during preloader
  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
  }, [isLoading]);

  // Magnetic cursor
  useEffect(() => {
    if (isLoading) return;

    // Pause RAF when tab is hidden — saves CPU
    const onVisibility = () => { isVisible.current = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    // Expand cursor on hover over interactive elements
    const onEnter = () => {
      isHovering.current = true;
      if (outerRef.current) {
        outerRef.current.style.width = '56px';
        outerRef.current.style.height = '56px';
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.8)';
        outerRef.current.style.background = 'rgba(232,160,32,0.05)';
      }
    };
    const onLeave = () => {
      isHovering.current = false;
      if (outerRef.current) {
        outerRef.current.style.width = '36px';
        outerRef.current.style.height = '36px';
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.5)';
        outerRef.current.style.background = 'transparent';
      }
    };

    const interactiveSelector = 'a, button, [data-cursor], input, textarea, label';
    const attachHovers = () => {
      document.querySelectorAll<HTMLElement>(interactiveSelector).forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attachHovers();

    // Re-attach on DOM mutations (dynamic content)
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      if (isVisible.current) {
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.1;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.1;
        if (outerRef.current) {
          outerRef.current.style.left = `${cursorPos.current.x}px`;
          outerRef.current.style.top = `${cursorPos.current.y}px`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [isLoading]);

  const cursorBase: React.CSSProperties = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 9990,
    transform: 'translate(-50%, -50%)',
    willChange: 'left, top',
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      {!isLoading && <ScrollProgressBar />}

      {/* Outer ring — lagging follower */}
      {!isLoading && (
        <div
          ref={outerRef}
          style={{
            ...cursorBase,
            width: 36, height: 36,
            border: '1px solid rgba(232,160,32,0.5)',
            borderRadius: '50%',
            background: 'transparent',
            transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease',
            mixBlendMode: 'difference',
          }}
        />
      )}

      {/* Inner dot — instant */}
      {!isLoading && (
        <div
          ref={dotRef}
          style={{
            ...cursorBase,
            width: 4, height: 4,
            background: 'rgba(232,160,32,0.9)',
            borderRadius: '50%',
            zIndex: 9991,
          }}
        />
      )}

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
        {children}
      </div>
    </>
  );
}