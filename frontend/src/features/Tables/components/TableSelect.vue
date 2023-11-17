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
            {{ createLabel || $t('buttons.add') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'

const props = defineProps<{
  modelValue: unknown
  createNew?: boolean
  createLabel?: string
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'create'): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const userTables = computed(() => editor.tables)
</script>
