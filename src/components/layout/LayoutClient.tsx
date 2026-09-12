'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Preloader } from '@/components/ui/Preloader';
import { FloorRail } from '@/components/ui/FloorRail';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import {
  lockScroll, emitPreloaderComplete, onUncaught,
  takeScrollRestoration, rememberedScroll, jumpScrollTo, trackScrollPosition,
  pauseOffscreenAnimations,
} from '@/lib/browser';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  /** Where the reader was before this load, read before anything moves. */
  const restoreTo = useRef(0);
  const stopTracking = useRef<(() => void) | null>(null);

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    emitPreloaderComplete();
    // The preloader changed the page height; let ScrollTrigger re-measure.
    // Only once it has can a saved offset mean anything, because the
    // pinned passages are what make the page the length it is.
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
        if (restoreTo.current > 0) jumpScrollTo(restoreTo.current);
        // Only now start recording, so the locked position during the
        // title sequence does not overwrite the place we are restoring.
        stopTracking.current = trackScrollPosition();
      });
    }, 150);
  }, []);

  useEffect(() => {
    takeScrollRestoration();
    restoreTo.current = rememberedScroll();
    const stopParking = pauseOffscreenAnimations();
    return () => {
      stopParking();
      stopTracking.current?.();
    };
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
