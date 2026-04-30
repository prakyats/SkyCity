---
phase: 6
plan: 2
wave: 1
---

# Plan 6.2: 3-Phase Cinematic Narrative & Content Refinement

## Objective
Transform the Hero section into a 3-phase cinematic narrative with strict content discipline. This involves staged reveals to control the viewer's attention flow: Branding (Phase 1) → Identity (Phase 2) → Detail/Action (Phase 3).

## Context
- src/components/sections/Hero.tsx
- src/components/ui/VideoBackground.tsx

## Tasks

<task type="auto">
  <name>Implement Staged Narrative Timing</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Narrative Phases State:**
      - `const [narrativePhase, setNarrativePhase] = useState(1);`
    - **Staged Reveal Logic (triggered by playback):**
      - **Phase 1 (0-6s):** Mount state. Only top-left branding visible.
      - **Phase 2 (6s mark):** Set `narrativePhase = 2`. Reveal split headline: "Yamuna" (Left) | "Sky City" (Right).
      - **Phase 3 (9s mark):** Set `narrativePhase = 3`. Reveal micro-tag, support text, and CTA.
    - **Fail-Safe Fallback:** Maintain the 2000ms immediate reveal if video fails to play. On mobile, jump straight to Phase 3.
  </action>
  <verify>Ensure `Hero.tsx` correctly transitions through all 3 phases based on the video playback handshake.</verify>
</task>

<task type="auto">
  <name>Refactor Editorial Composition with Phase-Aware Layering</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - **Phase 1 Content:** Render only "YAMUNA SKY CITY" in the top-left branding layer.
    - **Phase 2 Content:** Conditionally render the main split headings:
      - Left Block: "Yamuna" (Right-aligned).
      - Right Block: "Sky City" (Left-aligned, Italic).
    - **Phase 3 Content:** Conditionally render the supporting details:
      - Micro Tag: "A New Landmark in South India" (floating above).
      - Support Text: "South India’s Tallest Sea View Residential Tower" (below Right Block).
      - CTA: "Explore More" (below Left Block).
    - **Optical Integrity:** Maintain the 30% center protection zone and clamp-based margins throughout all phases.
  </action>
  <verify>Check visual balance across all phases. Confirm the building remains the visual anchor as text stages in.</verify>
</task>

<task type="auto">
  <name>Synchronize Scoped Entrance Animations</name>
  <files>
    - src/components/sections/Hero.tsx
  </files>
  <action>
    - Refactor GSAP logic to trigger animations based on `narrativePhase` transitions:
      - **Phase 2 Entrance:** Fade in + `x` translation for main headings.
      - **Phase 3 Entrance:** Fade in + `y` translation for Micro Tag, Support Text, and CTA.
    - Ensure `gsap.context()` handles cleanup and prevents duplicate execution if phases re-trigger.
  </action>
  <verify>Confirm smooth, staggered reveals at the 6s and 9s marks.</verify>
</task>

## Success Criteria
- [ ] 3-Phase narrative implemented (0-6s: Branding only, 6s: Headlines, 9s: Details).
- [ ] Content strictly follows the new hierarchy (Yamuna | Sky City).
- [ ] No more than 3 visible text groups per phase.
- [ ] 30% center zone strictly clear across all stages.
- [ ] GSAP reveals are smooth and tied to narrative phase state.
- [ ] Mobile fallback forces Phase 3 immediately.
