'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cld } from '@/lib/cloudinary';

const amenities = [
  {
    title: 'Podium Infinity Pool', cat: 'Serenity',
    image: cld("v1777700841/amenity_pool_ikcpqy.jpg", 800),
    desc: 'An architectural marvel where the pool edge meets the Arabian Sea on the horizon.',
    index: '01',
  },
  {
    title: 'Private Mini Theatre', cat: 'Entertainment',
    image: cld("v1777672872/Theater_s9f5ws.jpg", 800),
    desc: 'A bespoke cinematic experience with state-of-the-art acoustics and plush reclining seats.',
    index: '02',
  },
  {
    title: 'Grand Banquet Hall', cat: 'Events',
    image: cld("v1777672873/Banquet_ek3fc8.jpg", 800),
    desc: 'A majestic venue for grand celebrations, weddings, and elite corporate gatherings.',
    index: '03',
  },
  {
    title: 'Royal Wellness Spa', cat: 'Wellness',
    image: cld("v1777672872/Spa_lkqfyf.jpg", 800),
    desc: 'Deep rejuvenation through traditional and modern therapies in a tranquil, ocean-side setting.',
    index: '04',
  },
  {
    title: 'Yoga & Meditation Studio', cat: 'Energy',
    image: cld("v1777672710/Yoga_jxg4ne.jpg", 800),
    desc: 'A serene, light-filled space designed for mindfulness, breathwork, and spiritual balance.',
    index: '05',
  },
  {
    title: 'Arcade & Game Room', cat: 'Recreation',
    image: cld("v1777672705/Gameroom_u43si8.jpg", 800),
    desc: 'A vibrant social hub featuring high-end gaming consoles, billiards, and interactive entertainment.',
    index: '06',
  },
  {
    title: 'Elite Fitness Center', cat: 'Performance',
    image: cld("v1777672704/Gym_n6nqft.jpg", 800),
    desc: 'A world-class gym equipped with the latest strength and cardio technology for peak health.',
    index: '07',
  },
];

