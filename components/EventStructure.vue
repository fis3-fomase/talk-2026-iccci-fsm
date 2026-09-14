<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Grid: devices (rows) x rounds (columns)
const DEVICES = 4
const ROUNDS = 7
const W = 760
const H = 300
const marginX = 70
const marginY = 40
const dx = (W - 2 * marginX) / (ROUNDS - 1)
const dy = (H - 2 * marginY) / (DEVICES - 1)
const R = 12

interface Node { id: string; dev: number; round: number; x: number; y: number }

const nodes: Node[] = []
for (let dvc = 0; dvc < DEVICES; dvc++) {
  for (let rnd = 0; rnd < ROUNDS; rnd++) {
    nodes.push({
      id: `${dvc}-${rnd}`,
      dev: dvc,
      round: rnd,
      x: marginX + rnd * dx,
      y: marginY + dvc * dy,
    })
  }
}
const nodeMap = new Map(nodes.map(n => [n.id, n]))

// messaging relation ~> : self-chain + neighbour messages (with slight async skew)
interface Edge { from: string; to: string }
const edges: Edge[] = []
const skew = [1, 2, 1, 1, 2, 1] // per-round skew pattern to look "asynchronous"
for (let dvc = 0; dvc < DEVICES; dvc++) {
  for (let rnd = 0; rnd < ROUNDS - 1; rnd++) {
    edges.push({ from: `${dvc}-${rnd}`, to: `${dvc}-${rnd + 1}` }) // self
  }
}
for (let dvc = 0; dvc < DEVICES; dvc++) {
  for (let rnd = 0; rnd < ROUNDS - 1; rnd++) {
    const s = skew[rnd % skew.length]
    const target = rnd + s
    if (dvc + 1 < DEVICES && target < ROUNDS) edges.push({ from: `${dvc}-${rnd}`, to: `${dvc + 1}-${target}` })
    if (dvc - 1 >= 0 && target < ROUNDS) edges.push({ from: `${dvc}-${rnd}`, to: `${dvc - 1}-${target}` })
  }
}

const forward = new Map<string, string[]>()
const backward = new Map<string, string[]>()
for (const n of nodes) { forward.set(n.id, []); backward.set(n.id, []) }
for (const e of edges) { forward.get(e.from)!.push(e.to); backward.get(e.to)!.push(e.from) }

function reach(start: string, adj: Map<string, string[]>): Set<string> {
  const seen = new Set<string>()
  const stack = [...adj.get(start)!]
  while (stack.length) {
    const cur = stack.pop()!
    if (seen.has(cur)) continue
    seen.add(cur)
    for (const nxt of adj.get(cur)!) stack.push(nxt)
  }
  return seen
}

// a few interesting reference events to cycle through
const refs = ['1-2', '2-4', '1-5', '3-3']
const refIndex = ref(0)
const refId = computed(() => refs[refIndex.value % refs.length])
const past = computed(() => reach(refId.value, backward))
const future = computed(() => reach(refId.value, forward))

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => { refIndex.value++ }, 2600)
})
onUnmounted(() => { if (timer) clearInterval(timer) })

function classOf(id: string) {
  if (id === refId.value) return 'ref'
  if (past.value.has(id)) return 'past'
  if (future.value.has(id)) return 'future'
  return 'neutral'
}
function edgeClass(e: Edge) {
  const a = classOf(e.from)
  const b = classOf(e.to)
  if (a === 'past' || a === 'ref') if (b === 'ref' || b === 'future' || b === 'past') return 'lit'
  return 'dim'
}
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="event-structure">
    <text v-for="dvc in DEVICES" :key="'lbl' + dvc" :x="18" :y="marginY + (dvc - 1) * dy + 5" class="devlabel">δ{{ dvc }}</text>
    <text :x="marginX" :y="H - 8" class="axislabel">time →</text>

    <line v-for="e in edges" :key="e.from + e.to"
      :x1="nodeMap.get(e.from)!.x" :y1="nodeMap.get(e.from)!.y"
      :x2="nodeMap.get(e.to)!.x" :y2="nodeMap.get(e.to)!.y"
      :class="['edge', edgeClass(e)]" />

    <g v-for="n in nodes" :key="n.id">
      <circle :cx="n.x" :cy="n.y" :r="R" :class="['node', classOf(n.id)]" />
    </g>
  </svg>
  <div class="legend">
    <span><i class="dot ref" /> reference event ε</span>
    <span><i class="dot past" /> causal past (&lt; ε)</span>
    <span><i class="dot future" /> causal future (ε &lt; ·)</span>
  </div>
</template>

<style scoped>
.event-structure { width: 100%; height: auto; overflow: visible; }
.devlabel { font-size: 13px; fill: #6b7280; }
.axislabel { font-size: 12px; fill: #6b7280; }
.node {
  stroke: #94a3b8;
  stroke-width: 1.5;
  fill: #e5e7eb;
  transition: fill 0.7s ease, stroke 0.7s ease, r 0.4s ease;
}
.node.ref { fill: #facc15; stroke: #ca8a04; r: 14; }
.node.past { fill: #4ade80; stroke: #16a34a; }
.node.future { fill: #60a5fa; stroke: #2563eb; }
.edge { stroke: #cbd5e1; stroke-width: 1.5; transition: stroke 0.7s ease, stroke-width 0.7s ease; }
.edge.lit { stroke: #94a3b8; stroke-width: 2.2; }
.legend { display: flex; gap: 1.5em; justify-content: center; margin-top: 0.5em; font-size: 0.8em; color: #64748b; }
.dot { display: inline-block; width: 0.8em; height: 0.8em; border-radius: 50%; margin-right: 0.35em; vertical-align: middle; }
.dot.ref { background: #facc15; }
.dot.past { background: #4ade80; }
.dot.future { background: #60a5fa; }
</style>
