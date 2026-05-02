'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,          // slightly snappier — 0.08 can feel sluggish on fast scrolls
      smoothWheel: true,
      // @ts-expect-error - smoothTouch varies by Lenis version
      smoothTouch: false, // never smooth touch — causes jank on iOS
      wheelMultiplier: 0.95,
    });

    // Sync GSAP ScrollTrigger with Lenis position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for perfect frame alignment
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // NOTE: do NOT call gsap.ticker.lagSmoothing(0) — it disables GSAP's
    // built-in frame-drop protection. Default (500ms, 33ms) is correct.

    // Set default scroller for all ScrollTrigger instances
    // eslint-disable-next-line no-restricted-globals
    ScrollTrigger.defaults({ scroller: document.documentElement });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return <>{children}</>;
}