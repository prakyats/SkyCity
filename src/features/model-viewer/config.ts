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
   * Distance from the model centre as a multiple of the bounding sphere
   * radius. 1.0 roughly frames the whole site, lower values move in.
   */
  distance: number;
  /**
   * Vertical offset of the orbit target as a fraction of model height.
   * 0 is the vertical centre, negative looks toward the ground.
   */
  targetHeight?: number;
}

/**
 * A labelled point of interest.
 *
 * Positions are normalised to the model bounding box so they survive any
 * future re-export at a different scale: -1 to 1 on each axis, where 0 is the
 * centre of the box. Use the placement tool (see PLACEMENT_QUERY_PARAM) to
 * read coordinates off the model instead of guessing them.
 */
export interface Hotspot {
  id: string;
  label: string;
  detail?: string;
  /** Normalised position within the model bounding box, each axis -1 to 1. */
  position: [number, number, number];
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
  distance: 0.82,
};

export const CAMERA_PRESETS: CameraPreset[] = [
  OVERVIEW_PRESET,
  { id: 'aerial', label: 'Aerial', azimuth: 20, elevation: 62, distance: 0.8 },
  { id: 'approach', label: 'Approach', azimuth: 140, elevation: 9, distance: 0.6, targetHeight: -0.25 },
  { id: 'east', label: 'East face', azimuth: 90, elevation: 16, distance: 0.68 },
  { id: 'west', label: 'West face', azimuth: 270, elevation: 16, distance: 0.68 },
  { id: 'skyline', label: 'Skyline', azimuth: 215, elevation: 5, distance: 0.95, targetHeight: 0.05 },
];

export const DEFAULT_PRESET_ID = OVERVIEW_PRESET.id;

/**
 * Placeholder hotspots.
 *
 * The source model came out of SketchUp with unnamed geometry, so there is no
 * reliable way to attach these to specific buildings automatically. They sit
 * at plausible spots across the site and are meant to be repositioned with the
 * placement tool once someone can see the model.
 */
export const HOTSPOTS: Hotspot[] = [
  { id: 'arrival', label: 'Arrival Plaza', detail: 'Main entrance and drop off', position: [-0.45, -0.32, 0.4] },
  { id: 'clubhouse', label: 'Clubhouse', detail: 'Amenity deck and pool', position: [0.05, -0.18, -0.05] },
  { id: 'towers', label: 'Residential Towers', detail: 'Sky City residences', position: [0.3, 0.45, -0.3] },
  { id: 'green', label: 'Central Green', detail: 'Landscaped open space', position: [-0.1, -0.34, -0.45] },
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
