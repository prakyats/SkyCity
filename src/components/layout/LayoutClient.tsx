'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -200, y: -200 });
  const cursorPos = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const isHovering = useRef(false);
  const isVisible = useRef(true);
  // Track which elements already have listeners — avoids re-attaching on every mutation
  const listenedEls = useRef(new WeakSet<Element>());

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    // eslint-disable-next-line no-restricted-globals
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
    // Single ScrollTrigger refresh after layout settles
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 150);
  }, []);

  // Lock scroll during preloader
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    document.body.style.overflow = isLoading ? 'hidden' : '';
  }, [isLoading]);

  // Custom cursor — desktop only, after preloader
  useEffect(() => {
    // eslint-disable-next-line no-restricted-globals
    if (isLoading || typeof window === 'undefined') return;
    // Skip on touch devices entirely
    // eslint-disable-next-line no-restricted-globals
    if (window.matchMedia('(hover: none)').matches) return;

    // eslint-disable-next-line no-restricted-globals
    const onVisibility = () => { isVisible.current = !document.hidden; };
    // eslint-disable-next-line no-restricted-globals
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Inner dot is instant — no lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };

    const onEnter = () => {
      isHovering.current = true;
      if (outerRef.current) {
        outerRef.current.style.scale = '1.55';
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.8)';
      }
    };
    const onLeave = () => {
      isHovering.current = false;
      if (outerRef.current) {
        outerRef.current.style.scale = '1';
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.5)';
      }
    };

    // Attach hover listeners only to NEW elements not yet tracked
    const attachNew = () => {
      // eslint-disable-next-line no-restricted-globals
      document.querySelectorAll<HTMLElement>('a, button, [data-cursor], input, textarea, label').forEach(el => {
        if (!listenedEls.current.has(el)) {
          el.addEventListener('mouseenter', onEnter, { passive: true });
          el.addEventListener('mouseleave', onLeave, { passive: true });
          listenedEls.current.add(el);
        }
      });
    };
    attachNew();

    // Observe only childList changes (not attribute/subtree text mutations)
    const observer = new MutationObserver(attachNew);
    // eslint-disable-next-line no-restricted-globals
    observer.observe(document.body, { childList: true, subtree: true });

    // Lerp the outer ring — paused when tab hidden
    const lerp = () => {
      if (isVisible.current && outerRef.current) {
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.1;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.1;
        outerRef.current.style.transform = `translate(${cursorPos.current.x}px,${cursorPos.current.y}px) translate(-50%,-50%)`;
      }
      rafRef.current = requestAnimationFrame(lerp);
    };

    // eslint-disable-next-line no-restricted-globals
    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(lerp);

    // eslint-disable-next-line no-restricted-globals
    const onError = (msg: string | Event, url?: string, line?: number, col?: number, error?: Error) => {
      // eslint-disable-next-line no-console
      console.error('Global Error:', { msg, url, line, col, error });
    };
    // eslint-disable-next-line no-restricted-globals
    const onRejection = (e: PromiseRejectionEvent) => {
      // eslint-disable-next-line no-console
      console.error('Unhandled Rejection:', e.reason);
    };

    // eslint-disable-next-line no-restricted-globals
    window.addEventListener('error', onError);
    // eslint-disable-next-line no-restricted-globals
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      // eslint-disable-next-line no-restricted-globals
      window.removeEventListener('mousemove', onMove);
      // eslint-disable-next-line no-restricted-globals
      document.removeEventListener('visibilitychange', onVisibility);
      // eslint-disable-next-line no-restricted-globals
      window.removeEventListener('error', onError);
      // eslint-disable-next-line no-restricted-globals
      window.removeEventListener('unhandledrejection', onRejection);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [isLoading]);

  const base: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0,
    pointerEvents: 'none', zIndex: 9990, willChange: 'transform',
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      {!isLoading && <ScrollProgressBar />}

      {/* Cursor — only rendered on non-touch desktop */}
      {!isLoading && (
        <>
          <div ref={outerRef} style={{
            ...base,
            width: 34, height: 34,
            border: '1px solid rgba(232,160,32,0.5)',
            borderRadius: '50%',
            transition: 'scale 0.25s ease, border-color 0.25s ease',
          }} />
          <div ref={dotRef} style={{
            ...base,
            width: 4, height: 4,
            background: 'rgba(232,160,32,0.9)',
            borderRadius: '50%',
            zIndex: 9991,
          }} />
        </>
      )}

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    </>
  );
}