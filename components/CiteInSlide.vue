<script setup lang="ts">
import { useSlideContext } from '@slidev/client'
import { onBeforeUnmount, onMounted } from 'vue'
import { registerSlideFootnote, unregisterSlideFootnote } from '../slide-footnotes'

// Like <Cite>, but also adds the full reference at the bottom of the slide
// it's used in. Usage: <CiteInSlide id="bibtexKey" /> (comma-separated ids
// for a joint citation, same as <Cite>).
const props = defineProps<{ id: string }>()
const { $page } = useSlideContext()

const keys = () => props.id.split(',').map((k) => k.trim()).filter(Boolean)

onMounted(() => {
  for (const key of keys()) registerSlideFootnote($page.value, key)
})

onBeforeUnmount(() => {
  for (const key of keys()) unregisterSlideFootnote($page.value, key)
})
</script>

<template>
  <Cite :id="id" />
</template>
