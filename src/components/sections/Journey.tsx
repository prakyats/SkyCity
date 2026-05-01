'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const checklist = ['Superior Spaces', 'Innovative Designs', 'Timely Delivery', 'Client Relationships'];
const values = [
  'Quality Commitment', 'Innovative Practices',
  'Customer Satisfaction', 'Sustainable Solutions',
  'Integrity & Transparency', 'Excellence in Craft',
];

export const Journey = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('.jrn-reveal', { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pad overflow-hidden" style={{ background: 'var(--warm-dark)' }} id="journey">
      <div className="section-inner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">

          {/* Left */}
          <div className="jrn-reveal flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">What Drives Us</span>
            <h2 className="section-heading text-white mb-8" style={{ fontSize: 'clamp(1.8rem,3.5vw,3.5rem)' }}>
              Our Journey &<br />Commitment
            </h2>
            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-12"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '44ch' }}>
              For over three decades, Yamuna Homes and Design Pvt. Ltd. has been shaping
              skylines across Karnataka — where trust is our foundation and quality is our
              enduring signature.
            </p>
            <div className="flex flex-col gap-5">
              {checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center"
                    style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>
                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="font-body text-[var(--text-white-70)] text-sm tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="jrn-reveal flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-5 block">What We Stand For</span>
            <h2 className="section-heading text-white mb-10" style={{ fontSize: 'clamp(1.8rem,3.5vw,3.5rem)' }}>
              Core Values
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-12">
              {values.map((v, i) => (
                <div key={i} className="card-dark p-5 hover:border-[var(--gold)]/30 transition-colors cursor-default">
                  <span className="font-body text-[var(--text-white-70)] text-sm leading-snug">{v}</span>
                </div>
              ))}
            </div>
            {/* Legacy card */}
            <div className="p-10 flex flex-col" style={{
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
              borderRadius: 'var(--r-2xl)',
              border: '1px solid rgba(232,160,32,0.2)',
            }}>
              <span className="gold-rule" />
              <span className="label text-[var(--gold)] mb-4 block" style={{ fontSize: '0.58rem' }}>
                The Milestone
              </span>
              <h3 className="font-display text-white mb-4" style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300 }}>
                30+ Years of Excellence
              </h3>
              <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed">
                A legacy of delivering premium living spaces that stand the test of time,
                trends, and architectural ambition.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};