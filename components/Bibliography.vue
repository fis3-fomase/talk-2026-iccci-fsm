<script setup lang="ts">
import { citations, citationOrder } from '../citations.data'

const entries = citationOrder.map((key) => citations[key])
</script>

<template>
  <p v-if="entries.length === 0" class="text-sm opacity-60">No references cited yet — use &lt;Cite id="bibtexKey" /&gt; in a slide.</p>
  <ol v-else class="bibliography">
    <li v-for="e in entries" :key="e.key" :id="`ref-${e.key}`">
      <span class="bib-num">[{{ e.number }}]</span>
      <span class="bib-text" v-html="e.text" />
      <a v-if="e.url" :href="e.url" class="bib-link" target="_blank" rel="noopener">↗</a>
    </li>
  </ol>
</template>

<style scoped>
.bibliography {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.7em;
  line-height: 1.55;
}
.bibliography li {
  display: flex;
  gap: 0.6em;
  align-items: baseline;
  margin-bottom: 0.4em;
}
.bib-num {
  opacity: 0.55;
  flex-shrink: 0;
  min-width: 2em;
}
.bib-link {
  opacity: 0.55;
  text-decoration: none;
  flex-shrink: 0;
}
.bib-link:hover {
  opacity: 1;
}
</style>
