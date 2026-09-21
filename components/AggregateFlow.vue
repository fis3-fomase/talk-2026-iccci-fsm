<script setup lang="ts">
import { computed } from 'vue'

// Every stage stays "live" and breathes on its own independent timing,
// so the elements animate simultaneously rather than sweeping left-to-right.

// Progressive reveal: stages fade in as the presenter clicks through the
// matching bullet items. Without a `click` prop the whole pipeline is shown.
const props = defineProps<{ click?: number }>()
const c = computed(() => props.click ?? 99)
const shown = (threshold: number) => c.value >= threshold

// A small irregular network of devices.
const nodes = [
  { x: 24, y: 30 },
  { x: 64, y: 18 },
  { x: 96, y: 50 },
  { x: 40, y: 64 },
  { x: 78, y: 78 },
  { x: 18, y: 92 },
  { x: 110, y: 90 },
  { x: 56, y: 104 },
]
const edges = [
  [0, 1], [1, 2], [0, 3], [3, 4], [2, 4],
  [3, 5], [4, 7], [4, 6], [5, 7], [6, 7],
]
</script>

<template>
  <div class="agg-flow">
    <!-- 1. Network of devices -->
    <div class="agg-stage is-active" :class="{ 'agg-hidden': !shown(0) }">
      <svg viewBox="0 0 128 128" class="agg-canvas">
        <line
          v-for="(e, i) in edges"
          :key="`e-${i}`"
          :x1="nodes[e[0]].x" :y1="nodes[e[0]].y"
          :x2="nodes[e[1]].x" :y2="nodes[e[1]].y"
          class="agg-edge"
        />
        <circle
          v-for="(n, i) in nodes"
          :key="`n-${i}`"
          :cx="n.x" :cy="n.y" r="6"
          class="agg-node"
        />
      </svg>
      <span class="agg-label">Network of devices</span>
      <span class="agg-sub">neighbour interaction</span>
    </div>

    <div class="agg-arrow is-active" :class="{ 'agg-hidden': !shown(1) }">→</div>

    <!-- 2. Continuum -->
    <div class="agg-stage is-active" :class="{ 'agg-hidden': !shown(1) }">
      <svg viewBox="0 0 128 128" class="agg-canvas">
        <defs>
          <radialGradient id="contGrad" cx="42%" cy="40%" r="75%">
            <stop offset="0%" stop-color="rgba(15,76,92,0.85)" />
            <stop offset="55%" stop-color="rgba(15,76,92,0.32)" />
            <stop offset="100%" stop-color="rgba(15,76,92,0.05)" />
          </radialGradient>
        </defs>
        <rect x="10" y="10" width="108" height="108" rx="4" fill="url(#contGrad)" />
        <circle
          v-for="(n, i) in nodes"
          :key="`cn-${i}`"
          :cx="n.x" :cy="n.y" r="2.4"
          class="agg-ghost-node"
        />
      </svg>
      <span class="agg-label">Computational field</span>
      <span class="agg-sub">value per device, over a continuum</span>
    </div>

    <div class="agg-arrow is-active" :class="{ 'agg-hidden': !shown(2) }">→</div>

    <!-- 3. Composition of fields -->
    <div class="agg-stage is-active" :class="{ 'agg-hidden': !shown(2) }">
      <svg viewBox="0 0 128 128" class="agg-canvas">
        <defs>
          <radialGradient id="fieldA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(217,119,6,0.8)" />
            <stop offset="100%" stop-color="rgba(217,119,6,0)" />
          </radialGradient>
          <radialGradient id="fieldB" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(47,107,91,0.8)" />
            <stop offset="100%" stop-color="rgba(47,107,91,0)" />
          </radialGradient>
        </defs>
        <circle cx="46" cy="56" r="40" fill="url(#fieldA)" />
        <circle cx="84" cy="72" r="40" fill="url(#fieldB)" />
        <text x="64" y="118" text-anchor="middle" class="agg-op">f ∘ g</text>
      </svg>
      <span class="agg-label">Field composition</span>
      <span class="agg-sub">functional operators</span>
    </div>

    <div class="agg-arrow is-active" :class="{ 'agg-hidden': !shown(3) }">→</div>

    <!-- 4. Global effect -->
    <div class="agg-stage agg-stage-global is-active" :class="{ 'agg-hidden': !shown(3) }">
      <svg viewBox="0 0 128 128" class="agg-canvas">
        <defs>
          <linearGradient id="linkGrad" x1="30" y1="98" x2="98" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="rgba(47,107,91,0.95)" />
            <stop offset="50%" stop-color="rgba(15,76,92,0.85)" />
            <stop offset="100%" stop-color="rgba(217,119,6,0.95)" />
          </linearGradient>
          <radialGradient id="fieldBg" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stop-color="rgba(15,76,92,0.12)" />
            <stop offset="100%" stop-color="rgba(15,76,92,0.02)" />
          </radialGradient>
        </defs>
        <rect x="10" y="10" width="108" height="108" rx="4" fill="url(#fieldBg)" />
        <!-- soft gradient band connecting the two endpoints -->
        <line x1="30" y1="98" x2="98" y2="30" stroke="url(#linkGrad)" stroke-width="11" stroke-linecap="round" opacity="0.35" />
        <line x1="30" y1="98" x2="98" y2="30" stroke="url(#linkGrad)" stroke-width="4" stroke-linecap="round" />
        <!-- animated flow along the gradient -->
        <line x1="30" y1="98" x2="98" y2="30" class="agg-channel" />
        <!-- the two connected points (source -> target) -->
        <circle cx="30" cy="98" r="7.5" fill="rgba(47,107,91,1)" />
        <circle cx="98" cy="30" r="7.5" fill="rgba(217,119,6,1)" />
      </svg>
      <span class="agg-label">Collective behaviour</span>
      <span class="agg-sub">self-organising global effect</span>
    </div>
  </div>
