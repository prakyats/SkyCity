---
phase: 7
plan: 3
wave: 2
---

# Plan 7.3: Key Highlights Section (Editorial Upgrade)

## Objective
Upgrade the highlights section from a structured list into a visually balanced editorial composition while maintaining minimalism.

## Context
- src/components/sections/ProjectIntro.tsx

## Tasks

<task type="auto">
  <name>Implement Editorial Layout & Hierarchy</name>
  <files>
    - [MODIFY] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Detach index from content block using flex.
    - Offset index vertically by `6px`.
    - Make first highlight dominant (26px) vs rest (22px).
    - Add faint vertical line connecting indices.
  </action>
  <verify>Verify hierarchy and index offsets.</verify>
</task>

<task type="auto">
  <name>Refine Rhythm & Typography</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Set padding to `40px 0` with extra gaps.
    - Adjust tracking and opacity for descriptions (0.65).
    - Ensure strict max-width on text.
  </action>
  <verify>Check vertical rhythm and typography consistency.</verify>
</task>

<task type="auto">
  <name>Update GSAP Motion Flow</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Animate first item immediately on trigger.
    - Stagger remaining items with a 0.2s delay and 0.15s interval.
  </action>
  <verify>Observe sequential reveal starting with the dominant item.</verify>
</task>

## Success Criteria
- [ ] First item anchors attention through scale and spacing.
- [ ] Editorial layout breaks "rigid UI list" feel.
- [ ] Indices are vertically offset for visual interest.
- [ ] Motion flow follows the content hierarchy.
