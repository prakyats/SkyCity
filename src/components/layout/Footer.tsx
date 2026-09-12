'use client';
import React from 'react';
import { scrollToTarget } from '@/lib/browser';
import { project, media, legacy, navLinks, socials } from '@/content/project';
import { Logo } from '@/components/ui/Logo';

export const Footer = () => {
  const go = (href: string) => scrollToTarget(href);

  return (
    <footer data-stop="bone-warm">
      {/* The one kinetic moment on the page: the promise travelling past,
          full bleed, edge to edge, with no container to sit inside. */}
      <div
        className="overflow-hidden select-none"
        style={{ paddingBlock: 'clamp(40px, 6vw, 88px)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}
        aria-hidden="true"
      >
        <div className="marquee" data-autopause>
          {[0, 1].map((k) => (
            <span key={k} className="t-display whitespace-nowrap" style={{ color: 'var(--text-3)' }}>
              {legacy.footerLine}
              <span style={{ color: 'var(--brand)', padding: '0 0.4em' }}>·</span>
            </span>
          ))}
        </div>
      </div>
      {/* The same words, once, for anyone not watching it move. */}
      <p className="sr-only">{legacy.footerLine}</p>

      <div className="wrap" style={{ paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 rule-strong pt-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-6">
              {/* The project, then the developer behind it */}
              <Logo type="lockup" variant="primary" height={46} label={project.name} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.yamunaMark} alt={project.developer} width={240} height={234}
                className="h-12 w-auto object-contain" loading="lazy" />
            </div>
            <p className="t-body-sm mt-8" style={{ color: 'var(--text-2)', maxWidth: '34ch' }}>{legacy.footerBody}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 mt-7">
              {socials.map((s) => (
                <li key={s.label}><a href={s.href} className="t-ui link-u" style={{ color: 'var(--text-2)' }}>{s.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>Location</p>
            <p className="t-ui mt-3" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
              {project.addressLines.map((l) => <React.Fragment key={l}>{l}<br /></React.Fragment>)}
            </p>
          </div>

          <div className="lg:col-span-2">
            <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>Contact</p>
            <p className="t-ui mt-3" style={{ lineHeight: 1.7 }}>
              <a href={project.phoneHref} className="link-u" style={{ color: 'var(--text-2)' }}>{project.phone}</a><br />
              <a href={`mailto:${project.email}`} className="link-u" style={{ color: 'var(--text-2)', overflowWrap: 'anywhere' }}>{project.email}</a>
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Sections">
            <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>Explore</p>
            <ul className="mt-3 grid gap-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button onClick={() => go(l.href)} className="t-ui link-u text-left" style={{ color: 'var(--text-2)' }}>{l.label}</button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="wrap rule flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-5">
        <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>© 2026 {project.developer} All rights reserved.</p>
        <p className="t-ui-sm" style={{ color: 'var(--text-3)' }}>RERA NO.: {project.rera} · Ground floor</p>
      </div>
    </footer>
  );
};
