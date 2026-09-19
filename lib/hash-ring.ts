// Consistent hashing as pure functions (no React), so the hero simulator and its self-check share them.
// FNV-1a plus a murmur3-style finaliser: plain FNV-1a barely changes the high bits for near-identical
// strings ("n1#0", "n1#1"), which would clump a server's virtual nodes together on the ring.

export const VNODES = 100
export type Point = { pos: number; node: string }

export function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16
  return h >>> 0
}

export function buildRing(nodes: string[], vnodes = VNODES): Point[] {
  const ring = nodes.flatMap(node => Array.from({ length: vnodes }, (_, i) => ({ pos: hash(`${node}#${i}`), node })))
  return ring.sort((a, b) => a.pos - b.pos || (a.node < b.node ? -1 : 1))
}

// Binary search for the first virtual node at or after h, wrapping past the end back to the start.
export function ownerAt(ring: Point[], h: number): string {
  let lo = 0, hi = ring.length
  while (lo < hi) { const mid = (lo + hi) >> 1; if (ring[mid].pos < h) lo = mid + 1; else hi = mid }
  return ring[lo === ring.length ? 0 : lo].node
}

export const lookup = (ring: Point[], key: string) => ownerAt(ring, hash(key))
export const assign = (ring: Point[], keys: string[]) => Object.fromEntries(keys.map(k => [k, lookup(ring, k)]))
// The naive alternative the simulator compares against: hash % number-of-servers.
export const assignMod = (nodes: string[], keys: string[]) => Object.fromEntries(keys.map(k => [k, nodes[hash(k) % nodes.length]]))
export const moved = (a: Record<string, string>, b: Record<string, string>) => Object.keys(a).filter(k => a[k] !== b[k])
