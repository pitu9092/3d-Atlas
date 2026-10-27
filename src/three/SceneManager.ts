import * as THREE from 'three';
import { CameraManager } from './CameraManager';
import { GlobeObject } from './GlobeObject';

export class SceneManager {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraManager: CameraManager;
  private globe: GlobeObject;
  private starfield!: THREE.Points;
  private animationFrameId: number | null = null;
  private lastTime: number = performance.now();
  private scrollProgress: number = 0;
  private isDisposed: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.08);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.cameraManager = new CameraManager(this.camera);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // 4. Lighting setup
    this.setupLighting();

    // 5. Starfield & 3D Globe
    this.createStarfield();
    this.globe = new GlobeObject();
    this.scene.add(this.globe.group);

    // 6. Window resize handler
    window.addEventListener('resize', this.onResize);

    // 7. Start RAF render loop
    this.animate();
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x0e1c2e, 1.2);
    this.scene.add(ambientLight);

    // Main solar light illuminating earth
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    // Secondary cyan rim light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-5, -2, -3);
    this.scene.add(rimLight);
  }

  private createStarfield() {
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0xffffff);
    const c2 = new THREE.Color(0x38bdf8);

    for (let i = 0; i < starCount; i++) {
      // Distribute stars on outer sphere shell
      const r = 25 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const col = Math.random() > 0.3 ? c1 : c2;
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  private onResize = () => {
    if (!this.container || this.isDisposed) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  public setScrollProgress(progress: number) {
    this.scrollProgress = progress;
  }

  public setMousePosition(normX: number, normY: number) {
    this.cameraManager.setMouseParallax(normX, normY);
  }

  private animate = () => {
    if (this.isDisposed) return;

    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // Update camera and globe
    this.cameraManager.update(this.scrollProgress, delta);
    this.globe.update(delta, this.scrollProgress);

    // Slowly rotate background starfield
    if (this.starfield) {
      this.starfield.rotation.y += 0.015 * delta;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    this.isDisposed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);

    this.globe.dispose();

    if (this.starfield) {
      this.starfield.geometry.dispose();
      (this.starfield.material as THREE.Material).dispose();
    }

    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
