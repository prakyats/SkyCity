'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const floorPlanData = [
  {
    type: "2 BHK",
    floors: "3rd to 32nd Floor",
    size: "1,500 – 1,650",
    desc: "Thoughtfully designed for families who value panoramic sea views. All units sea-facing with private balconies and premium coastal finishes."
  },
  {
    type: "3 BHK",
    floors: "5th to 45th Floor",
    size: "1,850 – 2,100",
    desc: "Spacious family homes with split-level living areas, home office nook, and uninterrupted Arabian Sea views from every room."
  },
  {
    type: "4 BHK",
    floors: "20th to 55th Floor",
    size: "2,400 – 2,850",
    desc: "Grand residences for those who demand more. Double-height living rooms, chef's kitchen, and sky-terrace balconies."
  },
  {
    type: "5 BHK",
    floors: "45th to 60th Floor",
    size: "3,400 – 4,200",
    desc: "Ultra-luxury penthouses. Private plunge pools, panoramic wraparound decks, and bespoke interior finishes — by invitation only."
  }
];

export const FloorPlans = () => {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation on tab change
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    if (imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  return (
    <section className="relative w-full py-32 bg-white" id="floorplans">
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        <div className="mb-16">
          <span className="text-[12px] tracking-[0.2em] uppercase text-black/40 mb-4 block">
            Residency Options
          </span>
          <h2 className="text-[clamp(32px,4vw,52px)] font-serif font-medium text-[#0a0a0a]">
            Floor Plans
          </h2>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-4 md:gap-8 border-b border-black/[0.08] mb-16 overflow-x-auto no-scrollbar">
          {floorPlanData.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`pb-6 text-[14px] tracking-[0.15em] uppercase font-medium transition-all duration-300 relative whitespace-nowrap ${
                activeTab === i ? 'text-black' : 'text-black/30 hover:text-black/60'
              }`}
            >
              {item.type}
              {activeTab === i && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-16 md:gap-24 items-center">
          
          {/* Blueprint Visual */}
          <div 
            ref={imageRef}
            className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-[#FAFAF8] border border-black/[0.05] p-8 md:p-16 flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/blueprint.png" 
              alt="Floor Plan Blueprint" 
              className="w-full h-full object-contain opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
          </div>

          {/* Details Content */}
          <div ref={contentRef} className="flex flex-col">
            <span className="text-[12px] tracking-wider uppercase text-black/40 mb-2">
              {floorPlanData[activeTab].floors}
            </span>
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="text-[clamp(42px,5vw,64px)] font-serif font-light text-[#0a0a0a] leading-none">
                {floorPlanData[activeTab].size}
              </h3>
              <span className="text-[20px] font-serif text-black/40">sqft</span>
            </div>
            <p className="text-[16px] leading-[1.8] text-black/60 mb-10 max-w-[420px]">
              {floorPlanData[activeTab].desc}
            </p>
            
            <button className="w-full md:w-fit px-12 py-5 bg-[#0a0a0a] text-white rounded-full text-[12px] tracking-[0.2em] uppercase hover:bg-black/80 transition-all duration-300 shadow-xl shadow-black/5">
              Download Brochure
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
