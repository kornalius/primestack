import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const usePropertiesEditor = defineStore('properties-editor', () => {
  const states = ref({
    sections: {} as Record<string, string>,
    scrollTops: {} as Record<string, number>,
    expanded: {} as Record<string, boolean>,
  })

  const sections = computed(() => (
    states.value.sections
  ))

  const scrollTops = computed(() => (
    states.value.scrollTops
  ))

  const expanded = computed(() => (
    states.value.expanded
  ))

  const setSection = (id: string, name: string) => {
    states.value.sections = { ...states.value.sections, [id]: name }
  }

  const section = (id: string): string => (
    states.value.sections[id]
  )

  const setScrollTop = (id: string, top: number) => {
    states.value.scrollTops = { ...states.value.scrollTops, [id]: top }
  }

  const scrollTop = (id: string): number => (
    states.value.scrollTops[id]
  )

  const setExpanded = (id: string, propName: string, isExpanded: boolean) => {
    states.value.expanded = { ...states.value.expanded, [`${id}-${propName}`]: isExpanded }
  }

  const isExpanded = (id: string, propName: string): boolean => (
    !!states.value.expanded[`${id}-${propName}`]
  )

  const expandedForId = (id: string): Record<string, boolean> => {
    const r = {}
    Object.keys(states.value.expanded).forEach((k) => {
      const p = k.split('-')
      if (p.length === 2 && p[0] === id) {
        r[p[1]] = states.value.expanded[k]
      }
    })
    return r
  }

  return {
    states,
    sections,
    scrollTops,
    expanded,
    setSection,
    section,
    setScrollTop,
    scrollTop,
    setExpanded,
    isExpanded,
    expandedForId,
  }
})
