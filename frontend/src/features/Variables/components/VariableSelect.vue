<template>
  <autocomplete
    v-model="value"
    v-bind="$attrs"
    :options="options"
    dense
    outline
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </autocomplete>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { useVariables } from '@/features/Variables/store'
import { actionElementSchema } from '@/shared/schemas/actions'
import { AnyData } from '@/shared/interfaces/commons'
import Autocomplete from '@/features/Fields/components/Autocomplete.vue'

type ActionElement = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: unknown
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const variables = useVariables()

const options = computed(() => {
  const names = [...variables.names]

  const addVariables = (actions: ActionElement[]): void => {
    actions.forEach((a) => {
      // eslint-disable-next-line no-underscore-dangle
      if (a._type === 'setvar') {
        const n = (a as AnyData).name
        if (!names.includes(n)) {
          names.push(n)
        }
      }
      // eslint-disable-next-line no-underscore-dangle
      const children = a._children as ActionElement[]
      if (children) {
        addVariables(children)
      }
    })
  }

  editor.actions.forEach((a) => {
    // eslint-disable-next-line no-underscore-dangle
    addVariables(a._actions)
  })

  return names
})
</script>
