---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Production-Grade Video Delivery Pipeline

## Objective
Transform the Hero video system into a production-ready CDN pipeline. Compress the local 175MB video into optimized WebM/MP4 formats, extract and highly optimize a poster image, and refactor the component architecture for intent-based loading (via `requestIdleCallback`), eliminating arbitrary timing hacks and ensuring a seamless, premium crossfade transition.

## Context
- .gsd/SPEC.md
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx
- src/app/layout.tsx

## Tasks

<task type="manual">
  <name>Media Optimization Pipeline (FFmpeg)</name>
  <files>
    - public/videos/hero/hero-desktop.mp4
  </files>
  <action>
    - **Extract & Optimize Poster:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -ss 00:00:01.000 -vframes 1 -q:v 2 public/images/hero/hero-poster.jpg`. Verify size is ≤ 250KB.
    - **Generate WebM:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -c:v libvpx-vp9 -b:v 0 -crf 32 -an public/videos/hero/hero.webm`
    - **Generate MP4:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 -movflags +faststart -an public/videos/hero/hero.mp4`
    - **Cleanup:** Delete the raw 175MB video from `/public` to prevent it from bloating the build.
  </action>
  <verify>Check file sizes of generated assets. WebM ~3-5MB, MP4 ~4-6MB, Poster ≤ 250KB.</verify>
</task>

<task type="manual">
  <name>CDN Upload & Preconnect</name>
  <files>
    - src/app/layout.tsx
  </files>
  <action>
    - Upload optimized assets to Cloudflare R2 (or chosen CDN).
    - In `src/app/layout.tsx`, add a preconnect link to the `<head>`: `<link rel="preconnect" href="https://cdn.yoursite.com" crossOrigin="anonymous" />`
  </action>
  <verify>Ensure URLs resolve publicly and preconnect is present in the document head.</verify>
</task>

<task type="auto">
  <name>Intent-Based Loading & Crossfade Architecture</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - **Remove Timing Hacks:** Replace the fixed 500ms `setTimeout` with `requestIdleCallback` (with a `setTimeout` fallback for Safari) to trigger the `isLoaded` state only when the main thread is idle.
    - **Video Attributes:** Ensure `<video>` has `muted`, `playsInline`, `loop`, `preload="metadata"`, and `disablePictureInPicture`.
    - **Seamless Crossfade:**
      - Render both `<img>` (poster) and `<video>` concurrently once `isLoaded` fires.
      - Add an `onCanPlay` event listener to the video to toggle a `canPlay` state.
      - Default video to `opacity-0` and poster to `opacity-100`.
      - When `canPlay` is true, transition video to `opacity-100` and poster to `opacity-0` over `600ms` (e.g., `transition-opacity duration-600 ease-in-out`).
    - **Performance Guard:** Apply `will-change: opacity, transform` to both elements. Ensure no unnecessary state updates trigger re-renders of the video element.
  </action>
  <verify>Check dev server. The poster should load instantly. The video should trigger download only when the browser is idle, and crossfade smoothly without any flash or layout shift.</verify>
</task>

## Success Criteria
- [ ] Poster compressed to ≤ 250KB and served via CDN.
- [ ] Arbitrary `setTimeout` replaced with `requestIdleCallback`.
- [ ] `<link rel="preconnect">` added to document head.
- [ ] Video features `disablePictureInPicture` and `preload="metadata"`.
- [ ] Smooth `opacity` crossfade implemented with no flicker.
- [ ] `will-change: opacity, transform` applied.
