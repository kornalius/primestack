<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    :input-debounce="0"
    use-input
    @filter="filterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          {{ $t('app.no_results') }}
        </q-item-section>
      </q-item>
    </template>

    <template #option="{ opt, itemProps }">
      <q-item
        class="q-px-none"
        v-bind="itemProps"
        dense
      >
        <q-item-section class="q-pr-none items-center" avatar>
          <q-icon :name="opt" color="grey-9" size="sm" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ (opt as string).replace(/^mdi-/, '') }}
            {{ tooltip }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #selected-item="{ opt }">
      <q-item class="q-px-none" dense>
        <q-tooltip :delay="500">
          {{ (opt as string).replace(/^mdi-/, '') }}
        </q-tooltip>

        <q-item-section>
          <q-icon :name="opt" color="grey-9" size="sm" />
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
import { useModelValue } from '@/composites/prop'
import { mdiIcons } from '@/features/Fields/mdi-icons'
import { ref } from 'vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any
  // don't display the icon label in result
  noLabel?: boolean
  tooltip?: string
}>()

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: any): void,
}>()

const value = useModelValue(props, emit)

const options = ref([])

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      options.value = mdiIcons
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    options.value = mdiIcons.filter((v) => v.toLowerCase().indexOf(needle) > -1)
  })
}
</script>
