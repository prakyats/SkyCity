import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { reducedMotion } from '@/lib/motion';

/**
 * The hero's handoff. As the visitor scrolls, the film recedes: the frame
 * pushes in a few percent and the image loses light, so the surface that
 * slides over it feels like the story continuing rather than a new page.
 *
 * Transform and opacity only. No blur filter — it costs a full-screen
 * repaint every frame for an effect the dimming already implies.
 *
 * The range is the last viewport of the passage, wherever that passage
 * ends. Written as `top top` it would have stretched the whole exit
 * across the film's scrub once the hero was given room to be scrolled
 * through; `bottom bottom` is the same moment for a hero one viewport
 * tall, and the right one for a hero that is taller.
 */
export const initHeroAnimations = (
  trigger: React.RefObject<HTMLElement>,
  frameRef: React.RefObject<HTMLDivElement>,
  scrimRef?: React.RefObject<HTMLDivElement>,
) => {
  if (reducedMotion()) return null;
  const frame = frameRef.current;
  const el = trigger.current;
  if (!frame || !el) return null;

  gsap.registerPlugin(ScrollTrigger);
  // Push in from the top edge, so the opening frame is never cropped there.
  gsap.set(frame, { scale: 1, transformOrigin: '50% 0%' });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'bottom bottom',
      end: 'bottom top',
      scrub: 1.1,
      invalidateOnRefresh: true,
    },
  });

  // A single continuous push-in across the whole exit. One move, not four.
  tl.to(frame, { scale: 1.1, ease: 'none' }, 0);

  // The light goes out of the shot as the next surface arrives.
  if (scrimRef?.current) {
    tl.fromTo(scrimRef.current,
      { opacity: 0 },
      { opacity: 0.72, ease: 'none', immediateRender: false }, 0);
  }

  const t = setTimeout(() => ScrollTrigger.refresh(), 120);
  const kill = tl.kill.bind(tl);
  tl.kill = () => { clearTimeout(t); return kill(); };

  return tl;
};
