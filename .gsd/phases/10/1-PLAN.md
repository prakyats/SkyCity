---
phase: 10
plan: 1
wave: 1
---

# Plan 10.1: Contact System & Comprehensive Footer

## Objective
Implement a professional lead-generation system and a comprehensive footer to anchor the application and drive user engagement.

## Context
- src/components/sections/Contact.tsx
- src/components/layout/Footer.tsx
- src/components/ui/FloatingCTAs.tsx
- src/app/page.tsx
- Inspired by `yamuna_sky_city_vitu_refined.html` (Sections `#contact`, `footer`, and `.float-ctas`)

## Tasks

<task type="auto">
  <name>Create Contact Section</name>
  <files>
    - [NEW] src/components/sections/Contact.tsx
  </files>
  <action>
    - Build a high-impact split layout: Contact details (left) vs Minimalist Lead Form (right).
    - Form fields: Name, Email, Mobile, Message (all refined with modern border-focus states).
    - Styling: Deep navy background to match the site's cinematic anchor points.
  </action>
  <verify>Check form layout and responsiveness of the split grid.</verify>
</task>

<task type="auto">
  <name>Create Comprehensive Footer</name>
  <files>
    - [NEW] src/components/layout/Footer.tsx
  </files>
  <action>
    - Implement a 4-column footer: Brand/About, Location, Get in Touch, and Quick Links.
    - Include RERA registration details and copyright information.
    - Style with subtle white/gold accents and serif branding.
  </action>
  <verify>Check footer links and typography scaling.</verify>
</task>

<task type="auto">
  <name>Implement Floating CTAs</name>
  <files>
    - [NEW] src/components/ui/FloatingCTAs.tsx
  </files>
  <action>
    - Add WhatsApp and Call floating buttons that appear after a 45% scroll threshold.
    - Animate entry with GSAP for a smooth reveal.
  </action>
  <verify>Confirm the scroll-trigger logic for CTA visibility.</verify>
</task>

<task type="auto">
  <name>Final Integration & Assembly</name>
  <files>
    - [MODIFY] src/app/page.tsx
    - [MODIFY] src/app/layout.tsx
  </files>
  <action>
    - Place `<Contact />` as the final section in `page.tsx`.
    - Place `<Footer />` and `<FloatingCTAs />` globally in `layout.tsx`.
  </action>
  <verify>Ensure the entire landing page flows seamlessly from Hero to Footer.</verify>
</task>

## Success Criteria
- [ ] Lead generation form is intuitive and visually integrated.
- [ ] Footer provides a solid, professional base for the site.
- [ ] Floating CTAs are helpful but non-intrusive.
- [ ] All final links and technical details (RERA) are correct.
