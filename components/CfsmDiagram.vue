<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const pos = {
  Wait: { x: 130, y: 230 },
  Wander: { x: 510, y: 230 },
  Solve: { x: 320, y: 70 },
  Defend: { x: 320, y: 390 },
}

const edges = [
  { id: 'e1', label: 'alarm / −t', d: 'M150,205 Q320,140 490,205', lx: 320, ly: 150, kind: 'normal' },
  { id: 'e2', label: 'found / −t', d: 'M480,205 Q420,120 345,90', lx: 452, ly: 145, kind: 'normal' },
  { id: 'e3', label: 'solved / −t', d: 'M300,90 Q220,120 155,205', lx: 205, ly: 145, kind: 'normal' },
  { id: 'e4', label: 'attacked / ∞', d: 'M150,255 Q220,340 300,375', lx: 165, ly: 335, kind: 'critical' },
  { id: 'e5', label: 'attacked / ∞', d: 'M490,255 Q420,340 345,375', lx: 475, ly: 335, kind: 'critical' },
  { id: 'e6', label: 'attacked / ∞', d: 'M320,95 L320,365', lx: 345, ly: 230, kind: 'critical' },
  { id: 'e7', label: 'defended / −t', d: 'M295,372 Q160,320 140,260', lx: 195, ly: 350, kind: 'normal' },
]

// story matching the search-and-rescue case study: alarm -> wander -> solve -> solved
// then a second mission interrupted by a base attack (priority ∞ preempts wandering)
const timeline: { node: keyof typeof pos; edge: string | null }[] = [
  { node: 'Wait', edge: null },
  { node: 'Wait', edge: 'e1' },
  { node: 'Wander', edge: null },
  { node: 'Wander', edge: 'e2' },
  { node: 'Solve', edge: null },
  { node: 'Solve', edge: 'e3' },
  { node: 'Wait', edge: null },
  { node: 'Wait', edge: 'e1' },
  { node: 'Wander', edge: null },
  { node: 'Wander', edge: 'e5' },
  { node: 'Defend', edge: null },
  { node: 'Defend', edge: 'e7' },
]

const step = ref(0)
const cur = computed(() => timeline[step.value % timeline.length])

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => { step.value++ }, 1100) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<template>
  <svg viewBox="0 0 640 430" class="cfsm">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" class="arrowhead" />
      </marker>
      <marker id="arrow-crit" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" class="arrowhead-crit" />
      </marker>
    </defs>

    <g v-for="e in edges" :key="e.id">
      <path :d="e.d" fill="none"
        :class="['edge', e.kind, { active: cur.edge === e.id }]"
        :marker-end="e.kind === 'critical' ? 'url(#arrow-crit)' : 'url(#arrow)'" />
      <text :x="e.lx" :y="e.ly" :class="['elabel', e.kind, { active: cur.edge === e.id }]">{{ e.label }}</text>
    </g>

    <g v-for="(p, name) in pos" :key="name">
      <rect :x="p.x - 62" :y="p.y - 26" width="124" height="52" rx="26"
        :class="['state', name === 'Defend' ? 'defend' : '', { active: cur.node === name }]" />
      <text :x="p.x" :y="p.y + 7" class="slabel">{{ name }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cfsm { width: 100%; height: auto; overflow: visible; }
.state {
  fill: white; stroke: #475569; stroke-width: 2;
  transition: fill 0.4s ease, stroke 0.4s ease, filter 0.4s ease;
}
.state.defend { stroke: #b91c1c; }
.state.active { fill: #fde68a; stroke: #ca8a04; filter: drop-shadow(0 0 6px rgba(202,138,4,0.7)); }
.state.defend.active { fill: #fecaca; stroke: #b91c1c; filter: drop-shadow(0 0 6px rgba(185,28,28,0.7)); }
.slabel { text-anchor: middle; font-size: 22px; font-weight: 700; fill: #1e293b; font-family: sans-serif; }

.edge { stroke: #94a3b8; stroke-width: 2; transition: stroke 0.4s ease, stroke-width 0.4s ease; }
.edge.critical { stroke: #ef4444; stroke-dasharray: 6 4; }
.edge.active { stroke: #ca8a04; stroke-width: 4; }
.edge.critical.active { stroke: #b91c1c; stroke-width: 4; }
.arrowhead { fill: #94a3b8; }
.arrowhead-crit { fill: #ef4444; }

.elabel { text-anchor: middle; font-size: 15px; fill: #64748b; font-family: sans-serif; transition: fill 0.4s ease, font-weight 0.4s ease; }
.elabel.critical { fill: #dc2626; }
.elabel.active { fill: #92400e; font-weight: 700; }
.elabel.critical.active { fill: #7f1d1d; font-weight: 700; }
</style>
