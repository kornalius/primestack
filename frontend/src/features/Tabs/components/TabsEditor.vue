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
      add-button="end"
      :horizontal="!$attrs.vertical"
      no-separator
      reorderable
      @click.stop=""
    >
      <template #default="{ value: t }: { value: AnyData }">
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
        />
      </template>
    </array-editor>
  </q-tabs>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import startCase from 'lodash/startCase'
import kebabcase from 'lodash/kebabCase'
import { useRouter } from 'vue-router'
import { Static } from '@feathersjs/typebox'
import { useAppEditor } from '@/features/App/editor-store'
import { useUrl } from '@/composites/url'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { tabSchema, menuSchema } from '@/shared/schemas/menu'
import { AnyData } from '@/shared/interfaces/commons'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import hexObjectId from 'hex-object-id'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

const props = defineProps<{
  modelValue: Tab[]
  menu?: Menu
  tab?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Tab[]): void,
  (e: 'update:tab', value: string): void,
}>()

const tabs = useModelValue(props, emit)

const currentTab = useSyncedProp(props, 'tab', emit)

const router = useRouter()

const editor = useAppEditor()

const { menuUrl } = useUrl()

const selectTab = (id: string) => {
  if (props.menu) {
    editor.selectTab(id)
  }
}

const newTabName = (name: string): string => {
  let index = 1
  let newName = `${startCase(name)}${index}`.toLowerCase()
  let field = tabs.value.find((f) => f.name.toLowerCase() === newName)
  while (field) {
    index += 1
    newName = `${startCase(name)}${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    field = tabs.value.find((f) => f.name.toLowerCase() === newName)
  }
  return `${startCase(name)}${index}`
}

const addTab = () => {
  if (props.menu) {
    editor.addTab(true)
  } else {
    const name = newTabName('Tab')
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
    editor.removeTab(t._id)
  } else {
    const idx = tabs.value.indexOf(t)
    if (idx !== -1) {
      tabs.value.splice(idx, 1)
    }
  }
}

watch(() => editor.selectedTab, () => {
  if (props.menu && currentTab.value !== editor.selectedTab) {
    setTimeout(() => {
      router.push(menuUrl(props.menu._id, editor.selectedTab))
    }, 100)
  }
})

watch(currentTab, () => {
  if (props.menu) {
    editor.selectTab(currentTab.value)
  }
}, { immediate: true })

onMounted(() => {
  if (props.menu) {
    setTimeout(() => {
      router.push(menuUrl(props.menu._id, tabs.value?.[0]?._id))
    }, 100)
  }
})
</script>
