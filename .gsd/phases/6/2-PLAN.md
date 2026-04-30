---
phase: 6
plan: 2
wave: 1
---

# Plan 6.2: Editorial Content Hierarchy Refinement

## Objective
Refine the Hero content hierarchy to achieve a minimal, cinematic, and editorial layout. This involves stripping away informational clutter and establishing a clear visual narrative: Brand → Emotion → Authority.

## Context
- src/components/sections/Hero.tsx

## Tasks

<task type="auto">
  <name>Refactor Hero Typography & Hierarchy</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Clean Up:** Remove redundant headings, company name blocks, and decorative logo sections.
    - **Top Left Brand:** Implement "YAMUNA SKY CITY" (0.2em spacing, small, 0.75 opacity).
    - **Left Text Block:**
      - Micro Tag: "A New Landmark in South India" (Subtle).
      - Main Heading: "Sky City" (Large Serif, Right-aligned).
      - CTA: Single minimal button placed below this block.
    - **Right Text Block:**
      - Main Heading: "Sea View" (Large Serif, Left-aligned).
      - Support Text: "South India’s Tallest Sea View Residential Tower" (Opacity 0.6, max-width 280px).
    - **Optical Framing:** Ensure these blocks frame the building without overlap, respecting the previously established 30% center protection zone.
  </action>
  <verify>Check the visual hierarchy on desktop. Confirm the layout feels editorial and uncluttered.</verify>
</task>

## Success Criteria
- [ ] Redundant information and decorative logos removed.
- [ ] Top-left brand text follows exact styling specs.
- [ ] Main headings ("Sky City" / "Sea View") frame the building.
- [ ] Authority text ("South India's Tallest...") added with correct opacity/width.
- [ ] Single CTA implemented and positioned correctly (not centered).
