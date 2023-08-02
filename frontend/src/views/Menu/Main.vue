<template>
  <div>
    <!-- -->
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUrl } from '@/composites/url'
import { useFeathers } from '@/composites/feathers'

const props = defineProps<{
  menuId: string
}>()

const { api } = useFeathers()

const router = useRouter()

const { menuUrl } = useUrl()

const { data: menus } = api.service('menus').useFind({
  query: {},
})

const userMenu = computed(() => menus.value?.[0])

const menu = computed(() => userMenu.value?.list.find((m) => m._id === props.menuId))

const firstTab = computed(() => menu.value?.tabs[0])

watch(firstTab, () => {
  if (firstTab.value) {
    // Automatically go to the first tab
    router.replace(menuUrl(props.menuId as string, firstTab.value?._id))
  }
}, { immediate: true })
</script>
