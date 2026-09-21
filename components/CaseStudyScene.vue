<script setup lang="ts">
// A single, consolidated illustration of the search-and-rescue swarm case study
// (an improved, one-frame version of Fig. 2 in the paper: instead of four
// disconnected snapshots, one picture shows where each collective state
// "lives" spatially and how the swarm moves between them), plus a reminder
// that the whole scene is driven by one macro-program from "outside".

const base = { x: 46, y: 44 }
const target = { x: 322, y: 118 }

function tri(cx: number, cy: number, s = 9) {
  return `M${cx},${cy - s} L${cx + s * 0.87},${cy + s * 0.5} L${cx - s * 0.87},${cy + s * 0.5} Z`
}

// Wait: tight idle cluster right on the base
const wait = [
  { x: base.x - 8, y: base.y + 18 }, { x: base.x + 10, y: base.y + 20 },
  { x: base.x + 3, y: base.y + 33 }, { x: base.x - 13, y: base.y + 31 },
]

// Defend: a defensive ring drawn around the base
const defendRing = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2
  return { x: base.x + Math.cos(a) * 40, y: base.y + Math.sin(a) * 40 }
})

// Wander: spread across the terrain, loosely networked
const wander = [
  { x: 100, y: 40 }, { x: 150, y: 70 }, { x: 120, y: 110 }, { x: 175, y: 150 },
  { x: 210, y: 60 }, { x: 240, y: 100 }, { x: 90, y: 150 }, { x: 260, y: 170 },
  { x: 190, y: 190 },
]
const wanderEdges = [
  [0,1],[1,2],[1,4],[2,3],[2,6],[3,7],[4,5],[5,7],[3,8],[6,3],
]

// Solve: tight cluster converging on the target
const solve = [
  { x: target.x - 17, y: target.y - 12 }, { x: target.x + 3, y: target.y - 20 },
  { x: target.x + 19, y: target.y - 5 }, { x: target.x + 12, y: target.y + 15 },
  { x: target.x - 15, y: target.y + 15 },
]
</script>

<template>
  <svg viewBox="0 0 380 262" class="case-study">
    <!-- macro-program: the single program governing the whole scene, from "outside" -->
    <text x="190" y="14" class="macro-label">macro-program</text>
    <line x1="190" y1="19" x2="190" y2="34" class="macro-arrow" marker-end="url(#arrow-macro)" />

    <g transform="translate(0, 32)">
      <rect x="4" y="4" width="372" height="196" rx="10" class="terrain" />

      <!-- wander mesh (drawn first, underneath) -->
      <line v-for="(e, i) in wanderEdges" :key="'e' + i"
        :x1="wander[e[0]].x" :y1="wander[e[0]].y" :x2="wander[e[1]].x" :y2="wander[e[1]].y"
        class="mesh" />

      <!-- flight path: base -> search area -> target, and the return-to-defend arc -->
      <path :d="`M${base.x + 10},${base.y + 6} C 120,20 220,50 ${target.x - 20},${target.y - 6}`" class="path-out" marker-end="url(#arrow-out)" />
      <path :d="`M${target.x},${target.y + 20} C 220,190 120,170 ${base.x + 4},${base.y + 30}`" class="path-back" marker-end="url(#arrow-back)" />

      <!-- wander drones -->
      <path v-for="(d, i) in wander" :key="'w' + i" :d="tri(d.x, d.y)" class="drone wander" />

      <!-- defend ring around the base -->
      <path v-for="(d, i) in defendRing" :key="'d' + i" :d="tri(d.x, d.y, 8)" class="drone defend" />

      <!-- wait cluster on the base -->
      <path v-for="(d, i) in wait" :key="'q' + i" :d="tri(d.x, d.y, 8)" class="drone wait" />

      <!-- solve cluster on the target -->
      <path v-for="(d, i) in solve" :key="'s' + i" :d="tri(d.x, d.y, 8)" class="drone solve" />

      <!-- base station -->
      <rect :x="base.x - 9" :y="base.y - 9" width="18" height="18" rx="3" class="base-mark" />
      <text :x="base.x" :y="base.y - 14" class="tag">base</text>

      <!-- target -->
      <circle :cx="target.x" :cy="target.y" r="8" class="target-halo" />
      <circle :cx="target.x" :cy="target.y" r="4.5" class="target-mark" />
      <text :x="target.x + 30" :y="target.y - 8" class="tag">target</text>

      <!-- legend (base/target are already tagged directly in the scene) -->
      <g class="legend" transform="translate(30, 214)">
        <path :d="tri(8, 5, 8)" class="drone wait" /><text x="22" y="9" class="legend-label">Wait</text>
        <path :d="tri(108, 5, 8)" class="drone wander" /><text x="122" y="9" class="legend-label">Wander</text>
        <path :d="tri(238, 5, 8)" class="drone solve" /><text x="252" y="9" class="legend-label">Solve</text>
        <path :d="tri(338, 5, 8)" class="drone defend" /><text x="352" y="9" class="legend-label">Defend</text>
      </g>
    </g>

    <defs>
      <marker id="arrow-macro" markerWidth="8" markerHeight="8" refX="5" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L7,3.5 L0,7 Z" class="arrowhead-macro" />
      </marker>
      <marker id="arrow-out" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" class="arrowhead-out" />
      </marker>
      <marker id="arrow-back" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L6,3 L0,6 Z" class="arrowhead-back" />
      </marker>
    </defs>
  </svg>
</template>

<style scoped>
.case-study { width: 100%; height: auto; overflow: visible; }
.terrain { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; }

.mesh { stroke: #cbd5e1; stroke-width: 1.2; }

.path-out { fill: none; stroke: #94a3b8; stroke-width: 1.8; stroke-dasharray: 5 4; }
.path-back { fill: none; stroke: #94a3b8; stroke-width: 1.8; stroke-dasharray: 2 3; opacity: 0.8; }
.arrowhead-out, .arrowhead-back { fill: #94a3b8; }

.macro-label { text-anchor: middle; font-size: 18px; font-weight: 800; fill: #1d4ed8; font-family: sans-serif; }
.macro-arrow { stroke: #2563eb; stroke-width: 2.2; }
.arrowhead-macro { fill: #2563eb; }

.drone { stroke: #1e293b; stroke-width: 1; }
.drone.wait { fill: #ef4444; }
.drone.wander { fill: #f97316; }
.drone.solve { fill: #86efac; }
.drone.defend { fill: #16a34a; }

.base-mark { fill: #16a34a; stroke: #14532d; stroke-width: 1.2; }
.target-halo { fill: #fee2e2; stroke: #ef4444; stroke-width: 1.2; stroke-dasharray: 2 2; }
.target-mark { fill: #ef4444; }

.tag { text-anchor: middle; font-size: 15px; fill: #64748b; font-family: sans-serif; }
.legend-label { font-size: 15px; fill: #475569; font-family: sans-serif; dominant-baseline: middle; }
</style>
