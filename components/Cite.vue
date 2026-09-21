<script setup lang="ts">
import { computed } from 'vue'
import { citations } from '../citations.data'

// Usage: <Cite id="bibtexKey" /> or <Cite id="key1,key2" /> for a joint footnote.
const props = defineProps<{ id: string }>()

const entries = computed(() =>
  props.id.split(',').map((k) => k.trim()).filter(Boolean).map((key) => {
    const entry = citations[key]
    if (!entry) {
      console.warn(`[Cite] unknown citation id "${key}" — add it to bibliography.bib and rerun "npm run citations"`)
      return { key, number: '?', text: `Unknown citation: ${key}` }
    }
    return entry
  }),
)
</script>

<template>
  <sup class="cite">[<template v-for="(e, i) in entries" :key="e.key"><a :href="`#ref-${e.key}`" :title="e.text.replace(/<[^>]+>/g, '')" class="cite-link">{{ e.number }}</a><template v-if="i < entries.length - 1">,</template></template>]</sup>
</template>

<style scoped>
.cite {
  font-size: 0.65em;
  margin-left: 0.1em;
}
.cite-link {
  color: inherit;
  text-decoration: none;
  opacity: 0.7;
}
.cite-link:hover {
  opacity: 1;
  text-decoration: underline;
}
</style>