</template>

<style scoped>
.agg-flow {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0.55rem;
  width: 100%;
}

.agg-stage {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.5rem 0.4rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(16, 32, 43, 0.12);
  flex: 1 1 0;
  min-width: 0;
  transition: all 0.45s ease;
  animation: agg-breathe 3s ease-in-out infinite;
}

/* Each stage breathes on its own timing (non-sequential, negative delays
   so they animate at once instead of sweeping left-to-right). */
.agg-flow > .agg-stage:nth-child(1) { animation-duration: 3.1s; animation-delay: -0.4s; }
.agg-flow > .agg-stage:nth-child(3) { animation-duration: 2.6s; animation-delay: -1.7s; }
.agg-flow > .agg-stage:nth-child(5) { animation-duration: 3.5s; animation-delay: -0.9s; }
.agg-flow > .agg-stage:nth-child(7) { animation-duration: 2.9s; animation-delay: -2.3s; }

.agg-stage.is-active {
  border-color: var(--deck-teal);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 4px rgba(15, 76, 92, 0.1);
  transform: translateY(-2px);
}

/* Not-yet-revealed stages/arrows: fade out but keep their slot so the
   row never reflows as the presenter clicks through. */
.agg-hidden {
  opacity: 0;
  pointer-events: none;
  animation-play-state: paused;
}

.agg-canvas {
  width: 100%;
  max-width: 5.1rem;
  aspect-ratio: 1;
}

.agg-edge {
  stroke: rgba(15, 76, 92, 0.3);
  stroke-width: 2;
}

.agg-node {
  fill: var(--deck-teal);
}

.agg-ghost-node {
  fill: rgba(255, 255, 255, 0.85);
}

.agg-op {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  fill: var(--deck-ink);
}

.agg-channel {
  fill: none;
  stroke: rgba(255, 255, 255, 0.9);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 6 8;
}

.agg-stage.is-active .agg-channel {
  animation: channel-flow 3s linear infinite;
}

.agg-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--deck-muted, #52616d);
  text-align: center;
  line-height: 1.15;
}

.agg-stage.is-active .agg-label {
  color: var(--deck-teal);
}

.agg-sub {
  font-size: 0.64rem;
  font-weight: 500;
  color: rgba(82, 97, 109, 0.78);
  text-align: center;
  line-height: 1.1;
  margin-top: -0.25rem;
}

.agg-arrow {
  display: grid;
  place-items: center;
  font-size: 1.3rem;
  color: rgba(16, 32, 43, 0.28);
  transition: color 0.45s ease, transform 0.45s ease;
}

.agg-arrow.is-active {
  color: var(--deck-orange);
  transform: scale(1.25);
}

@keyframes channel-flow {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -56; }
}

@keyframes agg-breathe {
  0%, 100% {
    transform: translateY(0);
    box-shadow: 0 0 0 0 rgba(15, 76, 92, 0);
  }
  50% {
    transform: translateY(-3px);
    box-shadow: 0 0 0 5px rgba(15, 76, 92, 0.12);
  }
}
</style>
