'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // @ts-expect-error smoothTouch not in all type defs
      smoothTouch: false,   // never smooth touch — causes iOS jank
      wheelMultiplier: 0.95,
    });

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for frame-perfect sync
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // NOTE: intentionally NOT calling gsap.ticker.lagSmoothing(0).
    // Default lag smoothing (500ms threshold, 33ms cap) protects against
    // janky frame-drop recovery. Disabling it hurts performance on slow CPUs.

    ScrollTrigger.defaults({ scroller: document.documentElement });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}
