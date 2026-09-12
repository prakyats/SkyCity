# STATE.md

> **Project**: Sky City Real Estate
> **Current Focus**: Phase 12 - Interactive 360 Model Viewer

## Current Position
- **Phase**: 12
- **Task**: Interactive 360 Model Viewer
- **Status**: Complete, pending review of hotspot placement and framing

## Last Session Summary
Added an interactive 3D viewer at /explore, built on three.js driven directly
rather than through a React renderer. The raw 45.7 MB SketchUp export was
optimised to 15.7 MB for desktop and 12.0 MB for phones, both Draco compressed
and served from public/models with a self hosted decoder. The viewer supports
full 360 orbit, zoom, pan, six camera presets, auto rotation, day and dusk
lighting, hotspot labels and fullscreen. It renders on demand, so a still model
costs nothing, and holds 60fps on integrated graphics.

The homepage is untouched. The only shared files changed are LayoutClient,
where the preloader and floor rail are now scoped to "/", and next.config.mjs,
where immutable cache headers were added for /models and /draco.

## Open Items
1. Hotspot positions are placeholders. Place them with /explore?place, which
   prints the coordinate under the cursor, then paste into HOTSPOTS in
   src/features/model-viewer/config.ts.
2. Default framing is automatic and approximate. Set FOCUS_OVERRIDE in the same
   file to pin a composition.
3. Per-building highlighting needs geometry named and grouped in SketchUp,
   then a re-export.
4. Pre-existing: the homepage has no <h1>, and three of the five tests in
   tests/homepage.spec.ts fail against the rebuilt homepage. Not caused by this
   phase and not fixed here.

## Next Steps
1. Review the viewer on real hardware and decide the default composition.
2. Reposition hotspots, or drop them if labels are not wanted.
3. Decide whether /explore should be linked from the Explore3D section, which
   currently points at an external experience.
