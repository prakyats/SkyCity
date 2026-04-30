---
phase: 7
plan: 2
wave: 4
---

# Plan 7.2: Project Positioning Section (Deterministic Production Version)

## Objective
Anchor the user after the cinematic hero with a fully deterministic, visually consistent, and device-safe implementation.

## Context
- src/components/sections/ProjectIntro.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Hardened Background & Edge Blending</name>
  <files>
    - [MODIFY] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Implement exact multi-step gradient for zero-banding transition.
    - Add absolute pseudo-element overlay (120px) at the top for perfect seam hiding.
    - Set `margin-top: -100px` and `padding-top: 180px`.
  </action>
  <verify>Check for visible seams or banding on high-brightness screens.</verify>
</task>

<task type="auto">
  <name>Responsive Asymmetry & Highlight Refinement</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Replace fixed offset with `translateY(clamp(12px, 2vw, 28px))` for the right block.
    - Refine highlight items with `18px` padding and hover interactions.
    - Apply typography micro-fixes (font-smoothing, -0.005em tracking).
  </action>
  <verify>Test responsive scaling of the vertical offset.</verify>
</task>

<task type="auto">
  <name>Deterministic GSAP Orchestration</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Remove global delay from trigger.
    - Set Right block delay: 0.2s.
    - Set Highlights delay: 0.35s with 0.12s stagger.
    - Use `power3.out` duration 0.9s.
  </action>
  <verify>Ensure left-to-right reveal flow is perfectly timed.</verify>
</task>

## Success Criteria
- [ ] Zero banding or visible seams in the hero-to-intro transition.
- [ ] Responsive vertical asymmetry maintained across breakpoints.
- [ ] Interactive highlights with smooth hover transitions.
- [ ] Precise directional motion flow (Left -> Right -> Details).
