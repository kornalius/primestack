<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    :input-debounce="0"
    use-input
    dense
    outlined
    options-dense
    clearable
    @filter="filterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>

    <template #option="{ opt, itemProps }: { opt: string }">
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
            {{ opt.replace(/^mdi-/, '') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #selected-item="{ opt }: { opt: string }">
      <q-item class="q-px-none" dense>
        <q-item-section class="q-pr-none items-center" avatar>
          <q-icon :name="opt" color="grey-9" size="sm" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ opt.replace(/^mdi-/, '') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { mdiIcons } from '@/features/Fields/mdi-icons'
import { ref } from 'vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any;
}>()

// eslint-disable-next-line vue/valid-define-emits
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
