---
phase: 7
plan: 5
wave: 1
---

# Plan 7.5: Connectivity Section (Radial Diagram)

## Objective
Implement a high-end radial connectivity diagram that shows the project's proximity to key landmarks, using a cinematic dark aesthetic.

## Context
- src/components/sections/Connectivity.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Section `#connected`)

## Tasks

<task type="auto">
  <name>Create Connectivity Component</name>
  <files>
    - [NEW] src/components/sections/Connectivity.tsx
  </files>
  <action>
    - Create a radial SVG system with a central "Sky City" node.
    - Implement 6-8 connectivity nodes with Playfair typography.
    - Use a deep navy background (`#050505` or similar) to contrast from white sections.
  </action>
  <verify>Check radial symmetry and label legibility.</verify>
</task>

<task type="auto">
  <name>Implement GSAP Draw-Line Animation</name>
  <files>
    - [MODIFY] src/components/sections/Connectivity.tsx
  </files>
  <action>
    - Animate SVG lines (stroke-dashoffset) from center outward.
    - Stagger the reveal of landmark nodes (dot + text).
    - Add a pulse effect to the central node.
  </action>
  <verify>Observe the sequential "web" reveal effect on scroll.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<Connectivity />` after `VisualShowcase`.
  </action>
  <verify>Confirm smooth flow between the white VisualShowcase and the dark Connectivity section.</verify>
</task>

## Success Criteria
- [ ] Radial diagram is visually balanced and feels "high-tech refined".
- [ ] Lines animate with precise timing from center to perimeter.
- [ ] Typography follows the project's serif/sans hierarchy.
- [ ] Fully responsive (re-aligns nodes for mobile).
