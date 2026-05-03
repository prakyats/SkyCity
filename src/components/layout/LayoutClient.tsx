'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const outerRef    = useRef<HTMLDivElement>(null);
  const dotRef      = useRef<HTMLDivElement>(null);
  const mousePos    = useRef({ x: -200, y: -200 });
  const cursorPos   = useRef({ x: -200, y: -200 });
  const rafRef      = useRef<number>(0);
  const hoverScale  = useRef(1);        // target scale — lerped separately
  const curScale    = useRef(1);        // current scale (smoothed)
  const isVisible   = useRef(true);
  const listenedEls = useRef(new WeakSet<Element>());

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    window.dispatchEvent(new CustomEvent('preloaderComplete'));
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 150);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onVisibility = () => { isVisible.current = !document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Inner dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };

    // ── Hover scale: set target, lerp applies it each frame ──────────────
    // By keeping scale inside the same transform string as translate,
    // there is no property conflict — no more cursor deflection.
    const onEnter = () => {
      hoverScale.current = 1.55;
      if (outerRef.current) {
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.8)';
      }
    };
    const onLeave = () => {
      hoverScale.current = 1;
      if (outerRef.current) {
        outerRef.current.style.borderColor = 'rgba(232,160,32,0.5)';
      }
    };

    const attachNew = () => {
      document.querySelectorAll<HTMLElement>(
        'a, button, [data-cursor], input, textarea, label'
      ).forEach(el => {
        if (!listenedEls.current.has(el)) {
          el.addEventListener('mouseenter', onEnter, { passive: true });
          el.addEventListener('mouseleave', onLeave, { passive: true });
          listenedEls.current.add(el);
        }
      });
    };
    attachNew();

    const observer = new MutationObserver(attachNew);
    observer.observe(document.body, { childList: true, subtree: true });

    // ── Single rAF loop: lerp position AND scale together ────────────────
    // Both are written into the same transform string every frame.
    // This is the fix — previously scale was set via style.scale (a separate
    // CSS property) while transform was set by the lerp, causing them to
    // conflict and produce a deflection jump on hover.
    const lerp = () => {
      if (isVisible.current && outerRef.current) {
        const lerpFactor = 0.1;
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * lerpFactor;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * lerpFactor;
        // Smooth the scale too so the expand/shrink feels fluid
        curScale.current += (hoverScale.current - curScale.current) * 0.12;

        outerRef.current.style.transform =
          `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) ` +
          `translate(-50%, -50%) ` +
          `scale(${curScale.current.toFixed(3)})`;
      }
      rafRef.current = requestAnimationFrame(lerp);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(lerp);

    const onError = (msg: string | Event, url?: string, line?: number, col?: number, error?: Error) => {
      console.error('Global Error:', { msg, url, line, col, error });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      console.error('Unhandled Rejection:', e.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [isLoading]);

  const base: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0,
    pointerEvents: 'none', zIndex: 9990,
    willChange: 'transform',
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}
      {!isLoading && <ScrollProgressBar />}

      {/* Outer ring — scale + position now live in ONE transform string */}
      {!isLoading && (
        <>
          <div ref={outerRef} style={{
            ...base,
            width: 34, height: 34,
            border: '1px solid rgba(232,160,32,0.5)',
            borderRadius: '50%',
            // Only transition border-color — transform is driven by rAF, no CSS transition needed
            transition: 'border-color 0.25s ease',
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