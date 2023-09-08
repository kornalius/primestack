<template>
  <q-tabs
    v-model="currentTab"
    align="left"
    inline-label
    dense
  >
    <array-editor
      v-model="tabs"
      :add-function="() => editor.addTab(true)"
      :remove-function="(t) => editor.removeTab(t._id)"
      add-button="end"
      horizontal
      no-separator
      reorderable
      @click.stop=""
    >
      <template #default="{ value: t }: { value: AnyData }">
        <q-route-tab
          :name="t._id"
          :label="t.label"
          :icon="t.icon"
          :content-class="`text-${t.color}`"
          :to="menuUrl(menu._id, t._id)"
          @click="editor.selectTab(t._id)"
        />
      </template>
    </array-editor>
  </q-tabs>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { tabSchema, menuSchema } from '@/shared/schemas/menu'
import { useAppEditor } from '@/features/App/editor-store'
import { AnyData } from '@/shared/interfaces/commons'
import { useUrl } from '@/composites/url'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

const props = defineProps<{
  modelValue: Tab[]
  menu: Menu
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Tab[]): void,
}>()

const tabs = useModelValue(props, emit)

const currentTab = ref()

const router = useRouter()

const editor = useAppEditor()

const { menuUrl } = useUrl()

watch(() => editor.selectedTab, () => {
  if (currentTab.value !== editor.selectedTab) {
    setTimeout(() => {
      router.push(menuUrl(props.menu._id, editor.selectedTab))
    }, 100)
  }
})

watch(currentTab, () => {
  editor.selectTab(currentTab.value)
}, { immediate: true })

onMounted(() => {
  setTimeout(() => {
    router.push(menuUrl(props.menu._id, tabs.value?.[0]?._id))
  }, 100)
})
</script>
