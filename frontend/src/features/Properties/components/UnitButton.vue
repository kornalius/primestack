<template>
  <q-btn
    class="q-px-md"
    :label="value"
    :icon="!value ? 'mdi-dots-horizontal' : undefined"
    color="grey-7"
    size="md"
    no-caps
    dense
    flat
  >
    <q-menu fit>
      <q-list dense>
        <q-item
          clickable
          v-ripple
          v-close-popup
          @click="value = undefined"
        >
          <q-item-section>
            unset
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item
          v-for="sz in classSizes"
          :key="sz"
          clickable
          v-ripple
          v-close-popup
          @click="value = sz"
        >
          <q-item-section>
            {{ sz }}
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
          <q-item-section>
            <div class="row items-center q-gutter-md">
              <div
                v-if="label"
                class="col-auto"
              >
                {{ label }}:
              </div>

              <div class="col">
                <unit-input
                  v-model="value"
                  class="field"
                  :units="computedUnits"
                  default-unit="px"
                  hide-bottom-space
                  dense
                  borderless
                  @keydown="editor.preventSystemUndoRedo"
                />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AnyData } from '@/shared/interfaces/commons'
import { classSizes } from '@/features/Forms/composites'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import UnitInput from '@/features/Fields/components/UnitInput.vue'

const props = defineProps<{
  modelValue: string | undefined
  label?: string
  units?: { label: string, value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const computedUnits = computed(() => (
  props.units
    || [
      { label: 'px', value: 'px' },
      { label: '%', value: '%' },
      { label: 'rem', value: 'rem' },
    ]
))
</script>

<style scoped lang="sass">
.field
  width: 85px
</style>
