<template>
  <array-editor
    v-model="menus"
    :add-function="editor.addMenu"
    :remove-function="(m) => editor.removeMenu(m._id)"
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

onMounted(() => {
  editor.selectMenu(menus.value?.[0]?._id)
})
</script>
