<script setup lang="ts">
defineProps<{
  /** optional small caption shown above each quadrant's content */
  labels?: [string?, string?, string?, string?]
  /** total height of the 2x2 grid (CSS length), e.g. "440px" */
  height?: string
}>()
</script>

<template>
  <div class="quadrants" :style="{ height: height || '410px' }">
    <div class="q-row">
      <div class="quadrant">
        <div v-if="labels?.[0]" class="quadrant-label">{{ labels[0] }}</div>
        <div class="quadrant-body">
          <slot name="top-left"><span class="placeholder">top-left</span></slot>
        </div>
      </div>
      <div class="quadrant">
        <div v-if="labels?.[1]" class="quadrant-label">{{ labels[1] }}</div>
        <div class="quadrant-body">
          <slot name="top-right"><span class="placeholder">top-right</span></slot>
        </div>
      </div>
    </div>
    <div class="q-row">
      <div class="quadrant">
        <div v-if="labels?.[2]" class="quadrant-label">{{ labels[2] }}</div>
        <div class="quadrant-body">
          <slot name="bottom-left"><span class="placeholder">bottom-left</span></slot>
        </div>
      </div>
      <div class="quadrant">
        <div v-if="labels?.[3]" class="quadrant-label">{{ labels[3] }}</div>
        <div class="quadrant-body">
          <slot name="bottom-right"><span class="placeholder">bottom-right</span></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quadrants {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
}
.q-row {
  display: flex;
  gap: 10px;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}
.quadrant {
  flex: 1 1 0;
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.quadrant-label {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.6;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
  flex-shrink: 0;
}
.quadrant-body {
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.placeholder {
  margin: auto;
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
}
</style>
