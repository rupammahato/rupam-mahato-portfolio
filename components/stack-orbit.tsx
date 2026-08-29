'use client'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

// The wireframe sphere only — skill labels render as HTML in page.tsx (SkillRing). Drei's
// <Text> (troika SDF text) renders corrupted when drawn through a scissored View viewport;
// plain geometry is unaffected, so text moved out of the 3D layer entirely.
export default function StackOrbit() { const ref = useRef<THREE.Group>(null); useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * .12 }); return <><ambientLight intensity={1.5} /><group ref={ref}><mesh><icosahedronGeometry args={[.65, 1]} /><meshStandardMaterial color="#1648d8" wireframe /></mesh></group></> }
