<template>
  <q-input
    ref="autocompleteRef"
    v-model="value"
    v-bind="$attrs"
    type="text"
    @focus="displayResults"
    @blur="hideResults"
  />

  <q-list
    v-if="shouldShowResults"
    class="results-container shadow-1"
    :class="optionsContainerClass"
    :style="`width: ${inputWidth}px`"
  >
    <q-item
      v-for="item in filteredResults"
      :key="item"
      :class="optionItemClass"
      dense
      clickable
      @mousedown.prevent=""
      @click="clickItem(item)"
    >
      <slot v-bind="{ item }">
        <q-item-section>
          <q-item-label>
            {{ item }}
          </q-item-label>
        </q-item-section>
      </slot>
    </q-item>
  </q-list>

  <q-tooltip v-if="tooltip" :delay="500">
    {{ tooltip }}
  </q-tooltip>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AnyData } from '@/shared/interfaces/commons'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | null | undefined
  options: string[]
  optionsContainerClass?: string | string[] | AnyData
  optionItemClass?: string | string[] | AnyData
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'select', value: string): void,
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const autocompleteRef = ref()

const showResults = ref(false)

const inputWidth = ref(0)

watch(autocompleteRef, () => {
  if (autocompleteRef.value?.$el) {
    inputWidth.value = autocompleteRef.value.$el.offsetWidth
  }
}, { immediate: true })

const clickItem = (data: string): void => {
  emit('select', data)
  value.value = data
  showResults.value = false
}

const displayResults = (): void => {
  showResults.value = true
}

const hideResults = (): void => {
  showResults.value = false
}

const filteredResults = computed(() => {
  const v = value.value?.toLowerCase()
  return props.options.filter((o) => !v || o.toLowerCase().indexOf(v) !== -1)
})

const shouldShowResults = computed(() => (
  showResults.value && filteredResults.value.length > 0
))
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.results-container
  position: absolute
  max-height: 300px
  overflow-y: auto
  cursor: default
  top: 42px
  border: 1px solid $grey-5
  z-index: 99
  background: white
</style>
