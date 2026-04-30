---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Production-Grade Video Delivery Pipeline

## Objective
Transform the Hero video system into a production-ready CDN pipeline. Compress the local 175MB video into optimized WebM/MP4 formats, extract a high-quality poster, and refactor the component architecture for a deferred, poster-first loading strategy to ensure instant LCP and zero layout shift.

## Context
- .gsd/SPEC.md
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx

## Tasks

<task type="manual">
  <name>Media Optimization Pipeline (FFmpeg)</name>
  <files>
    - public/videos/hero/hero-desktop.mp4
  </files>
  <action>
    - **Extract Poster:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -ss 00:00:01.000 -vframes 1 public/images/hero/hero-poster.jpg`
    - **Generate WebM:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -c:v libvpx-vp9 -b:v 0 -crf 32 -an public/videos/hero/hero.webm`
    - **Generate MP4:** Run `ffmpeg -i public/videos/hero/hero-desktop.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 -movflags +faststart -an public/videos/hero/hero.mp4`
    - **Cleanup:** Delete the raw 175MB `hero-desktop.mp4` and `hero-mobile.mp4` (if any) from `/public`.
  </action>
  <verify>Check file sizes of generated assets. WebM should be ~3-5MB, MP4 ~4-6MB. The original 175MB file must be deleted.</verify>
</task>

<task type="manual">
  <name>CDN Upload</name>
  <files>
    - None
  </files>
  <action>
    - Upload `hero.webm`, `hero.mp4`, and `hero-poster.jpg` to Cloudflare R2 or equivalent CDN.
    - Note the public URLs for these assets. (e.g., `https://cdn.yoursite.com/hero.webm`).
  </action>
  <verify>Ensure URLs resolve publicly.</verify>
</task>

<task type="auto">
  <name>Refactor Video Component Architecture</name>
  <files>
    - src/components/ui/VideoBackground.tsx
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **VideoBackground.tsx:**
      - Remove `autoPlay` and synchronous video rendering.
      - Add `const [isLoaded, setIsLoaded] = useState(false)`.
      - Use `useEffect` with a `setTimeout` of 500ms to set `isLoaded(true)`.
      - Check `window.innerWidth` in the effect: if `< 768px`, do NOT load the video (stay on poster).
      - Always render an absolute `<img>` of the poster image (unoptimized `<img src="...">` for raw speed).
      - When `isLoaded` is true, render the `<video preload="metadata" muted playsInline loop>` overlaying the poster, with a subtle fade-in animation.
      - Use WebM first, then MP4 fallback in `<source>`.
    - **Hero.tsx:**
      - Update props passed to `VideoBackground` to use the CDN placeholder URLs: `desktopSrc="https://cdn.yoursite.com/hero.mp4"`, `webmSrc="https://cdn.yoursite.com/hero.webm"`, `posterSrc="https://cdn.yoursite.com/hero-poster.jpg"`.
  </action>
  <verify>Run the dev server. Confirm the network tab shows the video request delayed by 500ms, and the poster loading immediately. Ensure zero layout shift.</verify>
</task>

## Success Criteria
- [ ] 175MB video deleted from local repository.
- [ ] Optimized WebM and MP4 generated via FFmpeg.
- [ ] Component delays video load by 500ms, prioritizing poster.
- [ ] Mobile viewport strictly blocks video load.
- [ ] No layout shift occurs when the video hydrates.
