---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Cinematic Center-Focused Hero Redesign

## Objective
Transform the Hero section into a cinematic center-aligned composition where the video dominates the center, text is split across the left and right edges, and complex scroll-based GSAP animations orchestrate a luxury "brochure" experience.

## Context
- .gsd/SPEC.md
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Redesign Layout and Video Structure</name>
  <files>
    - src/components/sections/Hero.tsx
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Update `VideoBackground.tsx` to ensure `object-fit: cover` and `object-position: center`, filling `100vw` and `100vh`.
    - Update `Hero.tsx` structure to use a dual-sided gradient overlay: `background: linear-gradient(to right, #0A1A2F 80%, transparent 100%), linear-gradient(to left, #0A1A2F 30%, transparent 60%)` (or Tailwind equivalent, using a strong left fade and subtle right fade).
    - Implement a Split Content Layer: a `div` with `absolute inset-0 flex justify-between items-center px-[6vw]`.
    - Move Tagline, Heading, and CTA buttons to the Left Side container (`max-w-[420px]`).
    - Add an empty or subtle placeholder container to the Right Side to balance the layout.
    - WHAT TO AVOID: Do not leave the video cropped to 65%. It must be 100vw. Do not let text overlap the direct center.
  </action>
  <verify>npm run lint && npm run build (or manual visual check if dev server is running)</verify>
  <done>Video fills the screen, building is centered, text is split left/right, and gradient is dual-sided.</done>
</task>

<task type="auto">
  <name>Implement Advanced GSAP Scroll Sequence</name>
  <files>
    - src/lib/animations/heroAnimation.ts
  </files>
  <action>
    - Rewrite `initHeroAnimations` to implement the new sequence.
    - **Load Animation:** Left side enters from `y: 60` to `0` with `opacity: 0` to `1` (staggered). Right side enters from `x: 60` to `0` with `opacity: 0` to `1`. Add a ~0.5s delay after video load.
    - **Scroll Phase 1 (0% - 30%):** Video slowly zooms (`scale: 1.1` to `1.25`), text is visible.
    - **Scroll Phase 2 (30% - 60%):** Video continues zoom, Left text moves slightly inward (parallax).
    - **Scroll Phase 3 (60%+):** Hero content cleanly fades out.
    - Ensure ScrollTrigger coordinates correctly map these scroll percentages (or pixel equivalents) using a unified timeline linked to scroll progress.
    - WHAT TO AVOID: Do not control video playback with scroll, only CSS transforms/opacity.
  </action>
  <verify>Check GSAP logic for syntax errors and correct timeline staging.</verify>
  <done>GSAP timelines precisely map to the 3 scroll phases with the specified transforms and opacities.</done>
</task>

## Success Criteria
- [ ] Building remains perfectly centered at all times.
- [ ] Text sits safely on the left and right, never overlapping the center.
- [ ] Video slowly zooms in via `scale` transforms across scroll progress.
- [ ] Scroll phases orchestrate entry, parallax inward movement, and final fade-out seamlessly.
