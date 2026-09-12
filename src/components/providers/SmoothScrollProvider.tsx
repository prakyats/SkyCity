'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, scrollRoot, setScrollJump } from '@/lib/browser';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll is an enhancement, not the transport. Lenis only damps the
 * wheel; touch keeps the platform's own inertia, anchors and keyboard paging
 * still work, and anyone who asked for reduced motion gets native scrolling.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    ScrollTrigger.defaults({ scroller: scrollRoot() });

    if (reducedMotion()) return;

    const lenis = new Lenis({
      // Light damping. Heavier values read as lag, not smoothness.
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      // Don't swallow modifier-key and page-key scrolling.
      allowNestedScroll: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Restoring a position has to go through Lenis rather than the
    // window: scrolling the window out from under it leaves its own
    // position stale, and the next wheel event snaps straight back.
    setScrollJump((y) => lenis.scrollTo(y, { immediate: true, force: true }));
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      setScrollJump(null);
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}
