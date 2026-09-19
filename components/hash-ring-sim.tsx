'use client'
import { useMemo, useState } from 'react'
import { assign, assignMod, buildRing, hash, moved } from '@/lib/hash-ring'

// A browser-side simulation of a consistent-hashing ring: every number shown is computed from the
// real algorithm in lib/hash-ring.ts, and none of it is live traffic.
const COLORS = ['#ff5a2c', '#6f8cff', '#e8c547', '#4fd1a5', '#c084fc', '#f472b6', '#38bdf8', '#a3e635']
const START = ['n1', 'n2', 'n3', 'n4', 'n5']
const KEYS = Array.from({ length: 48 }, (_, i) => `key-${i}`)
const MAX_NODES = 8
const C = 200, R = 150

// Rounded so server and browser print identical SVG numbers (Math.cos/sin can differ in the last digit).
const q = (n: number) => Math.round(n * 100) / 100
const angle = (pos: number) => (pos / 2 ** 32) * 360 - 90
const pt = (deg: number, r: number) => [q(C + Math.cos((deg * Math.PI) / 180) * r), q(C + Math.sin((deg * Math.PI) / 180) * r)] as const
const color = (id: string) => COLORS[(Number(id.slice(1)) - 1) % COLORS.length]
const pct = (n: number) => Math.round((n / KEYS.length) * 100)

type Change = { moved: Set<string>; ring: number; naive: number }

export default function HashRingSim() {
  const [nodes, setNodes] = useState(START)
  const [nextId, setNextId] = useState(6)
  const [last, setLast] = useState<Change | null>(null)
  const [note, setNote] = useState('')
  const ring = useMemo(() => buildRing(nodes), [nodes])
  const owners = useMemo(() => assign(ring, KEYS), [ring])
  const load = useMemo(() => Object.fromEntries(nodes.map(n => [n, KEYS.filter(k => owners[k] === n).length])), [nodes, owners])

  const apply = (next: string[], verb: string) => {
    const m = moved(owners, assign(buildRing(next), KEYS))
    const naive = moved(assignMod(nodes, KEYS), assignMod(next, KEYS)).length
    setNodes(next)
    setLast({ moved: new Set(m), ring: pct(m.length), naive: pct(naive) })
    setNote(`${verb}: ${pct(m.length)}% of keys moved on the ring; plain hash % N would have moved ${pct(naive)}%.`)
  }
  const kill = (id: string) => apply(nodes.filter(n => n !== id), `Killed ${id}`)
  const add = () => { apply([...nodes, `n${nextId}`], `Added n${nextId}`); setNextId(nextId + 1) }
  const reset = () => { setNodes(START); setNextId(6); setLast(null); setNote(`Reset to ${START.length} nodes.`) }

  return <div className="sim">
    <div className="sim-bar"><span className="label">Consistent hash ring</span><span className="badge">Simulation</span></div>
    <svg className="sim-svg" viewBox="34 34 332 332" role="img" aria-label={`Consistent hash ring with ${nodes.length} servers and ${KEYS.length} keys. Each key belongs to the next server clockwise.`}>
      <circle cx={C} cy={C} r={R} className="sim-ring" />
      {ring.map((p, i) => { const a = angle(p.pos); const [x1, y1] = pt(a, R - 5), [x2, y2] = pt(a, R + 5); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color(p.node)} className="sim-tick" /> })}
      {KEYS.map((k, i) => {
        const a = angle(hash(k)), [x, y] = pt(a, R - 24 - (i % 3) * 12), [rx, ry] = pt(a, R - 6), hot = last?.moved.has(k)
        return <g key={k}><line x1={rx} y1={ry} x2={x} y2={y} stroke={color(owners[k])} opacity={.35} /><circle cx={x} cy={y} r={hot ? 4.8 : 3.4} fill={color(owners[k])} className={hot ? 'sim-key hot' : 'sim-key'} /></g>
      })}
      <text x={C} y={C + 2} className="sim-center-num" textAnchor="middle">{nodes.length}</text>
      <text x={C} y={C + 24} className="sim-center-label" textAnchor="middle">{nodes.length === 1 ? 'node' : 'nodes'}</text>
    </svg>
    <dl className="sim-stats">
      <div><dt>keys moved · ring</dt><dd className={last ? 'good' : ''}>{last ? `${last.ring}%` : '—'}</dd></div>
      <div><dt>keys moved · hash % N</dt><dd>{last ? `${last.naive}%` : '—'}</dd></div>
    </dl>
    <ul className="sim-nodes" aria-label="Servers. Select one to kill it.">{nodes.map(id =>
      <li key={id}><button onClick={() => kill(id)} disabled={nodes.length === 1} aria-label={`Kill ${id}, ${load[id]} keys`}><i style={{ background: color(id) }} />{id}<span>{load[id]} keys</span><b aria-hidden="true">×</b></button></li>)}
    </ul>
    <div className="sim-actions">
      <button className="btn btn-sm btn-ghost" onClick={add} disabled={nodes.length >= MAX_NODES}>Add node</button>
      <button className="btn btn-sm btn-ghost" onClick={reset}>Reset</button>
      <span className="sim-hint">Kill a node: only its keys move.</span>
    </div>
    <p className="sr-only" aria-live="polite">{note}</p>
    <p className="sim-foot">Simulated here: {KEYS.length} keys, 100 virtual nodes per server. The real load balancer benchmarked 19.66% key remap on node failure at 2,046 req/s.</p>
  </div>
}
