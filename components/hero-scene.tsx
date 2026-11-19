'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges, Line, RoundedBox } from '@react-three/drei'
import { useEffect, useRef, type RefObject } from 'react'
import { Color, Group, Mesh, OrthographicCamera, Vector3 } from 'three'

export type HeroSceneColors = { surface: string; structure: string; signal: string }
type Props = { colors: HeroSceneColors; running: boolean; pointer: RefObject<[number, number]>; onReady: () => void; onUnavailable: () => void }

const CONNECTIONS: [number, number, number][][] = [
  [[0, 1.42, 0], [0, .8, 0], [-1.05, .8, 0], [-1.05, .2, 0]],
  [[0, 1.42, 0], [0, .2, 0]],
  [[0, 1.42, 0], [0, .8, 0], [1.05, .8, 0], [1.05, .2, 0]],
  ...[-1.05, 0, 1.05].map(x => [[x, -.05, 0], [x, -1.1, 0]] as [number, number, number][]),
]

function Signal({ points, color, offset, running }: { points: [number, number, number][]; color: string; offset: number; running: boolean }) {
  const marker = useRef<Mesh>(null)
  const progress = useRef(offset)
  const vectors = points.map(point => new Vector3(...point))
  const lengths = vectors.slice(1).map((point, i) => point.distanceTo(vectors[i]))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  useFrame((_, delta) => {
    if (!marker.current) return
    if (running) progress.current = (progress.current + Math.min(delta, .05) * .22) % 1
    let distance = progress.current * total
    for (let i = 0; i < lengths.length; i++) {
      if (distance <= lengths[i]) { marker.current.position.lerpVectors(vectors[i], vectors[i + 1], distance / lengths[i]); break }
      distance -= lengths[i]
    }
  })
  return <mesh ref={marker} position={points[0]}><sphereGeometry args={[.045, 12, 12]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
}

function Assembly({ colors, running, pointer, onReady, onUnavailable }: Props) {
  const group = useRef<Group>(null)
  const { camera, size, invalidate, gl } = useThree()
  useEffect(() => {
    const ortho = camera as OrthographicCamera
    ortho.zoom = Math.min(size.width / 7.2, size.height / 5.8)
    ortho.updateProjectionMatrix()
    invalidate()
  }, [camera, size.width, size.height, invalidate])
  useEffect(() => {
    const frame = requestAnimationFrame(onReady)
    const canvas = gl.domElement
    const lost = (event: Event) => { event.preventDefault(); onUnavailable() }
    canvas.addEventListener('webglcontextlost', lost)
    return () => { cancelAnimationFrame(frame); canvas.removeEventListener('webglcontextlost', lost) }
  }, [gl, onReady, onUnavailable])
  useFrame((_, delta) => {
    if (!group.current || !running) return
    const smoothing = 1 - Math.exp(-Math.min(delta, .05) * 5)
    group.current.rotation.y += (pointer.current[0] * .16 - group.current.rotation.y) * smoothing
    group.current.rotation.x += (pointer.current[1] * .07 - group.current.rotation.x) * smoothing
  })
  const edge = new Color(colors.structure)
  return <>
    <ambientLight intensity={1.6} />
    <directionalLight position={[4, 7, 5]} intensity={3} />
    <pointLight color={colors.structure} position={[-4, 1, -3]} intensity={10} />
    <group ref={group}>
      {[-1.4, 0, 1.4].map(y => <group key={y}>
        <RoundedBox args={[3.8, .07, 2.3]} radius={.035} smoothness={2} position={[0, y, 0]}><meshStandardMaterial color={colors.surface} metalness={.15} roughness={.65} /></RoundedBox>
        <Line points={[[-1.86, y + .04, -1.11], [1.86, y + .04, -1.11], [1.86, y + .04, 1.11], [-1.86, y + .04, 1.11], [-1.86, y + .04, -1.11]]} color={edge} transparent opacity={.3} lineWidth={1} />
      </group>)}
      <RoundedBox args={[2.4, .92, .09]} radius={.055} smoothness={3} position={[0, 1.9, -.15]}>
        <meshStandardMaterial color={colors.surface} metalness={.15} roughness={.55} /><Edges color={edge} threshold={25} />
      </RoundedBox>
      <Line points={[[-1.08, 2.14, -.09], [1.08, 2.14, -.09]]} color={edge} lineWidth={1} />
      {[-.95, -.79, -.63].map((x, i) => <mesh key={x} position={[x, 2.25, -.09]}><circleGeometry args={[.026, 12]} /><meshBasicMaterial color={i === 0 ? colors.signal : colors.structure} /></mesh>)}
      <RoundedBox args={[.8, .45, .025]} radius={.025} position={[-.55, 1.82, -.09]}><meshStandardMaterial color={colors.structure} transparent opacity={.22} /></RoundedBox>
      {[0, 1, 2].map(i => <Line key={i} points={[[.03, 1.98 - i * .14, -.08], [.88 - i * .14, 1.98 - i * .14, -.08]]} color={edge} lineWidth={1} />)}
      {[-1.05, 0, 1.05].map(x => <group key={x} position={[x, 0, 0]}>
        <RoundedBox args={[.68, .47, .65]} radius={.045} smoothness={2} position={[0, .28, 0]}><meshStandardMaterial color={colors.surface} metalness={.3} roughness={.45} /><Edges color={edge} threshold={25} /></RoundedBox>
        {[.23, .36].map(y => <Line key={y} points={[[-.22, y, .332], [.06, y, .332]]} color={edge} lineWidth={1} />)}
        <mesh position={[.2, .25, .335]}><circleGeometry args={[.025, 10]} /><meshBasicMaterial color={colors.signal} /></mesh>
        <mesh position={[0, -1.13, 0]}><cylinderGeometry args={[.34, .34, .42, 32]} /><meshStandardMaterial color={colors.surface} metalness={.3} roughness={.45} /><Edges color={edge} threshold={25} /></mesh>
        {[-1.33, -1.13, -.92].map(y => <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.34, .009, 5, 32]} /><meshBasicMaterial color={colors.structure} /></mesh>)}
      </group>)}
      {CONNECTIONS.map((points, i) => <group key={i}><Line points={points} color={colors.structure} transparent opacity={.4} lineWidth={1} /><Signal points={points} color={colors.signal} offset={i / CONNECTIONS.length} running={running} /></group>)}
    </group>
  </>
}

export default function HeroScene(props: Props) {
  return <Canvas orthographic camera={{ position: [5, 3.2, 7], zoom: 65, near: .1, far: 50 }} dpr={[1, window.matchMedia('(pointer: coarse)').matches ? 1 : 1.5]} frameloop={props.running ? 'always' : 'demand'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={<span>3D unavailable</span>}>
    <Assembly {...props} />
  </Canvas>
}
