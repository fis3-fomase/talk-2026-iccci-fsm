<script setup>
import { computed } from 'vue'

const props = defineProps({
  click: {
    type: [Number, String],
    default: 0
  }
})

// Convert to number if passed as string
const currentClick = computed(() => {
  const val = Number(props.click)
  return isNaN(val) ? 0 : val
})

const activePhase = computed(() => {
  // Click 1 -> Sense
  // Click 2 -> Compute
  // Click 3 -> Interact/Act
  // Click 0 or >= 4 -> All active (overview)
  if (currentClick.value === 1) return 'sense'
  if (currentClick.value === 2) return 'compute'
  if (currentClick.value === 3) return 'interact'
  return 'all'
})

const isSense = computed(() => activePhase.value === 'sense')
const isCompute = computed(() => activePhase.value === 'compute')
const isInteract = computed(() => activePhase.value === 'interact')
const isOverview = computed(() => activePhase.value === 'all')

const sensorsActive = computed(() => isSense.value || isOverview.value)
const actuatorsActive = computed(() => isInteract.value || isOverview.value)
const nbrLinesActive = computed(() => isSense.value || isInteract.value || isOverview.value)
const outputVisible = computed(() => isCompute.value || isOverview.value)
</script>

<template>
  <div class="loop-shell">
    <svg viewBox="0 0 520 360" class="loop-svg" aria-hidden="true">
      <!-- Device envelope -->
      <rect class="device-box" x="155" y="25" width="210" height="230" rx="4"></rect>
      <text class="device-label" x="260" y="278" text-anchor="middle">device</text>

      <!-- Internal sense-compute-interact loop -->
      <path d="M200,166 C 206,130 222,110 245,104" class="loop-arc" :class="{ 'is-active': isSense || isCompute || isOverview }"></path>
      <path d="M275,104 C 298,110 314,130 320,166" class="loop-arc" :class="{ 'is-active': isCompute || isInteract || isOverview }"></path>
      <path d="M291,178 C 273,206 247,206 229,178" class="loop-arc" :class="{ 'is-active': isInteract || isSense || isOverview }"></path>

      <!-- Output message appearing during compute -->
      <circle cx="260" cy="66" r="6" class="output-dot" :class="{ 'is-active': outputVisible }"></circle>

      <!-- Phase pills -->
      <rect x="231" y="83" width="58" height="24" rx="12" class="loop-pill" :class="{ 'is-active': isCompute || isOverview }"></rect>
      <text x="260" y="99" text-anchor="middle" class="pill-label" :class="{ 'is-active': isCompute || isOverview }">Compute</text>

      <rect x="171" y="166" width="58" height="24" rx="12" class="loop-pill" :class="{ 'is-active': isSense || isOverview }"></rect>
      <text x="200" y="182" text-anchor="middle" class="pill-label" :class="{ 'is-active': isSense || isOverview }">Sense</text>

      <rect x="291" y="166" width="58" height="24" rx="12" class="loop-pill" :class="{ 'is-active': isInteract || isOverview }"></rect>
      <text x="320" y="182" text-anchor="middle" class="pill-label" :class="{ 'is-active': isInteract || isOverview }">Interact</text>

      <!-- Sensors / actuators, inside the device -->
      <line x1="200" y1="190" x2="200" y2="206" class="io-connector" :class="{ 'is-active': sensorsActive }"></line>
      <rect x="168" y="206" width="64" height="32" rx="3" class="io-box" :class="{ 'is-active': sensorsActive }"></rect>
      <text x="200" y="226" text-anchor="middle" class="io-label" :class="{ 'is-active': sensorsActive }">sensors</text>

      <line x1="320" y1="190" x2="320" y2="206" class="io-connector" :class="{ 'is-active': actuatorsActive }"></line>
      <rect x="288" y="206" width="64" height="32" rx="3" class="io-box" :class="{ 'is-active': actuatorsActive }"></rect>
      <text x="320" y="226" text-anchor="middle" class="io-label" :class="{ 'is-active': actuatorsActive }">actuators</text>

      <!-- Neighbours, outside the device -->
      <rect x="20" y="150" width="75" height="60" rx="3" class="nbr-box"></rect>
      <text x="57" y="184" text-anchor="middle" class="nbr-label">nbr</text>

      <rect x="425" y="150" width="75" height="60" rx="3" class="nbr-box"></rect>
      <text x="462" y="184" text-anchor="middle" class="nbr-label">nbr</text>

      <line x1="155" y1="180" x2="95" y2="180" class="nbr-line" :class="{ 'is-active': nbrLinesActive }"></line>
      <line x1="365" y1="180" x2="425" y2="180" class="nbr-line" :class="{ 'is-active': nbrLinesActive }"></line>

      <!-- Messages read from neighbours during sense -->
      <circle cx="100" cy="180" r="6" class="msg-dot msg-dot-in-left" :class="{ 'is-active': isSense }"></circle>
      <circle cx="420" cy="180" r="6" class="msg-dot msg-dot-in-right" :class="{ 'is-active': isSense }"></circle>

      <!-- Messages broadcast to neighbours during interact -->
      <circle cx="150" cy="180" r="6" class="msg-dot msg-dot-out-left" :class="{ 'is-active': isInteract }"></circle>
      <circle cx="370" cy="180" r="6" class="msg-dot msg-dot-out-right" :class="{ 'is-active': isInteract }"></circle>
    </svg>
  </div>
