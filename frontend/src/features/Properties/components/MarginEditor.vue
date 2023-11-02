<template>
  <div class="margin">
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
      <div class="col-auto">
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

const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.margin
  border: 1px solid $grey-9
  background: $grey-2
  background: $orange-1
  border-radius: 4px
  padding: 4px

.middle
  margin: 4px
  background: $orange-3
</style>
