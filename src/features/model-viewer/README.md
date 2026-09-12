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

**Move the hotspots.** Open `/explore?place` and click the model. The point
under the cursor is printed on screen and to the console, normalised to the
model's bounding box. Paste it into `HOTSPOTS` in `config.ts`.

**Pin the framing.** Automatic framing is a heuristic and it is approximate:
the exporter grouped geometry by material rather than by building, and the
scene holds tall, wide, paper-thin planes, both of which pull the framing box
wider than the towers. Set `FOCUS_OVERRIDE` in `config.ts` to fix a
composition exactly.

**Add a camera preset.** Add an entry to `CAMERA_PRESETS`. Angles are a compass
bearing and a height above the horizon; distance is a multiple of the framed
radius, adjusted automatically for the shape of the screen.

**Re-export the model.** Run `node scripts/optimise-model.mjs <path-to.glb>`.
Publish under a new filename rather than overwriting: these files are served
with a one year immutable cache.

## What it cannot do

Select or highlight an individual building. The export has no named geometry,
only labels like `3DGeom-1176`, and meshes are grouped by material, so nothing
identifies which triangles belong to which tower. That needs the parts grouped
and named in SketchUp and a re-export.

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
