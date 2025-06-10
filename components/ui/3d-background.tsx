"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useSpring, animated } from "@react-spring/web"
import type { Mesh } from "three"
import { useMouse } from "@/hooks/use-mouse"
import { Environment, MeshDistortMaterial } from "@react-three/drei"

// Simplified fitness shape component
function FitnessShape({
  position,
  color,
  speed,
  distort,
  scale,
}: {
  position: [number, number, number]
  color: string
  speed: number
  distort: number
  scale: number
}) {
  const mesh = useRef<Mesh>(null)
  const { mouse } = useMouse()
  const { viewport } = useThree()

  useFrame((state) => {
    if (!mesh.current) return

    // Very subtle rotation
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * speed * 0.1) * 0.05
    mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * speed * 0.15) * 0.05

    // Minimal breathing effect
    const breathe = Math.sin(state.clock.getElapsedTime() * speed * 0.3) * 0.03 + 1
    mesh.current.scale.set(scale * breathe, scale * breathe, scale * breathe)

    // Minimal mouse movement
    const x = (mouse.x * viewport.width) / 100
    const y = (mouse.y * viewport.height) / 100

    mesh.current.position.x = position[0] + x * 0.02
    mesh.current.position.y = position[1] - y * 0.02
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial
        color={color}
        speed={speed * 0.3}
        distort={distort * 0.3}
        opacity={0.2}
        transparent
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  )
}

// Main component that renders the Canvas
export default function ThreeDBackground() {
  const [springs, api] = useSpring(() => ({
    scale: 0,
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  useEffect(() => {
    api.start({ scale: 1 })
  }, [api])

  return (
    <animated.div
      className="fixed inset-0 -z-10 opacity-20"
      style={{
        scale: springs.scale,
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.2} />

        {/* More subtle, professional 3D elements */}
        <FitnessShape position={[-4, 2, -8]} color="#FF4B5C" speed={0.5} distort={0.1} scale={2} />
        <FitnessShape position={[4, -2, -10]} color="#00C9A7" speed={0.4} distort={0.05} scale={2.5} />
        <FitnessShape position={[0, 0, -12]} color="#FFC045" speed={0.3} distort={0.08} scale={3} />

        <Environment preset="sunset" />
      </Canvas>
    </animated.div>
  )
}
