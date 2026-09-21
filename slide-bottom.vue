
<script setup>
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { citations } from './citations.data'
import { useSlideFootnoteKeys } from './slide-footnotes'

// Per-slide instance (unlike global-bottom.vue, which is a single instance
// shared across the whole deck) -- so useSlideContext() here correctly
// reflects the specific slide this component is attached to.
const { $page } = useSlideContext()
const footnoteKeys = useSlideFootnoteKeys($page.value)
const footnotes = computed(() => footnoteKeys.value.map((key) => citations[key]).filter(Boolean))
</script>

<template>
    <div v-if="footnotes.length" class="slide-footnotes" aria-hidden="true">
        <div v-for="e in footnotes" :key="e.key" class="slide-footnote">
            <span class="slide-footnote-num">[{{ e.number }}]</span>
            <span v-html="e.text"></span>
        </div>
    </div>
</template>

<style scoped>
/* Positioned relative to the slide box itself (`.slidev-page`, the nearest
   positioned ancestor here) -- NOT `position: fixed` -- so it sits just
   above the global-bottom bar, within the current slide's own bounds. */
.slide-footnotes {
    position: absolute;
    left: 3.5rem;
    right: 3.5rem;
    bottom: 4em;
    display: flex;
    flex-direction: column;
    gap: 0.15em;
    font-size: 0.6em;
    line-height: 1.35;
    opacity: 0.65;
    border-top: 1px solid currentColor;
    padding-top: 0.3em;
}
.slide-footnote {
    display: flex;
    gap: 0.4em;
}
.slide-footnote-num {
    flex-shrink: 0;
}
</style>
