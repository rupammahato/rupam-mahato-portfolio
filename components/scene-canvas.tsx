'use client'
import { Canvas, useThree } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

// Views follow their DOM boxes, so under demand rendering (reduced motion) nothing redraws on
// scroll unless we ask for a frame.
function RedrawOnScroll() {
  const invalidate = useThree(s => s.invalidate)
  useEffect(() => {
    const redraw = () => invalidate()
    redraw()
    window.addEventListener('scroll', redraw, { passive: true })
    window.addEventListener('resize', redraw)
    return () => { window.removeEventListener('scroll', redraw); window.removeEventListener('resize', redraw) }
  }, [invalidate])
  return null
}

// R3F throws context-creation errors outside React's render path, so an error boundary can't
// catch them; probe once up front instead. Without WebGL the 3D layer is skipped and the page
// stays usable (every <SceneView> box has its own background). Later context loss/restore is
// handled inside three.js.
function webglAvailable() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch { return false }
}

// One shared WebGL context for the whole page. Every 3D visual renders into it through a
// <SceneView> tracking a DOM element, instead of each section mounting its own <Canvas> —
// browsers cap live WebGL contexts (~8-16), and five permanent ones caused random blank scenes.
export default function SceneCanvas() {
  const reduced = useReducedMotion()
  const [supported] = useState(webglAvailable)
  if (!supported) return null
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return <Canvas
    dpr={[1, coarse ? 1 : 1.5]}
    frameloop={reduced ? 'demand' : 'always'}
    camera={{ position: [0, 0, 6.5], fov: 40 }}
    style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
  >
    <View.Port />
    {reduced && <RedrawOnScroll />}
  </Canvas>
}
