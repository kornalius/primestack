<template>
  <array-editor
    v-model="menus"
    :add-function="addMenu"
    :remove-function="removeMenu"
    add-button="end"
    no-separator
    reorderable
  >
    <template #default="{ value: m }: { value: Menu }">
      <q-item
        class="Drawer__item left-drawer-expanded"
        :class="{ selected: editor.selectedMenu === m._id }"
        tag="router-link"
        clickable
        @click.stop="editor.selectMenu(m._id)"
      >
        <q-item-section avatar>
          <q-icon :name="m.icon" :color="m.color" />
        </q-item-section>

        <q-item-section>
          <q-item-label :class="{ [`text-${m.color}`]: true }">
            {{ m.label }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </array-editor>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { menuSchema } from '@/shared/schemas/menu'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import useAppEditor from '@/features/App/store'

type Menu = Static<typeof menuSchema>

const props = defineProps<{
  modelValue: Menu[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Menu[]): void,
}>()

const menus = useModelValue(props, emit)

const editor = useAppEditor()

const addMenu = () => {
  const m = {
    _id: hexObjectId(),
    label: undefined,
    icon: undefined,
    color: undefined,
    href: undefined,
    target: '_self',
    tabs: [],
  }
  menus.value.push(m)
}

const removeMenu = (v: Menu, index: number): boolean => {
  menus.value.splice(index, 1)
  return true
}

onMounted(() => {
  editor.selectMenu(menus.value?.[0]._id)
})
</script>
