<template>
  <q-input
    v-model.number="editValue"
    v-bind="$attrs"
    type="number"
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
              :key="u.value"
              clickable
              v-close-popup
              @click="unit = u.value"
            >
              <q-item-section>
                {{ u.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Unit } from '@/features/Fields/interfaces'

const props = defineProps<{
  modelValue: string | null | undefined
  units: Unit[]
  defaultUnit: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const unit = ref('')

const editValue = ref(0)

const realValue = (v: number): number => {
  const u = props.units.find((un) => un.value === unit.value)
  if (u?.min !== undefined && v < u.min) {
    return u.min
  }
  if (u?.max !== undefined && v > u.max) {
    return u.max
  }
  return v
}

const parse = (val: string): { value: number, unit: string } => {
  const units = `(${props.units.map((u) => u.value).join('|')})`
  const r = val.trim().match(new RegExp(`^(-?\\d+)${units}$`))
  return { value: realValue(Number(r?.[1]) || 0), unit: r?.[2] || props.defaultUnit }
}

watch(() => props.modelValue, () => {
  const p = parse(props.modelValue)
  if (p.value !== editValue.value) {
    editValue.value = p.value
  }
  if (p.unit !== unit.value) {
    unit.value = p.unit
  }
}, { immediate: true })

watch([editValue, unit], () => {
  const v = realValue(editValue.value)
  if (editValue.value !== v) {
    editValue.value = v
  }
  const newValue = `${v}${unit.value}`
  if (props.modelValue !== newValue) {
    emit('update:model-value', newValue)
  }
})
</script>
