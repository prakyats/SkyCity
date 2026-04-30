---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Cinematic Intro Scene Transformation (Production-Locked)

## Objective
Transform the Hero section into a production-locked cinematic intro scene. This involves implementing a deterministic playback sync system to handle narrative reveals without race conditions, establishing optical layout constraints to prevent visual drift on wide displays, and using a multi-layered overlay system for cinematic depth.

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Implement Deterministic Playback Sync</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Update `VideoBackgroundProps` to expose `onReady?: () => void` and `onPlay?: () => void`.
    - `onReady`: Fires on `onLoadedData`.
    - `onPlay`: Fires on `onPlay`.
  </action>
  <verify>Confirm parent component receives separate signals for buffer readiness and playback start.</verify>
</task>

<task type="auto">
  <name>Implement Guarded Narrative Reveal & Optical Composition</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Guarded Timing System:**
      - Track `isReady` and `isPlaying` states.
      - Start 6000ms timer ONLY when `isPlaying` is true AND `isReady` is true.
      - **Non-Destructive Fallback:** Start a 2000ms timer on mount. Cancel it immediately if `onPlay` fires. If it completes without playback, trigger `showText = true` (ensures content accessibility on slow networks).
    - **Optical Center Protection:**
      - Wrap blocks in `flex justify-between w-full`.
      - **Hard Constraints:** `max-w-[420px]`, `w-[min(420px,35vw)]`.
      - **Visual Anchors:** Apply `ml-[clamp(24px,6vw,80px)]` to the left block and `mr-[clamp(24px,6vw,80px)]` to the right block to prevent drift on ultrawide screens.
    - **Cinematic Overlay Depth:**
      - **Layer 1 (z-10):** Directional falloff gradient (90deg).
      - **Layer 2 (Pseudo):** Radial vignette (`circle at 50% 40%`, `transparent 60%`, `rgba(0,0,0,0.25) 100%`) to lock focus on the tower.
    - **Strict Layering System:** Enforce z-index hierarchy (z-0: Video, z-10: Overlay, z-20: Text, z-30: Logos).
    - **Mobile Fallback:** Immediate reveal, stacked center, reduced font scaling, no GSAP.
  </action>
  <verify>Check composition on ultrawide viewports. Confirm reveal timing is deterministic and respects playback state.</verify>
</task>

<task type="auto">
  <name>Locked GSAP Narrative Execution</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Use `hasAnimated` ref to prevent duplicate triggers.
    - Initialize entrance inside `useEffect` tied to `showText`.
    - Scope via `gsap.context()` and cleanup with `context.revert()`.
    - **Animation:** Left (`x: -40 -> 0`), Right (`x: 40 -> 0`), `opacity: 0 -> 1`, `duration: 0.8`, `ease: power3.out`.
  </action>
  <verify>Ensure absolutely no duplicate animations or memory leaks occur during hydration or re-renders.</verify>
</task>

## Success Criteria
- [ ] Narrative timing is synchronized to playback state (isPlaying + isReady).
- [ ] Fallback timer (2s) is non-destructive (cancelled on playback).
- [ ] Optical balance preserved via clamp-based margins and hard width constraints.
- [ ] Cinematic depth achieved via dual-layer (Gradient + Vignette) overlay system.
- [ ] GSAP execution is strictly locked via refs and context.
- [ ] Mobile experience is immediate and static.
