---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Production-Grade Cinematic Hero

## Objective
Transform the Hero into a production-grade visual narrative entry point. It must utilize a strict focal lock system, adaptive safe text zones, optical zoom mechanics, and heavy motion-damped GSAP scroll easing to feel like a high-end directed scene. Luxury is restraint and control.

## Context
- .gsd/SPEC.md
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Implement Adaptive Layout & Optical Framing</name>
  <files>
    - src/components/sections/Hero.tsx
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - **Focal Lock System:** Ensure the video wrapper has `overflow: hidden`. Apply `transform-origin: center center` to the inner video layer. In `VideoBackground.tsx`, apply `object-position: center 45%` to prevent top-floor drift. Add `will-change: transform` to the video element for performance.
    - **Adaptive Safe Zones:** Remove rigid percentage zones. Implement a natural layout constraint:
      - *Left Container:* `max-w-[420px]` with `ml-[clamp(24px,6vw,80px)]` to adapt naturally.
      - *Right Container:* REMOVE completely for now. Let the building dominate.
      - *Center:* Remains naturally clear due to the left-side constraint.
    - **Gradient System:** Simplify to a single, clean linear gradient to prevent muddy overlays:
      - `background: linear-gradient(to right, #0A1A2F 15%, rgba(10,26,47,0.6) 55%, transparent 85%)` (or Tailwind equivalent mapping to ascending stops). Add an optional subtle vignette via a pseudo-element if contrast needs a final touch.
    - **Mobile Override:** Stack content (`flex-col`), use a stronger flat gradient, and limit zoom scale intensity.
  </action>
  <verify>Check dev server visual structure. Resize viewport to ensure `clamp` adapts elegantly without text encroaching on the building.</verify>
  <done>Layout feels visually balanced with adaptive margins. The simplified gradient provides clean contrast without feeling over-layered.</done>
</task>

<task type="auto">
  <name>Implement Optical GSAP Camera Move & Timing</name>
  <files>
    - src/lib/animations/heroAnimation.ts
  </files>
  <action>
    - **Load Sequence:** Respect visual hierarchy. Wait `0.8s` after video starts before text enters. Left text: `y: 40` → `0`, `scale: 0.98` → `1`, `opacity: 0` → `1` (stagger `0.12`).
    - **Optical Scroll Timeline:** Apply motion damping with `scrub: 1.2` for heavy, expensive feel. Limit GSAP updates where possible.
      - *Phase 1 (0 → 25%):* Slow ease (`power2.out`), video `scale: 1.05` → `1.12` and `y: 0` → `-15px`.
      - *Phase 2 (25 → 55%):* Video `scale: 1.12` → `1.18` and `y: -15px` → `-40px`. Left text inward shift (`x: 0` → `20px`).
      - *Phase 3 (55 → 75%):* **Micro-Motion Hold Phase.** Stretch duration, `scale: 1.18` → `1.20`. Scene stays alive without major shifts.
      - *Phase 4 (75 → 100%):* Fade out text cleanly, apply slight blur (`filter: blur(2px)`) to video to transition to next section.
    - WHAT TO AVOID: Do not use large scale values (no `1.28`). Keep the zoom optical and sharp.
  </action>
  <verify>Test scroll manually to confirm the optical push-in (`y: -40px` translation), the micro-motion hold, and exact timing delays.</verify>
  <done>GSAP sequence feels like a real camera push-in. Text enters late enough to let the building register first. Motion is perfectly damped and never feels frozen.</done>
</task>

## Success Criteria
- [ ] Adaptive layout uses `clamp` constraints, leaving the right side empty for absolute focus.
- [ ] Optical camera move mimics a real push-in (`scale: 1.05 → 1.18` coupled with upward translation).
- [ ] Text entrance is delayed by 0.8s to establish visual hierarchy.
- [ ] Performance is guarded with `will-change: transform`.
- [ ] Phase 3 employs micro-motion to prevent the scene from feeling dead or artificial.
