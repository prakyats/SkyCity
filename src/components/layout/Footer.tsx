'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { cld } from '@/lib/cloudinary';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Location', href: '#location' },
  { label: 'Floor Plans', href: '#floorplans' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Progress', href: '#progress' },
];

const socials = [
  { label: 'FB', href: '#', full: 'Facebook' },
  { label: 'IN', href: '#', full: 'Instagram' },
  { label: 'LI', href: '#', full: 'LinkedIn' },
  { label: 'YT', href: '#', full: 'YouTube' },
];

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Footer content staggered reveal
      gsap.fromTo('.footer-col',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', once: true }
        }
      );
      // Tagline big text
      gsap.fromTo('.footer-tagline',
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        {
          clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: '.footer-tagline', start: 'top 92%', once: true }
        }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef}
      className="relative overflow-hidden"
      style={{ background: 'var(--navy-deep)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Top gold line */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,160,32,0.4), transparent)' }} />

      {/* Big display tagline */}
      <div className="overflow-hidden border-b"
        style={{ borderColor: 'rgba(255,255,255,0.04)', paddingTop: 'clamp(40px,5vw,60px)', paddingBottom: 'clamp(30px,4vw,50px)' }}>
        <div className="section-inner">
          <p className="footer-tagline font-display text-white/10 select-none whitespace-nowrap"
            style={{ fontSize: 'clamp(34px,6vw,80px)', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Building Trust, Quality, Dreams, Success &amp; Excellence.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="section-inner py-14 md:py-18">
        <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12 md:gap-8">

          {/* Brand col */}
          <div className="footer-col flex flex-col">
            <div className="flex items-center gap-6 mb-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cld("v1777699538/skyfavicon_1_tufy14.png", 200)} alt="Sky City" className="h-24 w-auto object-contain" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cld("v1777696301/yamuna_homes_z4hnie.png", 200)} alt="Yamuna Homes" className="h-24 w-auto object-contain opacity-80" />
            </div>
            <p className="font-body text-[var(--text-white-45)] leading-relaxed mb-6"
              style={{ fontSize: '0.85rem', maxWidth: '30ch' }}>
              Yamuna Homes and Design Pvt. Ltd. — shaping skylines across
              Karnataka since 1993 with trust, quality, and architectural ambition.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-auto">
              {socials.map((s, i) => (
                <a key={i} href={s.href} aria-label={s.full}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Location col */}
          <div className="footer-col flex flex-col">
            <span className="label text-[var(--gold)] mb-5 block" style={{ fontSize: '0.58rem' }}>Location</span>
            <div className="flex flex-col gap-2 font-body text-[var(--text-white-45)]" style={{ fontSize: '0.875rem', lineHeight: 1.8 }}>
              <span>1st Floor, Nalapad Building,</span>
              <span>Mallikatta, Kadri,</span>
              <span>Mangalore – 575003</span>
            </div>
          </div>

          {/* Contact col */}
          <div className="footer-col flex flex-col">
            <span className="label text-[var(--gold)] mb-5 block" style={{ fontSize: '0.58rem' }}>Contact</span>
            <div className="flex flex-col gap-4">
              <div>
                <span className="label text-[var(--text-white-28)] block mb-1" style={{ fontSize: '0.5rem' }}>Phone</span>
                <a href="tel:+918884439155"
                  className="hover-gold-line font-body text-[var(--text-white-45)] hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  +91 88844 39155
                </a>
              </div>
              <div>
                <span className="label text-[var(--text-white-28)] block mb-1" style={{ fontSize: '0.5rem' }}>Email</span>
                <a href="mailto:yamunahomes16@gmail.com"
                  className="hover-gold-line font-body text-[var(--text-white-45)] hover:text-white transition-colors"
                  style={{ fontSize: '0.875rem' }}>
                  yamunahomes16@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Nav col */}
          <div className="footer-col flex flex-col">
            <span className="label text-[var(--gold)] mb-5 block" style={{ fontSize: '0.58rem' }}>Explore</span>
            <ul className="flex flex-col gap-3">
              {navLinks.map((l, i) => (
                <li key={i}>
                  <button onClick={() => go(l.href)}
                    className="hover-gold-line font-body text-[var(--text-white-45)] hover:text-white transition-colors text-left"
                    style={{ fontSize: '0.875rem' }}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="section-inner py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="label text-[var(--text-white-28)]" style={{ fontSize: '0.52rem' }}>
            © 2026 Yamuna Homes and Design Pvt. Ltd. All Rights Reserved.
          </p>
          <p className="label text-[var(--text-white-28)]" style={{ fontSize: '0.52rem' }}>
            RERA NO.: PRM/KA/RERA/1257/334/PR/171023/006331
          </p>
        </div>
      </div>

    </footer>
  );
};