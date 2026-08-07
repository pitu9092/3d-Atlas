'use client'

import { Environment } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

import { useAnimation } from '@/providers/AnimationProvider'

interface HeroCanvasProps {
  scrollProgress: number
  isReady: boolean
}

// ─── Procedural Globe Implementation ──────────────────────────────────────────

function ProceduralGlobe() {
  const globeRef = useRef<THREE.Group>(null)

  // Custom simple Fresnel shader for the atmosphere rim
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: {
        color: { value: new THREE.Color(0x0088ff) },
        power: { value: 2.5 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float power;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), power);
          gl_FragColor = vec4(color, 1.0) * intensity;
        }
      `,
    })
  }, [])

  useFrame((_state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group position={[2, 0, 0]} ref={globeRef}>
      {/* Dark Matte Earth Base */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#050508" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Wireframe Network (procedural proxy for routes) */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial transparent wireframe color="#1a1a2e" opacity={0.3} />
      </mesh>

      {/* Atmosphere Glow Ring */}
      <mesh>
        <sphereGeometry args={[2.3, 64, 64]} />
        <primitive attach="material" object={atmosphereMaterial} />
      </mesh>
    </group>
  )
}

// ─── Camera Controller ────────────────────────────────────────────────────────

function CameraController({ progress }: { progress: number }) {
  useFrame(({ camera }) => {
    // Interpolate camera Z from 3.5 to 7.0 based on scroll progress
    const startZ = 3.5
    const endZ = 7.0
    const targetZ = startZ + (endZ - startZ) * progress

    // Smooth dampening
    camera.position.z += (targetZ - camera.position.z) * 0.1
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Main Canvas Component ───────────────────────────────────────────────────

export function HeroCanvas({ scrollProgress, isReady }: HeroCanvasProps) {
  const { isGSAPReady } = useAnimation()

  // We use CSS transition for the initial fade-in triggered by isReady
  const opacity = isReady && isGSAPReady ? 1 : 0

  return (
    <div
      className="absolute inset-0 z-0 transition-opacity duration-1000 ease-out"
      style={{ opacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight color="#04040a" intensity={0.2} />
        <directionalLight color="#fff4e0" intensity={2.0} position={[5, 3, 5]} />

        <ProceduralGlobe />
        <CameraController progress={scrollProgress} />

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
