#!/usr/bin/env node
/**
 * Turns the raw SketchUp export into the two files the viewer ships.
 *
 * Run this whenever the model is re-exported. It is the only record of how
 * the files in public/models were produced, and the numbers in the comments
 * below are the ones measured on the 2608-v1 export.
 *
 *   node scripts/optimise-model.mjs "../3d Asset/Yamuna_Sky_City_2608-v1.glb"
 *
 * What it does and why:
 *
 *   dedup      Merges identical accessors, textures and materials.
 *   prune      Drops anything nothing references.
 *   simplify   Collapses triangles. This export resists it: SketchUp gives
 *              every face its own normals, so almost no vertices are bitwise
 *              identical and the edge collapser has little to work with.
 *              2.33M triangles come down to about 1.63M and no further.
 *              That is fine. On real hardware 1.6M static triangles render at
 *              60fps; the constraint here is download size, not draw time.
 *   resize     Caps texture dimensions. This is the setting that matters most
 *              on phones: it governs how much memory the GPU needs for
 *              textures, which is what makes mobile Safari reload a tab.
 *              1024px costs roughly 180 MB, 512px roughly 90 MB.
 *   webp       Recompresses textures.
 *   draco      Compresses geometry. Draco rather than meshopt, by measurement:
 *              on this geometry meshopt produced 39.8 MB and Draco 15.7 MB.
 *              Draco decodes more slowly, which is why the decoder is self
 *              hosted in public/draco rather than fetched from a CDN.
 *
 * Result, from a 45.7 MB source:
 *   yamuna-sky-city.glb          15.7 MB, textures to 1024px
 *   yamuna-sky-city-mobile.glb   12.0 MB, textures to 512px
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const outDir = path.join(root, 'public', 'models');
const work = path.join(root, '.model-build');

const source = process.argv[2];
if (!source) {
  console.error('Usage: node scripts/optimise-model.mjs <path-to-source.glb>');
  process.exit(1);
}

const variants = [
  { name: 'yamuna-sky-city.glb', texture: 1024, quality: 78 },
  { name: 'yamuna-sky-city-mobile.glb', texture: 512, quality: 72 },
];

const megabytes = (file) => (statSync(file).size / 1048576).toFixed(2);

function gltf(...args) {
  execFileSync('npx', ['--yes', '@gltf-transform/cli', ...args], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

mkdirSync(outDir, { recursive: true });
mkdirSync(work, { recursive: true });

const step = (n) => path.join(work, `step-${n}.glb`);

console.log(`\nSource: ${source} (${megabytes(source)} MB)\n`);

gltf('dedup', source, step(1));
gltf('prune', step(1), step(2));
gltf('simplify', step(2), step(3), '--ratio', '0.5', '--error', '0.005');

for (const variant of variants) {
  console.log(`\n--- ${variant.name} ---`);
  const resized = path.join(work, `resize-${variant.texture}.glb`);
  const recompressed = path.join(work, `webp-${variant.texture}.glb`);
  const output = path.join(outDir, variant.name);

  gltf('resize', step(3), resized, '--width', String(variant.texture), '--height', String(variant.texture));
  gltf('webp', resized, recompressed, '--quality', String(variant.quality));
  gltf('draco', recompressed, output);

  console.log(`${variant.name}: ${megabytes(output)} MB`);
}

rmSync(work, { recursive: true, force: true });

console.log(`
Done. Both files are in public/models.

If you change a filename here, update MODEL_URLS in
src/features/model-viewer/config.ts to match. Those files are served with a
one year immutable cache, so publish a changed model under a new filename
rather than overwriting an existing one.
`);
