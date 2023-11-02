<template>
  <q-btn
    v-if="!options"
    v-bind="$attrs"
    :label="label"
    :disable="disable"
    :round="!label"
    :icon-right="label ? (icon || 'mdi-plus') : undefined"
    :icon="!label ? (icon || 'mdi-plus') : undefined"
    color="primary"
    size="sm"
    flat
    @click="$emit('click')"
  >
    <q-tooltip :delay="500">
      {{ label || $t('buttons.add') }}
    </q-tooltip>
  </q-btn>

  <q-btn-dropdown
    v-else
    :label="label"
    :disable="disable"
    :round="!label"
    :icon-right="label ? (icon || 'mdi-plus') : undefined"
    :icon="!label ? (icon || 'mdi-plus') : undefined"
    color="primary"
    size="sm"
    flat
    split
    @click="$emit('click')"
  >
    <q-tooltip :delay="500">
      {{ label || $t('buttons.add') }}
    </q-tooltip>

    <q-list style="min-width: 100px">
      <q-item
        v-for="option in options"
        :key="option.value"
        :disable="option.disabled"
        clickable
        v-close-popup
        @click="$emit('click-option', option.value)"
      >
        <q-item-section v-if="option.icon" avatar>
          <q-icon
            :name="option.icon"
            color="grey-8"
            size="xs"
          />
        </q-item-section>

        <q-item-section>
          <div>
            {{ option.label }}

            <q-icon
              v-if="option.paid"
              name="mdi-currency-usd"
              color="red-9"
              size="xs"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { AddOption } from '@/features/Fields/interfaces'

defineProps<{
  // label for the button
  label?: string
  // disable the button
  disable?: boolean
  // icon for the button
  icon?: string
  // button's menu options
  options?: AddOption[]
}>()

defineEmits<{
  (e: 'click'): void,
  (e: 'click-option', value: string): void,
}>()
</script>
