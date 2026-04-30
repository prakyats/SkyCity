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
        
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-16 md:gap-12 mb-20">
          
          {/* Brand */}
          <div className="flex flex-col">
            <h3 className="text-[24px] font-serif font-medium text-white mb-6">Yamuna Sky City</h3>
            <p className="text-[14px] leading-relaxed text-white/40 mb-8 max-w-[280px]">
              A luxury residential masterpiece on the coastline of New Mangalore, setting a new benchmark for high-rise living in Karnataka.
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
            <ul className="flex flex-col gap-4 text-[14px] text-white/40">
              <li>Near Ryan Intl School, Kulai</li>
              <li>Surathkal – NH 66</li>
              <li>Mangalore, Karnataka</li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Explore</h4>
            <ul className="flex flex-col gap-4 text-[14px] text-white/40">
              {links.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical */}
          <div>
            <h4 className="text-[12px] tracking-[0.2em] uppercase text-white/80 mb-6">Project Info</h4>
            <ul className="flex flex-col gap-4 text-[14px] text-white/40">
              <li>RERA PR: PRM/KA/RERA/1257/334/PR/230124/006579</li>
              <li>Developed by: Yamuna Homes</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
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
