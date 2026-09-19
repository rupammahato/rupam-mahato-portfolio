// Run: node --experimental-strip-types lib/hash-ring.check.ts   (Node 22.14 needs the flag)
import assert from 'node:assert/strict'
import { assign, assignMod, buildRing, moved, ownerAt } from './hash-ring.ts'

const keys = Array.from({ length: 10000 }, (_, i) => `key-${i}`)
const nodes = ['n1', 'n2', 'n3', 'n4', 'n5']
const before = assign(buildRing(nodes), keys)

// deterministic: same input, same ring, same owners
assert.deepEqual(assign(buildRing(nodes), keys), before)

// lookup wraps: at or before a point belongs to it, past the last point wraps to the first
const tiny = [{ pos: 10, node: 'a' }, { pos: 20, node: 'b' }]
assert.equal(ownerAt(tiny, 5), 'a'); assert.equal(ownerAt(tiny, 10), 'a')
assert.equal(ownerAt(tiny, 11), 'b'); assert.equal(ownerAt(tiny, 20), 'b'); assert.equal(ownerAt(tiny, 21), 'a')

// killing a node moves ONLY that node's keys (the defining property of consistent hashing)
const after = assign(buildRing(nodes.filter(n => n !== 'n3')), keys)
for (const k of keys) if (before[k] !== 'n3') assert.equal(after[k], before[k], `${k} moved but was not on n3`)

// and about 1/N of keys move; the servers share load roughly evenly
const fraction = moved(before, after).length / keys.length
assert.ok(Math.abs(fraction - 0.2) < 0.05, `remap fraction ${fraction} not near 1/5`)
for (const n of nodes) { const share = keys.filter(k => before[k] === n).length / keys.length; assert.ok(share > 0.1 && share < 0.3, `${n} share ${share}`) }

// the naive hash % N baseline moves far more, which is the point of the comparison in the UI
const naive = moved(assignMod(nodes, keys), assignMod(nodes.filter(n => n !== 'n3'), keys)).length / keys.length
assert.ok(naive > 0.5, `hash % N moved only ${naive}`)

console.log(`ok: ring remap ${(fraction * 100).toFixed(1)}%, hash % N remap ${(naive * 100).toFixed(1)}%`)
