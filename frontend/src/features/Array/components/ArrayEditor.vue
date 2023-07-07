<template>
  <div>
    <div
      v-for="(value, index) in modelValue"
      :key="index"
      class="row items-center"
      style="min-height: 30px;"
      @mouseover="hover = index as number"
      @mouseleave="hover = -1"
      @focus="hover = index as number"
      @blur="hover = -1"
    >
      <div class="col">
        <slot v-bind="{ value: modelValue[index], index, hover: hover === index }">
          <div>{{ value }}</div>
        </slot>
      </div>

      <div class="col-auto q-ml-sm" style="width: 30px;">
        <q-btn
          v-show="hover === index"
          icon="mdi-trash-can-outline"
          color="negative"
          size="x-small"
          round
          flat
          @click="removeItem(value)"
        />
      </div>
    </div>

    <div class="column items-end q-my-sm">
      <div class="col">
        <q-btn
          icon="mdi-plus"
          color="primary"
          size="x-small"
          round
          flat
          @click="addItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: unknown[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add'): void,
  (e: 'remove', index: number, value: unknown): void,
}>()

const hover = ref(-1)

const addItem = () => {
  emit('add')
}

const removeItem = (value: unknown) => {
  const idx = props.modelValue.indexOf(value)
  if (idx !== -1) {
    emit('remove', idx, value)
  }
}

</script>
