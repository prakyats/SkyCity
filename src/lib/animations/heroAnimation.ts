import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const initHeroAnimations = (
  overlayRef: React.RefObject<HTMLDivElement>,
  contentRef: React.RefObject<HTMLDivElement>,
  videoRef: React.RefObject<HTMLDivElement>
) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: Just show everything instantly
  if (prefersReducedMotion) {
    gsap.set(overlayRef.current, { opacity: 1 });
    if (contentRef.current) {
      gsap.set(contentRef.current.children, { y: 0, opacity: 1 });
    }
    return;
  }

  // Create timeline for initial load
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  // Initial States
  gsap.set(overlayRef.current, { opacity: 0 });
  
  if (contentRef.current) {
    // Initial state: shift children down, scale slightly down
    gsap.set(contentRef.current.children, { y: 40, scale: 0.98, opacity: 0 });
  }

  // Initial state for video: base optical scale
  if (videoRef.current) {
    gsap.set(videoRef.current, { scale: 1.05, y: 0 });
  }

  // Animation Sequence
  // 1. Fade in gradient overlay early
  tl.to(overlayRef.current, {
    opacity: 1,
    duration: 1.0,
  });

  // 2. Stagger text elements: wait 0.8s to let building register first
  tl.to(contentRef.current ? contentRef.current.children : [], {
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 1.4,
    stagger: 0.12,
  }, '+=0.8');

  // 3. Scroll Behavior: Optical camera push with 4 phases
  if (videoRef.current) {
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: videoRef.current.parentElement, // trigger on the section
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2, // motion damping
      }
    });

    // Phase 1 (0 -> 25%): Slow ease initial push
    scrollTl.to(videoRef.current, { scale: 1.12, y: -15, ease: 'power2.out', duration: 25 }, 0);

    // Phase 2 (25 -> 55%): Continue push, text inward parallax
    scrollTl.to(videoRef.current, { scale: 1.18, y: -40, ease: 'none', duration: 30 }, 25);
    if (contentRef.current) {
      scrollTl.to(contentRef.current, { x: 20, ease: 'none', duration: 30 }, 25);
    }

    // Phase 3 (55 -> 75%): Micro-motion hold
    scrollTl.to(videoRef.current, { scale: 1.20, ease: 'none', duration: 20 }, 55);

    // Phase 4 (75 -> 100%): Fade out text, blur video
    if (contentRef.current) {
      scrollTl.to(contentRef.current, { opacity: 0, ease: 'none', duration: 25 }, 75);
    }
    scrollTl.to(videoRef.current, { filter: 'blur(2px)', ease: 'none', duration: 25 }, 75);
  }

  return tl;
};
