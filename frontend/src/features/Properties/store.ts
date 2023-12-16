import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'

export const usePropertiesEditor = defineStore('properties-editor', () => {
  const sections = ref({}) as Ref<Record<string, string>>
  const scrollTops = ref({}) as Ref<Record<string, number>>
  const expanded = ref({}) as Ref<Record<string, boolean>>

  const setSection = (id: string, name: string) => {
    sections.value = { ...sections.value, [id]: name }
  }

  const section = (id: string): string => (
    sections.value[id]
  )

  const setScrollTop = (id: string, top: number) => {
    scrollTops.value = { ...scrollTops.value, [id]: top }
  }

  const scrollTop = (id: string): number => (
    scrollTops.value[id]
  )

  const setExpanded = (id: string, propName: string, isExpanded: boolean) => {
    expanded.value = { ...expanded.value, [`${id}-${propName}`]: isExpanded }
  }

  const isExpanded = (id: string, propName: string): boolean => (
    !!expanded.value[`${id}-${propName}`]
  )

  const expandedForId = (id: string): Record<string, boolean> => {
    const r = {}
    Object.keys(expanded.value).forEach((k) => {
      const p = k.split('-')
      if (p.length === 2 && p[0] === id) {
        r[p[1]] = expanded.value[k]
      }
    })
    return r
  }

  return {
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
