---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Cinematic Intro Scene Transformation (Production-Grade)

## Objective
Transform the Hero section into a production-safe cinematic intro scene. This involves implementing fail-safe timing for narrative reveals, establishing strict architectural layout constraints to protect the central subject (the building), and using a deterministic layering system to ensure visual stability across all viewports.

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Implement Bulletproof Playback Signal</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Update `VideoBackgroundProps` to include `onReady?: () => void` and `onPlay?: () => void`.
    - Attach `onLoadedData` (Ready) and `onPlay` listeners to the `<video>` element.
    - Ensure both signals are bubbled up to the parent `Hero` component.
  </action>
  <verify>Ensure `Hero.tsx` receives both the buffer-ready and playback-started signals.</verify>
</task>

<task type="auto">
  <name>Implement Fail-Safe Narrative Reveal & Layering</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Fail-Safe Narrative Logic:**
      - Combine `ready` and `playing` signals to start a 6000ms timer.
      - Use `showText` boolean and `hasTriggered` ref to ensure a single-fire reveal.
      - Add a 2000ms fallback: if playback doesn't signal within 2s of mount, force `showText = true` to guarantee content visibility.
    - **Strict Layering System:**
      - z-0: Video Layer.
      - z-10: Directional Falloff Overlay (90deg linear gradient: `rgba(10,26,47,0.55) 0%`, `rgba(10,26,47,0.35) 25%`, `rgba(10,26,47,0.15) 45%`, `transparent 65%`).
      - z-20: Split Text Layers.
      - z-30: Logo/Navigation Layer.
    - **Architectural Layout Constraints:**
      - Wrap split blocks in a `flex justify-between w-full` container.
      - Enforce `max-w-[420px]` AND `w-[min(420px,35vw)]` on each block to strictly protect the center 30% of the screen.
    - **Mobile Fallback:** Disable delay entirely (immediate reveal), stack centrally, and reduce font scale significantly.
  </action>
  <verify>Check visual layering and layout stability. Confirm the center space never collapses and the reveal is deterministic.</verify>
</task>

<task type="auto">
  <name>Implement Scoped Narrative GSAP Animation</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Refactor the entrance animation using `gsap.context()` for scoped cleanup.
    - Trigger animation inside a `useEffect` tied strictly to `showText`.
    - **Left Block:** `opacity: 0 -> 1`, `x: -40 -> 0`.
    - **Right Block:** `opacity: 0 -> 1`, `x: 40 -> 0`.
    - **Config:** `duration: 0.8`, `ease: power3.out`.
    - Ensure all previous timelines are cleared via `context.revert()`.
  </action>
  <verify>Confirm silky smooth entrance exactly at the 6-second mark (or 2-second fallback).</verify>
</task>

## Success Criteria
- [ ] Video occupies 100% viewport with `will-change: transform` and `object-position: center 45%`.
- [ ] Narrative timing is bulletproof (Ready + Play signal + 6s timer + 2s fallback).
- [ ] Layer hierarchy (z-0 to z-30) strictly followed.
- [ ] Center protection zone (30%) enforced via `min(420px, 35vw)` constraints.
- [ ] Directional cinematic overlay prevents flat UI-block appearance.
- [ ] Mobile experience is immediate, stacked, and static.
