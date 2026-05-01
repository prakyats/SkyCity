'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const socials = [
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube',  href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Instagram',href: '#' },
];

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {

      // ── BIG BACKGROUND TEXT: parallax ──
      if (bgTextRef.current) {
        gsap.fromTo(bgTextRef.current,
          { xPercent: -3 },
          { xPercent: 3, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
          }
        );
      }

      // ── SECTION REVEAL ──
      gsap.fromTo('.ctc-reveal', { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true } });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-section-dark section-pad overflow-hidden relative" id="contact">

      {/* Radial glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '80%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.3), transparent)',
        }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '50%', height: '300px',
          background: 'radial-gradient(ellipse at top, rgba(232,160,32,0.04) 0%, transparent 70%)',
        }} />

      {/* Big watermark text */}
      <div ref={bgTextRef} className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        style={{ zIndex: 0 }}>
        <span className="font-display text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(80px,14vw,200px)', fontWeight: 700, opacity: 0.018, lineHeight: 1 }}>
          CONTACT US
        </span>
      </div>

      <div className="section-inner relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-16 md:gap-24 items-start">

          {/* Left */}
          <div className="ctc-reveal flex flex-col">
            <span className="gold-rule" />
            <span className="label text-[var(--gold)] mb-6 block">Get in Touch</span>
            <h2 className="font-display text-white mb-8"
              style={{ fontSize: 'clamp(2.4rem,5.5vw,6rem)', fontWeight: 300, lineHeight: 0.9 }}>
              Book Your<br />
              <em style={{ color: 'rgba(255,255,255,0.55)' }}>Luxury Address</em>
            </h2>
            <p className="font-body text-[var(--text-white-45)] leading-[1.85] mb-14"
              style={{ fontSize: 'clamp(0.9rem,1.1vw,1rem)', maxWidth: '38ch' }}>
              Experience the pinnacle of coastal living. Our team will reach you
              within 24 hours to arrange an exclusive site visit.
            </p>

            <div className="flex flex-col gap-8 mb-14">
              {[
                { line1: 'Visit Us', line2: '1st Floor, Nalapad Building,\nMallikatta, Kadri, Mangalore' },
                { line1: 'Direct Line', line2: '+91 88844 39155', href: 'tel:+918884439155' },
                { line1: 'Email', line2: 'yamunahomes16@gmail.com', href: 'mailto:yamunahomes16@gmail.com' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-b pb-6 group"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                  <span className="label text-[var(--gold)]" style={{ fontSize: '0.58rem' }}>{item.line1}</span>
                  {item.href
                    ? <a href={item.href} className="hover-gold-line font-body text-[var(--text-white-70)] text-sm leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}>{item.line2}</a>
                    : <span className="font-body text-[var(--text-white-70)] text-sm leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}>{item.line2}</span>
                  }
                </div>
              ))}
            </div>

            <div className="flex gap-5">
              {socials.map((s, i) => (
                <a key={i} href={s.href}
                  className="label text-[var(--text-white-28)] hover:text-[var(--gold)] transition-colors"
                  style={{ fontSize: '0.56rem' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="ctc-reveal">
            <div className="p-10 md:p-14 relative overflow-hidden scan-line-card" style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 'var(--r-2xl)',
            }}>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none"
                style={{ borderTop: '1px solid rgba(232,160,32,0.2)', borderLeft: '1px solid rgba(232,160,32,0.2)' }} />
              <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
                style={{ borderBottom: '1px solid rgba(232,160,32,0.2)', borderRight: '1px solid rgba(232,160,32,0.2)' }} />

              <h3 className="section-heading text-white mb-2"
                style={{ fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}>
                Request a Consultation
              </h3>
              <p className="font-body text-[var(--text-white-45)] text-sm mb-10 leading-relaxed">
                Fill in your details and a dedicated property consultant will
                personally reach out within 24 hours.
              </p>

              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>
                      Full Name *
                    </label>
                    <input type="text" placeholder="John Doe" className="input-dark" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>
                      Email Address
                    </label>
                    <input type="email" placeholder="john@example.com" className="input-dark" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>
                    Mobile Number *
                  </label>
                  <div className="flex gap-3">
                    <div className="input-dark flex items-center justify-center flex-shrink-0"
                      style={{ width: 72, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                      +91
                    </div>
                    <input type="tel" placeholder="98765 43210" className="input-dark flex-1" required />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="label text-[var(--text-white-28)]" style={{ fontSize: '0.56rem' }}>
                    Message
                  </label>
                  <textarea rows={3} placeholder="Tell us about your requirements..."
                    className="input-dark resize-none" />
                </div>

                <div className="flex items-start gap-4 mt-1">
                  <input type="checkbox" defaultChecked
                    className="mt-1 flex-shrink-0 accent-[#E8A020]" />
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    I agree to receive communications regarding Yamuna Sky City and acknowledge
                    the processing of my personal data as per the Privacy Policy.
                  </p>
                </div>

                <button type="submit" className="btn-gold w-full mt-3" style={{ fontSize: '0.68rem', padding: '1.1rem' }}>
                  Submit Enquiry →
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
