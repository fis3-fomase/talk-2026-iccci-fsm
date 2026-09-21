<script setup lang="ts">
const agents = [
  { x: 90, y: 330 },
  { x: 170, y: 355 },
  { x: 250, y: 330 },
  { x: 330, y: 360 },
  { x: 410, y: 330 },
  { x: 490, y: 355 },
  { x: 570, y: 330 },
]
</script>

<template>
  <svg viewBox="0 0 660 420" class="macromicro">
    <defs>
      <marker id="mm-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L7,3.5 L0,7 Z" class="mm-arrowhead" />
      </marker>
      <marker id="mm-arrow-up" markerWidth="9" markerHeight="9" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L7,3.5 L0,7 Z" class="mm-arrowhead-up" />
      </marker>
    </defs>

    <!-- macro level: one global spec -->
    <rect x="180" y="20" width="300" height="70" rx="14" class="mm-macro" />
    <text x="330" y="48" class="mm-title">macro level</text>
    <text x="330" y="74" class="mm-subtitle">one collective program / task</text>

    <!-- programming arrow: macro -> micro -->
    <path d="M270,95 C230,150 200,190 200,230" fill="none" class="mm-edge down" marker-end="url(#mm-arrow)" />
    <text x="165" y="165" class="mm-elabel down">program</text>

    <!-- inference arrow: micro -> macro -->
    <path d="M420,230 C450,180 465,150 405,95" fill="none" class="mm-edge up" marker-end="url(#mm-arrow-up)" />
    <text x="500" y="165" class="mm-elabel up">infer</text>

    <!-- micro level: many local agents -->
    <g v-for="(p, i) in agents" :key="i">
      <line :x1="330" :y1="230" :x2="p.x" :y2="p.y - 22" class="mm-link" />
    </g>
    <rect x="150" y="215" width="360" height="30" rx="8" class="mm-microband" />
    <text x="330" y="236" class="mm-microlabel">local device programs (emergent behaviour)</text>

    <g v-for="(p, i) in agents" :key="'a' + i">
      <circle :cx="p.x" :cy="p.y" r="20" class="mm-agent" />
      <circle :cx="p.x" :cy="p.y" r="5" class="mm-agent-dot" />
    </g>
    <text x="330" y="405" class="mm-title micro">micro level</text>
  </svg>
</template>

<style scoped>
.macromicro { width: 100%; height: auto; overflow: visible; }

.mm-macro {
  fill: #eff6ff; stroke: #2563eb; stroke-width: 2;
}
.mm-microband {
  fill: #f8fafc; stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4 3;
}

.mm-title { text-anchor: middle; font-size: 20px; font-weight: 800; fill: #1e293b; font-family: sans-serif; }
.mm-title.micro { fill: #334155; }
.mm-subtitle { text-anchor: middle; font-size: 13px; fill: #475569; font-family: sans-serif; }
.mm-microlabel { text-anchor: middle; font-size: 12px; fill: #64748b; font-family: sans-serif; }

.mm-edge { stroke-width: 2.5; }
.mm-edge.down { stroke: #2563eb; }
.mm-edge.up { stroke: #16a34a; stroke-dasharray: 5 4; }
.mm-arrowhead { fill: #2563eb; }
.mm-arrowhead-up { fill: #16a34a; }

.mm-elabel { text-anchor: middle; font-size: 14px; font-weight: 700; font-family: sans-serif; }
.mm-elabel.down { fill: #1d4ed8; }
.mm-elabel.up { fill: #15803d; }

.mm-link { stroke: #cbd5e1; stroke-width: 1.5; }

.mm-agent { fill: white; stroke: #475569; stroke-width: 2; }
.mm-agent-dot { fill: #64748b; }
</style>
