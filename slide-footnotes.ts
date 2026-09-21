import { computed, reactive } from 'vue'

// Per-slide registry of citation keys added via <CiteInSlide id="..." />,
// keyed by the slide's page number (from useSlideContext().$page).
// A Map so slides that are pre-mounted/unmounted (Slidev preloads neighbours)
// don't leak footnotes onto the wrong slide.
const registry = reactive(new Map<number, string[]>())

export function registerSlideFootnote(page: number, key: string) {
  const list = registry.get(page) ?? []
  if (!list.includes(key)) {
    registry.set(page, [...list, key])
  }
}

export function unregisterSlideFootnote(page: number, key: string) {
  const list = registry.get(page)
  if (!list) return
  const next = list.filter((k) => k !== key)
  if (next.length) registry.set(page, next)
  else registry.delete(page)
}

export function useSlideFootnoteKeys(page: number) {
  return computed(() => registry.get(page) ?? [])
}
