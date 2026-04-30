'use client';

import React, { useEffect, useState } from 'react';

export const FloatingCTAs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.45;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex flex-col gap-4 transition-all duration-500 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
    }`}>
      {/* WhatsApp CTA */}
      <a 
        href="https://wa.me/918884439155" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        aria-label="Contact on WhatsApp"
      >
        <span className="text-2xl">💬</span>
      </a>

      {/* Call CTA */}
      <a 
        href="tel:+918884439155"
        className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
        aria-label="Call Now"
      >
        <span className="text-xl">📞</span>
      </a>
    </div>
  );
};
