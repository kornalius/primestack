<template>
  <div :class="{ 'form-element': true, selected, preview }">
    <div v-if="!preview" class="overlay" @click.stop="onClick" />

    <div
      v-if="!preview"
      class="form-element-header row items-center"
    >
      <div class="col-auto q-ml-sm text-white">
        <q-icon :name="fieldIcon" size="large" />
      </div>

      <div class="col q-ml-sm text-white">
        {{ fieldLabel }}
      </div>

      <div class="col-auto">
        <q-btn
          class="trashcan"
          icon="mdi-trash-can"
          size="xx-small"
          color="red-2"
          round
          flat
        />
      </div>
    </div>

    <component
      :is="componentForType[value.type]"
      v-model="value.options.modelValue"
      v-bind="value.options"
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QCheckbox, QInput, QSelect } from 'quasar'
import startCase from 'lodash/startCase'
import { TFormField, TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: TFormField
  components: TFormComponent[]
  selected?: boolean
  preview?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: TFormField): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const value = useModelValue(props, emit)

const componentForType = {
  text: QInput,
  checkbox: QCheckbox,
  select: QSelect,
}

const onClick = () => {
  if (!props.preview) {
    emit('click', props.modelValue)
  }
}

const component = computed(() => (
  props.components.find((c) => c.type === props.modelValue.type)
))

const fieldLabel = computed(() => startCase(props.modelValue.type))

const fieldIcon = computed(() => component.value?.icon)
</script>

<style scoped lang="sass">
.form-element
  position: relative

  &:not(.preview)
    margin: 8px 0
    padding: 8px
    width: 100%
    border: 1px dashed $blue-grey-5
    border-radius: 4px

  &.selected:not(.preview)
    border: 2px solid $blue-grey-5

  & .trashcan
    z-index: 3

.form-element-header
  background: $grey-6

.overlay
  position: absolute
  z-index: 2
  cursor: pointer
  left: 0
  top: 0
  width: 100%
  height: 100%
</style>
