---
phase: 7
plan: 6
wave: 1
---

# Plan 7.6: Specifications & Stats Section

## Objective
Implement a clean, typography-driven specifications section that highlights key project metrics (Floors, Units, Amenities) with refined elegance.

## Context
- src/components/sections/Specifications.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Sections `#specs` and `#highlights`)

## Tasks

<task type="auto">
  <name>Create Specifications Component</name>
  <files>
    - [NEW] src/components/sections/Specifications.tsx
  </files>
  <action>
    - Build a 3-column grid for primary specs (GF+60, 296 Units, 1 Tower).
    - Add a secondary subtle grid for additional highlights (Amenities, Acreage).
    - Use large, light-weight Playfair Display for numbers.
  </action>
  <verify>Check for consistent spacing and elegant number rendering.</verify>
</task>

<task type="auto">
  <name>Implement GSAP Counter Animation</name>
  <files>
    - [MODIFY] src/components/sections/Specifications.tsx
  </files>
  <action>
    - Animate numbers from 0 to target value on scroll.
    - Stagger the reveal of spec blocks with a subtle Y-slide.
  </action>
  <verify>Observe the counting effect as the section enters the viewport.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<Specifications />` after `Connectivity`.
  </action>
  <verify>Confirm the visual transition from dark Connectivity to light Specifications.</verify>
</task>

## Success Criteria
- [ ] Primary numbers are dominant and elegantly rendered.
- [ ] Section feels balanced and "high-end editorial".
- [ ] Counting animations are smooth and perfectly timed.
- [ ] Responsive grid handles mobile stacking gracefully.
