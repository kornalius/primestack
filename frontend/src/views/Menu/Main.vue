<template>
  <q-page class="q-pa-sm">
    <!-- -->
  </q-page>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUrl } from '@/composites/url'
import { useFeathersService } from '@/composites/feathers'
import { useApp } from '@/features/App/store'

const props = defineProps<{
  menuId: string
}>()

const app = useApp()

const router = useRouter()

const { menuUrl } = useUrl()

const userMenu = useFeathersService('menus')
  .findOneInStore({ query: {} })

const menu = computed(() => userMenu.value?.list.find((m) => m._id === props.menuId))

watch(menu, () => {
  app.setMenu(menu.value?._id)
  app.setTab(undefined)
  app.setForm(undefined)
  app.setTable(undefined)
  app.setDoc(undefined)
}, { immediate: true })

const firstTab = computed(() => menu.value?.tabs[0])

watch(firstTab, () => {
  if (firstTab.value) {
    // Automatically go to the first tab
    router.replace(menuUrl(props.menuId as string, app.tabId || firstTab.value?._id))
  }
}, { immediate: true })
</script>
