/* eslint-disable no-restricted-globals, no-unused-vars */
/*
 * no-unused-vars is disabled for the same reason src/lib/browser.ts disables
 * it: the base rule cannot tell that the parameter names in a callback type
 * declaration are documentation rather than dead bindings.
 */
/**
 * The lint rule that bans scattered `window` and `document` access exists to
 * keep server rendering safe. This file is the exception the rule is shaped
 * around, the same way `src/lib/browser.ts` is: a WebGL renderer owns a canvas,
 * an animation frame loop and a resize observer by definition, and it is only
 * ever constructed from a client effect after mount. Routing that through a
 * generic browser helper would obscure it rather than make it safer.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  CAMERA,
  FOCUS_OVERRIDE,
  DPR_RANGE,
  DRACO_DECODER_PATH,
  FLIGHT_DURATION,
  ORBIT,
  type CameraPreset,
  type Hotspot,
  type LightingMode,
} from './config';

/**
 * The 3D viewer, with no framework attached.
 *
 * This deliberately drives three.js directly rather than going through a React
 * renderer. Next's App Router runs its own bundled copy of React, and the
 * React renderers for three.js reach into React internals that differ between
 * versions; pinning one would have forced a React upgrade across the whole
 * site. Owning the render loop here keeps the viewer's dependencies to three
 * and gsap, and keeps its failure modes inside this file.
 *
 * Rendering is on demand. Nothing draws unless something asked for a frame,
 * so a model sitting still costs nothing.
 */

export interface EngineCallbacks {
  onProgress: (percent: number) => void;
  onLoaded: () => void;
  onError: (message: string) => void;
  /** Fires when the visitor starts driving the camera themselves. */
  onUserInteract: () => void;
}

interface HotspotBinding {
  hotspot: Hotspot;
  element: HTMLElement;
  world: THREE.Vector3;
}

export class ViewerEngine {
  private readonly container: HTMLElement;
  private readonly callbacks: EngineCallbacks;

  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;

