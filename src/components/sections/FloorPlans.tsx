'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const plans = [
  {
    type: '2 BHK', floors: '3rd – 32nd Floor', size: '1,500 – 1,650',
    desc: 'Thoughtfully designed for families seeking panoramic sea views. All units sea-facing with private balconies and premium coastal finishes.',
    // PLACEHOLDER: replace image path with actual 2BHK floor plan
    image: '/images/blueprint.png',
  },
  {
    type: '3 BHK', floors: '5th – 45th Floor', size: '1,850 – 2,100',
    desc: 'Spacious family homes with split-level living, home office nook, and uninterrupted Arabian Sea views from every room.',
    // PLACEHOLDER: replace image path with actual 3BHK floor plan
    image: '/images/blueprint.png',
  },
  {
    type: '4 BHK', floors: '20th – 55th Floor', size: '2,400 – 2,850',
    desc: 'Grand residences for those who demand more. Double-height living rooms, chef\'s kitchen, and sky-terrace balconies.',
    // PLACEHOLDER: replace image path with actual 4BHK floor plan
    image: '/images/blueprint.png',
  },
  {
    type: '5 BHK', floors: '45th – 60th Floor', size: '3,400 – 4,200',
    desc: 'Ultra-luxury penthouses with private plunge pools, panoramic wraparound decks, and bespoke interior finishes.',
    // PLACEHOLDER: replace image path with actual 5BHK floor plan
    image: '/images/blueprint.png',
  },
];

export const FloorPlans = () => {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) gsap.fromTo(contentRef.current,
      { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' });
    if (imageRef.current) gsap.fromTo(imageRef.current,
      { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' });
  }, [active]);

  return (
    <section className="bg-section-cream section-pad" id="floorplans">
      <div className="section-inner">

        <div className="mb-16">
          <span className="gold-rule" />
          <span className="label text-[var(--gold)] mb-5 block">Residency Options</span>
          <h2 className="section-heading text-[var(--near-black)]"
            style={{ fontSize: 'clamp(1.8rem,4vw,4rem)' }}>
            Floor Plans
          </h2>
        </div>

        {/* Tab selector */}
        <div className="flex gap-0 border-b mb-16 overflow-x-auto no-scrollbar"
          style={{ borderColor: 'var(--sand)' }}>
          {plans.map((p, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="relative pb-5 px-8 font-label text-sm transition-colors duration-300 whitespace-nowrap"
              style={{
                fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: active === i ? 'var(--near-black)' : 'var(--text-subtle)',
              }}>
              {p.type}
              {active === i && (
                <span className="absolute bottom-0 left-0 w-full h-[2px]"
                  style={{ background: 'var(--gold)' }} />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-24 items-center">

          {/* Floor plan image — PLACEHOLDER */}
          <div ref={imageRef}
            className="relative aspect-[4/3] bg-white flex items-center justify-center p-10 md:p-16"
            style={{ borderRadius: 'var(--r-2xl)', border: '1px solid var(--sand)' }}>
            <img src={plans[active].image} alt={`${plans[active].type} Floor Plan`}
              className="w-full h-full object-contain opacity-80" />
            {/* Placeholder label — remove when real image is added */}
            <div className="absolute bottom-6 left-6">
              <span className="label text-[var(--text-subtle)]" style={{ fontSize: '0.52rem' }}>
                {/* PLACEHOLDER — replace image with actual floor plan */}
                Floor Plan · {plans[active].type}
              </span>
            </div>
            <div className="absolute top-6 right-6 w-8 h-8"
              style={{ borderTop: '1px solid var(--gold)', borderRight: '1px solid var(--gold)', opacity: 0.5 }} />
          </div>

          {/* Details */}
          <div ref={contentRef} className="flex flex-col">
            <span className="label text-[var(--text-subtle)] mb-3 block" style={{ fontSize: '0.6rem' }}>
              {plans[active].floors}
            </span>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-[var(--near-black)]"
                style={{ fontSize: 'clamp(2.8rem,5vw,5rem)', fontWeight: 300, lineHeight: 1 }}>
                {plans[active].size}
              </span>
              <span className="font-body text-[var(--text-subtle)]" style={{ fontSize: '1rem' }}>
                sq.ft
              </span>
            </div>
            <p className="font-body text-[var(--text-muted)] leading-[1.85] mb-12"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '38ch' }}>
              {plans[active].desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-gold">Download Brochure</button>
              <button className="btn-ghost-light">Schedule Site Visit</button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};