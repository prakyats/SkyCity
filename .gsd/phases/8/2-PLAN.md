---
phase: 8
plan: 2
wave: 1
---

# Plan 8.2: Amenities Grid (Luxury Lifestyle Cards)

## Objective
Implement a premium amenities grid with interactive cards that showcase the lifestyle offerings of Yamuna Sky City.

## Context
- src/components/sections/Amenities.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Section `#amenities`)

## Tasks

<task type="auto">
  <name>Create Amenities Component</name>
  <files>
    - [NEW] src/components/sections/Amenities.tsx
  </files>
  <action>
    - Build a 3-column grid of luxury amenity cards.
    - Features: "Kawaki Forest Trails", "Wellness Studio", "Infinity Pool".
    - Use a sophisticated dark-to-light gradient or atmospheric imagery.
  </action>
  <verify>Check card layout and text legibility.</verify>
</task>

<task type="auto">
  <name>Implement High-End Hover Effects</name>
  <files>
    - [MODIFY] src/components/sections/Amenities.tsx
  </files>
  <action>
    - Add smooth scale-up and overlay reveal on hover.
    - Implement subtle parallax or "tilt" effect if suitable.
    - Use CSS transitions for the "glow" or "border" expansion.
  </action>
  <verify>Observe the interactive feedback on each card.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<Amenities />` after `Specifications`.
  </action>
  <verify>Confirm the section sequence on the main page.</verify>
</task>

## Success Criteria
- [ ] Amenities feel exclusive and luxury-focused.
- [ ] Hover states are fluid and responsive.
- [ ] Grid layout is perfectly balanced on all screen sizes.
- [ ] Image/Visual content is high-quality.
