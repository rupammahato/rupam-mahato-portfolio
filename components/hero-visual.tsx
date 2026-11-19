'use client'

import dynamic from 'next/dynamic'
import { Component, useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './hero-visual.module.css'
import type { HeroSceneColors } from './hero-scene'

const HeroScene = dynamic(() => import('./hero-scene'), { ssr: false })

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onUnavailable() }
  render() { return this.state.failed ? null : this.props.children }
}

function SystemStill() {
  return <svg viewBox="0 0 520 460" fill="none" aria-hidden="true" className={styles.still}>
    <g stroke="var(--line-strong)" strokeWidth="1">
      <path d="M54 280 260 400 466 280M54 314 260 434 466 314M105 250v106m51-135v165m52-195v225m52-255v273m52-243v225m52-195v165m51-135v106" opacity=".5" />
    </g>
    <g stroke="var(--diagram-accent)" strokeWidth="1.3" strokeLinejoin="round">
      <path d="m94 124 166-96 166 96-166 96Z" fill="var(--panel)" />
      <path d="m94 124 166 96 166-96v10l-166 96-166-96Z" fill="var(--panel-2)" />
      <path d="m94 234 166-96 166 96-166 96Z" fill="var(--panel)" />
      <path d="m94 234 166 96 166-96v10l-166 96-166-96Z" fill="var(--panel-2)" />
      <path d="m94 344 166-96 166 96-166 96Z" fill="var(--panel)" />
      <path d="m94 344 166 96 166-96v10l-166 96-166-96Z" fill="var(--panel-2)" />
      <path d="m177 100 83-48 83 48v43l-83 48-83-48Z" fill="var(--panel-2)" />
      <path d="m177 100 83 48 83-48m-83 48v43m-67-88 48 28m-48-17 31 18m47 20 48-28" />
      {[174, 260, 346].map((x, i) => <g key={x} transform={`translate(${x} ${242 + (i === 1 ? 18 : -30)})`}>
        <path d="m-28 0 28-16L28 0v-35L0-51l-28 16Zm0-35L0-19l28-16M0-19v35" fill="var(--panel-2)" />
        <path d="m-19-22 12 7m-12 3 12 7" />
      </g>)}
      {[185, 260, 335].map((x, i) => <g key={x} transform={`translate(${x} ${348 + (i === 1 ? 26 : -17)})`}>
        <path d="M-25-19v34c0 19 50 19 50 0v-34" fill="var(--panel-2)" />
        <ellipse cy="-19" rx="25" ry="11" fill="var(--panel-2)" />
        <path d="M-25-3c0 18 50 18 50 0" />
      </g>)}
    </g>
    <g stroke="var(--accent)" strokeWidth="2"><path d="M260 192v38m0 53v38" strokeDasharray="4 6" /></g>
    <g fill="var(--accent)"><circle cx="260" cy="211" r="4" /><circle cx="260" cy="305" r="4" /></g>
  </svg>
}

export default function HeroVisual() {
  const host = useRef<HTMLElement>(null)
  const pointer = useRef<[number, number]>([0, 0])
  const descriptionId = useId()
  const [colors, setColors] = useState<HeroSceneColors | null>(null)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reduced, setReduced] = useState(true)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const hasEntered = useRef(false)

  useEffect(() => {
    const element = host.current
    if (!element) return
    try {
      const context = document.createElement('canvas').getContext('webgl2')
      if (!context) setUnavailable(true)
      context?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch { setUnavailable(true) }
    const css = getComputedStyle(element)
    setColors({ surface: css.getPropertyValue('--panel').trim(), structure: css.getPropertyValue('--diagram-accent').trim(), signal: css.getPropertyValue('--accent').trim() })
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReduced(preference.matches)
    const syncVisibility = () => setPageVisible(!document.hidden)
    syncMotion()
    syncVisibility()
    preference.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncVisibility)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) hasEntered.current = true
      setInView(entry.isIntersecting)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      preference.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  const onReady = useCallback(() => setReady(true), [])
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false) }, [])
  const running = inView && pageVisible && !paused && !reduced
  const motionPaused = paused || reduced
  const status = unavailable ? 'Static view' : !ready ? 'System overview' : reduced ? 'Reduced motion' : paused ? 'Motion paused' : 'Interactive 3D'

  return <figure ref={host} className={styles.visual} aria-label="Illustrative layered system model" aria-describedby={descriptionId}>
    <div className={styles.toolbar}>
      <span className={styles.kicker}><span aria-hidden="true">01 /</span> Inside the system</span>
      <button type="button" className={styles.motionButton} disabled={!ready || reduced || unavailable} aria-pressed={motionPaused} onClick={() => setPaused(value => !value)}>
        {motionPaused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
        {reduced ? 'Motion reduced' : paused ? 'Resume motion' : 'Pause motion'}
      </button>
    </div>
    <div className={styles.stage} data-scene-state={unavailable ? 'unavailable' : ready ? 'ready' : 'loading'}
      onPointerMove={event => {
        if (event.pointerType !== 'mouse' || !running) return
        const bounds = event.currentTarget.getBoundingClientRect()
        pointer.current = [(event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1]
      }} onPointerLeave={() => { pointer.current = [0, 0] }}>
      <div className={styles.fallback} hidden={ready && !unavailable}><SystemStill /></div>
      {colors && hasEntered.current && !unavailable && <div className={styles.canvas} aria-hidden="true">
        <SceneBoundary onUnavailable={onUnavailable}><HeroScene colors={colors} running={running} pointer={pointer} onReady={onReady} onUnavailable={onUnavailable} /></SceneBoundary>
      </div>}
      <span className={styles.status} role="status">{status}</span>
      <span className={styles.annotation}>Conceptual model / no live traffic</span>
    </div>
    <figcaption id={descriptionId} className={styles.caption}>
      <span><b>01</b> Product experience</span><span><b>02</b> Reliable services</span><span><b>03</b> Isolated knowledge</span>
    </figcaption>
  </figure>
}
