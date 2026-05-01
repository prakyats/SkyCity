'use client';

import React from 'react';

const links = [
  { label: "Architecture", href: "#project-intro" },
  { label: "Connectivity", href: "#connectivity" },
  { label: "Floor Plans", href: "#floorplans" },
  { label: "Expertise", href: "#partners" },
  { label: "Progress", href: "#progress" }
];

export const Footer = () => {
  return (
    <footer className="relative w-full py-24 bg-[#050505] border-t border-white/[0.05]">
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        
        {/* Branding Logos */}
        <div className="flex items-center gap-8 md:gap-12 mb-16 border-b border-white/[0.05] pb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logos/skyfavicon.png" 
            alt="Sky City Logo" 
            className="h-12 md:h-16 w-auto object-contain"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logos/yamuna_homes.png" 
            alt="Yamuna Homes Logo" 
            className="h-12 md:h-16 w-auto object-contain"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-16 md:gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col">
            <h3 className="text-[20px] font-serif font-medium text-white mb-6">Building Trust, Quality, & Excellence</h3>
            <p className="text-[14px] leading-relaxed text-white/40 mb-8 max-w-[280px]">
              Yamuna Homes and Design Pvt. Ltd. delivers innovative, sustainable, and high-quality spaces, shaping modern lifestyles since 1993.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all">FB</div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all">IN</div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 cursor-pointer transition-all">LI</div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Location</h4>
            <div className="flex flex-col gap-4 text-[14px] text-white/40 leading-relaxed">
              <p>1st Floor, Nalapad Building,</p>
              <p>Mallikatta, Kadri,</p>
              <p>Mangalore – 575003</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Get in Touch</h4>
            <p className="text-[14px] text-white/40 mb-10">+91 88844 39155</p>
            
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Mail Us</h4>
            <p className="text-[14px] text-white/40">yamunahomes16@gmail.com</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Explore</h4>
            <ul className="flex flex-col gap-4 text-[14px] text-white/40">
              <li>Home</li>
              <li>Highlights</li>
              <li>Location</li>
              <li>Overview</li>
              <li>Site Progress</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[12px] text-white/20">
            © 2024 Yamuna Homes and Design Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-[12px] text-white/20">
            Design by Advanced Agentic Coding
          </p>
        </div>

      </div>
    </footer>
  );
};
