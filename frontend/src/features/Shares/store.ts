import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useShareStore = defineStore('share', () => {
  const states = ref({
    shareId: undefined,
    linkClicked: undefined,
  })

  const shareId = computed(() => states.value.shareId)

  const linkClicked = computed(() => states.value.linkClicked)

  const setShareId = (id: string | undefined) => {
    states.value.shareId = id
  }

  const setLinkClicked = (timestamp: number | undefined) => {
    states.value.linkClicked = timestamp
  }

  return {
    states,
    shareId,
    linkClicked,
    setShareId,
    setLinkClicked,
  }
})
