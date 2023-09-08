<template>
  <array-editor
    v-model="menus"
    :add-function="() => editor.addMenu(true)"
    :remove-function="(m) => editor.removeMenu(m._id)"
    add-button="end"
    no-separator
    reorderable
  >
    <template #default="{ value: m }">
      <q-item
        class="Drawer__item left-drawer-expanded"
        :class="{ selected: editor.selectedMenu === m._id }"
        tag="router-link"
        :to="m.href || menuUrl(m._id)"
        :target="m.target as string"
        clickable
        @click.stop="selectMenu(m._id)"
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
import { useUrl } from '@/composites/url'
import { useAppEditor } from '@/features/App/editor-store'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'

type Menu = Static<typeof menuSchema>

const props = defineProps<{
  modelValue: Menu[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Menu[]): void,
}>()

const menus = useModelValue(props, emit)

const { menuUrl } = useUrl()

const editor = useAppEditor()

const selectMenu = (id: string): void => {
  editor.selectMenu(id)
  const el: HTMLElement = document.querySelector(`a[href="${menuUrl(id)}"]`)
  if (el) {
    el.click()
  }
}

onMounted(() => {
  selectMenu(menus.value?.[0]?._id)
})
</script>
