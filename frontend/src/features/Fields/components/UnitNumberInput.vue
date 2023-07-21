<template>
  {{ value }}
  <q-input
    v-model="editValue"
    v-bind="$attrs"
    hide-bottom-space
    outlined
    dense
  >
    <template #append>
      <q-btn dense flat no-caps>
        {{ unit }}
        <q-menu>
          <q-list>
            <q-item
              v-for="u in units"
              :key="u"
              clickable
              v-close-popup
              @click="unit = u"
            >
              <q-item-section>{{ u }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string | null | undefined
  units: string[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const unit = ref('')
const editValue = ref()

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:model-value', `${v}${unit.value}`),
})

watch(value, () => {
  unit.value = ''
  props.units.forEach((u) => {
    const l = u.length
    console.log(value.value?.slice(-l).toLowerCase(), value.value?.slice(0, -l))
    if (value.value?.slice(-l).toLowerCase() === u) {
      unit.value = u
      editValue.value = value.value.slice(0, -l)
    }
  })
  if (unit.value === '') {
    // eslint-disable-next-line prefer-destructuring
    unit.value = props.units[0]
  }
}, { immediate: true })

watch(editValue, () => {
  const newValue = `${editValue.value}${unit.value}`
  if (value.value !== newValue) {
    value.value = newValue
  }
})
</script>
