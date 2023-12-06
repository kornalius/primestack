<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    option-value="_id"
    option-label="name"
    emit-value
    map-options
  >
    <!--    <template v-if="createNew" #before-options>-->
    <!--      <q-item-->
    <!--        dense-->
    <!--        clickable-->
    <!--        @click="$emit('create')"-->
    <!--      >-->
    <!--        <q-item-section>-->
    <!--          <q-item-label class="text-blue-4">-->
    <!--            <q-icon name="mdi-plus" size="xs" />-->
    <!--            {{ createLabel || $t('buttons.add') }}-->
    <!--          </q-item-label>-->
    <!--        </q-item-section>-->
    <!--      </q-item>-->
    <!--    </template>-->

    <template #option="{ opt, itemProps }">
      <q-separator v-if="(opt as any).name === '-'" />

      <q-item
        v-else
        class="items-center"
        v-bind="itemProps"
      >
        <q-item-section avatar>
          <q-icon :name="iconForType((opt as any).type)" size="xs" color="grey-7" />
        </q-item-section>

        <span :class="fieldClass((opt as any).name)">
          {{ (opt as any).name }}
        </span>
      </q-item>
    </template>

    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { iconForType, fieldClass } from '@/shared/schema'
import { tableFieldSchema } from '@/shared/schemas/table'

type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: string | null | undefined
  fields?: TableField[]
  createNew?: boolean
  createLabel?: string
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'create'): void,
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const options = computed(() => ([
  ...props.fields,
]))
</script>
