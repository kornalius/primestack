<template>
  <div class="padding">
    <div class="row justify-center">
      <div class="col-auto">
        <unit-button v-model="value.top" label="top" />
      </div>
    </div>

    <div class="row">
      <div class="col-auto">
        <unit-button v-model="value.left" label="left" />
      </div>

      <div class="col middle" />

      <div class="col-auto">
        <unit-button v-model="value.right" label="right" />
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-auto align-center">
        <unit-button v-model="value.bottom" label="bottom" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import UnitButton from '@/features/Properties/components/UnitButton.vue'

const props = defineProps<{
  modelValue: AnyData
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.padding
  border: 1px solid $grey-9
  background: $blue-grey-2
  border-radius: 4px
  padding: 4px

.field
  width: 78px

.middle
  margin: 4px
  background: $blue-grey-4
</style>
