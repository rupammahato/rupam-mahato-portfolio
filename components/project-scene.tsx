'use client'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
export default function ProjectScene({ kind }: { kind: 'ledger' | 'mesh' | 'signal' }) { return <><ambientLight intensity={1.5} /><directionalLight position={[2, 4, 3]} intensity={3} color="#ffffff" /><Scene kind={kind} /></> }
function Scene({ kind }: { kind: string }) { const ref = useRef<THREE.Group>(null); useFrame((_, d) => { if (ref.current) { ref.current.rotation.y += d * .2; ref.current.rotation.x = Math.sin(performance.now() * .0006) * .08 } }); const color = kind === 'signal' ? '#f24822' : '#1648d8'; return <group ref={ref}>{Array.from({ length: kind === 'ledger' ? 5 : 9 }, (_, i) => <mesh key={i} position={[(i % 3 - 1) * .58, Math.floor(i / 3) * .45 - .4, (i % 2) * .2]}><boxGeometry args={[.42, .34, .42]} /><meshStandardMaterial color={i === 4 ? '#f5f1e8' : color} roughness={.5} metalness={.15} /></mesh>)}</group> }
