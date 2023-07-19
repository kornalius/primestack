<template>
  <div>
    <!-- -->
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/plugins/pinia'
import { useUrl } from '@/composites/url'

const props = defineProps<{
  menuId: string
}>()

const router = useRouter()

const { menuTabUrl } = useUrl()

const { data: menus } = api.service('menus').useFind({
  query: {},
})

const userMenu = computed(() => menus.value?.[0])

const menu = computed(() => userMenu.value?.list.find((m) => m._id === props.menuId))

const firstTab = computed(() => menu.value?.tabs[0])

watch(firstTab, () => {
  if (firstTab.value) {
    // Automatically go to the first tab
    router.replace(menuTabUrl(props.menuId as string, firstTab.value?._id))
  }
}, { immediate: true })
</script>
