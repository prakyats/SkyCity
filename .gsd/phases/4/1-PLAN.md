---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Production-Grade Cinematic Hero

## Objective
Transform the Hero into a production-grade visual narrative entry point. It must utilize a strict focal lock system, safe text zones, layered depth gradients, and heavy motion-damped GSAP scroll easing to feel like a high-end directed scene.

## Context
- .gsd/SPEC.md
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Implement Strict Layout, Safe Zones & Gradients</name>
  <files>
    - src/components/sections/Hero.tsx
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - **Focal Lock System:** Ensure the video wrapper has `overflow: hidden`. Apply `transform-origin: center center` to the inner video. In `VideoBackground.tsx`, apply `object-position: center 45%` to prevent drift.
    - **Safe Text Zones:** Structure a container with `flex justify-between items-center px-[6vw] w-full`.
      - *Left Zone (0% - 35%):* `max-w-[420px]` with strong typography hierarchy.
      - *Center Protected Zone (35% - 65%):* STRICTLY NO TEXT. Let the building breathe.
      - *Right Zone (65% - 100%):* `max-w-[300px]`. Initially empty or containing subtle micro text/stats.
    - **Layered Gradient Correction:** Replace flat gradients with a 3-layer system:
      - Layer 1 (Base dark): `linear-gradient(to right, #0A1A2F 90%, transparent 100%)`
      - Layer 2 (Center softness): `radial-gradient(circle at center, transparent 40%, rgba(10,26,47,0.3) 100%)`
      - Layer 3 (Right balance): `linear-gradient(to left, rgba(10,26,47,0.2), transparent)`
    - **Mobile Override:** Disable the split layout via Tailwind classes (`flex-col` on mobile). Stack the content, use a stronger flat gradient, and reduce max scale intensity for mobile limits.
  </action>
  <verify>Check dev server visual structure ensures no text bleeds into the center 30% gap.</verify>
  <done>Text remains perfectly constrained to safe zones and the building is perfectly framed with depth gradients.</done>
</task>

<task type="auto">
  <name>Implement Motion-Damped GSAP Easing Timeline</name>
  <files>
    - src/lib/animations/heroAnimation.ts
  </files>
  <action>
    - **Load Sequence:** Wait ~0.5s after load. Left text: `y: 40` → `0`, `scale: 0.98` → `1`, `opacity: 0` → `1` (stagger `0.12`). Right text: `x: 40` → `0`, `scale: 0.98` → `1`, `opacity: 0` → `1`.
    - **Scroll Timeline (Easing-Based):** Apply motion damping with `scrub: 1.2` for heavy, expensive feel.
      - *Phase 1 (0 → 25%):* Slow ease (`power2.out`), video `scale: 1.08` → `1.16`.
      - *Phase 2 (25 → 55%):* Video `scale: 1.16` → `1.28`. Left text inward shift (`x: 0` → `20px`). Right text inward shift (`x: 0` → `-20px`).
      - *Phase 3 (55 → 75%):* **HOLD MOMENT.** No motion. Creates premium pause.
      - *Phase 4 (75 → 100%):* Fade out text, apply slight blur (`filter: blur(2px)`) to video to transition to next section.
    - WHAT TO AVOID: Do not use linear mapping. It must feel like a directed scene.
  </action>
  <verify>Test scroll manually to confirm motion damping, the Phase 3 hold moment, and exact scale transforms.</verify>
  <done>GSAP handles the 4 distinct easing phases perfectly without jitter, confirming a heavy, cinematic feel.</done>
</task>

## Success Criteria
- [ ] Top floors of the building stay visually dominant and do not drift during zoom.
- [ ] The center 30% of the screen is completely free of text at all times.
- [ ] Layered depth gradients add contrast without looking like a flat overlay.
- [ ] Scroll interaction features motion damping (`scrub: 1.2`) and an intentional hold moment.
