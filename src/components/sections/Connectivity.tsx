'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const landmarks = [
  { name: "Ryan Intl School", dist: "0.5 km", angle: -135 },
  { name: "NITK Campus", dist: "4 km", angle: -45 },
  { name: "Surathkal Railway", dist: "4 km", angle: 180 },
  { name: "Panambur Beach", dist: "5 km", angle: 0 },
  { name: "MRPL", dist: "6 km", angle: 135 },
  { name: "Mangalore Airport", dist: "12 km", angle: 45 },
];

export const Connectivity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
          once: true,
        }
      });

      // 1. Center Pulse & Fade
      tl.fromTo(centerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)' }
      );

      // 2. Draw Lines & Reveal Nodes
      linesRef.current.forEach((line, i) => {
        if (!line) return;
        const node = nodesRef.current[i];
        
        tl.fromTo(line,
          { strokeDasharray: 1000, strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.6'
        );

        if (node) {
          tl.fromTo(node,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.4'
          );
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-center py-24 bg-[#050505] overflow-hidden"
      id="connectivity"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-radial-gradient from-[#0A1A2F]/20 to-transparent opacity-40 pointer-events-none" />

      <div className="relative z-10 text-center mb-20 px-6">
        <span className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-4 block">
          Gracefully Connected
        </span>
        <h2 className="text-[clamp(32px,4vw,56px)] font-serif font-medium text-white leading-tight">
          Prime Proximity to Landmarks
        </h2>
      </div>

      <div className="relative w-full max-w-[600px] aspect-square mx-auto">
        {/* SVG Spoke Lines */}
        <svg 
          ref={svgRef}
          viewBox="0 0 540 540" 
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {landmarks.map((_, i) => {
            // Calculate line end points based on angle
            const angleRad = (landmarks[i].angle * Math.PI) / 180;
            const x2 = 270 + Math.cos(angleRad) * 200;
            const y2 = 270 + Math.sin(angleRad) * 200;
            
            return (
              <line 
                key={i}
                ref={el => { linesRef.current[i] = el; }}
                x1="270" y1="270" 
                x2={x2} y2={y2}
                className="stroke-white/10"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            );
          })}
        </svg>

        {/* Center Node */}
        <div 
          ref={centerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-white/10 bg-[#0A1A2F] flex flex-col items-center justify-center z-20 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Sky</span>
          <span className="text-[14px] font-serif font-medium text-white">City</span>
          <div className="absolute inset-[-8px] rounded-full border border-white/5 animate-pulse" />
        </div>

        {/* Landmark Nodes */}
        {landmarks.map((item, i) => {
          const angleRad = (item.angle * Math.PI) / 180;
          const left = 50 + Math.cos(angleRad) * 38;
          const top = 50 + Math.sin(angleRad) * 38;

          return (
            <div 
              key={i}
              ref={el => { nodesRef.current[i] = el; }}
              className="absolute w-32 -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 mx-auto mb-3 shadow-[0_0_10px_white/30]" />
              <h3 className="text-[12px] font-serif text-white/90 leading-tight mb-1">
                {item.name}
              </h3>
              <span className="text-[10px] tracking-wider text-white/40">
                {item.dist}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
