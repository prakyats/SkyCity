'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo([leftRef.current, formRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-32 bg-[#050505] overflow-hidden"
      id="contact"
    >
      <div className="max-w-[1200px] mx-auto px-[clamp(24px,6vw,80px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32">
          
          {/* Left: Contact Info */}
          <div ref={leftRef} className="flex flex-col">
            <span className="text-[12px] tracking-[0.25em] uppercase text-white/40 mb-4 block">
              Get in Touch
            </span>
            <h2 className="text-[clamp(32px,5vw,64px)] font-serif font-medium text-white leading-tight mb-8">
              Book Your<br />Luxury Address
            </h2>
            <p className="text-[16px] leading-relaxed text-white/60 mb-12 max-w-[420px]">
              Experience the pinnacle of coastal living. Our team will reach you within 24 hours to arrange an exclusive site visit.
            </p>

            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
                <span className="text-xl opacity-50">📍</span>
                <div>
                  <h4 className="text-[14px] font-serif text-white/90 mb-1">Visit Us</h4>
                  <p className="text-[14px] text-white/40 leading-relaxed">
                    1st Floor, Nalapad Building,<br />Mallikatta, Kadri, Mangalore
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <span className="text-xl opacity-50">📞</span>
                <div>
                  <h4 className="text-[14px] font-serif text-white/90 mb-1">Direct Line</h4>
                  <p className="text-[14px] text-white/40">+91 88844 39155</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <span className="text-xl opacity-50">✉</span>
                <div>
                  <h4 className="text-[14px] font-serif text-white/90 mb-1">Email</h4>
                  <p className="text-[14px] text-white/40">yamunahomes16@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lead Form */}
          <div 
            ref={formRef}
            className="p-10 md:p-16 rounded-[32px] bg-white/5 border border-white/10"
          >
            <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-[14px] outline-none focus:border-white/30 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-[14px] outline-none focus:border-white/30 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 ml-2">Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 00000 00000"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-[14px] outline-none focus:border-white/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/40 ml-2">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-white text-[14px] outline-none focus:border-white/30 transition-all resize-none"
                />
              </div>

              <div className="flex items-start gap-4 mt-2">
                <input type="checkbox" className="mt-1 accent-white/40" defaultChecked />
                <p className="text-[12px] text-white/30 leading-relaxed">
                  I agree to receive communications regarding Yamuna Sky City and acknowledge the processing of my personal data.
                </p>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-white text-black rounded-full text-[12px] tracking-[0.2em] uppercase font-bold hover:bg-white/90 transition-all duration-300 mt-4"
              >
                Submit Enquiry →
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
