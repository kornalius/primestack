<template>
  <q-tabs
    v-model="currentTab"
    align="left"
    inline-label
    dense
  >
    <array-editor
      v-model="tabs"
      :add-function="addTab"
      :remove-function="removeTab"
      add-button="end"
      horizontal
      no-separator
      reorderable
      @click.stop=""
    >
      <template #default="{ value: t }: { value: Tab }">
        <q-route-tab
          :name="t._id"
          :label="t.label"
          :icon="t.icon"
          :content-class="`text-${t.color}`"
          :to="menuTabUrl(menu._id, t._id)"
        />
      </template>
    </array-editor>
  </q-tabs>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { tabSchema, menuSchema } from '@/shared/schemas/menu'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import useAppEditor from '@/features/App/store'
import { useUrl } from '@/composites/url'
import { api } from '@/plugins/pinia'

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

watch(currentTab, () => {
  editor.selectTab(currentTab.value)
}, { immediate: true })

const { data: forms } = api.service('forms').useFind({
  query: {},
})

const userForm = computed(() => forms.value?.[0])

const addTab = () => {
  const f = {
    _id: hexObjectId(),
    name: 'form',
    fields: [],
  }
  userForm.value.list.push(f)

  const t: Tab = {
    _id: hexObjectId(),
    label: 'New Tab',
    icon: undefined,
    color: undefined,
    formId: f._id,
  }

  tabs.value.push(t)
}

const removeTab = (v: Tab, index: number): boolean => {
  const idx = userForm.value?.list.findIndex((f) => f._id === v.formId)
  if (idx !== -1) {
    userForm.value.list.splice(idx, 1)
  }
  tabs.value.splice(index, 1)
  return true
}

const { menuTabUrl } = useUrl()

onMounted(() => {
  setTimeout(() => {
    router.push(menuTabUrl(props.menu._id, tabs.value?.[0]?._id))
  }, 100)
})
</script>