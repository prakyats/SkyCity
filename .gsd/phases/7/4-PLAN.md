---
phase: 7
plan: 4
wave: 1
---

# Plan 7.4: Visual Showcase Section (Immersive Media Block)

## Objective
Create a high-impact visual section that reinforces the project’s scale and environment using a dominant media element with minimal supporting text.

## Context
- src/components/sections/VisualShowcase.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Create VisualShowcase Component</name>
  <files>
    - [NEW] src/components/sections/VisualShowcase.tsx
  </files>
  <action>
    - Implement a grid layout (1.3fr visual / 0.7fr content).
    - Add a 520px high media container with 20px border-radius.
    - Style headings with Playfair Display.
  </action>
  <verify>Check for proper grid alignment and media aspect-ratio.</verify>
</task>

<task type="auto">
  <name>Implement GSAP Scroll Reveal</name>
  <files>
    - [MODIFY] src/components/sections/VisualShowcase.tsx
  </files>
  <action>
    - Animate media: opacity 0 -> 1, scale 1.05 -> 1.
    - Animate content: opacity 0 -> 1, y 30 -> 0 (delay 0.2s).
    - Set `once: true` on ScrollTrigger.
  </action>
  <verify>Observe the "breathing" scale-down effect on the media element.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<VisualShowcase />` after the Highlights section.
  </action>
  <verify>Confirm the section flows correctly after the ProjectIntro highlights.</verify>
</task>

## Success Criteria
- [ ] Media element is dominant and visually immersive.
- [ ] Section provides a clear visual break from text-heavy content.
- [ ] Animations are smooth and professionally timed (left -> right).
- [ ] Fully responsive (stacks on mobile, media on top).
