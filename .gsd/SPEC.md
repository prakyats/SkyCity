# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A production-grade, cinematic, video-first Hero section for a luxury real estate website. It must feel premium, minimal, and distraction-free, using subtle motion and setting the tone for the entire website.

## Goals
1. Implement a full-viewport, autoplaying background video that is optimized for performance (desktop and mobile).
2. Create a dark-navy to transparent gradient overlay for perfect readability and smooth blending.
3. Build a sophisticated, left-aligned typography layout with a tagline, serif heading, and interactive CTA buttons.
4. Integrate a high-performance GSAP animation sequence that plays on load, and subtle parallax on scroll.

## Non-Goals (Out of Scope)
- Heavy scroll-based animations that control the video playback.
- Flashy or overwhelming visual effects.
- Generic placeholders or non-premium aesthetics.

## Users
High-net-worth individuals exploring luxury real estate offerings online.

## Constraints
- Next.js 14 (App Router) + Tailwind CSS + GSAP.
- Video size < 4–5MB with strict performance rules (LCP < 2.5s).
- Must provide fallback to poster image if video fails or for reduced motion preferences.

## Success Criteria
- [ ] Video autoplays seamlessly with proper mobile fallback and `<video>` attributes.
- [ ] Text elements stagger-fade in sequence using GSAP `power2.out` ease.
- [ ] Perfect LCP scores and no layout shifts.
- [ ] Premium aesthetic matching "Sky City: Sea View Homes".
