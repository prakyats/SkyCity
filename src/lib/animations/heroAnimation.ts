import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const initHeroAnimations = (
  overlayRef: React.RefObject<HTMLDivElement> | null,
  contentRef: React.RefObject<HTMLDivElement> | null,
  videoRef: React.RefObject<HTMLDivElement>
) => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return null;

  // 1. Initial State for Video: Optical focal lock
  if (videoRef.current) {
    gsap.set(videoRef.current, { scale: 1.05, y: 0 });
  }

  // 2. Scroll-Driven Camera Push-In
  if (videoRef.current) {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2, // Smooth motion damping
      }
    });

    // Four-phase cinematic zoom
    // Phase 1: Slow ease initial push
    scrollTl.to(videoRef.current, { scale: 1.12, y: -15, ease: 'power2.out', duration: 25 }, 0);

    // Phase 2: Sustained push
    scrollTl.to(videoRef.current, { scale: 1.18, y: -40, ease: 'none', duration: 30 }, 25);

    // Phase 3: Micro-motion hold (keeping the scene alive)
    scrollTl.to(videoRef.current, { scale: 1.20, ease: 'none', duration: 20 }, 55);

    // Phase 4: Narrative fade-out/blur
    scrollTl.to(videoRef.current, { 
      filter: 'blur(4px)', 
      opacity: 0.5,
      ease: 'none', 
      duration: 25 
    }, 75);

    return scrollTl;
  }

  return null;
};
