'use client';
import React, { useEffect, useState } from 'react';
import { onViewportChange, scrollMetrics, viewportHeight } from '@/lib/browser';
import { project } from '@/content/project';

/**
 * The persistent way to reach a person. It waits until the film is behind
 * the visitor, then stays: two plain actions in one bar, in the page's own
 * ink and hairline, rather than a pair of floating coloured bubbles.
 */
export const FloatingCTAs = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => onViewportChange(
    () => setVisible(scrollMetrics().y > viewportHeight() * 0.6),
  ), []);

  return (
    <div
      className={`fixed bottom-4 md:bottom-6 right-4 md:right-6 z-[100] flex transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
      style={{ border: '1px solid rgba(247,240,230,0.25)', background: 'var(--black)', color: 'var(--ivory)', borderRadius: 2 }}
    >
      <a
        href={project.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="t-ui flex items-center gap-2 px-4 h-12 hover:bg-white/10 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.979-1.381A9.965 9.965 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.964 7.964 0 01-4.058-1.107l-.291-.173-3.018.836.823-3.018-.19-.309A7.963 7.963 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
      <span style={{ width: 1, background: 'rgba(247,240,230,0.25)' }} aria-hidden="true" />
      <a
        href={project.phoneHref}
        aria-label="Call Now"
        className="t-ui flex items-center gap-2 px-4 h-12 hover:bg-white/10 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
        <span className="hidden sm:inline">Call</span>
      </a>
    </div>
  );
};
