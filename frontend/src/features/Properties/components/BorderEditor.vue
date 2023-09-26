<template>
  <div>
    <div class="row q-my-xs">
      <div class="col">
        <q-select
          v-model="value.style"
          :disable="disable"
          :options="styleOptions"
          label="Style"
          emit-value
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col">
        <color-field
          v-model="value.color"
          :disable="disable"
          label="Color"
          css-color
          hide-bottom-space
          quasar-palette
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col">
        <q-slider
          v-model="value.width"
          :disable="disable"
          :min="1"
          :max="8"
          snap
          hide-bottom-space
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col">
        <btn-toggle-multi
          v-model="value.sides"
          :options="sidesOptions"
          :disable="disable"
          clearable
          spread
          stretch
          unelevated
          dense
        />
      </div>
    </div>

    <div class="row q-my-xs">
      <div class="col-auto q-mr-md">
        Preview:
      </div>

      <div class="col">
        <div class="previewBox">
          <div
            class="previewBox"
            style="z-index: 1;"
            :style="style"
          />

          <q-input
            v-model="value.radius.topLeft"
            style="position: absolute; top: 4px; left: 20px; width: 50px;"
            dense
            outlined
          />

          <q-input
            v-model="value.radius.topRight"
            style="position: absolute; top: 4px; right: 20px; width: 50px;"
            dense
            outlined
          />

          <q-input
            v-model="value.radius.bottomLeft"
            style="position: absolute; bottom: 4px; left: 20px; width: 50px;"
            dense
            outlined
          />

          <q-input
            v-model="value.radius.bottomRight"
            style="position: absolute; bottom: 4px; right: 20px; width: 50px;"
            dense
            outlined
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { useAppEditor } from '@/features/App/editor-store'
import ColorField from '@/features/Fields/components/ColorField.vue'
import BtnToggleMulti from '@/features/Fields/components/BtnToggleMulti.vue'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: AnyData
  disable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const styleOptions = computed(() => [
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
  { label: 'double', value: 'double' },
  { label: 'groove', value: 'groove' },
  { label: 'ridge', value: 'ridge' },
  { label: 'inset', value: 'inset' },
  { label: 'outset', value: 'outset' },
  { label: 'none', value: 'none' },
])

const sidesOptions = computed(() => [
  { icon: 'mdi-border-top-variant', value: 'top' },
  { icon: 'mdi-border-bottom-variant', value: 'bottom' },
  { icon: 'mdi-border-left-variant', value: 'left' },
  { icon: 'mdi-border-right-variant', value: 'right' },
])

const style = computed(() => {
  const b = value.value

  const border = `${b.width}px ${b.style} ${b.color}`

  const radius = b.radius as AnyData
  const tl = radius.topLeft ? `${radius.topLeft}px` : '0'
  const tr = radius.topRight ? `${radius.topRight}px` : '0'
  const br = radius.bottomLeft ? `${radius.bottomLeft}px` : '0'
  const bl = radius.bottomRight ? `${radius.bottomRight}px` : '0'

  const sides = b.sides as AnyData
  return {
    borderTop: sides.top ? border : 'none',
    borderBottom: sides.bottom ? border : 'none',
    borderLeft: sides.left ? border : 'none',
    borderRight: sides.right ? border : 'none',
    borderRadius: `${tl} ${tr} ${bl} ${br}`,
  }
})
</script>

<style scoped lang="sass">
.previewBox
  width: 150px
  height: 100px
  position: relative
</style>
