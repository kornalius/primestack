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
      <div class="col">
        <div class="previewBox">
          <div
            class="previewBox"
            style="z-index: 1; pointer-events: none;"
            :style="style"
          />

          <unit-input
            v-model="value.radius.topLeft"
            class="field"
            style="position: absolute; top: 8px; left: 8px;"
            :units="units"
            default-unit="px"
            outlined
            dense
            @keydown="editor.preventSystemUndoRedo"
          />

          <unit-input
            v-model="value.radius.topRight"
            class="field"
            style="position: absolute; top: 8px; right: 8px;"
            :units="units"
            default-unit="px"
            outlined
            dense
            @keydown="editor.preventSystemUndoRedo"
          />

          <unit-input
            v-model="value.radius.bottomLeft"
            class="field"
            style="position: absolute; bottom: 8px; left: 8px;"
            :units="units"
            default-unit="px"
            outlined
            dense
            @keydown="editor.preventSystemUndoRedo"
          />

          <unit-input
            v-model="value.radius.bottomRight"
            class="field"
            style="position: absolute; bottom: 8px; right: 8px;"
            :units="units"
            default-unit="px"
            outlined
            dense
            @keydown="editor.preventSystemUndoRedo"
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
import { useAppEditor } from '@/features/Editor/store'
import ColorField from '@/features/Fields/components/ColorField.vue'
import BtnToggleMulti from '@/features/Fields/components/BtnToggleMulti.vue'
import UnitInput from '@/features/Fields/components/UnitInput.vue'

const props = defineProps<{
  modelValue: AnyData
  disable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const units = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
]

const styleOptions = computed(() => [
  { label: 'none', value: 'none' },
  { label: 'solid', value: 'solid' },
  { label: 'dashed', value: 'dashed' },
  { label: 'dotted', value: 'dotted' },
  { label: 'double', value: 'double' },
  { label: 'groove', value: 'groove' },
  { label: 'ridge', value: 'ridge' },
  { label: 'inset', value: 'inset' },
  { label: 'outset', value: 'outset' },
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
  const tl = radius.topLeft || '0'
  const tr = radius.topRight || '0'
  const br = radius.bottomLeft || '0'
  const bl = radius.bottomRight || '0'

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
  width: 224px
  height: 100px
  position: relative

.field
  width: 100px
</style>
