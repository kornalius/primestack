<template>
  <q-tabs
    v-model="currentTab"
    v-bind="$attrs"
    align="left"
    inline-label
    dense
  >
    <array-editor
      v-model="tabs"
      :add-function="addTab"
      :remove-function="removeTab"
      :horizontal="!$attrs.vertical"
      add-button="end"
      no-separator
      reorderable
      @click.stop=""
    >
      <template #default="{ value: t }: { value: Tab }">
        <q-route-tab
          v-if="menu"
          :name="t._id"
          :label="t.label"
          :icon="t.icon"
          :content-class="`text-${t.color}`"
          :to="menuUrl(menu._id, t._id)"
          @click="selectTab(t._id)"
        />
        <q-tab
          v-else
          :name="t._id"
          :label="t.label"
          :icon="t.icon"
          :content-class="`text-${t.color}`"
          @click="$emit('click-tab', (t as Tab))"
        />
      </template>
    </array-editor>
  </q-tabs>
</template>

<script setup lang="ts">
import hexObjectId from 'hex-object-id'
import { onMounted, watch } from 'vue'
import startCase from 'lodash/startCase'
import kebabcase from 'lodash/kebabCase'
import { useRouter } from 'vue-router'
import { Static } from '@feathersjs/typebox'
import { useAppEditor } from '@/features/Editor/store'
import { useUrl } from '@/composites/url'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { tabSchema, menuSchema } from '@/shared/schemas/menu'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import { newName } from '@/shared/utils'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

const props = defineProps<{
  modelValue: Tab[]
  menu?: Menu
  tab?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Tab[]): void,
  (e: 'update:tab', value: string): void,
  (e: 'click-tab', value: Tab): void,
}>()

const tabs = useModelValue(props, emit)

const currentTab = useSyncedProp(props, 'tab', emit)

const router = useRouter()

const editor = useAppEditor()

const { menuUrl } = useUrl()

const selectTab = (id: string) => {
  if (props.menu) {
    editor.setTabId(id)
  }
}

const addTab = () => {
  if (props.menu) {
    editor.addTab(props.menu, undefined, undefined, true)
  } else {
    const name = newName('tab', tabs.value, 'label')
    tabs.value.push({
      _id: hexObjectId(),
      _type: 'tab',
      name,
      label: startCase(kebabcase(name).replace('-', ' ')),
      _fields: [],
    })
  }
}

const removeTab = (t: Tab) => {
  if (props.menu) {
    editor.removeTab(t._id, props.menu)
  } else {
    const idx = tabs.value.indexOf(t)
    if (idx !== -1) {
      tabs.value.splice(idx, 1)
    }
  }
}

watch(() => editor.tabId, () => {
  if (props.menu && currentTab.value !== editor.tabId) {
    setTimeout(() => {
      router.push(menuUrl(props.menu._id, editor.tabId))
    }, 100)
  }
})

watch(currentTab, () => {
  if (props.menu) {
    editor.setTabId(currentTab.value)
  }
}, { immediate: true })

onMounted(() => {
  if (props.menu && !props.tab) {
    setTimeout(() => {
      router.push(menuUrl(props.menu._id, tabs.value?.[0]?._id))
    }, 100)
  }
})
</script>
