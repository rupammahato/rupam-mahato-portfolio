import { useId } from 'react'
import type { Visual } from '@/lib/site-data'

const FG = 'var(--fg)', BG = 'var(--bg)', PANEL = 'var(--panel-2)', MUTED = 'var(--fg-3)', BLUE = 'var(--diagram-accent)', ORANGE = 'var(--accent)'

function Label({ x, y, children, color = MUTED }: { x: number; y: number; children: string; color?: string }) {
  return <text x={x} y={y} fill={color} fontSize={16} fontFamily="var(--mono)" textAnchor="middle">{children}</text>
}

function Box({ x, y, width, text, accent = false }: { x: number; y: number; width: number; text: string; accent?: boolean }) {
  return <g><rect x={x} y={y} width={width} height={44} rx={5} fill={PANEL} stroke={accent ? BLUE : MUTED} strokeWidth={1.2} /><Label x={x + width / 2} y={y + 28} color={FG}>{text}</Label></g>
}

function Ring() {
  const point = (angle: number, radius = 84) => [Number((180 + Math.cos(angle) * radius).toFixed(2)), Number((130 + Math.sin(angle) * radius).toFixed(2))]
  return <>
    <circle cx={180} cy={130} r={106} stroke="var(--line-strong)" />
    <circle cx={180} cy={130} r={84} stroke={BLUE} strokeWidth={1.4} />
    {Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2; const [x1, y1] = point(a, 101), [x2, y2] = point(a, 110); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--line-strong)" /> })}
    {Array.from({ length: 5 }, (_, i) => {
      const a = i / 5 * Math.PI * 2 - Math.PI / 2
      const [x, y] = point(a), [lx, ly] = point(a, 116)
      return <g key={i}><rect x={x - 12} y={y - 12} width={24} height={24} rx={5} fill={BG} stroke={BLUE} strokeWidth={1.5} /><circle cx={x} cy={y} r={3} fill={ORANGE} /><Label x={lx} y={ly + 6}>{String.fromCharCode(65 + i)}</Label></g>
    })}
    <path d="M101 101A84 84 0 0 1 180 46" stroke={ORANGE} strokeWidth={2.5} />
    <circle cx={108} cy={88} r={4} fill={ORANGE} />
    <Label x={180} y={127} color={FG}>Hash ring</Label><Label x={180} y={151}>5 nodes</Label>
    <Label x={180} y={270}>Keys → next node</Label>
  </>
}

function Gate({ arrow }: { arrow: string }) {
  return <>
    <Box x={14} y={116} width={90} text="Request" />
    <Box x={136} y={116} width={78} text="JWT" accent />
    <Box x={253} y={56} width={94} text="Admin" accent />
    <Box x={253} y={176} width={94} text="Public" />
    <g stroke={ORANGE} strokeWidth={1.5} markerEnd={`url(#${arrow})`}>
      <path d="M104 138h27" /><path d="M214 138h17V78h17" /><path d="M214 138h17v60h17" />
    </g>
    <path d="M155 166v29h40v-29" stroke={BLUE} strokeWidth={1.2} />
    <Label x={180} y={239}>Role-based access</Label>
    <Label x={180} y={268}>Verify → route</Label>
  </>
}

function Tenants({ arrow }: { arrow: string }) {
  return <>
    {[38, 108, 178].map((y, i) => <g key={y}>
      <Box x={12} y={y} width={84} text={`NGO ${'ABC'[i]}`} />
      <path d={`M96 ${y + 22}h29`} stroke={ORANGE} strokeWidth={1.5} markerEnd={`url(#${arrow})`} />
      <Box x={130} y={y} width={100} text={`Index ${'ABC'[i]}`} accent />
      <path d={`M230 ${y + 22}h25`} stroke={BLUE} strokeWidth={1.2} />
    </g>)}
    <path d="M255 60v140" stroke={BLUE} strokeWidth={1.2} />
    <rect x={268} y={93} width={80} height={92} rx={5} stroke={MUTED} strokeDasharray="4 5" fill={PANEL} />
    <path d="M255 140h8" stroke={ORANGE} markerEnd={`url(#${arrow})`} />
    <Label x={308} y={131} color={FG}>13</Label><Label x={308} y={157}>rules</Label>
    <Label x={180} y={268}>One index / NGO</Label>
  </>
}

const descriptions: Record<Visual, string> = {
  ring: 'Consistent hashing: keys follow the ring clockwise to the next of five server nodes.',
  gate: 'A request passes JWT verification and is routed to admin or public pages according to access.',
  tenants: 'Three NGOs have separate knowledge indexes. A shared layer of thirteen scope rules constrains answers.',
}

export default function ProjectVisual({ kind }: { kind: Visual }) {
  const arrow = `project-arrow-${useId()}`
  return <svg viewBox="0 0 360 280" fill="none" preserveAspectRatio="xMidYMid meet" role="img" aria-label={descriptions[kind]}>
    <defs><marker id={arrow} viewBox="0 0 8 8" refX={7} refY={4} markerWidth={5} markerHeight={5} orient="auto"><path d="M0 0 8 4 0 8Z" fill={ORANGE} /></marker></defs>
    {kind === 'ring' ? <Ring /> : kind === 'gate' ? <Gate arrow={arrow} /> : <Tenants arrow={arrow} />}
  </svg>
}
