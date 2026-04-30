---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Cinematic Intro Scene Transformation

## Objective
Transform the Hero section from a standard landing page component into a premium cinematic intro scene. This involves removing all intrusive overlays, implementing a split typography system that frames the building, and delaying text reveal until the video reaches a specific narrative point (6 seconds).

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/lib/animations/heroAnimation.ts

## Tasks

<task type="auto">
  <name>Expose Video Timing Signal</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - Update `VideoBackgroundProps` to include an optional `onTimeUpdate: (time: number) => void`.
    - Attach the `onTimeUpdate` listener to the `<video>` element to bubble up the `currentTime` to the parent component.
  </action>
  <verify>Ensure `Hero.tsx` can receive the current time from the video background.</verify>
</task>

<task type="auto">
  <name>Implement Split Typography & Narrative Logic</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Narrative State:** Implement `const [showText, setShowText] = useState(false)` and `useEffect` to trigger it when `currentTime >= 6`. On mobile, `showText` should be `true` immediately.
    - **Remove Overlays:** Delete the current dark gradient overlay (`overlayRef`).
    - **Split Layout:** Replace the current content layer with a structure containing:
      - *Top Navigation/Logo placeholders:* Absolute positioned top-left and top-right.
      - *Split Typography:* Two containers (Left and Right) that frame the center (building).
        - **Left Container:** Right-aligned text, `max-w-[40vw]`.
        - **Right Container:** Left-aligned text, `max-w-[40vw]`.
      - *CTA Placement:* Move the CTA below the left text or to a subtle bottom-left position.
    - **Mobile Fallback:** Use Tailwind classes to stack the typography centrally and disable the split/delay logic for smaller viewports.
  </action>
  <verify>Check visual layout on desktop. Confirm the building is centered and the text appears after 6 seconds, framing the tower without overlap.</verify>
</task>

<task type="auto">
  <name>Update GSAP Animation Engine</name>
  <files>
    - src/lib/animations/heroAnimation.ts
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Refactor `initHeroAnimations` to handle the new split typography:
      - **Left Entry:** Fade in + `x: -40 -> 0`.
      - **Right Entry:** Fade in + `x: 40 -> 0`.
      - **Duration:** 0.8s with `power3.out` easing.
    - Ensure the animation only triggers when `showText` becomes true.
  </action>
  <verify>Scroll through the page and check the initial reveal. The entrance should feel intentional and premium.</verify>
</task>

## Success Criteria
- [ ] Video fills 100% of the viewport with no intrusive overlays.
- [ ] Text reveal is delayed by 6 seconds on desktop.
- [ ] Typography is split across the building (Left: Right-aligned, Right: Left-aligned).
- [ ] Logos are placed at top-left and top-right corners.
- [ ] Mobile experience is a simplified stacked layout with immediate reveal.
- [ ] Animation is smooth and uses the specified GSAP easing/translation.
