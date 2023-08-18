<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="userTables"
    option-value="_id"
    option-label="name"
    emit-value
    map-options
  >
    <template v-if="createNew" #before-options>
      <q-item
        dense
        clickable
        @click="$emit('create')"
      >
        <q-item-section>
          <q-item-label class="text-blue-4">
            <q-icon name="mdi-plus" size="xs" />
            {{ createLabel || 'Create new...' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/App/store'

const props = defineProps<{
  modelValue: unknown
  createNew?: boolean
  createLabel?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'create'): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const userTables = computed(() => editor.tables)
</script>
