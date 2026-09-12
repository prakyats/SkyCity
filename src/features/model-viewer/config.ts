/**
 * Model viewer configuration.
 *
 * Every tunable value for the 360 viewer lives here so the scene code stays
 * about behaviour and this file stays about taste. Nothing in this feature
 * reads from the rest of the site, and nothing in the rest of the site reads
 * from here.
 */

/** A saved camera position, expressed in normalised terms. */
export interface CameraPreset {
  id: string;
  label: string;
  /** Compass bearing in degrees. 0 looks from the north, 90 from the east. */
  azimuth: number;
  /** Angle above the horizon in degrees. 0 is eye level, 90 is straight down. */
  elevation: number;
  /**
   * Distance as a multiple of the fitting distance, the range at which the
   * framed subject exactly fills the frame. 1.0 fits it, lower moves in,
   * higher pulls back. Screen shape is accounted for, so the same number
   * composes the same way on a desktop window and an upright phone.
   */
  distance: number;
  /**
   * Vertical offset of the orbit target as a fraction of model height.
   * 0 is the vertical centre, negative looks toward the ground.
   */
  targetHeight?: number;
}

/**
 * How a label finds its place on the model.
 *
 * `crown` sits on the tower, at a fraction of its height. `material` sits at
 * the average position of every surface painted with a matching material,
 * which is how the pool and the water features can be found by name even
 * though no mesh is named. `fixed` is a literal position, normalised to the
 * framed box, for anything placed by hand with the placement tool.
 */
export type HotspotAnchor =
  | { kind: 'crown'; heightFraction?: number }
  | { kind: 'material'; match: string }
  | { kind: 'fixed'; position: [number, number, number] };

/** A labelled point of interest. */
export interface Hotspot {
  id: string;
  label: string;
  detail?: string;
  anchor: HotspotAnchor;
}

export interface LightingMode {
  id: string;
  label: string;
  /** Background colour behind the model. */
  background: string;
  /** Ground plane colour. */
  ground: string;
  /** Image based lighting intensity. */
  envIntensity: number;
  /** Key light colour and intensity. */
  keyColor: string;
  keyIntensity: number;
  /** Fill light from the opposite side. */
  fillColor: string;
  fillIntensity: number;
  /** Exposure applied by the renderer. */
  exposure: number;
}

/** Where the optimised assets live, relative to the site root. */
export const MODEL_URLS = {
  /** 15.7 MB, textures up to 1024px. */
  full: '/models/yamuna-sky-city.glb',
  /** 12.0 MB, textures capped at 512px, for phones and low memory devices. */
  light: '/models/yamuna-sky-city-mobile.glb',
} as const;

/** Self hosted Draco decoder. Avoids a third party CDN request. */
export const DRACO_DECODER_PATH = '/draco/';

/**
 * Add this query parameter to the viewer URL to enable hotspot placement.
 * Clicking the model then logs a ready to paste coordinate triple.
 */
export const PLACEMENT_QUERY_PARAM = 'place';

/**
 * Whether to log how the viewer decided to frame the model and place its
 * labels. Useful when a re-export lands somewhere unexpected and the default
 * view looks wrong. Read at call time rather than at import, so this module
 * stays free of browser access.
 */
export function debugFraming(search: string) {
  return new URLSearchParams(search).has('framing');
}

/** Orbit limits. Keeping the camera above the horizon stops it going underground. */
export const ORBIT = {
  /** Closest approach, as a multiple of bounding sphere radius. */
  minDistance: 0.18,
  /** Furthest retreat, as a multiple of bounding sphere radius. */
  maxDistance: 4.2,
  /** Highest angle, 0 is straight down from above. */
  minPolarAngle: 0.12,
  /**
   * Lowest angle. Stopping just short of 90 degrees keeps the camera above
   * ground level, so the model never appears to float.
   */
  maxPolarAngle: Math.PI / 2 - 0.045,
  dampingFactor: 0.075,
  rotateSpeed: 0.65,
  zoomSpeed: 0.8,
  panSpeed: 0.7,
  autoRotateSpeed: 0.35,
  /** Seconds of stillness before auto rotation resumes after interaction. */
  idleBeforeAutoRotate: 4,
} as const;

