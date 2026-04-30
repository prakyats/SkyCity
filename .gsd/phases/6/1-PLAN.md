---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Cinematic Intro Scene Transformation (Refined)

## Objective
Transform the Hero section into a production-safe cinematic intro scene. This involves implementing deterministic timing for text reveals, establishing hard layout constraints to protect the central subject (the building), and using editorial split typography to frame the narrative.

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Implement Deterministic Playback Signal</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Update `VideoBackgroundProps` to include an optional `onPlay: () => void`.
    - Attach the `onPlay` listener to the `<video>` element. Ensure it only fires once (deterministic trigger).
  </action>
  <verify>Ensure `Hero.tsx` receives a signal exactly when video playback begins.</verify>
</task>

<task type="auto">
  <name>Implement Controlled Narrative Reveal & Split Layout</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Narrative Logic:** Use a `showText` boolean state and a `useEffect` triggered by the video `onPlay`. Start a 6000ms timer to set `showText = true`. Use a ref to ensure this only fires once.
    - **Safe Cinematic Overlay:** Reintroduce a minimal gradient overlay: `linear-gradient(to right, rgba(10,26,47,0.35) 0%, rgba(10,26,47,0.15) 40%, transparent 65%)`.
    - **Split Typography Structure:**
      - **Left Block:** `max-w-[420px]`, `ml-[clamp(24px,6vw,80px)]`, `text-right`.
      - **Right Block:** `max-w-[420px]`, `mr-[clamp(24px,6vw,80px)]`, `text-left`.
      - **Center Protection:** Ensure the middle 30% of the screen remains completely clear using `justify-between` and hard constraints.
    - **Logo System:** Add absolute-positioned placeholders at the top-left and top-right with `padding-[clamp(16px,3vw,40px)]`.
    - **Mobile Fallback:** Use Tailwind to stack text centrally, remove reveal delays, and disable GSAP animations for mobile viewports.
  </action>
  <verify>Check visual balance on desktop. Confirm the building is perfectly framed and the text appears exactly 6 seconds after play starts.</verify>
</task>

<task type="auto">
  <name>Locked GSAP Narrative Animation</name>
  <files>
    - src/components/sections/Hero.tsx
    - src/lib/animations/heroAnimation.ts
  </files>
  <action>
    - Refactor `initHeroAnimations` to target the split blocks using refs.
    - When `showText` triggers:
      - **Left Text:** `opacity: 0 -> 1`, `x: -40 -> 0`.
      - **Right Text:** `opacity: 0 -> 1`, `x: 40 -> 0`.
      - **Config:** `duration: 0.8s`, `ease: power3.out`.
    - Ensure previous timelines are killed before initialization.
  </action>
  <verify>Confirm smooth, jitter-free entrance exactly at the 6-second mark.</verify>
</task>

## Success Criteria
- [ ] Video fills 100% viewport with `object-position: center 45%` and `transform-origin: center center`.
- [ ] Text reveal is deterministic (6s after `onPlay`), not reactive.
- [ ] Center 30% of screen is strictly protected from text/overlays.
- [ ] Editorial framing implemented (Left: Right-aligned, Right: Left-aligned).
- [ ] Minimal cinematic gradient rebalanced for readability.
- [ ] Mobile experience is immediate, stacked, and static.
