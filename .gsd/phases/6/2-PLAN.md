---
phase: 6
plan: 2
wave: 1
---

# Plan 6.2: Editorial Content Hierarchy & Composition Refinement

## Objective
Refine the Hero composition into a balanced editorial layout with correct visual weight distribution and vertical rhythm. This involves shifting from a mirrored layout to an asymmetrical but optically balanced structure where content layers are separated by hierarchy (Atmospheric Tone → Identity → Action).

## Context
- src/components/sections/Hero.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Refactor Editorial Composition Layering</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Vertical Rhythm Implementation:**
      - Set Headline baseline approximately at vertical center.
      - **Micro Tag (Atmospheric Layer):** Implement "A New Landmark in South India" as a detached absolute element floating ABOVE the headline zone (centered or slightly left-biased, wide tracking, low opacity 0.6).
      - **CTA (Action Layer):** Implement a single CTA anchored BELOW the left headline, but offset downward with significant spacing to feel like a separate layer.
    - **Optical Weight Distribution (Asymmetry):**
      - **Left Block (Heavy):** Heading "Sky City" (Right-aligned) + Anchored CTA below.
      - **Right Block (Light):** Heading "Sea View" (Left-aligned) + Support Text "South India’s Tallest Sea View Residential Tower" (max-w-[280px], opacity 0.65, spaced breathing gap).
    - **Branding Anchor:** Maintain "YAMUNA SKY CITY" at top-left with established 0.75 opacity/tracking.
    - **Center Protection:** Ensure the building remains dominant and the 30% center zone is strictly clear.
  </action>
  <verify>Check visual balance on ultra-wide and standard displays. Confirm the asymmetrical weight feels stable and the vertical hierarchy (Top: Tone, Center: Identity, Bottom: Action) is clear.</verify>
</task>

<task type="auto">
  <name>Refine Scoped Entrance Animations</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Update the GSAP entrance logic in `Hero.tsx` to handle the detached layers:
      - **Micro Tag:** Subtle fade in from `y: -20 -> 0`.
      - **CTA:** Subtle fade in from `y: 20 -> 0`.
      - Ensure these are scoped within the `showText` trigger.
  </action>
  <verify>Confirm all layers reveal with a cohesive, intentional timing.</verify>
</task>

## Success Criteria
- [ ] Visual hierarchy established: Top (Micro Tag) → Center (Identity) → Bottom (Action).
- [ ] Asymmetrical weight distribution (Left heavy / Right light) feels optically balanced.
- [ ] Micro tag is detached and atmospheric (centered or left-biased).
- [ ] CTA is anchored below left block but offset for breathing space.
- [ ] Center protection zone (30%) strictly preserved.
- [ ] Redundant content (decorative logos, company blocks) removed.
