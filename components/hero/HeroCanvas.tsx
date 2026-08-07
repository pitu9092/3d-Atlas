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
        color: { value: new THREE.Color('#3b82f6') }, // var(--color-accent-500) equivalent
        power: { value: 2.2 },
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
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), power);
          gl_FragColor = vec4(color, 1.0) * intensity;
        }
      `,
    })
  }, [])

  useFrame((state, delta) => {
    if (globeRef.current) {
      // Slow continuous rotation
      globeRef.current.rotation.y += delta * 0.02

      // Subtle idle floating movement (breathing)
      const time = state.clock.getElapsedTime()
      globeRef.current.position.y = Math.sin(time * 0.4) * 0.08
    }
  })

  // Position globe slightly to the right to balance the left-aligned typography
  return (
    <group position={[2.2, 0, 0]} ref={globeRef}>
      {/* Dark Matte Earth Base with slight specular highlight */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#060812" emissive="#000000" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Wireframe Network (procedural proxy for routes) */}
      <mesh>
        <sphereGeometry args={[2.015, 48, 48]} />
        <meshBasicMaterial transparent wireframe color="#1e293b" opacity={0.4} />
      </mesh>

      {/* Atmosphere Glow Ring */}
      <mesh>
        <sphereGeometry args={[2.35, 64, 64]} />
        <primitive attach="material" object={atmosphereMaterial} />
      </mesh>
    </group>
  )
}

// ─── Camera Controller ────────────────────────────────────────────────────────

function CameraController({ progress }: { progress: number }) {
  useFrame(({ camera, pointer }) => {
    // Interpolate camera Z from 3.8 to 7.5 based on scroll progress (pull back effect)
    const startZ = 3.8
    const endZ = 7.5
    const targetZ = startZ + (endZ - startZ) * progress

    // Subtle parallax drift based on mouse position
    const targetX = pointer.x * 0.15
    const targetY = pointer.y * 0.15

    // Smooth dampening (lerp)
    camera.position.z += (targetZ - camera.position.z) * 0.05
    camera.position.x += (targetX - camera.position.x) * 0.05
    camera.position.y += (targetY - camera.position.y) * 0.05

    // Always look at center
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Main Canvas Component ───────────────────────────────────────────────────

export function HeroCanvas({ scrollProgress, isReady }: HeroCanvasProps) {
  const { isGSAPReady } = useAnimation()

  // We use CSS transition for the initial fade-in triggered by isReady
  // We use a slow duration to make the appearance cinematic
  const opacity = isReady && isGSAPReady ? 1 : 0

  return (
    <div
      data-hero-canvas
      className="absolute inset-0 z-0 transition-opacity duration-[1500ms] ease-out"
      style={{ opacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Cinematic Lighting Setup */}
        <ambientLight color="#0a0f1d" intensity={0.5} />

        {/* Main Key Light (simulating distant sun) */}
        <directionalLight color="#ffffff" intensity={1.8} position={[5, 3, 5]} />

        {/* Cool Rim Light from opposite side */}
        <directionalLight color="#3b82f6" intensity={2.5} position={[-5, 0, -5]} />

        <ProceduralGlobe />
        <CameraController progress={scrollProgress} />

        {/* Adds natural reflection map to materials that use metalness/roughness */}
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
