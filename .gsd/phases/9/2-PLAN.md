---
phase: 9
plan: 2
wave: 1
---

# Plan 9.2: Project Partners (Expertise Grid)

## Objective
Implement a professional expertise section that showcases the world-class partners involved in the project, reinforcing trust and quality.

## Context
- src/components/sections/Partners.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Section `#partners`)

## Tasks

<task type="auto">
  <name>Create Partners Component</name>
  <files>
    - [NEW] src/components/sections/Partners.tsx
  </files>
  <action>
    - Build a 3-column grid for key partners: CPP Wind, Shanghvi, and MFE Formwork.
    - Use a minimalist card design with subtle icons or background silhouettes.
    - Emphasize the global reach and heritage of each partner (e.g., 50+ years, USA, Australia).
  </action>
  <verify>Check for consistent card sizing and typography alignment.</verify>
</task>

<task type="auto">
  <name>Implement Hover Reveals</name>
  <files>
    - [MODIFY] src/components/sections/Partners.tsx
  </files>
  <action>
    - Add a clean hover interaction that subtly emphasizes the partner's description.
    - Use a smooth transition for the card's background or border.
  </action>
  <verify>Ensure hover states are subtle and high-end.</verify>
</task>

<task type="auto">
  <name>Integrate into Landing Page</name>
  <files>
    - [MODIFY] src/app/page.tsx
  </files>
  <action>
    - Import and place `<Partners />` after `Location`.
  </action>
  <verify>Confirm the flow from dark Location to light Partners (or dark Partners if preferred).</verify>
</task>

## Success Criteria
- [ ] Expertise is communicated with professional clarity.
- [ ] Section reinforces the "global standard" of the project.
- [ ] Responsive grid stacks correctly for mobile users.
