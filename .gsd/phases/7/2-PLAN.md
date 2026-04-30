---
phase: 7
plan: 2
wave: 3
---

# Plan 7.2: Project Positioning Section (Depth-Aware & Rhythm-Controlled)

## Objective
Refine the `ProjectIntro` section into a visually continuous, depth-aware, and rhythm-controlled composition that flows naturally from the cinematic hero.

## Context
- src/components/sections/ProjectIntro.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Implement Depth-Aware Background Transition</name>
  <files>
    - [MODIFY] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Replace white background with a multi-step gradient: `#0A1A2F` (0-20%) -> `white` (60%).
    - Ensure `-mt-[100px]` remains for overlap but feels seamless.
  </action>
  <verify>Check for any "hard edge" line at the transition point.</verify>
</task>

<task type="auto">
  <name>Refine Visual Rhythm & Structured Blocks</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Shift the Right block down by `20px` for editorial asymmetry.
    - Wrap highlights in containers with `padding: 16px 0` and `1px solid rgba(0,0,0,0.08)`.
    - Apply typography polish (tracking -0.005em, opacity 0.7).
  </action>
  <verify>Verify asymmetry and list styling.</verify>
</task>

<task type="auto">
  <name>Tune GSAP Directional Reveal</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Add `delay: 0.2` (breathing room) to the main trigger.
    - Stagger highlight items by `0.12s`.
    - Ensure Left block starts first, followed by Right block.
  </action>
  <verify>Confirm left-to-right directional flow on reveal.</verify>
</task>

## Success Criteria
- [ ] Visual continuity from hero (no shock break).
- [ ] Editorial asymmetry established via vertical offsets.
- [ ] Structured blocks for highlights instead of plain list.
- [ ] Rhythm-controlled motion with directional flow.
