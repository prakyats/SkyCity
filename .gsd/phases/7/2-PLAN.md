---
phase: 7
plan: 2
wave: 1
---

# Plan 7.2: Project Positioning Section (Post-Hero Anchor)

## Objective
Immediately anchor the user after the cinematic hero by clearly defining what the project is, where it stands, and why it matters.

## Context
- src/components/sections/ProjectIntro.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Create ProjectIntro Component</name>
  <files>
    - [NEW] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Implement a clean, white-background section (`#FFFFFF`).
    - Use a 1200px max-width grid layout (1.2fr 0.8fr).
    - Add "PROJECT OVERVIEW" micro-label.
    - Add serif main heading and description text.
    - Implement the vertical highlight list on the right.
  </action>
  <verify>Check visual alignment and typography scale.</verify>
</task>

<task type="auto">
  <name>Implement GSAP Scroll Reveal</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Use ScrollTrigger to animate Left block (y: 40 -> 0) and Right block (y: 20 -> 0).
    - Duration: 0.8s, Ease: power3.out.
  </action>
  <verify>Scroll down to trigger the animation.</verify>
</task>

<task type="auto">
  <name>Integrate into Main Page</name>
  <files>
    - src/app/page.tsx
  </files>
  <action>
    - Replace the spacer `div` with the `ProjectIntro` component.
    - Ensure smooth transition from the Hero section.
  </action>
  <verify>Verify continuous flow on the live page.</verify>
</task>

## Success Criteria
- [ ] Section anchors user immediately after hero.
- [ ] High contrast (White bg) from Hero.
- [ ] GSAP scroll reveal functions correctly.
- [ ] Responsive grid stacks on mobile.
