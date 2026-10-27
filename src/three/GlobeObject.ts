import * as THREE from 'three';
import rawGlobePoints from '@/data/globe-points.json';
import rawAirports from '@/data/airports.json';
import rawFlights from '@/data/flights.json';

export interface AirportData {
  text: string;
  size: number;
  country: string;
  city: string;
  lat: string | number;
  lng: string | number;
}

export interface FlightData {
  type: string;
  order: number;
  from: string;
  to: string;
  flightCode: string;
  date: string;
  status: boolean;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt?: number;
}

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export class GlobeObject {
  public group: THREE.Group = new THREE.Group();
  public radius: number = 1.82;
  private globePoints!: THREE.Points;
  private coreSphere!: THREE.Mesh;
  private atmosphereMesh!: THREE.Mesh;
  private portGroup: THREE.Group = new THREE.Group();
  private arcGroup: THREE.Group = new THREE.Group();
  private arcPackets: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; speed: number; progress: number }[] = [];
  public rotationMultiplier: number = 1.0;
  public phi: number = 1.75; // Initial rotation centering Australia & APAC

  constructor() {
    this.createCoreSphere();
    this.createAtmosphereHalo();
    this.createDotMatrixGlobe();
    this.createAirportsAndPins();
    this.createFlightRoutes();

    // Position globe on the right half of the desktop viewport
    this.group.position.set(2.05, 0.0, 0);
    this.group.rotation.x = 0.28;
    this.group.rotation.z = -0.04;
    this.group.rotation.y = this.phi;
  }

  private createCoreSphere() {
    // Pure black sphere interior blocking any backside bleed
    const sphereGeo = new THREE.SphereGeometry(this.radius * 0.992, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreSphere);
  }

  private createAtmosphereHalo() {
    // Outer atmospheric Fresnel rim glow: Top fiery neon orange, Bottom electric blue
    const haloGeo = new THREE.SphereGeometry(this.radius * 1.025, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float fresnel = 1.0 - max(0.0, dot(viewDir, vNormal));
          fresnel = pow(fresnel, 2.6);

          // Top rim glowing orange, bottom rim glowing deep electric blue
          float yGrad = clamp(vNormal.y * 1.3 + 0.35, 0.0, 1.0);
          vec3 orangeColor = vec3(1.0, 0.33, 0.0);
          vec3 blueColor = vec3(0.0, 0.28, 1.0);
          vec3 rimColor = mix(blueColor, orangeColor, yGrad);

          gl_FragColor = vec4(rimColor, fresnel * 0.9);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    this.atmosphereMesh = new THREE.Mesh(haloGeo, haloMat);
    this.group.add(this.atmosphereMesh);
  }

  private createDotMatrixGlobe() {
    const rawCoords = rawGlobePoints as number[];
    const count = Math.floor(rawCoords.length / 3);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const white = new THREE.Color(0xffffff);
    const silver = new THREE.Color(0xdde5ed);

    for (let i = 0; i < count; i++) {
      const x = rawCoords[i * 3];
      const y = rawCoords[i * 3 + 1];
      const z = rawCoords[i * 3 + 2];

      positions[i * 3] = x * this.radius;
      positions[i * 3 + 1] = y * this.radius;
      positions[i * 3 + 2] = z * this.radius;

      // Slight subtle variation between crisp white and silver dots
      const c = (i % 7 === 0) ? silver : white;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material with KILL_BACK: discards points on the rear hemisphere
    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
        pointSize: { value: 0.024 * (typeof window !== 'undefined' ? window.devicePixelRatio : 1) },
      },
      vertexShader: `
        attribute vec3 color;
        varying vec3 vColor;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        uniform float pointSize;

        void main() {
          vColor = color;
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          vec3 centerPos = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vNormal = normalize(vWorldPos - centerPos);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Camera-distance point size attenuation
          gl_PointSize = (110.0 / -mvPosition.z) * 0.28;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        void main() {
          // Circular particle shape
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;

          // Discard back-facing points
          vec3 viewDir = normalize(cameraPosition - vWorldPos);
          float ndv = dot(viewDir, vNormal);
          if (ndv <= 0.04) discard;

          // Smooth edge falloff
          float edgeFade = smoothstep(0.04, 0.25, ndv);
          gl_FragColor = vec4(vColor, 0.96 * edgeFade);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    this.globePoints = new THREE.Points(geometry, pointsMat);
    this.group.add(this.globePoints);
  }

  private createAirportsAndPins() {
    const airports = rawAirports as AirportData[];

    airports.forEach((airport) => {
      const lat = typeof airport.lat === 'string' ? parseFloat(airport.lat) : airport.lat;
      const lng = typeof airport.lng === 'string' ? parseFloat(airport.lng) : airport.lng;
      if (isNaN(lat) || isNaN(lng)) return;

      const pos = latLngToVector3(lat, lng, this.radius * 1.003);
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(pos);
      pinGroup.lookAt(new THREE.Vector3(0, 0, 0));

      // Key APAC ports get prominent glowing orange rings and labels
      const isProminent = ['SYD', 'SIN', 'AKL', 'PEK', 'NRT', 'HKG'].includes(airport.text);
      const dotSize = isProminent ? 0.04 : 0.024;
      const ringOuter = isProminent ? 0.08 : 0.048;

      // Solid central beacon dot
      const dotGeo = new THREE.SphereGeometry(dotSize, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xf45300,
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      pinGroup.add(dot);

      // Radiating beacon ring
      const ringGeo = new THREE.RingGeometry(dotSize * 1.25, ringOuter, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf45300,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isProminent ? 0.9 : 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ring);

      // Text label for APAC key ports matching reference video
      let labelText = '';
      if (airport.text === 'SYD') labelText = 'AUSTRALIA';
      else if (airport.text === 'SIN') labelText = 'SINGAPORE';
      else if (airport.text === 'AKL') labelText = 'NEW ZEALAND';
      else if (airport.text === 'PEK') labelText = 'CHINA';

      if (labelText && typeof document !== 'undefined') {
        const sprite = this.createPortLabelSprite(labelText);
        sprite.position.set(0.12, 0.06, 0.02);
        pinGroup.add(sprite);
      }

      this.portGroup.add(pinGroup);
    });

    this.group.add(this.portGroup);
  }

  private createPortLabelSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Transparent canvas
    ctx.clearRect(0, 0, 256, 64);

    // Pill background
    ctx.fillStyle = 'rgba(10, 10, 16, 0.85)';
    ctx.strokeStyle = 'rgba(244, 83, 0, 0.6)';
    ctx.lineWidth = 2.5;

    const w = 170, h = 38, r = 8;
    ctx.beginPath();
    ctx.roundRect(10, 13, w, h, r);
    ctx.fill();
    ctx.stroke();

    // Red-orange indicator beacon dot
    ctx.fillStyle = '#f45300';
    ctx.beginPath();
    ctx.arc(28, 32, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Crisp typography
    ctx.font = 'bold 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '1px';
    ctx.fillText(text, 40, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });

    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(0.55, 0.14, 1.0);
    return sprite;
  }

  private createFlightRoutes() {
    const flights = rawFlights as FlightData[];

    flights.forEach((flight) => {
      const p1 = latLngToVector3(flight.startLat, flight.startLng, this.radius * 1.003);
      const p2 = latLngToVector3(flight.endLat, flight.endLng, this.radius * 1.003);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const altitude = Math.min(0.65, Math.max(0.18, distance * (flight.arcAlt || 0.22)));
      mid.normalize().multiplyScalar(this.radius + altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: 0xf45300,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      this.arcGroup.add(line);

      // Animated bright light packet cruising along arc
      const packetGeo = new THREE.SphereGeometry(0.026, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      this.arcGroup.add(packetMesh);

      this.arcPackets.push({
        curve,
        mesh: packetMesh,
        speed: 0.24 + Math.random() * 0.12,
        progress: Math.random(),
      });
    });

    this.group.add(this.arcGroup);
  }

  public update(delta: number, scrollProgress: number) {
    const effectiveDelta = Math.min(delta, 0.05);

    // Continuous majestic rotation
    this.phi += 0.09 * effectiveDelta * this.rotationMultiplier;
    this.group.rotation.y = this.phi;

    // Advance flight packets
    this.arcPackets.forEach((p) => {
      p.progress += effectiveDelta * p.speed * this.rotationMultiplier;
      if (p.progress > 1) p.progress = 0;
      const pos = p.curve.getPoint(p.progress);
      p.mesh.position.copy(pos);
    });

    // When scrolling down into editorial, gently scale and recede
    if (scrollProgress > 0.0) {
      const recede = Math.min(1.0, scrollProgress * 4.0);
      this.group.scale.setScalar(1.0 - recede * 0.35);
      this.group.position.x = 2.05 - recede * 0.8;
    } else {
      this.group.scale.setScalar(1.0);
      this.group.position.set(2.05, 0.0, 0);
    }
  }

  public setRotationMultiplier(val: number) {
    this.rotationMultiplier = Math.max(0, Math.min(5, val));
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
