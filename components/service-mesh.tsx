'use client'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Mesh() { const group = useRef<THREE.Group>(null); const nodes = useMemo(() => Array.from({ length: 17 }, (_, i) => { const a = i * 1.78; return [Math.cos(a) * (1.5 + (i % 3) * .28), Math.sin(a * 1.4) * 1.05, Math.sin(a) * 1.2] as [number, number, number] }), [])
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * .08 })
  return <group ref={group}>{nodes.map((position, i) => <mesh key={i} position={position}><icosahedronGeometry args={[i % 4 === 0 ? .16 : .08, 0]} /><meshStandardMaterial color={i % 4 === 0 ? '#1648d8' : '#111827'} emissive={i % 4 === 0 ? '#1648d8' : '#000000'} emissiveIntensity={i % 4 === 0 ? .4 : 0} /></mesh>)}{nodes.slice(1).map((position, i) => <Line key={`line-${i}`} points={[nodes[i], position]} color="#aeb6c8" transparent opacity={.42} lineWidth={.7} />)}<mesh position={[0, 0, 0]}><icosahedronGeometry args={[.42, 1]} /><meshStandardMaterial color="#f24822" roughness={.35} /></mesh></group> }

// Scene content only — rendered inside a shared <View> in a single page-wide Canvas/WebGL
// context, since mounting one Canvas per section exhausts the browser's WebGL context limit.
export default function ServiceMesh() { return <><ambientLight intensity={1.4} /><directionalLight position={[3, 4, 2]} intensity={3} color="#ffffff" /><Mesh /><ContactShadows position={[0, -1.6, 0]} opacity={.18} scale={7} blur={2} far={3} /></> }
