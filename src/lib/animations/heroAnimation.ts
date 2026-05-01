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
    // Using fromTo with immediateRender: false to prevent the "refresh blur" bug
    scrollTl.fromTo(videoRef.current, 
      { filter: 'blur(0px)', opacity: 1 },
      { 
        filter: 'blur(10px)', 
        opacity: 0.35,
        ease: 'none', 
        duration: 20,
        immediateRender: false // CRITICAL: Prevents style application before scroll threshold
      }, 
      80
    );

    // CRITICAL: Refresh ScrollTrigger after a short delay to account for 
    // browser scroll restoration and preloader layout shifts
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return scrollTl;
  }

  return null;
};
