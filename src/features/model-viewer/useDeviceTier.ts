'use client';

/* eslint-disable no-restricted-globals */
/**
 * Feature detection has to touch the browser directly: it creates a throwaway
 * WebGL context and reads navigator hints. Every access is inside an effect or
 * guarded, so nothing here runs during server rendering.
 */

import { useEffect, useState } from 'react';
import { MODEL_URLS } from './config';

export type DeviceTier = 'unknown' | 'full' | 'light' | 'unsupported';

interface DeviceReport {
  tier: DeviceTier;
  modelUrl: string | null;
  /** True once the check has run, so the caller can avoid a flash of fallback. */
  ready: boolean;
  reason: string;
}

/**
 * Detects whether WebGL is usable and how much the device can be trusted with.
 *
 * The decision matters: the full model holds roughly 180 MB of decompressed
 * texture data, which is enough to make mobile Safari silently reload the tab.
 * The light build halves that. When in doubt this picks the light build,
 * because a slightly softer texture is invisible next to a crashed page.
 */
function probe(): { tier: DeviceTier; reason: string } {
  if (typeof window === 'undefined') return { tier: 'unknown', reason: 'server' };

  // WebGL support. A failed context means no viewer at all.
  let gl: WebGLRenderingContext | null = null;
  let canvas: HTMLCanvasElement | null = null;
  try {
    canvas = document.createElement('canvas');
    gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl) return { tier: 'unsupported', reason: 'WebGL unavailable' };

  // Texture budget is the practical limit, not raw speed.
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

  // Release the probe context. Browsers cap simultaneous contexts, and the
  // viewer needs one of its own.
  const lose = gl.getExtension('WEBGL_lose_context');
  if (lose) lose.loseContext();
  canvas = null;

  if (maxTextureSize < 4096) {
    return { tier: 'light', reason: `max texture size ${maxTextureSize}` };
  }

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  // deviceMemory is Chromium only and reports in gigabytes, capped at 8.
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) {
    return { tier: 'light', reason: `device memory ${nav.deviceMemory} GB` };
  }

  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) {
    return { tier: 'light', reason: `${nav.hardwareConcurrency} cores` };
  }

  // Coarse pointer plus a narrow viewport is the most reliable phone signal
  // that does not depend on parsing a user agent string.
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = window.matchMedia?.('(max-width: 1024px)').matches ?? false;
  if (coarse && narrow) return { tier: 'light', reason: 'touch device' };

  // Saving data is an explicit request to send less.
  const conn = (window.navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return { tier: 'light', reason: 'data saver enabled' };

  return { tier: 'full', reason: 'desktop class device' };
}

export function useDeviceTier(): DeviceReport {
  const [state, setState] = useState<{ tier: DeviceTier; reason: string }>({
    tier: 'unknown',
    reason: 'pending',
  });

  useEffect(() => {
    setState(probe());
  }, []);

  const modelUrl =
    state.tier === 'full'
      ? MODEL_URLS.full
      : state.tier === 'light'
        ? MODEL_URLS.light
        : null;

  return {
    tier: state.tier,
    modelUrl,
    ready: state.tier !== 'unknown',
    reason: state.reason,
  };
}

/** Respects the operating system reduced motion setting. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
