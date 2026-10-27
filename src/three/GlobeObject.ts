import * as THREE from 'three';

export interface TradePort {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  size: number;
}

export const TRADE_PORTS: TradePort[] = [
  { id: 'SYD', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, size: 1.2 },
  { id: 'MEL', name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, size: 1.2 },
  { id: 'SIN', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, size: 1.4 },
  { id: 'HKG', name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, size: 1.3 },
  { id: 'SHA', name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737, size: 1.4 },
  { id: 'NRT', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, size: 1.3 },
  { id: 'BKK', name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, size: 1.1 },
  { id: 'LAX', name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, size: 1.2 },
  { id: 'LHR', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, size: 1.2 },
  { id: 'FRA', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, size: 1.1 },
  { id: 'DXB', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, size: 1.2 },
  { id: 'AKL', name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, size: 1.0 },
];

export const TRADE_ROUTES: [string, string][] = [
  ['SYD', 'SIN'],
  ['MEL', 'SIN'],
  ['SIN', 'HKG'],
  ['HKG', 'SHA'],
  ['SHA', 'NRT'],
  ['SIN', 'DXB'],
  ['DXB', 'LHR'],
  ['DXB', 'FRA'],
  ['HKG', 'LAX'],
  ['NRT', 'LAX'],
  ['SYD', 'AKL'],
  ['SIN', 'BKK'],
  ['BKK', 'HKG'],
];

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
  private radius: number = 2.05;
  private globePoints!: THREE.Points;
  private coreSphere!: THREE.Mesh;
  private portGroup: THREE.Group = new THREE.Group();
  private arcGroup: THREE.Group = new THREE.Group();
  private arcPackets: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; speed: number; progress: number }[] = [];
  public rotationMultiplier: number = 1.0;

  constructor() {
    this.createCoreSphere();
    this.createDotMatrixGlobe();
    this.createTradePorts();
    this.createTradeRoutes();
    
    // Shift globe to the right side of desktop screen
    this.group.position.set(1.4, 0.0, 0);
    this.group.rotation.x = 0.22;
    this.group.rotation.z = -0.05;
    this.group.rotation.y = 3.8;
  }

  private createCoreSphere() {
    const sphereGeo = new THREE.SphereGeometry(this.radius * 0.995, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
    });
    this.coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.group.add(this.coreSphere);
  }

  private createDotMatrixGlobe() {
    const pointCount = 20000;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    const whiteColor = new THREE.Color(0xffffff);
    const slateColor = new THREE.Color(0xa0aec0);
    const dimColor = new THREE.Color(0x1a202c);

    const isContinental = (lat: number, lon: number): boolean => {
      // APAC / Australia
      if (lat >= -45 && lat <= -10 && lon >= 110 && lon <= 155) return true;
      // New Zealand
      if (lat >= -48 && lat <= -34 && lon >= 165 && lon <= 179) return true;
      // South East Asia
      if (lat >= -12 && lat <= 22 && lon >= 95 && lon <= 145) return true;
      // East Asia / China / Japan
      if (lat >= 15 && lat <= 55 && lon >= 75 && lon <= 148) return true;
      // India / South Asia
      if (lat >= 6 && lat <= 35 && lon >= 68 && lon <= 92) return true;
      // Europe
      if (lat >= 35 && lat <= 70 && lon >= -12 && lon <= 45) return true;
      // Africa
      if (lat >= -35 && lat <= 38 && lon >= -18 && lon <= 52) return true;
      // North America
      if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) return true;
      // South America
      if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) return true;
      return false;
    };

    let pIdx = 0;
    for (let i = 0; i < pointCount; i++) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = 2.39996323 * i;

      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const lat = (Math.asin(y) * 180) / Math.PI;
      const lon = (Math.atan2(z, x) * 180) / Math.PI;

      const land = isContinental(lat, lon);
      if (!land && Math.random() > 0.08) {
        continue;
      }

      const rad = this.radius * (1 + (land ? 0.005 : 0));
      positions[pIdx * 3] = x * rad;
      positions[pIdx * 3 + 1] = y * rad;
      positions[pIdx * 3 + 2] = z * rad;

      const chosenColor = land ? (Math.random() > 0.35 ? whiteColor : slateColor) : dimColor;
      colors[pIdx * 3] = chosenColor.r;
      colors[pIdx * 3 + 1] = chosenColor.g;
      colors[pIdx * 3 + 2] = chosenColor.b;

      pIdx++;
      if (pIdx >= pointCount) break;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, pIdx * 3), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, pIdx * 3), 3));

    const material = new THREE.PointsMaterial({
      size: 0.024,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    this.globePoints = new THREE.Points(geometry, material);
    this.group.add(this.globePoints);
  }

  private createTradePorts() {
    TRADE_PORTS.forEach((port) => {
      const pos = latLngToVector3(port.lat, port.lng, this.radius * 1.002);
      const portMarker = new THREE.Group();
      portMarker.position.copy(pos);
      portMarker.lookAt(new THREE.Vector3(0, 0, 0));

      const dotGeo = new THREE.SphereGeometry(0.035 * port.size, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xf45300 });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      portMarker.add(dot);

      const ringGeo = new THREE.RingGeometry(0.045 * port.size, 0.065 * port.size, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf45300,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      portMarker.add(ring);

      this.portGroup.add(portMarker);
    });

    this.group.add(this.portGroup);
  }

  private createTradeRoutes() {
    const portMap = new Map<string, THREE.Vector3>();
    TRADE_PORTS.forEach((p) => {
      portMap.set(p.id, latLngToVector3(p.lat, p.lng, this.radius * 1.002));
    });

    TRADE_ROUTES.forEach(([fromId, toId]) => {
      const p1 = portMap.get(fromId);
      const p2 = portMap.get(toId);
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const altitude = Math.min(0.75, distance * 0.25);
      mid.normalize().multiplyScalar(this.radius + altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(45);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: 0xf45300,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(curveGeo, curveMat);
      this.arcGroup.add(line);

      const packetGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      this.arcGroup.add(packetMesh);

      this.arcPackets.push({
        curve,
        mesh: packetMesh,
        speed: 0.22 + Math.random() * 0.12,
        progress: Math.random(),
      });
    });

    this.group.add(this.arcGroup);
  }

  public update(delta: number, scrollProgress: number) {
    const effectiveDelta = Math.min(delta, 0.05);
    this.group.rotation.y += 0.08 * effectiveDelta * this.rotationMultiplier;

    this.arcPackets.forEach((p) => {
      p.progress += effectiveDelta * p.speed * this.rotationMultiplier;
      if (p.progress > 1) p.progress = 0;
      const pos = p.curve.getPoint(p.progress);
      p.mesh.position.copy(pos);
    });
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
