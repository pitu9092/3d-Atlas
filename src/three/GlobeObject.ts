import * as THREE from 'three';
import { GLOBAL_HUBS, ACTIVE_ARCS } from '@/constants/hubs';

// Custom Fresnel Glow Vertex Shader
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewVec;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vViewVec = normalize(-worldPos.xyz);
    gl_Position = projectionMatrix * worldPos;
  }
`;

// Custom Fresnel Glow Fragment Shader
const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewVec;
  uniform vec3 uColor;
  uniform float uCoefficient;
  uniform float uPower;

  void main() {
    float intensity = pow(uCoefficient - max(0.0, dot(vNormal, vViewVec)), uPower);
    gl_FragColor = vec4(uColor, intensity * 0.85);
  }
`;

export class GlobeObject {
  public group: THREE.Group = new THREE.Group();
  private radius: number = 2.0;
  private globePoints!: THREE.Points;
  private atmosphereMesh!: THREE.Mesh;
  private hubGroup: THREE.Group = new THREE.Group();
  private arcGroup: THREE.Group = new THREE.Group();
  private satelliteGroup: THREE.Group = new THREE.Group();
  private arcPackets: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; speed: number; progress: number }[] = [];

  constructor() {
    this.createCoreSphere();
    this.createAtmosphereGlow();
    this.createDotMatrixLandmasses();
    this.createHubs();
    this.createLogisticsArcs();
    this.createOrbitalSatellites();
  }

  private createCoreSphere() {
    const sphereGeo = new THREE.SphereGeometry(this.radius * 0.99, 64, 64);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x02050b,
      roughness: 0.85,
      metalness: 0.2,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(coreSphere);
  }

  private createAtmosphereGlow() {
    const atmoGeo = new THREE.SphereGeometry(this.radius * 1.18, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0x38bdf8) },
        uCoefficient: { value: 0.95 },
        uPower: { value: 3.2 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    this.atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    this.group.add(this.atmosphereMesh);
  }

  // Generate dense continental dot cloud
  private createDotMatrixLandmasses() {
    const pointCount = 18000;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const sizes = new Float32Array(pointCount);

    const cyanColor = new THREE.Color(0x38bdf8);
    const whiteColor = new THREE.Color(0xe2e8f0);
    const dimBlueColor = new THREE.Color(0x0e2a47);

    // Approximate continental clustering function
    const isContinental = (lat: number, lon: number): boolean => {
      // Eurasia & Africa: lat -35 to 70, lon -20 to 140
      if (lat > -35 && lat < 70 && lon > -20 && lon < 140) return true;
      // North America: lat 15 to 70, lon -165 to -50
      if (lat > 15 && lat < 70 && lon > -165 && lon < -50) return true;
      // South America: lat -55 to 12, lon -80 to -35
      if (lat > -55 && lat < 12 && lon > -80 && lon < -35) return true;
      // Australia: lat -40 to -10, lon 110 to 155
      if (lat > -40 && lat < -10 && lon > 110 && lon < 155) return true;
      return false;
    };

    let pIdx = 0;
    for (let i = 0; i < pointCount; i++) {
      // Golden spiral distribution on sphere surface
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = 2.39996323 * i; // Golden ratio angle

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(z, x) * 180) / Math.PI;

      const land = isContinental(lat, lon);
      // Extra probability filter for landmass crispness
      if (!land && Math.random() > 0.15) {
        // Skip some ocean dots to leave continents defined
        i--;
        continue;
      }

      const rad = this.radius * (1 + (land ? 0.008 : 0));
      positions[pIdx * 3] = x * rad;
      positions[pIdx * 3 + 1] = y * rad;
      positions[pIdx * 3 + 2] = z * rad;

      const chosenColor = land ? (Math.random() > 0.4 ? cyanColor : whiteColor) : dimBlueColor;
      colors[pIdx * 3] = chosenColor.r;
      colors[pIdx * 3 + 1] = chosenColor.g;
      colors[pIdx * 3 + 2] = chosenColor.b;

      sizes[pIdx] = land ? (Math.random() * 0.035 + 0.02) : 0.015;

      pIdx++;
      if (pIdx >= pointCount) break;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, pIdx * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, pIdx * 3), 3));

    const material = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.globePoints = new THREE.Points(geometry, material);
    this.group.add(this.globePoints);
  }

  private createHubs() {
    GLOBAL_HUBS.forEach((hub) => {
      const hubMarker = new THREE.Group();
      hubMarker.position.copy(hub.position);
      hubMarker.lookAt(new THREE.Vector3(0, 0, 0));

      // Glowing dot at hub location
      const dotGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      hubMarker.add(dot);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.085, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      hubMarker.add(ring);

      // Vertical beacon spire
      const spireGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.35, 8);
      spireGeo.translate(0, 0.175, 0);
      const spireMat = new THREE.MeshBasicMaterial({
        color: 0x4aa8ff,
        transparent: true,
        opacity: 0.8,
      });
      const spire = new THREE.Mesh(spireGeo, spireMat);
      spire.quaternion.copy(hubMarker.quaternion);
      spire.position.copy(hub.position);

      this.hubGroup.add(hubMarker);
      this.hubGroup.add(spire);
    });

    this.group.add(this.hubGroup);
  }

  private createLogisticsArcs() {
    const hubMap = new Map<string, THREE.Vector3>();
    GLOBAL_HUBS.forEach((h) => hubMap.set(h.id, h.position));

    ACTIVE_ARCS.forEach((arcData) => {
      const p1 = hubMap.get(arcData.sourceHubId);
      const p2 = hubMap.get(arcData.targetHubId);
      if (!p1 || !p2) return;

      // Calculate midpoint elevated above globe surface for quadratic bezier curve
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(this.radius + distance * 0.45 * arcData.altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(arcData.color),
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      this.arcGroup.add(line);

      // Animated traveling light packet
      const packetGeo = new THREE.SphereGeometry(0.025, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      this.arcGroup.add(packetMesh);

      this.arcPackets.push({
        curve,
        mesh: packetMesh,
        speed: arcData.speed * 0.25,
        progress: Math.random(),
      });
    });

    this.group.add(this.arcGroup);
  }

  private createOrbitalSatellites() {
    // Tilted thin orbital guide ring
    const ringGeo = new THREE.TorusGeometry(this.radius * 1.45, 0.006, 16, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const orbitalRing = new THREE.Mesh(ringGeo, ringMat);
    orbitalRing.rotation.x = Math.PI * 0.35;
    orbitalRing.rotation.y = Math.PI * 0.15;
    this.satelliteGroup.add(orbitalRing);

    // Add satellites on the ring
    for (let i = 0; i < 4; i++) {
      const satGroup = new THREE.Group();
      const satBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.03, 0.03),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      const solarPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.004, 0.04),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      satGroup.add(satBody);
      satGroup.add(solarPanel);
      this.satelliteGroup.add(satGroup);
    }

    this.group.add(this.satelliteGroup);
  }

  public update(delta: number, scrollProgress: number) {
    // Base planetary idle spin + scroll responsiveness
    const spinSpeed = 0.08 * delta + scrollProgress * 0.15 * delta;
    this.group.rotation.y += spinSpeed;

    // Update travelling packets along logistics arcs
    this.arcPackets.forEach((p) => {
      p.progress += delta * p.speed;
      if (p.progress > 1) p.progress = 0;
      const pos = p.curve.getPoint(p.progress);
      p.mesh.position.copy(pos);
    });

    // Orbit satellites
    const time = performance.now() * 0.0006;
    let satIdx = 0;
    this.satelliteGroup.children.forEach((child) => {
      if (child instanceof THREE.Group) {
        const angle = time * 0.8 + (satIdx * Math.PI) / 2;
        const satR = this.radius * 1.45;
        // Transform on tilted plane
        const localX = Math.cos(angle) * satR;
        const localY = Math.sin(angle) * satR;
        child.position.set(localX, localY * Math.cos(Math.PI * 0.35), localY * Math.sin(Math.PI * 0.35));
        satIdx++;
      }
    });
  }

  public dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
