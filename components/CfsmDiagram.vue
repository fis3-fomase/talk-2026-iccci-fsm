<script setup lang="ts">
// Static reproduction of Fig. 3(a) in the paper (state machine diagram
// for the synthetic search-and-rescue case study). No animation/highlighting:
// all states and transitions are always shown, exactly as in the figure.

const pos = {
  Wait: { x: 130, y: 230 },
  Wander: { x: 510, y: 230 },
  Solve: { x: 320, y: 70 },
  Defend: { x: 320, y: 390 },
}

type Seg = { t: string; i?: boolean }
const dash = ' / −'
const inf = ' / ∞'

const edges: { id: string; d: string; label: Seg[]; lx: number; ly: number; rotate: number }[] = [
  { id: 'help', d: 'M195,230 L445,230', label: [{ t: `Help Asked${dash}` }, { t: 't', i: true }], lx: 320, ly: 208, rotate: 0 },
  { id: 'solved-inner', d: 'M295,372 Q160,320 140,260', label: [{ t: `Solved${dash}` }, { t: 't', i: true }], lx: 230, ly: 305, rotate: -10 },
  { id: 'solve-wait', d: 'M300,90 Q220,120 155,205', label: [{ t: `Solved${dash}` }, { t: 't', i: true }], lx: 204, ly: 128, rotate: -38 },
  { id: 'wander-solve', d: 'M480,205 Q420,120 365,100', label: [{ t: `Found problem${dash}` }, { t: 't', i: true }], lx: 456, ly: 138, rotate: 50 },
  { id: 'wait-defend', d: 'M100,255 Q150,340 260,395', label: [{ t: `Base Attacked${inf}` }], lx: 145, ly: 342, rotate: 39 },
  { id: 'wander-defend', d: 'M490,255 Q450,340 385,375', label: [{ t: `Base Attacked${inf}` }], lx: 490, ly: 332, rotate: -39 },
]
</script>

<template>
  <svg viewBox="0 0 640 430" class="cfsm">
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" class="arrowhead" />
      </marker>
      <filter id="nodeShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="2" dy="3" stdDeviation="1.4" flood-color="#000000" flood-opacity="0.35" />
      </filter>
    </defs>

    <g v-for="e in edges" :key="e.id">
      <path :d="e.d" fill="none" class="edge" marker-end="url(#arrow)" />
      <text :x="e.lx" :y="e.ly" class="elabel" :transform="`rotate(${e.rotate} ${e.lx} ${e.ly})`">
        <tspan v-for="(s, i) in e.label" :key="i" :font-style="s.i ? 'italic' : 'normal'">{{ s.t }}</tspan>
      </text>
    </g>

    <g v-for="(p, name) in pos" :key="name">
      <rect :x="p.x - 62" :y="p.y - 26" width="124" height="52" rx="26" class="state" filter="url(#nodeShadow)" />
      <text :x="p.x" :y="p.y + 7" class="slabel">{{ name }}</text>
    </g>
  </svg>
</template>

<style scoped>
.cfsm { width: 100%; height: auto; overflow: visible; }

.state { fill: white; stroke: #1a1a1a; stroke-width: 2; }
.slabel { text-anchor: middle; font-size: 22px; font-weight: 700; fill: #1a1a1a; font-family: Arial, Helvetica, sans-serif; }

.edge { stroke: #1a1a1a; stroke-width: 1.75; }
.arrowhead { fill: #1a1a1a; }

.elabel { text-anchor: middle; font-size: 16px; fill: #1a1a1a; font-family: 'Times New Roman', Georgia, serif; }
</style>
