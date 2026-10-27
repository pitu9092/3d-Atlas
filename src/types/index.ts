import * as THREE from 'three';

export interface HubNode {
  id: string;
  name: string;
  code: string;
  country: string;
  lat: number;
  lon: number;
  position: THREE.Vector3;
  status: 'OPTIMAL' | 'CONGESTED' | 'STANDBY';
  pingMs: number;
  activeShipments: number;
  bandwidthGbps: number;
}

export interface LogisticsArc {
  id: string;
  sourceHubId: string;
  targetHubId: string;
  color: string;
  altitude: number;
  speed: number;
  activePackets: number;
}

export interface CameraKeyframe {
  progress: number; // 0 to 1
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface TelemetryState {
  satelliteUptime: string;
  activeNodes: number;
  totalThroughputTbps: number;
  meanLatencyMs: number;
  planetaryCoveragePct: number;
  lastSyncUtc: string;
}
