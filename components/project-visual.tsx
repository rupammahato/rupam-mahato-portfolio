import type { Visual } from '@/lib/site-data'

// One static SVG per project, drawn for the dark theme. Each shows the idea the project is built on,
// not decoration. No hooks, so it renders on the server and costs no WebGL context.
const FG = '#eceae4', BG = '#0b0c0e', LINE = '#3a3f47', TICK = '#2c3138', MUTED = '#8a919c', BLUE = '#6f8cff', ORANGE = '#ff5a2c'
const MONO = "var(--font-geist-mono), ui-monospace, monospace"

const Label = ({ x, y, children, fill = MUTED, size = 9 }: { x: number; y: number; children: string; fill?: string; size?: number }) =>
  <text x={x} y={y} fill={fill} fontSize={size} fontFamily={MONO} textAnchor="middle">{children}</text>

const Box = ({ x, y, w, h, lines, fill = 'none', stroke = FG, color = FG, dash }: { x: number; y: number; w: number; h: number; lines: string[]; fill?: string; stroke?: string; color?: string; dash?: string }) =>
  <g>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.3} strokeDasharray={dash} />
    {lines.map((line, i) => <Label key={i} x={x + w / 2} y={y + h / 2 + 3 + (i - (lines.length - 1) / 2) * 13} fill={color} size={10}>{line}</Label>)}
  </g>

const Arrow = ({ id }: { id: string }) =>
  <defs><marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill={FG} /></marker></defs>

function Ring() {
  const cx = 200, cy = 150, r = 96
  // Rounded so server and browser print identical coordinates (Math.cos/sin can differ in the last digit, which breaks hydration).
  const q = (n: number) => Math.round(n * 100) / 100
  const pt = (deg: number, rad = r): [number, number] => [q(cx + Math.cos(deg * Math.PI / 180) * rad), q(cy + Math.sin(deg * Math.PI / 180) * rad)]
  const nodes = [-90, -18, 54, 126, 198] // clockwise degrees; a key belongs to the next node clockwise
  const keys = [-70, -40, 5, 30, 80, 100, 150, 170, 215, 250]
  const owner = (k: number) => nodes.find(n => n > k) ?? nodes[0] + 360
  return <>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE} strokeWidth={1.5} />
    {Array.from({ length: 48 }, (_, i) => { const [x1, y1] = pt(i * 7.5, r - 4), [x2, y2] = pt(i * 7.5, r + 4); return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={TICK} strokeWidth={1} /> })}
    {keys.map(k => { const [kx, ky] = pt(k), [ox, oy] = pt(owner(k)); return <path key={k} d={`M${kx} ${ky} A${r} ${r} 0 0 1 ${ox} ${oy}`} fill="none" stroke={ORANGE} strokeWidth={1.6} opacity={.85} /> })}
    {keys.map(k => { const [x, y] = pt(k); return <circle key={k} cx={x} cy={y} r={3.5} fill={FG} /> })}
    {nodes.map((n, i) => { const [x, y] = pt(n); return <g key={n}><circle cx={x} cy={y} r={12} fill={BLUE} stroke={BG} strokeWidth={3} /><Label x={x} y={y + 3} fill={BG} size={9}>{`n${i + 1}`}</Label></g> })}
    <Label x={cx} y={cy - 4}>keys walk clockwise</Label><Label x={cx} y={cy + 9}>to the next node</Label>
    <Label x={200} y={288}>hash ring · 5 nodes · 48 virtual-node ticks</Label>
  </>
}

function Gate() {
  return <>
    <Arrow id="arrow-gate" />
    <Box x={16} y={125} w={70} h={44} lines={['request']} />
    <line x1={86} y1={147} x2={110} y2={147} stroke={FG} strokeWidth={1.3} markerEnd="url(#arrow-gate)" />
    <Box x={112} y={112} w={118} h={70} lines={['edge middleware', 'jose · JWT verify']} fill={BG} />
    <line x1={230} y1={147} x2={258} y2={147} stroke={FG} strokeWidth={1.3} />
    <circle cx={258} cy={147} r={4} fill={FG} />
    <line x1={258} y1={147} x2={284} y2={92} stroke={FG} strokeWidth={1.3} markerEnd="url(#arrow-gate)" />
    <line x1={258} y1={147} x2={284} y2={202} stroke={FG} strokeWidth={1.3} markerEnd="url(#arrow-gate)" />
    <Box x={286} y={68} w={98} h={44} lines={['admin', 'dashboard']} fill={BLUE} stroke={BLUE} color={BG} />
    <Box x={286} y={182} w={98} h={44} lines={['public', 'pages']} />
    <Label x={335} y={126} size={8}>orders · certs · mail</Label>
    <Label x={335} y={240} size={8}>sub-2s loads</Label>
    <path d="M140 182 C140 216 202 216 202 184" fill="none" stroke={ORANGE} strokeWidth={1.4} markerEnd="url(#arrow-gate)" />
    <Label x={171} y={232} fill={ORANGE}>refresh-token rotation</Label>
    <Label x={200} y={288}>role-gated auth, verified at the edge</Label>
  </>
}

function Tenants() {
  const lanes = [{ y: 92, name: 'NGO A', c: BLUE }, { y: 155, name: 'NGO B', c: FG }, { y: 218, name: 'NGO C', c: ORANGE }]
  return <>
    <Arrow id="arrow-tenants" />
    <Label x={110} y={46} size={8}>ingest: validate → chunk → embed</Label>
    {lanes.map(({ y, name, c }, i) => <g key={name}>
      <Box x={16} y={y - 20} w={74} h={40} lines={[name]} stroke={c} />
      <line x1={90} y1={y} x2={174} y2={y} stroke={c} strokeWidth={1.3} markerEnd="url(#arrow-tenants)" />
      <Box x={176} y={y - 20} w={96} h={40} lines={[`index-${'abc'[i]}`]} fill={c} stroke={c} color={BG} />
      <line x1={272} y1={y} x2={302} y2={y} stroke={c} strokeWidth={1.3} markerEnd="url(#arrow-tenants)" />
    </g>)}
    <Box x={304} y={64} w={80} h={182} lines={['13 scope', 'rules', '', 'off-topic,', 'medical,', 'legal,', 'financial', '→ refuse']} dash="4 3" />
    <Label x={200} y={288}>one Pinecone index per tenant</Label>
  </>
}

const VISUALS: Record<Visual, { Scene: () => React.JSX.Element; label: string }> = {
  ring: { Scene: Ring, label: 'Diagram of a consistent-hash ring: five nodes on a circle, each key routed clockwise to the next node.' },
  gate: { Scene: Gate, label: 'Diagram of a request passing edge middleware that verifies a JWT and routes to an admin dashboard or public pages.' },
  tenants: { Scene: Tenants, label: 'Diagram of three NGOs, each with its own vector index, feeding a shared layer of 13 scope rules that refuse off-topic questions.' },
}

export default function ProjectVisual({ kind }: { kind: Visual }) {
  const { Scene, label } = VISUALS[kind]
  return <svg viewBox="0 0 400 310" preserveAspectRatio="xMidYMid meet" role="img" aria-label={label}><Scene /></svg>
}
