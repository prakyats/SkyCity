'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion, scrollRoot } from '@/lib/browser';

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
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}
