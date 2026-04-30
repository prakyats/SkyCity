---
phase: 7
plan: 2
wave: 5
---

# Plan 7.2: Project Positioning Section (Final Production Safeguards)

## Objective
Add final production safeguards to ensure visual consistency, performance stability, and rendering precision across all environments.

## Context
- src/components/sections/ProjectIntro.tsx
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Harden Gradient & Overlay Safety</name>
  <files>
    - [MODIFY] src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Add `#0A1A2F` background-color fallback.
    - Set `pointer-events: none` on the top edge blend overlay.
    - Ensure overlay `z-index` is correctly managed.
  </action>
  <verify>Check that links/buttons below the overlay are still clickable.</verify>
</task>

<task type="auto">
  <name>Performance & Rendering Optimization</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Apply `will-change: transform` specifically to the right content block.
    - Implement global font-smoothing for serif elements.
    - Refine hover states to use only opacity and border (no motion).
  </action>
  <verify>Confirm smooth scrolling and crisp text rendering.</verify>
</task>

<task type="auto">
  <name>GSAP & Scroll Integrity</name>
  <files>
    - src/components/sections/ProjectIntro.tsx
  </files>
  <action>
    - Add `invalidateOnRefresh: true` to all ScrollTriggers.
    - Verify `gsap.context()` cleanup on unmount.
  </action>
  <verify>Resize window and verify trigger points recalculate correctly.</verify>
</task>

## Success Criteria
- [ ] No visual banding on high-brightness displays.
- [ ] Interactive elements are not blocked by overlays.
- [ ] Scroll performance is optimized via targeted `will-change`.
- [ ] Typography is smoothed and crisp.
- [ ] Scroll triggers are consistent after layout refreshes.