/**
 * Manual framing override, in the model's own coordinates.
 *
 * Leave null to let the viewer choose a frame automatically. Set it to pin the
 * composition exactly: the box you give becomes what the camera orbits and
 * frames. Read coordinates off the model with the placement tool, which prints
 * the point under the cursor.
 */
export const FOCUS_OVERRIDE: { min: [number, number, number]; max: [number, number, number] } | null = null;

/** Seconds a preset camera flight takes. */
export const FLIGHT_DURATION = 1.5;

export const CAMERA = {
  fov: 38,
  /** Near and far planes are derived from model radius by these multiples. */
  nearFactor: 0.002,
  farFactor: 12,
} as const;

/**
 * Named so it can be used as a guaranteed fallback. Looking a preset up by id
 * can miss; this one always exists.
 */
export const OVERVIEW_PRESET: CameraPreset = {
  id: 'overview',
  label: 'Overview',
  azimuth: 38,
  elevation: 26,
  distance: 1.0,
};

export const CAMERA_PRESETS: CameraPreset[] = [
  OVERVIEW_PRESET,
  { id: 'aerial', label: 'Aerial', azimuth: 20, elevation: 62, distance: 0.95 },
  { id: 'approach', label: 'Approach', azimuth: 140, elevation: 9, distance: 0.78, targetHeight: -0.3 },
  { id: 'east', label: 'East face', azimuth: 90, elevation: 16, distance: 0.92 },
  { id: 'west', label: 'West face', azimuth: 270, elevation: 16, distance: 0.92 },
  { id: 'skyline', label: 'Skyline', azimuth: 215, elevation: 5, distance: 1.15, targetHeight: 0.05 },
];

export const DEFAULT_PRESET_ID = OVERVIEW_PRESET.id;

/**
 * Labelled points on the model.
 *
 * These are anchored to geometry rather than to guessed coordinates, because
 * the SketchUp export has no named meshes to attach them to. The tower label
 * rides the highest solid point in the model, and the amenity label sits on
 * the average position of the pool water material. Both therefore stay correct
 * if the model is re-exported at a different scale or origin.
 *
 * To add more, open the viewer with ?place, click the model, and paste the
 * printed coordinate as a `fixed` anchor.
 */
export const HOTSPOTS: Hotspot[] = [
  {
    id: 'tower',
    label: 'Sky City Tower',
    detail: 'GF+60 floors, every apartment sea facing',
    anchor: { kind: 'crown', heightFraction: 0.92 },
  },
  {
    id: 'amenities',
    label: 'Amenity Deck',
    detail: 'Pool and clubhouse at podium level',
    anchor: { kind: 'material', match: 'water pool' },
  },
];

export const DAY_LIGHTING: LightingMode = {
  id: 'day',
  label: 'Day',
  // The model is largely white render clay. A near-white sky washed it out
  // completely, so the background sits a few steps darker than the building.
  background: '#c8cdd2',
  ground: '#b2ada4',
  envIntensity: 0.55,
  keyColor: '#fff4e2',
  keyIntensity: 1.45,
  fillColor: '#b9cfe8',
  fillIntensity: 0.45,
  exposure: 0.78,
};

export const LIGHTING_MODES: LightingMode[] = [
  DAY_LIGHTING,
  {
    id: 'dusk',
    label: 'Dusk',
    background: '#22242c',
    ground: '#1b1d24',
    envIntensity: 0.3,
    keyColor: '#ffb578',
    keyIntensity: 1.5,
    fillColor: '#5c6d9e',
    fillIntensity: 0.7,
    exposure: 0.9,
  },
];

export const DEFAULT_LIGHTING_ID = 'day';

/**
 * Device pixel ratio ceiling.
 *
 * Retina phones report 3, which would quadruple the pixels shaded for no
 * visible gain on a model this dense. Two is the practical ceiling.
 */
export const DPR_RANGE: [number, number] = [1, 1.8];
