---
phase: 8
plan: 1
wave: 1
---

# Plan 8.1: Luxury Smooth Scroll Implementation (Lenis + GSAP Sync)

## Objective
Implement a high-end smooth scrolling system with inertia and damping using Lenis, fully synchronized with GSAP ScrollTrigger.

## Context
- src/app/layout.tsx
- src/components/providers/SmoothScrollProvider.tsx
- src/app/globals.css

## Tasks

<task type="auto">
  <name>Create SmoothScrollProvider</name>
  <files>
    - [NEW] src/components/providers/SmoothScrollProvider.tsx
  </files>
  <action>
    - Implement Lenis core with GSAP ticker synchronization.
    - Handle `lenis.destroy()` on unmount.
  </action>
  <verify>Check for console errors related to Lenis or GSAP.</verify>
</task>

<task type="auto">
  <name>Wrap Application Layout</name>
  <files>
    - [MODIFY] src/app/layout.tsx
  </files>
  <action>
    - Import and wrap children with `SmoothScrollProvider`.
  </action>
  <verify>Ensure the app still renders correctly.</verify>
</task>

<task type="auto">
  <name>Apply Global Scroll CSS</name>
  <files>
    - [MODIFY] src/app/globals.css
  </files>
  <action>
    - Set `html, body { height: auto; }`.
    - Ensure `min-height: 100vh` on the main page wrapper if necessary.
  </action>
  <verify>Check for any layout breakage or horizontal scrollbars.</verify>
</task>

## Success Criteria
- [ ] Smooth inertial scrolling is active.
- [ ] GSAP ScrollTriggers are perfectly synced with Lenis.
- [ ] No mobile lag (smoothTouch disabled).
- [ ] Controlled acceleration/deceleration feel.
