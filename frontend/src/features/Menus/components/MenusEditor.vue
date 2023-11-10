<template>
  <array-editor
    v-model="menus"
    :add-function="() => editor.addMenu(undefined, true)"
    :remove-function="(m) => editor.removeMenu(m._id)"
    add-button="end"
    no-separator
    reorderable
  >
    <template #default="{ value: m }">
      <q-item
        class="Drawer__item left-drawer-expanded"
        :class="{ selected: $route.path.startsWith(menuUrl((m as any)._id)) }"
        tag="router-link"
        :to="(m as any).href || menuUrl((m as any)._id)"
        :target="(m as any).target as string"
        clickable
        @click.stop="editor.setMenuId((m as any)._id)"
      >
        <q-item-section avatar>
          <q-icon :name="(m as any).icon" :color="(m as any).color" />
        </q-item-section>

        <q-item-section>
          <q-item-label :class="{ [`text-${(m as any).color}`]: true }">
            {{ (m as any).label }}
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
import { useAppEditor } from '@/features/Editor/store'
import { useApp } from '@/features/App/store'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'

type Menu = Static<typeof menuSchema>

const props = defineProps<{
  modelValue: Menu[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Menu[]): void,
}>()

const menus = useModelValue(props, emit)

const { menuUrl } = useUrl()

const app = useApp()

const editor = useAppEditor()

onMounted(() => {
  const tid = app.tabId
  const menuId = app.menuId || menus.value?.[0]?._id
  const menu = menus.value.find((m) => m._id === menuId)
  editor.setMenuId(menuId)
  editor.setTabId(tid || menu?.tabs?.[0]?._id)
})
</script>
