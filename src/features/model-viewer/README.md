# 360 model viewer

An interactive 3D view of the masterplan, served at `/explore`.

Everything the viewer needs lives in this directory plus `public/models` and
`public/draco`. Nothing outside reads from it, and it reads nothing from the
rest of the site except CSS custom properties, each with a literal fallback.

## Files

| File | Role |
|---|---|
| `config.ts` | Every tunable value: presets, hotspots, lighting, limits |
| `engine.ts` | three.js renderer, camera, controls, loading. No React |
| `ModelViewer.tsx` | The React component and control chrome |
| `ModelViewerMount.tsx` | Dynamic import boundary, keeps the renderer off other pages |
| `useDeviceTier.ts` | Picks the desktop or mobile model, detects WebGL |
| `viewer.module.css` | Scoped styles |

## Why three.js directly

React Three Fiber would be less code, but Next 16's App Router runs its own
bundled React 19 while this project declares React 18. Fiber v8 reads
`ReactCurrentBatchConfig`, which React 19 removed, and the page dies at import.
Fiber v9 targets React 19 and would drag a React types upgrade across the whole
project. Driving three.js directly costs about two hundred lines and removes
the coupling entirely. Dependencies are `three` and `gsap`, and gsap was
already here.

## Rendering on demand

The canvas does not draw every frame. Anything that moves the camera asks for
a frame, and the loop stops as soon as nothing is moving. A model sitting still
costs nothing, which matters on a phone.

## Common changes

**Move or add a label.** Labels are anchored to geometry, not to typed-in
coordinates. `crown` rides the highest solid point, which is the top of the
tower. `material` sits at the base of everything painted with a matching
material, which is how the pool is found without any mesh being named. `fixed`
takes a literal position: open `/explore?place`, click the model, and paste the
printed coordinate. All three live in `HOTSPOTS` in `config.ts`.

**Pin the framing.** The viewer frames the tower automatically and that is
usually right. Set `FOCUS_OVERRIDE` in `config.ts` to fix a composition
exactly. Add `?framing` to the URL to log how the current frame was chosen and
where each label landed.

**Add a camera preset.** Add an entry to `CAMERA_PRESETS`. Angles are a compass
bearing and a height above the horizon. Distance is a multiple of the fitting
distance, where 1.0 means the subject exactly fills the frame; screen shape and
viewing angle are both accounted for, so one number composes the same way on a
desktop window and an upright phone.

**Re-export the model.** Run `node scripts/optimise-model.mjs <path-to.glb>`.
Publish under a new filename rather than overwriting: these files are served
with a one year immutable cache.

## What the export makes hard

Three things in this model defeat the obvious approaches, and the framing code
is shaped around all three.

Geometry is grouped by material rather than by building, so a single mesh can
hold every pane of glass on the site and its bounding box covers everything.

Trees and figures were merged into a handful of alpha-cutout meshes whose boxes
also span the whole site. Framing ignores anything drawn with a cutout
material for exactly this reason.

Part of the model is drawn with GPU instancing, where the stored vertices are
one template placed many times by a separate transform. Reading those vertices
directly reports coordinates nowhere near where the object appears, so the
analysis works from per-mesh bounding boxes, which apply the instance
transforms, rather than from raw vertex positions.

What none of this can give you is selecting or highlighting an individual
building. Nothing in the file identifies which triangles belong to which tower.
That needs the parts grouped and named in SketchUp and a re-export.

## Testing

```
npx next build
npx playwright test --project=webgl
```

Headless Chromium defaults to SwiftShader, a software renderer that draws this
model at about four frames a second, slow enough that clicks time out. The
`webgl` project passes flags that hand the browser the real GPU. The tests
compare rendered pixels, not just the DOM, because a viewer can pass every DOM
assertion while showing an empty rectangle.
