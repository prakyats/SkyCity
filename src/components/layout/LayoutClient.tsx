'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Preloader } from '@/components/ui/Preloader';
import { FloorRail } from '@/components/ui/FloorRail';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { lockScroll, emitPreloaderComplete, onUncaught } from '@/lib/browser';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // The preloader and the floor rail are built around the homepage scroll:
  // the rail counts storeys against the Hero, and the preloader hands off to
  // it. On any other route they are decoration over content that does not have
  // storeys, so they are scoped to the homepage. Behaviour at "/" is unchanged.
  const pathname = usePathname();
  const isHome = pathname === '/';
  const showPreloader = isHome && isLoading;

  const handleComplete = useCallback(() => {
    setIsLoading(false);
    emitPreloaderComplete();
    // The preloader changed the page height; let ScrollTrigger re-measure.
    setTimeout(() => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 150);
  }, []);

  useEffect(() => { lockScroll(showPreloader); }, [showPreloader]);

  useEffect(() => onUncaught(
    // eslint-disable-next-line no-console
    (e) => console.error('Uncaught error:', e.message, e.error),
    // eslint-disable-next-line no-console
    (e) => console.error('Unhandled rejection:', e.reason),
  ), []);

  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}

      {/* Skip link first in the DOM, so it is the first thing Tab reaches */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 t-ui"
        style={{ background: 'var(--brand)', color: '#fff' }}
      >
        Skip to main content
      </a>

      {!showPreloader && <Header />}
      {isHome && !isLoading && <FloorRail />}
      <ErrorBoundary>{children}</ErrorBoundary>
    </>
  );
}