  private keyLight = new THREE.DirectionalLight(0xffffff, 1);
  private fillLight = new THREE.DirectionalLight(0xffffff, 1);
  private hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.35);
  private ground: THREE.Mesh | null = null;
  private environmentMap: THREE.Texture | null = null;

  private model: THREE.Object3D | null = null;
  private center = new THREE.Vector3();
  private size = new THREE.Vector3(1, 1, 1);
  private radius = 1;
  /** Ground height in recentred space, so the disc sits under the whole site. */
  private groundY = 0;

  private frameRequest: number | null = null;
  private flying = false;
  private autoRotate = false;
  private reducedMotion = false;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private interactionSuspendsRotation = false;
  private disposed = false;
  private currentPreset: CameraPreset | null = null;
  /** Set once the visitor moves the camera, so resizes stop re-framing. */
  private userDrove = false;
  private lastAspectScale = 1;
  /** Set while the pointer is over a marker, so it stops sliding away. */
  private hoverPause = false;

  private hotspots: HotspotBinding[] = [];
  private readonly projection = new THREE.Vector3();

  private resizeObserver: ResizeObserver | null = null;
  private activeTween: gsap.core.Tween | null = null;

  constructor(container: HTMLElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    const { clientWidth, clientHeight } = container;
    const width = Math.max(1, clientWidth);
    const height = Math.max(1, clientHeight);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, DPR_RANGE[1]),
    );
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(CAMERA.fov, width / height, 0.1, 1000);
    this.camera.position.set(1, 1, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = ORBIT.dampingFactor;
    this.controls.rotateSpeed = ORBIT.rotateSpeed;
    this.controls.zoomSpeed = ORBIT.zoomSpeed;
    this.controls.panSpeed = ORBIT.panSpeed;
    this.controls.minPolarAngle = ORBIT.minPolarAngle;
    this.controls.maxPolarAngle = ORBIT.maxPolarAngle;
    this.controls.autoRotateSpeed = ORBIT.autoRotateSpeed;
    this.controls.screenSpacePanning = false;

    this.controls.addEventListener('change', this.requestFrame);
    this.controls.addEventListener('start', this.handleInteractionStart);
    this.controls.addEventListener('end', this.handleInteractionEnd);

    this.scene.add(this.keyLight, this.fillLight, this.hemiLight);
    this.buildEnvironment();

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(container);
  }

  /**
   * Neutral studio lighting, generated on the GPU at start up.
   *
   * The export uses specular and index of refraction extensions, which look
   * dead without a real environment map. Building one from three's procedural
   * room avoids downloading an HDR file from a third party.
   */
  private buildEnvironment() {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    this.environmentMap = target.texture;
    this.scene.environment = target.texture;
    room.dispose?.();
    pmrem.dispose();
  }

  /** Loads the model, reports progress, and frames it. */
  load(url: string) {
    const draco = new DRACOLoader();
    draco.setDecoderPath(DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      url,
      (gltf) => {
        if (this.disposed) return;
        this.adoptModel(gltf.scene);
        draco.dispose();
        this.callbacks.onLoaded();
        this.requestFrame();
      },
      (event) => {
        if (this.disposed) return;
        // The server streams the model, so total is often zero. Falling back
        // to the known asset size keeps the bar honest rather than stuck.
        const total = event.total || 0;
        const percent = total > 0 ? (event.loaded / total) * 100 : Math.min(
          95,
          (event.loaded / 15_653_440) * 100,
        );
        this.callbacks.onProgress(Math.min(99, percent));
      },
      (error) => {
        if (this.disposed) return;
        this.callbacks.onError(
          error instanceof Error ? error.message : 'Failed to load model',
        );
      },
    );
  }

  /**
   * Finds the part of the model worth looking at.
   *
   * The export includes a long apron of roads and empty land, several times
   * larger than the buildings. Framing the whole bounding box therefore puts
   * the towers in a corner of an otherwise empty screen. This isolates the
   * geometry that reaches into the top of the model's height range, which for
   * a residential site plan is the towers, then pads outward so the podium and
   * immediate landscaping stay in shot.
   */
  private findFocus(root: THREE.Object3D, full: THREE.Box3): THREE.Box3 {
    // An explicit frame always wins. Automatic framing is a starting point,
    // not a substitute for someone looking at the model and deciding.
    if (FOCUS_OVERRIDE) {
      return new THREE.Box3(
        new THREE.Vector3(...FOCUS_OVERRIDE.min),
        new THREE.Vector3(...FOCUS_OVERRIDE.max),
      );
    }

    const height = full.max.y - full.min.y;
    if (height <= 0) return full.clone();

    // Frame the built form, not the land.
    //
    // The export carries a long apron of roads and empty plots several times
    // larger than the buildings, so framing the whole model leaves the towers
    // as a detail in the corner. Geometry reaching the top of the height range
    // is built form; everything below is ground.
    //
    // This is a heuristic and it is not perfect: the exporter grouped geometry
    // by material rather than by building, so some meshes span the whole site,
    // and the scene also holds tall, wide, paper-thin planes. Both pull the
    // box wider than the towers alone. It frames the site well in practice;
    // where a specific composition is wanted, set FOCUS_OVERRIDE.
    const threshold = full.max.y - height * 0.3;
    const focus = new THREE.Box3().makeEmpty();
    const meshBox = new THREE.Box3();

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      meshBox.setFromObject(child);
      if (meshBox.max.y > threshold) focus.union(meshBox);
    });

    if (focus.isEmpty()) return full.clone();

    const size = focus.getSize(new THREE.Vector3());
    const pad = Math.max(size.x, size.z) * 0.4;
    focus.expandByVector(new THREE.Vector3(pad, 0, pad));
    // Deliberately not extended down to the model floor. The terrain reaches
    // far below the towers, and including it drags the orbit centre
    // underground and strands the subject high in frame.
    focus.max.y = Math.min(full.max.y, focus.max.y);
    return focus;
  }

  private adoptModel(root: THREE.Object3D) {
    const full = new THREE.Box3().setFromObject(root);
    const focus = this.findFocus(root, full);

    focus.getCenter(this.center);
    focus.getSize(this.size);
    this.radius = this.size.length() / 2 || 1;
    // Keep the true ground height so the disc sits under the whole site, not
    // just under the focused part.
    this.groundY = full.min.y - this.center.y;

    // The export sits well off the origin, which would make orbiting feel like
    // swinging around an empty point. Recentre on the focus so every camera
    // and hotspot downstream works in a predictable space.
    root.position.sub(this.center);

    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    const aniso = Math.min(4, maxAniso);
    const touched = new Set<THREE.Texture>();

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (!material) continue;
        const standard = material as THREE.MeshStandardMaterial;
        if (standard.map && !touched.has(standard.map)) {
          touched.add(standard.map);
          standard.map.anisotropy = aniso;
          standard.map.needsUpdate = true;
        }
        // SketchUp marks many opaque surfaces double sided, which doubles the
        // shading work for surfaces nobody sees the back of.
        if (material.side === THREE.DoubleSide) material.side = THREE.FrontSide;
      }
    });

    this.model = root;
    this.scene.add(root);

    // Clip planes have to match a model several thousand units across.
    this.camera.near = Math.max(0.01, this.radius * CAMERA.nearFactor);
    this.camera.far = this.radius * CAMERA.farFactor;
    this.camera.updateProjectionMatrix();

    this.controls.minDistance = this.radius * ORBIT.minDistance;
    this.controls.maxDistance = this.radius * ORBIT.maxDistance;

    this.addGround();
  }

  /** A disc under the site, so it reads as standing on something. */
  private addGround() {
    const geometry = new THREE.CircleGeometry(this.radius * 2.4, 64);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcfcac1,
      roughness: 1,
      metalness: 0,
    });
    const disc = new THREE.Mesh(geometry, material);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = this.groundY - this.radius * 0.002;
    this.ground = disc;
    this.scene.add(disc);
  }

  get modelRadius() {
    return this.radius;
  }

  get boundingSize() {
    return this.size.clone();
  }

  /** Resolves a preset into a camera position and orbit target. */
  /**
   * How much further back the camera must sit at this viewport shape.
   *
   * Preset distances are tuned against a wide desktop frame. A phone held
   * upright has a far narrower horizontal field at the same distance, so the
   * same number crops the site down its sides. Pulling back in proportion to
   * the aspect ratio keeps the same horizontal coverage on every screen.
   */
  private aspectScale() {
    const reference = 1.6;
    const aspect = this.camera.aspect || reference;
    return THREE.MathUtils.clamp(reference / aspect, 1, 3.2);
  }

  private resolvePreset(preset: CameraPreset) {
    const phi = THREE.MathUtils.degToRad(
      THREE.MathUtils.clamp(90 - preset.elevation, 1, 89),
    );
    const theta = THREE.MathUtils.degToRad(preset.azimuth);
    const target = new THREE.Vector3(
      0,
      (preset.targetHeight ?? 0) * (this.size.y / 2),
      0,
    );
    const position = new THREE.Vector3()
      .setFromSphericalCoords(
        preset.distance * this.radius * this.aspectScale(),
        phi,
        theta,
      )
      .add(target);
    return { position, target };
  }

  /** Moves the camera to a preset, instantly when motion is reduced. */
  flyTo(preset: CameraPreset, immediate = false) {
    this.currentPreset = preset;
    this.userDrove = false;
    this.lastAspectScale = this.aspectScale();
    const { position, target } = this.resolvePreset(preset);
    this.activeTween?.kill();

    if (immediate || this.reducedMotion) {
      this.camera.position.copy(position);
      this.controls.target.copy(target);
      this.controls.update();
      this.requestFrame();
      return;
    }

    const frame = {
      px: this.camera.position.x,
      py: this.camera.position.y,
      pz: this.camera.position.z,
      tx: this.controls.target.x,
      ty: this.controls.target.y,
      tz: this.controls.target.z,
    };

    this.flying = true;
    this.requestFrame();

    this.activeTween = gsap.to(frame, {
      px: position.x,
      py: position.y,
      pz: position.z,
      tx: target.x,
      ty: target.y,
      tz: target.z,
      duration: FLIGHT_DURATION,
      ease: 'power2.inOut',
      onUpdate: () => {
        this.camera.position.set(frame.px, frame.py, frame.pz);
        this.controls.target.set(frame.tx, frame.ty, frame.tz);
        this.controls.update();
        this.requestFrame();
      },
      onComplete: () => {
        this.flying = false;
        this.requestFrame();
      },
    });
  }

  setLighting(mode: LightingMode) {
    this.scene.background = new THREE.Color(mode.background);
    this.renderer.toneMappingExposure = mode.exposure;
    this.scene.environmentIntensity = mode.envIntensity;

    this.keyLight.color.set(mode.keyColor);
    this.keyLight.intensity = mode.keyIntensity;
    this.keyLight.position.set(this.radius * 0.9, this.radius * 1.3, this.radius * 0.7);

    this.fillLight.color.set(mode.fillColor);
    this.fillLight.intensity = mode.fillIntensity;
    this.fillLight.position.set(-this.radius * 0.8, this.radius * 0.5, -this.radius * 0.9);

    this.hemiLight.color.set(mode.keyColor);
    this.hemiLight.groundColor.set(mode.ground);

    if (this.ground) {
      (this.ground.material as THREE.MeshStandardMaterial).color.set(mode.ground);
    }

    this.requestFrame();
  }

  /** Single place that decides whether the model is turning. */
  private syncAutoRotate() {
    this.controls.autoRotate =
      this.autoRotate &&
      !this.reducedMotion &&
      !this.interactionSuspendsRotation &&
      !this.hoverPause;
    this.requestFrame();
  }

  setAutoRotate(enabled: boolean) {
    this.autoRotate = enabled;
    this.syncAutoRotate();
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
    this.syncAutoRotate();
  }

  /**
   * Holds the model still while the pointer is over a marker.
   *
   * Without this, a hotspot drifts out from under the cursor between the
   * moment someone aims at it and the moment they press, which makes the
   * labels genuinely hard to click rather than merely fiddly.
   */
  setHoverPause(paused: boolean) {
    this.hoverPause = paused;
    this.syncAutoRotate();
  }

  /**
   * Binds hotspot markers to the scene.
   *
   * Positions are stored normalised to the bounding box, so a re-export at a
   * different scale keeps them in place. The elements are moved directly each
   * frame rather than through React state, because re-rendering a component
   * tree sixty times a second to move four dots would be absurd.
   */
  setHotspots(entries: { hotspot: Hotspot; element: HTMLElement }[]) {
    this.hotspots = entries.map(({ hotspot, element }) => ({
      hotspot,
      element,
      world: new THREE.Vector3(
        hotspot.position[0] * (this.size.x / 2),
        hotspot.position[1] * (this.size.y / 2),
        hotspot.position[2] * (this.size.z / 2),
      ),
    }));
    this.requestFrame();
  }

  private updateHotspots() {
    if (this.hotspots.length === 0) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    for (const binding of this.hotspots) {
      this.projection.copy(binding.world).project(this.camera);
      // z beyond 1 means the point sits behind the camera.
      const behind = this.projection.z > 1;
      const x = (this.projection.x * 0.5 + 0.5) * width;
      const y = (-this.projection.y * 0.5 + 0.5) * height;

      binding.element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      binding.element.style.visibility = behind ? 'hidden' : 'visible';
    }
  }

  /** Converts a click on the model into normalised bounding box coordinates. */
  pickNormalised(clientX: number, clientY: number): [number, number, number] | null {
    if (!this.model) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const pointer = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, this.camera);
    const hit = raycaster.intersectObject(this.model, true)[0];
    if (!hit) return null;
    return [
      Number((hit.point.x / (this.size.x / 2 || 1)).toFixed(3)),
      Number((hit.point.y / (this.size.y / 2 || 1)).toFixed(3)),
      Number((hit.point.z / (this.size.z / 2 || 1)).toFixed(3)),
    ];
  }

  private handleInteractionStart = () => {
    this.userDrove = true;
    this.interactionSuspendsRotation = true;
    this.controls.autoRotate = false;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.callbacks.onUserInteract();
  };

  private handleInteractionEnd = () => {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.interactionSuspendsRotation = false;
      this.syncAutoRotate();
    }, ORBIT.idleBeforeAutoRotate * 1000);
  };

  private handleResize = () => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // A rotated phone changes the shape of the frame enough to crop the site.
    // Re-frame for it, but never yank the camera away from a visitor who has
    // moved it themselves.
    const scale = this.aspectScale();
    const changed = Math.abs(scale - this.lastAspectScale) / this.lastAspectScale;
    if (this.currentPreset && !this.userDrove && changed > 0.08) {
      this.lastAspectScale = scale;
      const { position, target } = this.resolvePreset(this.currentPreset);
      this.camera.position.copy(position);
      this.controls.target.copy(target);
      this.controls.update();
    }

    this.requestFrame();
  };

  /** Asks for a frame. Repeated calls before the next frame collapse into one. */
  requestFrame = () => {
    if (this.disposed || this.frameRequest !== null) return;
    this.frameRequest = requestAnimationFrame(this.tick);
  };

  private tick = () => {
    this.frameRequest = null;
    if (this.disposed) return;

    // update() returns true while damping or auto rotation is still moving the
    // camera, which is what keeps the loop alive without a permanent timer.
    const moving = this.controls.update();

    this.renderer.render(this.scene, this.camera);
    this.updateHotspots();

    if (moving || this.flying || this.controls.autoRotate) this.requestFrame();
  };

  dispose() {
    this.disposed = true;
    if (this.frameRequest !== null) cancelAnimationFrame(this.frameRequest);
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.activeTween?.kill();

    this.resizeObserver?.disconnect();
    this.controls.removeEventListener('change', this.requestFrame);
    this.controls.removeEventListener('start', this.handleInteractionStart);
    this.controls.removeEventListener('end', this.handleInteractionEnd);
    this.controls.dispose();

    // Release GPU memory explicitly. Without this, leaving and returning to
    // the page keeps a second copy of every texture alive.
    this.scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.geometry?.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (!material) continue;
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose();
        }
        material.dispose();
      }
    });

    this.environmentMap?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