</template>

<style scoped>
.loop-shell {
  position: relative;
  width: 100%;
  min-height: 18rem;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(16, 32, 43, 0.12);
  overflow: hidden;
}

.loop-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Device envelope */
.device-box {
  fill: rgba(15, 76, 92, 0.04);
  stroke: rgba(15, 76, 92, 0.35);
  stroke-width: 2;
}

.device-label {
  fill: #52616d;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Internal loop */
.loop-arc {
  fill: none;
  stroke: rgba(15, 76, 92, 0.18);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 6 8;
  transition: stroke 0.3s ease;
}

.loop-arc.is-active {
  stroke: rgba(15, 76, 92, 0.6);
  animation: arc-flow 3.6s linear infinite;
}

.loop-pill {
  fill: rgba(255, 255, 255, 0.92);
  stroke: rgba(16, 32, 43, 0.15);
  stroke-width: 1;
  transition: all 0.3s ease;
}

.pill-label {
  fill: #10202b;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.55;
  transition: all 0.3s ease;
}

.loop-pill.is-active {
  stroke-width: 1.6;
}

.pill-label.is-active {
  opacity: 1;
}

/* Output message that appears during compute */
.output-dot {
  fill: #d97706;
  opacity: 0;
  transform-origin: 260px 66px;
  transition: opacity 0.3s ease;
}

.output-dot.is-active {
  opacity: 1;
  animation: output-appear 2s ease-in-out infinite;
}

/* Sensors / actuators */
.io-box {
  fill: rgba(255, 255, 255, 0.9);
  stroke: rgba(16, 32, 43, 0.15);
  stroke-width: 1;
  transition: all 0.3s ease;
}

.io-label {
  fill: #52616d;
  font-size: 10px;
  font-weight: 600;
  opacity: 0.55;
  transition: all 0.3s ease;
}

.io-connector {
  stroke: rgba(16, 32, 43, 0.15);
  stroke-width: 2;
  transition: stroke 0.3s ease;
}

.io-box.is-active {
  stroke: #d97706;
  stroke-width: 1.6;
  filter: drop-shadow(0 0 4px rgba(217, 119, 6, 0.35));
}

.io-connector.is-active {
  stroke: #d97706;
}

.io-label.is-active {
  opacity: 1;
  fill: #d97706;
}

/* Neighbours */
.nbr-box {
  fill: rgba(255, 255, 255, 0.92);
  stroke: rgba(16, 32, 43, 0.12);
  stroke-width: 1;
}

.nbr-label {
  fill: #52616d;
  font-size: 11px;
  font-weight: 600;
}

.nbr-line {
  stroke: rgba(15, 76, 92, 0.15);
  stroke-width: 3;
  stroke-dasharray: 6 8;
  transition: stroke 0.3s ease;
}

.nbr-line.is-active {
  stroke: rgba(15, 76, 92, 0.55);
}

/* Messages travelling on neighbour links */
.msg-dot {
  fill: #d97706;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.msg-dot.is-active {
  opacity: 1;
}

.msg-dot-in-left.is-active {
  animation: msg-in-left 2s ease-in-out infinite;
}

.msg-dot-in-right.is-active {
  animation: msg-in-right 2s ease-in-out infinite;
}

.msg-dot-out-left.is-active {
  animation: msg-out-left 2s ease-in-out infinite;
}

.msg-dot-out-right.is-active {
  animation: msg-out-right 2s ease-in-out infinite;
}

@keyframes arc-flow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -56;
  }
}

@keyframes output-appear {
  0%,
  100% {
    transform: scale(0.4);
    opacity: 0.25;
  }
  50% {
    transform: scale(1.15);
    opacity: 1;
  }
}

@keyframes msg-in-left {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.15;
  }
  45% {
    transform: translateX(50px);
    opacity: 1;
  }
}

@keyframes msg-in-right {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.15;
  }
  45% {
    transform: translateX(-50px);
    opacity: 1;
  }
}

@keyframes msg-out-left {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.15;
  }
  45% {
    transform: translateX(-50px);
    opacity: 1;
  }
}

@keyframes msg-out-right {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.15;
  }
  45% {
    transform: translateX(50px);
    opacity: 1;
  }
}
</style>
