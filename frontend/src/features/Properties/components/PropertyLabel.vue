<template>
  <div
    class="row items-center justify-end"
    :style="`max-height: ${lineHeight}; overflow-y: hidden;`"
  >
    <div class="col-auto">
      <!-- Multitypes button to offer a menu -->

      <q-btn
        v-if="multipleTypes"
        class="q-ml-sm"
        icon="mdi-tag-multiple"
        color="grey-7"
        size="xs"
        flat
        dense
      >
        <q-menu>
          <q-list dense>
            <q-item
              v-for="tp in multipleTypes"
              :key="tp"
              clickable
              v-close-popup
              @click="$emit('change-type', tp)"
            >
              <q-item-section>
                {{ tp }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Label -->

    <span
      class="text-caption text-weight-medium"
      :style="{ 'text-align': 'end', cursor: section ? 'pointer' : 'default' }"
    >
      <q-icon
        v-if="icon"
        :name="icon"
        :color="color"
        size="sm"
      />

      {{ label }}:

      <q-tooltip :delay="500">
        {{ tooltip || label }}
      </q-tooltip>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProperties } from '@/features/Properties/composites'

defineProps<{
  // label to display
  label: string
  // icon
  icon?: string
  // icon color
  color?: string
  // multiple types to allow selecting from
  multipleTypes?: string[]
  // is the label part of a section
  section?: boolean
  // tooltip
  tooltip?: string
}>()

defineEmits<{
  (e: 'change-type', value: string): void,
}>()

const { t } = useI18n()

const { lineHeight } = useProperties(t)
</script>
