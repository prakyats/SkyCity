'use client';

/* eslint-disable no-restricted-globals */
/**
 * Reads the fullscreen state and the placement query parameter directly. Both
 * happen inside effects, after mount, so server rendering never sees them.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ViewerEngine } from './engine';
import { useDeviceTier, usePrefersReducedMotion } from './useDeviceTier';
import {
  CAMERA_PRESETS,
  DAY_LIGHTING,
  DEFAULT_LIGHTING_ID,
  DEFAULT_PRESET_ID,
  HOTSPOTS,
  LIGHTING_MODES,
  OVERVIEW_PRESET,
  PLACEMENT_QUERY_PARAM,
} from './config';
import styles from './viewer.module.css';

interface ModelViewerProps {
  eyebrow?: string;
  title?: string;
}

export function ModelViewer({
  eyebrow = 'Yamuna Sky City',
  title = 'Explore the masterplan in three dimensions',
}: ModelViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ViewerEngine | null>(null);
  const hotspotRefs = useRef<Map<string, HTMLElement>>(new Map());

  const { tier, modelUrl, ready } = useDeviceTier();
  const reducedMotion = usePrefersReducedMotion();

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presetId, setPresetId] = useState(DEFAULT_PRESET_ID);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingId, setLightingId] = useState(DEFAULT_LIGHTING_ID);
  const [hotspotsVisible, setHotspotsVisible] = useState(true);
  const [openHotspotId, setOpenHotspotId] = useState<string | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [placementMode, setPlacementMode] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  /** Labels whose anchor the engine managed to find on the model. */
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const preset = useMemo(
    () => CAMERA_PRESETS.find((item) => item.id === presetId) ?? OVERVIEW_PRESET,
    [presetId],
  );
  const lighting = useMemo(
    () => LIGHTING_MODES.find((item) => item.id === lightingId) ?? DAY_LIGHTING,
    [lightingId],
  );

  // The placement tool is a build time aid, switched on only by an explicit
  // query parameter. It never ships enabled.
  useEffect(() => {
    setPlacementMode(new URLSearchParams(window.location.search).has(PLACEMENT_QUERY_PARAM));
  }, []);

  // Create the engine once the device check has chosen a model.
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || !modelUrl) return;

    let engine: ViewerEngine;
    try {
      engine = new ViewerEngine(host, {
        onProgress: setProgress,
        onLoaded: () => {
          setProgress(100);
          setLoaded(true);
        },
        onError: (message) => setError(message),
        onUserInteract: () => setInteracted(true),
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start the 3D viewer');
      return;
    }

    engineRef.current = engine;
    engine.setLighting(DAY_LIGHTING);
    engine.load(modelUrl);

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [modelUrl]);

  // Frame the model as soon as it is in the scene, without animating into
  // position from an arbitrary starting point.
  useEffect(() => {
    if (!loaded) return;
    engineRef.current?.flyTo(preset, true);
    // Only on first load; later preset changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const isFirstPresetRun = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstPresetRun.current) {
      isFirstPresetRun.current = false;
      return;
    }
    engineRef.current?.flyTo(preset);
  }, [preset, loaded]);

  useEffect(() => {
    engineRef.current?.setLighting(lighting);
  }, [lighting]);

  useEffect(() => {
    engineRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate, loaded]);

  useEffect(() => {
    engineRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  // Hand the engine the marker elements so it can position them each frame.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !loaded) return;

    if (!hotspotsVisible) {
      engine.setHotspots([]);
      return;
    }

    const entries = HOTSPOTS.flatMap((hotspot) => {
      const element = hotspotRefs.current.get(hotspot.id);
      return element ? [{ hotspot, element }] : [];
    });
    engine.setHotspots(entries);
    // A label whose anchor the engine could not find stays in the DOM so its
    // ref survives, but is hidden outright rather than left as an invisible
    // button a screen reader would still announce.
    setResolvedIds(engine.resolvedHotspotIds);
  }, [loaded, hotspotsVisible]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = rootRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      // Fullscreen can be refused by permissions policy; the viewer keeps
      // working inline, so the rejection is not worth surfacing.
      void node.requestFullscreen?.().catch(() => undefined);
    }
  }, []);

  const selectPreset = useCallback((id: string) => {
    setPresetId(id);
    setOpenHotspotId(null);
  }, []);

  const handlePlacementClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!placementMode) return;
      const point = engineRef.current?.pickNormalised(event.clientX, event.clientY);
      if (!point) return;
      const text = `[${point.join(', ')}]`;
      setPlaced(text);
      // eslint-disable-next-line no-console
      console.log('[model-viewer] hotspot position', text);
    },
    [placementMode],
  );

  if (ready && tier === 'unsupported') {
    return (
      <div className={styles.root}>
        <div className={styles.status}>
          <p className={styles.statusLabel}>3D unavailable</p>
          <p className={styles.statusMessage}>
            This browser does not support WebGL, which the interactive model needs.
            Try a current version of Chrome, Edge, Safari or Firefox, and check that
            hardware acceleration is switched on.
          </p>
        </div>
      </div>
    );
  }

  return (
    // data-lenis-prevent stops the site's smooth scroll from stealing the wheel
    // events the viewer needs for zoom. It is the same opt out the Amenities
    // section already uses, so no shared code has to change.
    <div className={styles.root} ref={rootRef} data-lenis-prevent>
      <div
        className={styles.canvasHost}
        ref={canvasHostRef}
        onClick={handlePlacementClick}
      />

      {/* Hotspot markers. The engine moves these; React only decides what is
          inside them and which one is open. */}
      {hotspotsVisible && loaded ? (
        <div className={styles.hotspotLayer}>
          {HOTSPOTS.map((hotspot) => {
            const open = openHotspotId === hotspot.id;
            // Before the first resolution pass nothing is placed yet, so the
            // markers render and stay hidden until the engine positions them.
            const placedOnModel = resolvedIds.includes(hotspot.id);
            return (
              <div
                key={hotspot.id}
                className={styles.hotspot}
                data-open={open || undefined}
                hidden={!placedOnModel}
                ref={(node) => {
                  if (node) hotspotRefs.current.set(hotspot.id, node);
                  else hotspotRefs.current.delete(hotspot.id);
                }}
              >
                <button
                  type="button"
                  className={styles.hotspotDot}
                  // Holding the model still while the pointer is on a marker
                  // stops it drifting out from under the cursor mid-aim.
                  onPointerEnter={() => engineRef.current?.setHoverPause(true)}
                  onPointerLeave={() => engineRef.current?.setHoverPause(false)}
                  aria-expanded={open}
                  aria-label={
                    open
                      ? `Hide details for ${hotspot.label}`
                      : `Show details for ${hotspot.label}`
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenHotspotId((current) =>
                      current === hotspot.id ? null : hotspot.id,
                    );
                  }}
                >
                  <span aria-hidden="true" className={styles.hotspotPulse} />
                </button>

                <div className={styles.hotspotCard} hidden={!open}>
                  <p className={styles.hotspotTitle}>{hotspot.label}</p>
                  {hotspot.detail ? (
                    <p className={styles.hotspotDetail}>{hotspot.detail}</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── Loading and failure ─────────────────────────────────────────── */}
      {error ? (
        <div className={styles.status}>
          <p className={styles.statusLabel}>Model unavailable</p>
          <p className={styles.statusMessage}>
            The 3D model could not be loaded. Refresh the page to try again.
          </p>
        </div>
      ) : (
        <div
          className={`${styles.status} ${loaded ? styles.statusFading : ''}`}
          aria-hidden={loaded}
        >
          <p className={styles.statusLabel}>Loading the model</p>
          <div className={styles.progressTrack}>
            <span
              className={styles.progressFill}
              style={{ transform: `scaleX(${Math.max(0.02, progress / 100)})` }}
            />
          </div>
          <p className={styles.progressValue}>{Math.round(progress)}%</p>
        </div>
      )}

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className={styles.overlay}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 className={styles.title}>{title}</h1>
          </div>

          <div className={`${styles.cluster} ${styles.clusterVertical}`}>
            <button
              type="button"
              className={styles.button}
              aria-pressed={autoRotate}
              onClick={() => setAutoRotate((value) => !value)}
            >
              <span className={styles.buttonDot} aria-hidden="true" />
              {autoRotate ? 'Rotating' : 'Rotate'}
            </button>

            <button
              type="button"
              className={styles.button}
              onClick={() =>
                setLightingId((current) => (current === 'day' ? 'dusk' : 'day'))
              }
            >
              {lighting.label}
            </button>

            <button
              type="button"
              className={styles.button}
              aria-pressed={hotspotsVisible}
              onClick={() => {
                setHotspotsVisible((value) => !value);
                setOpenHotspotId(null);
              }}
            >
              {hotspotsVisible ? 'Hide labels' : 'Show labels'}
            </button>

            <button type="button" className={styles.button} onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.presetRail} role="group" aria-label="Camera views">
            {CAMERA_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.button} ${styles.presetButton}`}
                data-active={item.id === presetId || undefined}
                aria-pressed={item.id === presetId}
                onClick={() => selectPreset(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className={`${styles.hint} ${interacted ? styles.hintHidden : ''}`}>
            Drag to orbit, scroll to zoom, right drag to pan
          </p>
        </div>
      </div>

      {placementMode && placed ? (
        <div className={styles.placement}>position: {placed}</div>
      ) : null}
    </div>
  );
}

export default ModelViewer;
