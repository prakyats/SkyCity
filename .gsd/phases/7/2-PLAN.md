---
phase: 7
plan: 2
wave: 2
---

# Plan 7.2: Project Positioning Section (Refined Production Version)

## Objective
Anchor the user after the cinematic hero with a high-clarity, high-impact section that feels like a natural continuation—not a visual reset.

## Context
- src/components/sections/ProjectIntro.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Refine ProjectIntro Component (Transition & Layout)</name>
  <files>
    - [MODIFY] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Apply overlap pull: `margin-top: -100px`.
    - Add top gradient fade: `linear-gradient(to bottom, rgba(10,26,47,0.6), transparent)`.
    - Set `padding-top: 180px`.
    - Set grid gap to `100px`.
  </action>
  <verify>Check visual overlap with Hero section.</verify>
</task>

<task type="auto">
  <name>Update Typography & Highlights Structure</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Use "Playfair Display" for headings.
    - Implement the indexed highlight list (01, 02, etc.).
    - Apply exact spacing (label -> heading: 16px, heading -> description: 24px).
  </action>
  <verify>Verify indices and font styles.</verify>
</task>

<task type="auto">
  <name>Tune GSAP Scroll Orchestration</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Set trigger start to "top 80%" with `once: true`.
    - Add 0.1s stagger to highlight items.
    - Adjust y-offset (Left: 50, Right: 30) and duration (0.9s).
  </action>
  <verify>Scroll down to test smooth staggered entrance.</verify>
</task>

<task type="auto">
  <name>Mobile Optimization</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Force single column with 48px gap.
    - Center-align all text and elements.
    - Reduce heading scale.
  </action>
  <verify>Verify mobile layout in responsive view.</verify>
</task>

## Success Criteria
- [ ] Seamless transition from hero (no hard break).
- [ ] Strong visual hierarchy with structured highlights.
- [ ] Precise GSAP staggered reveals.
- [ ] Mobile-centric alignment and scaling.
