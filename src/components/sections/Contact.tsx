'use client';
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const socials = [
  { label: 'LinkedIn', href: '#', icon: 'LI' },
  { label: 'YouTube', href: '#', icon: 'YT' },
  { label: 'Facebook', href: '#', icon: 'FB' },
  { label: 'Instagram', href: '#', icon: 'IG' },
];

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── WATERMARK: parallax scrub ──
      if (bgTextRef.current) {
        gsap.fromTo(bgTextRef.current,
          { xPercent: -3 },
          {
            xPercent: 3, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
          }
        );
      }

      // ── HEADING: each line slams in from left with clip-path ──
      gsap.fromTo('.ctc-line',
        { x: -80, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
        {
          x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)',
          duration: 1.1, stagger: 0.12, ease: 'power3.inOut',
          scrollTrigger: { trigger: leftRef.current, start: 'top 80%', once: true }
        }
      );

      // ── INFO ITEMS: stagger from left ──
      gsap.fromTo('.ctc-info-item',
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.ctc-info-list', start: 'top 82%', once: true }
        }
      );

      // ── FORM CARD: rises from below ──
      gsap.fromTo(formRef.current,
        { y: 80, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 84%', once: true }
        }
      );

      // ── GOLD RULE ──
      gsap.fromTo('.ctc-rule',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 82%', once: true }
        }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <section ref={sectionRef}
      className="bg-section-dark section-pad overflow-hidden relative" id="contact">

      {/* Top gold line */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.3), transparent)' }} />
      {/* Gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '50%', height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(232,160,32,0.05) 0%, transparent 70%)'
        }} />

      {/* Watermark */}
      <div ref={bgTextRef}
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0 }}>
        <span className="font-display text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', fontWeight: 700, opacity: 0.016, lineHeight: 1 }}>
          CONTACT US
        </span>
      </div>

      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24 items-start">

          {/* ── LEFT ── */}
          <div ref={leftRef} className="flex flex-col">
            <span className="ctc-rule gold-rule" />
            <span className="label text-[var(--gold)] mb-6 block">Get in Touch</span>

            <h2 className="mb-8" style={{ lineHeight: 0.9 }}>
              <span className="ctc-line block font-display text-white"
                style={{ fontSize: 'clamp(2.4rem,5.5vw,6rem)', fontWeight: 300 }}>
                Book Your
              </span>
              <span className="ctc-line block font-display"
                style={{ fontSize: 'clamp(2.4rem,5.5vw,6rem)', fontWeight: 300, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                Luxury Address
              </span>
            </h2>

            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-14"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '38ch' }}>
              Experience the pinnacle of coastal living. Our dedicated consultants will
              reach you within 24 hours to arrange an exclusive site visit.
            </p>

            {/* Info list */}
            <div className="ctc-info-list flex flex-col gap-7 mb-14">
              {[
                { label: 'Visit Us', value: '1st Floor, Nalapad Building,\nMallikatta, Kadri, Mangalore' },
                { label: 'Direct Line', value: '+91 88844 39155', href: 'tel:+918884439155' },
                { label: 'Email', value: 'yamunahomes16@gmail.com', href: 'mailto:yamunahomes16@gmail.com' },
              ].map((item, i) => (
                <div key={i}
                  className="ctc-info-item flex flex-col gap-1 pb-6 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <span className="label text-[var(--gold)]" style={{ fontSize: '0.58rem' }}>{item.label}</span>
                  {item.href
                    ? <a href={item.href}
                      className="hover-gold-line font-body text-[var(--text-white-70)] text-sm leading-relaxed"
                      style={{ whiteSpace: 'pre-line' }}>{item.value}</a>
                    : <span className="font-body text-[var(--text-white-70)] text-sm leading-relaxed"
                      style={{ whiteSpace: 'pre-line' }}>{item.value}</span>
                  }
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {socials.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'var(--font-tenor)', fontSize: '0.52rem',
                  }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Form ── */}
          <div ref={formRef}>
            <div className="relative overflow-hidden p-10 md:p-14"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-2xl)',
              }}>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                style={{ borderTop: '1px solid rgba(232,160,32,0.22)', borderLeft: '1px solid rgba(232,160,32,0.22)' }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                style={{ borderBottom: '1px solid rgba(232,160,32,0.22)', borderRight: '1px solid rgba(232,160,32,0.22)' }} />

              {submitted ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                    style={{ border: '1px solid var(--gold)', background: 'rgba(232,160,32,0.08)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l5.5 5.5L20 6.5" stroke="#E8A020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="section-heading text-white mb-4" style={{ fontSize: '1.4rem' }}>
                    Enquiry Received
                  </h3>
                  <p className="font-body text-[var(--text-white-45)] text-sm leading-relaxed max-w-xs">
                    Our luxury property consultant will personally reach you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="section-heading text-white mb-2" style={{ fontSize: 'clamp(1.2rem,2vw,1.5rem)' }}>
                    Request a Consultation
                  </h3>
                  <p className="font-body text-[var(--text-white-45)] text-sm mb-10 leading-relaxed">
                    Our team responds within 24 hours, personally.
                  </p>

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>Full Name *</label>
                        <input type="text" placeholder="John Doe" className="input-dark" required />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>Email Address</label>
                        <input type="email" placeholder="john@example.com" className="input-dark" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>Mobile Number *</label>
                      <div className="flex gap-3">
                        <div className="input-dark flex items-center justify-center flex-shrink-0"
                          style={{ width: 72, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                          +91
                        </div>
                        <input type="tel" placeholder="98765 43210" className="input-dark flex-1" required />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>Message</label>
                      <textarea rows={3} placeholder="Tell us about your requirements…"
                        className="input-dark resize-none" />
                    </div>

                    <div className="flex items-start gap-4 mt-1">
                      <input type="checkbox" id="ctc-consent" required className="mt-1 flex-shrink-0 accent-[#E8A020]" />
                      <label htmlFor="ctc-consent" className="font-body text-xs leading-relaxed cursor-pointer" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        I agree to receive communications regarding Yamuna Sky City and acknowledge
                        the processing of my personal data as per the Privacy Policy.
                      </label>
                    </div>

                    <button type="submit" className="btn-gold w-full mt-3 relative overflow-hidden"
                      style={{ fontSize: '0.68rem', padding: '1.1rem' }}
                      disabled={loading}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <span className="w-4 h-4 rounded-full border-2 border-[var(--navy-deep)] border-t-transparent animate-spin" />
                          Sending…
                        </span>
                      ) : 'Submit Enquiry →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};