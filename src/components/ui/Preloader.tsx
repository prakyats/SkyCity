'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { reducedMotion } from '@/lib/browser';
import { project } from '@/content/project';
import { Logo } from '@/components/ui/Logo';

/**
 * The title sequence.
 *
 * A lift ride told as one shot: the floor counter runs G to 60, a hairline
 * fills the shaft beside it, the project's name rises into the bottom of
 * the frame, and then the whole panel is drawn upward off the screen to
 * leave you at altitude, looking at the film. The exit is the establishing
 * cut, which is why the panel leaves upward instead of fading.
 */
export const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const shaftRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete });

    if (reducedMotion()) {
      if (numRef.current) numRef.current.textContent = String(project.floors);
      tl.to(rootRef.current, { yPercent: -100, duration: 0.01 });
      return () => { tl.kill(); };
    }

    tl
      .fromTo(nameRef.current, { yPercent: 108 }, { yPercent: 0, duration: 1.1, ease: 'expo.out' }, 0)
      .fromTo(metaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.45)
      .to(counter, {
        v: project.floors,
        duration: 1.9,
        ease: 'power3.inOut',
        onUpdate: () => {
          const f = Math.round(counter.v);
          if (numRef.current) numRef.current.textContent = f === 0 ? 'G' : String(f);
        },
      }, 0.2)
      .fromTo(shaftRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1.9, ease: 'power3.inOut' }, 0.2)
      .to({}, { duration: 0.3 })
      // The cut: the panel is pulled up and away, revealing the film.
      .to(rootRef.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' });

    return () => { tl.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-end overflow-hidden"
      style={{ background: 'var(--bone)', color: 'var(--ink)', willChange: 'transform' }}
    >
      {/* The shaft */}
      <div className="absolute left-0 rail:left-[38px] top-0 bottom-0"
        style={{ width: 1, background: 'rgba(10,12,14,0.12)' }}>
        <div ref={shaftRef} className="absolute inset-0 origin-bottom"
          style={{ background: 'var(--ember)', transform: 'scaleY(0)' }} />
      </div>

      <div className="wrap w-full pb-[clamp(28px,5vh,64px)]">
        <div className="flex items-end justify-between gap-8">
          <div className="overflow-hidden">
            {/* The identity rises into frame, rather than the name set
                as display type. It is the first thing anyone sees. */}
            <div ref={nameRef} style={{ willChange: 'transform' }}>
              <Logo
                type="lockup"
                variant="primary"
                cssHeight="clamp(56px, 11vw, 150px)"
                label={project.name}
                priority
              />
            </div>
          </div>

          <div ref={metaRef} className="hidden sm:block text-right" style={{ opacity: 0 }}>
            <div className="t-num" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              <span ref={numRef}>G</span>
            </div>
            <div className="t-ui-sm muted mt-1">of {project.floors}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
