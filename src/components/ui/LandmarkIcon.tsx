import React from 'react';
import type { LandmarkIcon as Name } from '@/content/project';

/**
 * Line icons for the connectivity radar, one per landmark, drawn to the
 * same 24-unit grid and weight so the bubbles read as a set. Placeholder
 * for the brand icon set: swap these paths for the approved artwork when
 * it is supplied.
 */
const PATHS: Record<Name, React.ReactNode> = {
  beach: (
    <>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M2 15.5c2 0 2.6-1.4 5-1.4s3 1.4 5 1.4 2.6-1.4 5-1.4 2.6 1.4 5 1.4" />
      <path d="M2 19.5c2 0 2.6-1.4 5-1.4s3 1.4 5 1.4 2.6-1.4 5-1.4 2.6 1.4 5 1.4" />
    </>
  ),
  highway: (
    <>
      <path d="M5 21 8.5 3M19 21 15.5 3" />
      <path d="M12 5v2.5M12 11v2.5M12 17v2.5" />
    </>
  ),
  rail: (
    <>
      <rect x="6" y="3" width="12" height="13" rx="2.5" />
      <path d="M6 11h12M9.5 20l2-4M14.5 20l-2-4M4 20h16" />
    </>
  ),
  school: (
    <>
      <path d="M12 4 2.5 8.5 12 13l9.5-4.5L12 4Z" />
      <path d="M6 10.8V16c0 1.7 2.7 3.2 6 3.2s6-1.5 6-3.2v-5.2" />
    </>
  ),
  hospital: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  city: (
    <>
      <path d="M3 21V9l6-3v15" />
      <path d="M9 21V12l6-3v12" />
      <path d="M15 21V8l6 3v10" />
      <path d="M2 21h20" />
    </>
  ),
  airport: (
    <path d="M21 15.5v-1.8l-7.5-4.6V4.3a1.5 1.5 0 0 0-3 0v4.8L3 13.7v1.8l7.5-2.3v4.9L8.3 19.6V21l3.2-.9 3.2.9v-1.4l-2.2-1.5v-4.9L21 15.5Z" />
  ),
};

export const LandmarkIcon = ({ name, size = 22 }: { name: Name; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);
