---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Production-Grade Video Delivery Pipeline

## Objective
Transform the Hero video system into a production-ready CDN pipeline. Compress the local 175MB video into optimized WebM/MP4 formats, extract a highly optimized poster, and refactor the component architecture with a bulletproof hybrid intent-loading strategy and buffer-safe crossfades to eliminate all unpredictability.

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
  <name>Hybrid Intent-Based Loading & Buffer-Safe Crossfade</name>
  <files>
    - src/components/ui/VideoBackground.tsx
  </files>
  <action>
    - **Hybrid Loading Strategy:** Implement a dual-trigger for the `isLoaded` state.
      - Try `requestIdleCallback` to load when idle.
      - Run a parallel `setTimeout(..., 1200)` to force load after 1200ms if idle never fires (ensures reliability across strained devices/browsers).
    - **Video Attributes:** Enforce `<video>` has `muted`, `playsInline`, `loop`, `preload="metadata"`, and `disablePictureInPicture`.
    - **Buffer-Safe Crossfade:**
      - Default video to `opacity-0` and poster to `opacity-100`.
      - Listen to `onLoadedData` (or `onCanPlayThrough`) instead of `onCanPlay` to ensure sufficient buffer exists before playback.
      - Upon the event firing, wait an additional `~100ms` via `setTimeout` before executing the crossfade.
      - Transition video to `opacity-100` and poster to `opacity-0` over `600ms`.
    - **Performance Guard:** Apply `will-change: opacity, transform` to both elements. Ensure no unnecessary state updates trigger re-renders.
  </action>
  <verify>Check dev server on various network throttles. Video must strictly load either on idle or hard 1200ms limit. Crossfade must only occur after buffer clears, feeling silky smooth without dropped frames.</verify>
</task>

## Success Criteria
- [ ] Poster compressed to ≤ 250KB and served via CDN.
- [ ] Dual-trigger loading logic deployed (`requestIdleCallback` + 1200ms fallback).
- [ ] `<link rel="preconnect">` added to document head.
- [ ] Ready signal uses `onLoadedData` / `onCanPlayThrough` for buffer safety.
- [ ] `100ms` perceived smoothness delay applied to fade logic.
- [ ] Smooth `opacity` crossfade implemented with no flicker.