export const Amenities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── BIG BACKGROUND TEXT: parallax ──
      if (bgTextRef.current) {
        gsap.fromTo(bgTextRef.current,
          { xPercent: 5 },
          { xPercent: -5, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 }
          }
        );
      }

      // ── HEADER: split chars fly in from random angles ──
      gsap.fromTo('.amen-title-char',
        { opacity: 0, y: () => gsap.utils.random(-60, 60), x: () => gsap.utils.random(-40, 40), rotate: () => gsap.utils.random(-15, 15) },
        {
          opacity: 1, y: 0, x: 0, rotate: 0,
          duration: 0.8, stagger: 0.03, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true }
        }
      );

      // ── CARDS: pinwheel/fan entrance ──
      const cards = gsap.utils.toArray<HTMLElement>('.amen-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 120, rotate: i % 2 === 0 ? -3 : 3, scale: 0.85 },
          {
            opacity: 1, y: 0, rotate: 0, scale: 1,
            duration: 1.1, delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.amen-track-wrapper', start: 'top 85%', once: true }
          }
        );
      });

      // ── NEW PREMIUM INFINITE CAROUSEL LOGIC ──
      const track = scrollContainerRef.current;
      if (track) {
        // Calculate the total width of the original items
        const items = gsap.utils.toArray<HTMLElement>('.amen-card');
        const itemWidth = items[0].offsetWidth + 24; // width + gap
        const totalWidth = itemWidth * amenities.length;

        // Create the seamless loop animation
        const loop = gsap.to(track, {
          x: -totalWidth,
          duration: 35,
          ease: 'none',
          repeat: -1,
          paused: true,
          force3D: true, // GPU acceleration
        });

        // Slow down on hover (but slightly faster now), speed up on leave
        const slowDown = () => gsap.to(loop, { timeScale: 0.20, duration: 1, ease: 'power2.out' });
        const speedUp = () => gsap.to(loop, { timeScale: 1, duration: 1.5, ease: 'power2.inOut' });

        track.addEventListener('mouseenter', slowDown);
        track.addEventListener('mouseleave', speedUp);

        // ── MANUAL INTERACTION: React to horizontal wheel ──
        const onWheel = (e: WheelEvent) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            // Nudge the animation's time based on scroll delta (increased sensitivity)
            gsap.to(loop, { 
              time: loop.time() + (e.deltaX * 0.02), 
              duration: 0.5, 
              overwrite: 'auto', // Smart overwrite
              ease: 'power2.out',
              force3D: true
            });
          }
        };

        track.addEventListener('wheel', onWheel as EventListener, { passive: false });

        // Play only when section is in view
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => loop.play(),
          onLeave: () => loop.pause(),
          onEnterBack: () => loop.play(),
          onLeaveBack: () => loop.pause(),
        });
      }

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const titleChars = 'Unmatched'.split('');
  const titleChars2 = 'Amenities'.split('');

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden relative" id="amenities">

      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(232,160,32,0.04) 0%, transparent 70%)' }} />

      {/* Large watermark background text */}
      <div ref={bgTextRef} className="absolute bottom-0 left-0 overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0 }}>
        <span className="font-display text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', fontWeight: 700, opacity: 0.02, lineHeight: 1 }}>
          ELITE LIVING
        </span>
      </div>

      {/* Top separator gold */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.15), transparent)' }} />

      <div className="section-inner relative z-10">

        <div className="amen-header flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">Crafted for an Elite Lifestyle</span>
            <h2 className="section-heading text-white" style={{ fontSize: 'clamp(1.8rem,4vw,4rem)', lineHeight: 1 }}>
              <span>
                {titleChars.map((c, i) => (
                  <span key={i} className="amen-title-char inline-block"
                    style={{ whiteSpace: c === ' ' ? 'pre' : 'normal' }}>{c}</span>
                ))}
              </span>
              <em className="block font-display font-light italic text-white/60"
                style={{ fontSize: 'clamp(2.2rem,5vw,5rem)', lineHeight: 0.88 }}>
                {titleChars2.map((c, i) => (
                  <span key={i} className="amen-title-char inline-block">{c}</span>
                ))}
              </em>
            </h2>
          </div>
          <button className="btn-ghost-dark self-start md:self-auto">View All 10+ Amenities</button>
        </div>

        {/* Seamless Loop Track */}
        <div className="amen-track-wrapper relative -mx-[clamp(24px,6vw,80px)] overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 pb-12 w-max will-change-transform"
          >
            {/* Original + Cloned items for seamless loop */}
            {[...amenities, ...amenities].map((item, i) => (
              <div key={i}
                className="amen-card group relative w-[300px] md:w-[400px] aspect-[3/4] overflow-hidden cursor-pointer"
                style={{ borderRadius: 'var(--r-2xl)', willChange: 'transform' }}
                onMouseEnter={() => setActiveIdx(i % amenities.length)}
                onMouseLeave={() => setActiveIdx(-1)}>

                {/* Image with scale */}
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-110">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Multi-layer gradient */}
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(to top, rgba(4,12,22,0.95) 0%, rgba(4,12,22,0.2) 50%, transparent 100%)' }} />

                {/* Hover overlay tint */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: 'linear-gradient(135deg, rgba(232,160,32,0.04) 0%, transparent 60%)' }} />

                {/* Index number — large background */}
                <div className="absolute top-6 left-6 font-display text-white/10 group-hover:text-white/20 transition-colors duration-500 select-none pointer-events-none"
                  style={{ fontSize: '5rem', fontWeight: 300, lineHeight: 1 }}>
                  {item.index}
                </div>

                {/* Gold corner accent */}
                <div className="absolute top-6 right-6 pointer-events-none overflow-hidden"
                  style={{ width: 32, height: 32 }}>
                  <div style={{
                    width: 32, height: 32,
                    borderTop: '1px solid var(--gold)',
                    borderRight: '1px solid var(--gold)',
                    opacity: activeIdx === (i % amenities.length) ? 1 : 0,
                    transform: activeIdx === (i % amenities.length) ? 'scale(1)' : 'scale(0.5)',
                    transition: 'all 0.4s ease',
                  }} />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <span className="label text-[var(--gold)] mb-3 block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0"
                    style={{ fontSize: '0.58rem' }}>
                    {item.cat}
                  </span>
                  <h3 className="section-heading text-white mb-4 group-hover:translate-y-0 translate-y-1 transition-transform duration-500"
                    style={{ fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}>
                    {item.title}
                  </h3>
                  <div className="overflow-hidden h-0 group-hover:h-20 transition-all duration-500">
                    <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  {/* Read more line */}
                  <div className="h-px w-0 group-hover:w-full transition-all duration-700 delay-100 kinetic-border mt-2" />
                </div>

                {/* Border rim */}
                <div className="absolute inset-0 pointer-events-none border border-white/10 group-hover:border-[var(--gold)]/30 transition-colors duration-500"
                  style={{ borderRadius: 'var(--r-2xl)' }} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
