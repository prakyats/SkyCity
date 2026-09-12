'use client';
import { useState, useEffect, useCallback } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { FloorRail } from '@/components/ui/FloorRail';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { lockScroll, emitPreloaderComplete, onUncaught } from '@/lib/browser';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    emitPreloaderComplete();
    // The preloader changed the page height; let ScrollTrigger re-measure.
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 150);
  }, []);

  useEffect(() => { lockScroll(isLoading); }, [isLoading]);

  useEffect(() => onUncaught(
    // eslint-disable-next-line no-console
    (e) => console.error('Uncaught error:', e.message, e.error),
    // eslint-disable-next-line no-console
    (e) => console.error('Unhandled rejection:', e.reason),
  ), []);

  return (
    <>
      {isLoading && <Preloader onComplete={handleComplete} />}

      {/* Skip link first in the DOM, so it is the first thing Tab reaches */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 t-ui"
        style={{ background: 'var(--brand)', color: '#fff' }}
      >
        Skip to main content
      </a>

      {!isLoading && <Header />}
      {!isLoading && <FloorRail />}
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
