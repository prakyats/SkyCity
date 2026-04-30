---
phase: 8
plan: 3
wave: 1
---

# Plan 8.3: Floor Plans (Interactive Typography Tabs)

## Objective
Implement an interactive floor plan selector that allows users to explore different residency options (2BHK to 5BHK) with a premium editorial layout.

## Context
- src/components/sections/FloorPlans.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Section `#floorplans`)

## Tasks

<task type="auto">
  <name>Create FloorPlans Component</name>
  <files>
    - [NEW] src/components/sections/FloorPlans.tsx
  </files>
  <action>
    - Build a state-managed tab system for 2BHK, 3BHK, 4BHK, and 5BHK.
    - Implement a split layout: Blueprint visual (left) vs Type details (right).
    - Use Playfair Display for sizes and Inter for technical details.
  </action>
  <verify>Check tab switching logic and content updating.</verify>
</task>

<task type="auto">
  <name>Implement High-End Reveal Transitions</name>
  <files>
    - [MODIFY] src/components/sections/FloorPlans.tsx
  </files>
  <action>
    - Animate content reveal (opacity/y) when switching tabs using GSAP or Framer Motion (if available, otherwise standard CSS/GSAP).
    - Add a "blueprint draw" effect or subtle scale on the visual.
  </action>
  <verify>Ensure tab transitions are smooth and professional.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<FloorPlans />` after `Amenities`.
  </action>
  <verify>Confirm the visual transition from dark Amenities to light Floor Plans.</verify>
</task>

## Success Criteria
- [ ] Interactive selector is intuitive and responsive.
- [ ] Typography correctly emphasizes the scale and luxury of each unit.
- [ ] Tab transitions are "glitch-free" and elegantly timed.
- [ ] Design maintains the premium architectural aesthetic.
