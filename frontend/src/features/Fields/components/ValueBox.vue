<template>
  <div
    :class="containerClass"
    :style="$attrs.style"
  >
    <div class="row full-height">
      <div class="col">
        <div
          v-if="label"
          class="row q-mb-xs items-center"
        >
          <div class="col">
            <div :class="labelClass">
              {{ label }}
            </div>
          </div>
        </div>

        <div
          v-if="tag"
          class="row q-mb-xs items-center"
        >
          <div class="col-auto">
            <div :class="tagClass">
              {{ tag }}
            </div>
          </div>
        </div>

        <div
          v-if="hasDiff"
          class="row q-mb-xs items-center"
        >
          <div class="col-auto">
            <q-icon
              v-if="hasDiffIcon && !diffIconSuffix"
              :name="diffIcon"
              :color="diffIconColor"
              :size="diffIconSize"
            />

            <span :class="diffClass">
              {{ diffValue }}
            </span>

            <q-icon
              v-if="hasDiffIcon && diffIconSuffix"
              :name="diffIcon"
              :color="diffIconColor"
              :size="diffIconSize"
            />
          </div>
        </div>

        <div
          v-if="hasValue"
          class="row q-mb-xs items-center"
        >
          <div class="col">
            <div :class="valueClass">
              {{ value }}
            </div>
          </div>
        </div>
      </div>

      <div class="col-auto q-ml-md">
        <div class="row full-height items-center">
          <div class="col">
            <q-icon
              v-if="icon"
              class="icon"
              :name="icon"
              :color="iconColor"
              size="64px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AnyData } from '@/shared/interfaces/commons'
import {
  validCurrencyCodes, ValueBoxFormatStyle, ValueBoxSize, ValueBoxTextStyle,
} from '@/features/Fields/interfaces'

const props = defineProps<{
  modelValue: number | undefined
  // container class
  containerClass?: AnyData
  // value color
  valueColor?: string
  // format value style
  valueFormat?: typeof ValueBoxFormatStyle[string]
  // format value style
  valueStyle?: typeof ValueBoxTextStyle[string]
  // format valud decimal digits
  valueDigits?: number
  // format value currency
  valueCurrency?: string
  // hide the currency symbol
  valueCurrencyNarrow?: boolean
  // background color
  color?: string
  // label
  label?: string
  // label color
  labelColor?: string
  // format value style
  labelStyle?: typeof ValueBoxTextStyle[string]
  // icon
  icon?: string
  // icon color
  iconColor?: string
  // tag label
  tag?: string
  // tag color
  tagColor?: string
  // format value style
  tagStyle?: typeof ValueBoxTextStyle[string]
  // difference value
  diff?: number
  // format diff label style
  diffFormat?: typeof ValueBoxFormatStyle[string]
  // format diff decimal digits
  diffDigits?: number
  // format diff currency
  diffCurrency?: string
  // hide the diff currency symbol
  diffCurrencyNarrow?: boolean
  // diff color
  diffColor?: string
  // format value style
  diffStyle?: typeof ValueBoxTextStyle[string]
  // diff icon
  diffIcon?: string
  // diff icon color
  diffIconColor?: string
  // tag label size
  diffIconSize?: typeof ValueBoxSize[string]
  // should we place the diff icon after the diff value
  diffIconSuffix?: boolean
}>()

const format = (
  style: typeof ValueBoxFormatStyle[string],
  value: number,
  currency?: string,
  narrow = false,
  digits = 0,
): string => (
  style
    ? new Intl.NumberFormat(
      undefined,
      {
        style,
        localeMatcher: 'best fit',
        currencyDisplay: narrow ? 'narrowSymbol' : undefined,
        currency: validCurrencyCodes.includes(props.valueCurrency) ? props.valueCurrency : 'USD',
        minimumFractionDigits: Math.max(0, Math.min(20, digits)),
      },
    ).format(value || 0)
    : String(value)
)

const hasValue = computed(() => props.modelValue !== undefined)
const hasDiff = computed(() => props.diff !== undefined)
const hasDiffIcon = computed(() => props.diffIcon !== undefined)

const containerClass = computed(() => ({
  container: true,
  'q-pa-sm': true,
  [`bg-${props.color}`]: true,
  ...(props.containerClass || {}),
}))

const valueClass = computed(() => ({
  value: true,
  [`text-${props.valueColor}`]: true,
  [`text-${props.valueStyle || 'h5'}`]: true,
  'text-bold': true,
}))

const value = computed(() => (
  format(
    props.valueFormat,
    props.modelValue,
    props.valueCurrency,
    props.valueCurrencyNarrow,
    props.valueDigits,
  )
))

const labelClass = computed(() => ({
  label: true,
  [`text-${props.labelColor}`]: true,
  [`text-${props.labelStyle || 'h6'}`]: true,
}))

const diffClass = computed(() => ({
  diff: true,
  [`text-${props.diffColor}`]: true,
  [`text-${props.diffStyle || 'subtitle1'}`]: true,
  'text-bold': true,
}))

const diffValue = computed(() => (
  format(
    props.diffFormat,
    props.diff,
    props.diffCurrency,
    props.diffCurrencyNarrow,
    props.diffDigits,
  )
))

const tagClass = computed(() => ({
  tag: true,
  'q-py-xs': true,
  'q-px-sm': true,
  [`text-${props.tagColor}-10`]: true,
  [`bg-${props.tagColor}-2`]: true,
  [`text-${props.tagStyle || 'subtitle1'}`]: true,
}))
</script>

<style scoped lang="sass">
.container
  border-radius: 3px

.tag
  border-radius: 20px

.icon
  opacity: .5
</style>
