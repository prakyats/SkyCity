---
phase: 9
plan: 1
wave: 1
---

# Plan 9.1: Location Overview (Coastal Context)

## Objective
Implement a high-fidelity location section that emphasizes the project's prime coastal position and connectivity.

## Context
- src/components/sections/Location.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Section `#location`)

## Tasks

<task type="auto">
  <name>Create Location Component</name>
  <files>
    - [NEW] src/components/sections/Location.tsx
  </files>
  <action>
    - Build a split layout: Information cards (left) vs Stylized Map (right).
    - Map should feature a pulsing "Sky City" pin and a minimalist dark grid aesthetic.
    - Include key connectivity stats: Airport, Railway, Sea distance.
  </action>
  <verify>Check alignment and readability of connectivity labels.</verify>
</task>

<task type="auto">
  <name>Implement Map Interaction & Reveal</name>
  <files>
    - [MODIFY] src/components/sections/Location.tsx
  </files>
  <action>
    - Animate map grid lines and pin reveal using GSAP.
    - Add a hover effect to connectivity cards (glow/border shift).
  </action>
  <verify>Observe the map's subtle "loading" animation on scroll.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<Location />` after `FloorPlans`.
  </action>
  <verify>Confirm the visual flow after the light Floor Plans section.</verify>
</task>

## Success Criteria
- [ ] Location context is clear and professionally presented.
- [ ] Stylized map adds to the "high-end" cinematic feel.
- [ ] Connectivity data is easily scannable.
- [ ] Design remains cohesive with the dark/light rhythm of the site.
