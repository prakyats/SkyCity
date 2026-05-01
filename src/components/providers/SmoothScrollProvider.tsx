'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      easing: (t) => 1 - Math.pow(1 - t, 4), // power4.out
      smoothWheel: true,
      // @ts-expect-error - Some versions of Lenis use smoothTouch, others touchMultiplier
      smoothTouch: false,
      wheelMultiplier: 0.9,
    });

    // GSAP SYNC (CRITICAL)
    // Synchronize ScrollTrigger with Lenis updates
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP's ticker to drive Lenis for perfect synchronization
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // Handle initial scroll trigger setup
    ScrollTrigger.defaults({
      scroller: document.documentElement
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return <>{children}</>;
}
