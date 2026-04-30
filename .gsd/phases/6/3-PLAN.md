---
phase: 6
plan: 3
wave: 1
---

# Plan 6.3: Cinematic Editorial Hero — Exact Implementation

## Objective
Implement a fully deterministic, cinematic hero section with staged content reveal (0s → 6s → 9s), unified serif typography, and split editorial composition. This is a "No Interpretation" execution.

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Apply Video & Layering Constraints</name>
  <files>
    - src/components/sections/Hero.tsx
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Ensure VideoBackground uses `object-position: center 45%` and `will-change: transform`.
    - Set strict z-index hierarchy in Hero: Video (z-0), Overlay (z-10), Content (z-20), Branding (z-30).
    - Implement the exact subtle gradient overlay as specified.
  </action>
  <verify>Confirm video coverage and z-index ordering.</verify>
</task>

<task type="auto">
  <name>Implement Exact Content Timeline (0s-6s-9s)</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Branding (Phase 1):** "YAMUNA SKY CITY" at top-left, serif, 0.2em spacing, 0.7 opacity. Always visible.
    - **Headline (Phase 2 at 6s):** "Sky City" (Left/Right-aligned/600 weight) and "Sea View" (Right/Left-aligned/400 weight/Italic).
    - **Details (Phase 3 at 9s):** Micro-tag (top 35%), Support text (below Right block), CTA (below Left block).
  </action>
  <verify>Confirm staged reveal timing (6s and 9s marks).</verify>
</task>

<task type="auto">
  <name>Lock Editorial Typography & Grid</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Set font to "Playfair Display", serif.
    - Implement split composition with middle 30% empty.
    - Apply `clamp` based font-sizes: `clamp(64px, 9vw, 140px)`.
    - Position Micro-tag at `top: 35%`.
    - Style CTA as transparent pill with backdrop-blur and 40px-60px margin-top.
  </action>
  <verify>Check alignment and spacing on ultra-wide screens.</verify>
</task>

<task type="auto">
  <name>GSAP & Mobile Overrides</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Implement scoped GSAP transitions (x-axis for Identity, y-axis for Details).
    - Add Mobile override: immediate reveal, stacked center, 40% font reduction below 768px.
  </action>
  <verify>Confirm mobile experience is instant and stacked.</verify>
</task>

## Success Criteria
- [ ] 3-Phase reveal strictly follows 0s/6s/9s timing.
- [ ] Typography is locked to "Playfair Display" serif.
- [ ] Center 30% zone is strictly preserved.
- [ ] Content blocks follow exact styling and alignment (Sky City | Sea View).
- [ ] Branding anchor is persistent and static.
- [ ] Mobile override is instant and stacked.
