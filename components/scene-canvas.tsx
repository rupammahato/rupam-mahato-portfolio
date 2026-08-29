'use client'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'

// One shared WebGL context for the whole page. Every 3D visual renders into it through a
// <SceneView> tracking a DOM element, instead of each section mounting its own <Canvas> —
// browsers cap live WebGL contexts (~8-16), and five permanent ones caused random blank scenes.
export default function SceneCanvas() {
  return <Canvas
    dpr={[1, 1.5]}
    frameloop="always"
    camera={{ position: [0, 0, 6.5], fov: 40 }}
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
  >
    <View.Port />
  </Canvas>
}
